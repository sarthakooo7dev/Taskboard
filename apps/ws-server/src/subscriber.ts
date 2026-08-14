import { Redis } from 'ioredis'
import { io } from './server'

const sub = new Redis(process.env.REDIS_URL!)

export function startNotificationSubscriber() {
  // listen to all user channels
  sub.psubscribe('user:*')
  sub.psubscribe('board:*')

  sub.on('pmessage', (_, channel, message) => {
    const data = JSON.parse(message)
    if (channel.startsWith('user:')) {
      const userId = channel.split(':')[1]
      //  console.log('📩 Redis → WS:userId', userId)
      io.to(userId).emit('notification', data)
      return
    }

    if (channel.startsWith('board:')) {
      const boardId = channel.split(':')[1]
      // console.log('📩 Redis → WS: boardId', boardId)
      io.to(boardId).emit('task-updated', data)
      return
    }
  })
}

//
