import { NextResponse } from 'next/server'
import { checkBoardAccess } from '../../../../../lib/validators/membership.validator'
import { updateTaskSchema } from '../../../../../lib/validators.schema/auth.schema'
import { validateSchema } from '../../../../../lib/validators/schema.validator'
import { checkAuthorization } from '../../../../../lib/validators/user.validator'
import { ActivityType, eventDispatcher, prisma } from '@repo/db'
import { z, ZodError } from 'zod'
import { activityService } from '../../../../../services/activity.service'
import { EventType } from '@repo/types'

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
    const {
      title,
      description,
      Priority,
      estimate,
      columnId,
      progress,
      assignedToId,
    } = validated.body

    const checkMembership = await checkBoardAccess(boardId, currentUserID)

    if (!checkMembership || checkMembership.role === 'VIEWER') {
      return NextResponse.json(
        { message: 'Insufficient permission.' },
        { status: 403 },
      )
    }

    let columnExists
    let assigneeMembership
    // If column change requested → validate
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

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    })
    if (!existingTask) {
      return NextResponse.json(
        { message: 'Task not found in this board.' },
        { status: 400 },
      )
    }
    const isStatusChanged =
      columnId !== undefined && columnId !== existingTask.columnId

    const isTaskAssigned =
      assignedToId !== undefined && assignedToId !== existingTask.assignedToId

    const isMetadataUpdated =
      (title !== undefined && title !== existingTask.title) ||
      (description !== undefined && description !== existingTask.description)

    const updateData: any = {}

    if (title !== undefined) {
      updateData.title = title
    }

    if (description !== undefined) {
      updateData.description = description
    }

    if (columnId !== undefined) {
      updateData.columnId = columnId
    }

    if (Priority !== undefined) {
      updateData.Priority = Priority
    }

    if (estimate !== undefined) {
      updateData.estimate = estimate
    }

    if (progress !== undefined) {
      updateData.progress = progress
    }

    if (assignedToId !== undefined) {
      updateData.assignedToId = assignedToId
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    })

    let changeCounter = 0

    // ## -- Add activity logs...
    // TASK_MOVED
    if (isStatusChanged) {
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
      changeCounter++
    }

    // TASK_ASSIGNED
    if (isTaskAssigned) {
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
      changeCounter++
    }

    //TASK_UPDATED
    if (isMetadataUpdated) {
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
      changeCounter++
    }

    // ## -- Dispatch notification events...

    let receiverIds: string[] = []
    if (existingTask.createdById != currentUserID) {
      receiverIds.push(existingTask.createdById)
    }
    if (
      existingTask.assignedToId &&
      existingTask.assignedToId != currentUserID
    ) {
      receiverIds.push(existingTask?.assignedToId)
    }
    if (assignedToId && assignedToId != currentUserID) {
      receiverIds.push(assignedToId)
    }
    receiverIds = [...new Set(receiverIds)]

    if (changeCounter > 1) {
      eventDispatcher({
        type: EventType.TASK_EDIT_GENERIC,
        boardId,
        creator: checkMembership.user.name,
        info: { isStatusChanged, isTaskAssigned, isMetadataUpdated },
        taskId,
        senderId: currentUserID,
        receiverIds,
      })
    } else if (isStatusChanged) {
      eventDispatcher({
        type: EventType.TASK_EDIT_STATUS,
        boardId,
        creator: checkMembership.user.name,
        info: {
          isStatusChanged,
          oldStatusId: existingTask.columnId,
          newStatus: columnExists?.name,
        },
        taskId,
        senderId: currentUserID,
        receiverIds,
      })
    } else if (isTaskAssigned && assigneeMembership) {
      eventDispatcher({
        type: EventType.TASK_EDIT_ASSIGNMENT,
        boardId,
        creator: checkMembership.user.name,
        info: {
          isTaskAssigned,
          title: updatedTask.title,
          oldAssignee: existingTask.assignedToId,
          newAssignee: assignedToId,
          newAssigneName: assigneeMembership.user.name,
        },
        taskId,
        senderId: currentUserID,
        receiverIds,
      })
    } else if (isMetadataUpdated) {
      eventDispatcher({
        type: EventType.TASK_EDIT_METADATA,
        boardId,
        creator: checkMembership.user.name,
        info: {
          isMetadataUpdated,
          oldTitle: existingTask.title,
          newTitle: updatedTask.title,
          oldDesc: existingTask.description,
          newDesc: updatedTask.description,
        },
        taskId,
        senderId: currentUserID,
        receiverIds,
      })
    }

    return NextResponse.json(
      {
        message: 'Task updated successfully',
        data: updatedTask,
      },
      { status: 200 },
    )
  } catch (err) {
    console.log(err)
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
        createdById: true,
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
    const isCreator = task.createdById === currentUserID

    if (!isManagerOrLead && !isCreator) {
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
