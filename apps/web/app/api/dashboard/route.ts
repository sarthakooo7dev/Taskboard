import { checkAuthorization } from '@/app/lib/validators/user.validator'
import { ColumnType, prisma } from '@repo/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await checkAuthorization()
    //@ts-ignore
    const currentUserId = session.user.id
    //# Get all boards user can access
    const boards = await prisma.board.findMany({
      where: {
        members: {
          some: {
            userId: currentUserId,
          },
        },
      },
      orderBy: {
        lastActivityAt: 'desc',
      },

      select: {
        id: true,
        name: true,
        lastActivityAt: true,

        tasks: {
          select: {
            progress: true,
            column: {
              select: {
                type: true,
              },
            },
          },
        },
      },
    })

    const boardIds = boards.map((board) => board.id)

    const activeTasks = await prisma.task.findMany({
      where: {
        boardId: {
          in: boardIds,
        },

        assignedToId: {
          not: null,
        },

        column: {
          type: {
            not: 'DONE',
          },
        },
      },

      select: {
        id: true,
        title: true,
        estimate: true,
        Priority: true,
        updatedAt: true,
        progress: true,

        board: {
          select: {
            id: true,
            name: true,
          },
        },

        assignedTo: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },

        column: {
          select: {
            type: true,
          },
        },
      },
    })

    // ==========================
    // Workspace Overview
    // ==========================
    let workspaceDoneTasks = 0
    let workspaceInProgressTasks = 0
    let workspaceBlockedTasks = 0
    let workspaceNotStartedTasks = 0

    const workspaceOverview = boards.map((board) => {
      let doneTasks = 0
      let inProgressTasks = 0
      let blockedTasks = 0

      let totalProgress = 0

      for (const task of board.tasks) {
        totalProgress += task.progress

        switch (task.column.type) {
          case 'DONE':
            doneTasks++
            workspaceDoneTasks++
            break

          case 'IN_PROGRESS':
            inProgressTasks++
            workspaceInProgressTasks++
            break

          case 'BLOCKED':
            blockedTasks++
            workspaceBlockedTasks++
            break

          case 'NOT_STARTED':
            workspaceNotStartedTasks++
            break
        }
      }

      return {
        id: board.id,
        name: board.name,
        totalTasks: board.tasks.length,
        doneTasks,
        inProgressTasks,
        blockedTasks,
        progress:
          board.tasks.length > 0
            ? Math.round(totalProgress / board.tasks.length)
            : 0,

        lastActivityAt: board.lastActivityAt,
      }
    })

    // ==========================
    // Team Workload
    // ==========================

    const workloadMap = new Map<
      string,
      {
        id: string
        name: string
        avatar: string | null
        activeTasks: number
        workloadMinutes: number
      }
    >()

    for (const task of activeTasks) {
      if (!task.assignedTo) continue

      const existing = workloadMap.get(task.assignedTo.id)

      if (existing) {
        existing.activeTasks += 1
        existing.workloadMinutes += task.estimate
      } else {
        workloadMap.set(task.assignedTo.id, {
          id: task.assignedTo.id,
          name: task.assignedTo.name,
          avatar: task.assignedTo.avatar,
          activeTasks: 1,
          workloadMinutes: task.estimate,
        })
      }
    }

    const teamWorkload = Array.from(workloadMap.values()).sort(
      (a, b) => b.workloadMinutes - a.workloadMinutes,
    )

    // ==========================
    // My Tasks
    // ==========================
    const userTasks = activeTasks.filter(
      (val) => val.assignedTo?.id === currentUserId,
    )

    // ==========================
    // Quick insights
    // ==========================
    const quickInsights = {
      DoneTasks: workspaceDoneTasks,
      InProgressTasks: workspaceInProgressTasks,
      BlockedTasks: workspaceBlockedTasks,
      NotStartedTasks: workspaceNotStartedTasks,
    }

    return NextResponse.json({
      data: {
        workspaceOverview,
        teamWorkload,
        userTasks,
        quickInsights,
      },
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
