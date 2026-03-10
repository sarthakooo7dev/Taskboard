import { ActivityType, prisma } from '@repo/db'

type LogActivityInput = {
  boardId: string
  actorId: string
  type: ActivityType
  entityId: string
  metadata?: Record<string, any>
}

async function logActivity({
  boardId,
  actorId,
  type,
  entityId,
  metadata,
}: LogActivityInput) {
  try {
    await prisma.activity.create({
      data: {
        boardId,
        actorId,
        type,
        entityId,
        metadata,
      },
    })
  } catch (error) {
    console.error('Activity logging failed:', error)
  }
}

async function getBoardActivity(boardId: string) {
  return prisma.activity.findMany({
    where: { boardId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })
}

export const activityService = {
  logActivity,
  getBoardActivity,
}
