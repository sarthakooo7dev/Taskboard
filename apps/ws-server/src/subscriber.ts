import { Redis } from 'ioredis'
import { io } from './server'

const sub = new Redis({
  host: '127.0.0.1',
  port: 6379,
})

export function startNotificationSubscriber() {
  // listen to all user channels
  sub.psubscribe('user:*')

  sub.on('pmessage', (_, channel, message) => {
    const userId = channel.split(':')[1]
    const data = JSON.parse(message)

    console.log('📩 Redis → WS:', userId)

    // send to that user
    io.to(userId).emit('notification', data)
  })
}
