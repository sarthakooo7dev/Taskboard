import { NextResponse } from 'next/server'
import { checkBoardAccess } from '../../../../../lib/validators/membership.validator'
import { updateTaskSchema } from '../../../../../lib/validators.schema/auth.schema'
import { validateSchema } from '../../../../../lib/validators/schema.validator'
import { checkAuthorization } from '../../../../../lib/validators/user.validator'
import { ActivityType, prisma } from '@repo/db'
import { z, ZodError } from 'zod'
import { activityService } from '../../../../../services/activity.service'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ boardId: string; taskId: string }> },
) {
  try {
    const session = await checkAuthorization()
    const { boardId, taskId } = await params
    const reqBody = await req.json()
    //@ts-ignore
    const currentUserID = session?.user?.id

    const validated = validateSchema(updateTaskSchema, {
      body: reqBody,
    })
    const { title, description, columnId, assignedToId } = validated.body

    const checkMembership = await checkBoardAccess(boardId, currentUserID)

    if (!checkMembership || checkMembership.role === 'VIEWER') {
      return NextResponse.json(
        { message: 'Insufficient permission.' },
        { status: 403 },
      )
    }

    let columnExists
    let assigneeMembership
    // 🔹 If column change requested → validate
    if (columnId) {
      columnExists = await prisma.boardColumn.findFirst({
        where: {
          id: columnId,
          boardId,
        },
        select: { id: true, name: true },
      })

      if (!columnExists) {
        return NextResponse.json(
          { message: 'Invalid status for this board.' },
          { status: 400 },
        )
      }
    }

    if (assignedToId) {
      assigneeMembership = await checkBoardAccess(boardId, assignedToId)

      if (!assigneeMembership) {
        return NextResponse.json(
          { message: 'Invalid assignee for this board.' },
          { status: 400 },
        )
      }
    }

    const result = await prisma.task.updateMany({
      where: {
        id: taskId,
        boardId,
      },
      data: {
        title,
        description,
        columnId,
        assignedToId,
      },
    })

    if (result.count === 0) {
      return NextResponse.json(
        { message: 'Task not found in this board.' },
        { status: 404 },
      )
    }

    // TASK_MOVED
    if (columnExists) {
      await activityService.logActivity({
        boardId: boardId,
        actorId: currentUserID,
        type: ActivityType.TASK_MOVED,
        entityId: taskId,
        metadata: {
          toStatus: columnExists!.name,
          modifiedBy: checkMembership.user.name,
        },
      })
    }

    // TASK_ASSIGNED
    if (assignedToId) {
      await activityService.logActivity({
        boardId: boardId,
        actorId: currentUserID,
        type: ActivityType.TASK_ASSIGNED,
        entityId: taskId,
        metadata: {
          assignedTo: assigneeMembership?.user.name,
          assigneeRole: assigneeMembership?.role,
          modifiedBy: checkMembership.user.name,
        },
      })
    }

    //TASK_UPDATED
    if (title || description) {
      await activityService.logActivity({
        boardId: boardId,
        actorId: currentUserID,
        type: ActivityType.TASK_UPDATED,
        entityId: taskId,
        metadata: {
          title,
          description,
          modifiedBy: checkMembership.user.name,
        },
      })
    }

    return NextResponse.json(
      { message: 'Task updated successfully' },
      { status: 200 },
    )
  } catch (err) {
    if (err instanceof Error && err.message == 'UNAUTHORIZED') {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in !',
          },
        },
        { status: 401 },
      )
    }

    if (err instanceof ZodError) {
      const errorTree = z.treeifyError(err)

      return NextResponse.json(
        {
          error: 'Invalid inputs',
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong',
        },
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { boardId: string; taskId: string } },
) {
  try {
    const session = await checkAuthorization()
    const { boardId, taskId } = await params

    //@ts-ignore
    const currentUserID = session?.user?.id

    const checkMembership = await checkBoardAccess(boardId, currentUserID)

    if (!checkMembership) {
      return NextResponse.json(
        { message: 'Insufficient permission.' },
        { status: 403 },
      )
    }

    // Fetch task scoped by board
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        boardId,
      },
      select: {
        id: true,
        title: true,
        assignedToId: true,
      },
    })

    if (!task) {
      return NextResponse.json(
        { message: 'Task not found in this board.' },
        { status: 404 },
      )
    }

    // Permission rule
    const isManagerOrLead =
      checkMembership.role === 'MANAGER' || checkMembership.role === 'LEAD'
    const isOwner = task.assignedToId === currentUserID

    if (!isManagerOrLead && !isOwner) {
      return NextResponse.json(
        { message: 'Insufficient permission to perform this action.' },
        { status: 403 },
      )
    }

    //  Delete Task
    await prisma.task.delete({
      where: { id: task.id },
    })

    await activityService.logActivity({
      boardId,
      actorId: currentUserID,
      type: ActivityType.TASK_DELETED,
      entityId: task.id,
      metadata: { title: task.title, deletedBy: checkMembership.user.name },
    })

    return NextResponse.json(
      { message: 'Task deleted successfully.' },
      { status: 200 },
    )
  } catch (err) {
    if (err instanceof Error && err.message == 'UNAUTHORIZED') {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in !',
          },
        },
        { status: 401 },
      )
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong',
        },
      },
      { status: 500 },
    )
  }
}
