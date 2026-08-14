import { Redis } from 'ioredis'

export const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
})

export async function publishNotification(userId: string, data: any) {
  await connection.publish(`user:${userId}`, JSON.stringify(data))
}

export async function usersViewingBoard(boardId: string) {
  return await connection.smembers(`board:${boardId}:users`)
}

export async function publishBoardEvent(boardId: string, data: any) {
  await connection.publish(`board:${boardId}`, JSON.stringify(data))
}
