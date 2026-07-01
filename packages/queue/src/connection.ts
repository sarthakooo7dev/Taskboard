import { Redis } from 'ioredis'

export const connection = new Redis({
  host: '127.0.0.1',
  port: 6379,
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
