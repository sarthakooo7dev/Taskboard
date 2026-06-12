import { NextResponse } from 'next/server'
import { newTaskSchema } from '../../../../lib/validators.schema/auth.schema'
import { checkBoardAccess } from '../../../../lib/validators/membership.validator'
import { validateSchema } from '../../../../lib/validators/schema.validator'
import { checkAuthorization } from '../../../../lib/validators/user.validator'
import { ActivityType, prisma } from '@repo/db'
import { z, ZodError } from 'zod'
import { activityService } from '../../../../services/activity.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ boardId: string; columnId: string }> },
) {
  try {
    const session = await checkAuthorization()
    const { boardId } = await params
    const reqBody = await req.json()
    //@ts-ignore
    const currentUserID = session?.user?.id

    const validated = validateSchema(newTaskSchema, {
      body: reqBody,
    })
    const { title, description, assignedToId, Priority } = validated.body

    const checkMembership = await checkBoardAccess(boardId, currentUserID)

    if (!checkMembership || checkMembership.role === 'VIEWER') {
      return NextResponse.json(
        { message: 'Insufficient permission.' },
        { status: 403 },
      )
    }

    // Fetch default status for board
    const defaultColumn = await prisma.boardColumn.findFirst({
      where: {
        boardId,
        isDefault: true,
      },
      select: { id: true },
    })

    if (!defaultColumn) {
      return NextResponse.json(
        { message: 'Default status missing.Board corrupted.' },
        { status: 500 },
      )
    }

    if (assignedToId) {
      const assigneeMembership = await checkBoardAccess(boardId, assignedToId)

      if (!assigneeMembership) {
        return NextResponse.json(
          { message: 'Invalid assignee for this board.' },
          { status: 400 },
        )
      }
    }
    const task = await prisma.task.create({
      data: {
        title,
        description,
        order: 1,
        boardId,
        columnId: defaultColumn.id,
        createdById: currentUserID,
        assignedToId,
        Priority,
      },
    })

    await activityService.logActivity({
      boardId: task.boardId,
      actorId: currentUserID,
      type: ActivityType.TASK_CREATED,
      entityId: task.id,
      metadata: {
        title: task.title,
      },
    })

    return NextResponse.json(task, { status: 201 })
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
