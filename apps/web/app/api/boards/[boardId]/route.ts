import { NextResponse } from 'next/server'
import { checkAuthorization } from '../../../lib/validators/user.validator'
import { prisma } from '@repo/db'
import { checkBoardAccess } from '../../../lib/validators/membership.validator'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ boardId: string }> },
) {
  try {
    const session = await checkAuthorization()
    const { boardId } = await params
    //@ts-ignore
    const userId = session?.user?.id

    //Check if user has access to that board
    const checkmembership = await checkBoardAccess(boardId, userId)
    if (!checkmembership) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Get all board details
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          select: { id: true, name: true, type: true, order: true },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!board) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    // Get all tasks for the board
    const tasks = await prisma.task.findMany({
      where: { boardId },
      orderBy: { createdAt: 'desc' },
      include: {
        column: true,
        assignedTo: {
          select: { id: true, name: true, avatar: true },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    return NextResponse.json({
      data: { board, tasks },
    })
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
