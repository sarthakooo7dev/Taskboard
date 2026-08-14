import http from 'http'
import { Server, Socket } from 'socket.io'
import {
  getBoardPresence,
  joinBoard,
  leaveBoard,
} from './managers/presenceManager'
import { startNotificationSubscriber } from './subscriber'
import { Redis } from 'ioredis'
const server = http.createServer()

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

const redis = new Redis(process.env.REDIS_URL!)
startNotificationSubscriber()

io.on('connection', (socket) => {
  console.log('user connected:', socket.id)
  // user joins a board
  socket.on('JOIN_BOARD', ({ boardId, userId }) => {
    joinBoard(socket.id, userId, boardId)
    socket.join(boardId)
    addUsersToredis(boardId, userId)

    const users = getBoardPresence(boardId)
    io.to(boardId).emit('PRESENCE_UPDATE', users)
    // console.log(users)
  })

  socket.on('REGISTER', ({ userId }) => {
    socket.join(userId)
    console.log('User joined personal room:', userId)
  })

  socket.on('LEAVE_BOARD', async () => {
    await cleanupBoard(socket)
  })

  socket.on('disconnect', async () => {
    await cleanupBoard(socket)
  })
})

const cleanupBoard = async (socket: Socket) => {
  const info = leaveBoard(socket.id)
  if (info?.boardId) {
    socket.leave(info.boardId)
    removeUsersToredis(info.boardId, info.userId)
    const users = getBoardPresence(info.boardId)
    io.to(info.boardId).emit('PRESENCE_UPDATE', users)
    console.log(`current users on ${info.boardId}  :`, users)
  }
  console.log('user disconnected:', socket.id)
}

// adds user to redis (presence gets available to workers through it)
async function addUsersToredis(boardId: string, userId: string) {
  await redis.sadd(`board:${boardId}:users`, userId)
}

async function removeUsersToredis(boardId: string, userId: string) {
  await redis.srem(`board:${boardId}:users`, userId)
}

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log('Realtime server running on port 4000')
})

export { io }
