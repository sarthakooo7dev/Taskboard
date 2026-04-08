import { prisma } from '@repo/db'
import { NextResponse } from 'next/server'
import { checkBoardAccess } from '../../../../../../lib/validators/membership.validator'
import { checkAuthorization } from '../../../../../../lib/validators/user.validator'
import { newCommentSchema } from '../../../../../../lib/validators.schema/auth.schema'
import { validateSchema } from '../../../../../../lib/validators/schema.validator'
import { z, ZodError } from 'zod'
import { activityService } from '../../../../../../services/activity.service'
import { ActivityTypes, EventType, NotifyTypes } from '@repo/types'
import { eventDispatcher } from '@repo/db'

export async function GET(
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

    const comments = await prisma.comment.findMany({
      where: {
        task: {
          id: taskId,
          boardId: boardId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(comments, { status: 200 })
  } catch (err) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED') {
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

    console.error('Load comments error:', err)

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

export async function POST(
  req: Request,
  { params }: { params: { boardId: string; taskId: string } },
) {
  try {
    const session = await checkAuthorization()
    const { boardId, taskId } = await params
    const reqBody = await req.json()

    const validated = validateSchema(newCommentSchema, {
      body: reqBody,
    })

    const { message, mentionedUserIds } = validated.body

    //@ts-ignore
    const currentUserID = session?.user?.id

    // Membership check
    const checkMembership = await checkBoardAccess(boardId, currentUserID)

    if (!checkMembership || checkMembership.role === 'VIEWER') {
      return NextResponse.json(
        { message: 'Insufficient permission.' },
        { status: 403 },
      )
    }

    // Ensure task exists IN THIS BOARD
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        boardId,
      },
      select: { id: true, title: true, assignedToId: true, createdById: true },
    })

    if (!task) {
      return NextResponse.json(
        { message: 'Task not found in this board.' },
        { status: 404 },
      )
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        message,
        taskId: task.id,
        userId: currentUserID,
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    await activityService.logActivity({
      boardId: boardId,
      actorId: currentUserID,
      type: ActivityTypes.COMMENT_CREATED,
      entityId: task.id,
      metadata: {
        commentedOn: task.title,
        modifiedBy: checkMembership.user.name,
      },
    })

    const receiverIds: string[] = []
    if (mentionedUserIds.length > 0) {
      const validMentions = await prisma.boardMember.findMany({
        where: {
          boardId,
          userId: {
            in: mentionedUserIds,
          },
        },
        select: { userId: true },
      })

      const safeMentionIds = validMentions.map((m) => m.userId)
      receiverIds.push(...safeMentionIds)
    }

    if (task.assignedToId) {
      receiverIds.push(task.assignedToId)
    } else if (task.createdById != currentUserID) {
      receiverIds.push(task.createdById)
    }

    eventDispatcher({
      type: EventType.TASK_COMMENT_CREATED,
      boardId,
      creator: comment.user.name,
      info: { title: task.title },
      taskId: task.id,
      senderId: currentUserID,
      mentionedIds: mentionedUserIds,
      receiverIds,
    })

    return NextResponse.json(comment, { status: 201 })
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
