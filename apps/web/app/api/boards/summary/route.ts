import { checkAuthorization } from '@/app/lib/validators/user.validator'
import { prisma } from '@repo/db'
import { NextResponse } from 'next/server'

import z, { ZodError } from 'zod'

// Get all boards for the user
export async function GET() {
  try {
    const session = await checkAuthorization()
    const BoardData = await prisma.boardMember.findMany({
      where: {
        //@ts-ignore
        userId: session.user.id,
      },
      select: {
        boardId: true,
        role: true,

        board: {
          select: {
            id: true,
            name: true,
            Description: true,
            updatedAt: true,

            _count: {
              select: {
                members: true,
              },
            },

            // NOW SAFE TO LIMIT
            members: {
              take: 3,
              orderBy: {
                joinedAt: 'asc',
              },
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },

            columns: {
              select: {
                type: true,
                _count: {
                  select: { tasks: true },
                },
              },
            },
          },
        },
      },
      orderBy: {
        board: {
          updatedAt: 'desc',
        },
      },
    })

    const boardSummaryData = BoardData.map(({ board, role, boardId }) => {
      let totalTasks = 0
      let blockedTasks = 0
      let inProgressTasks = 0

      for (const col of board.columns) {
        const count = col._count.tasks

        totalTasks += count

        if (col.type === 'BLOCKED') blockedTasks += count
        if (col.type === 'IN_PROGRESS') inProgressTasks += count
      }

      return {
        boardId,
        title: board.name,
        role,
        description: board.Description,
        updatedAt: board.updatedAt,
        totalMembers: board._count.members,
        members: board.members.map((m) => m.user),
        totalTasks,
        blockedTasks,
        inProgressTasks,
      }
    })

    return NextResponse.json({
      data: boardSummaryData,
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
