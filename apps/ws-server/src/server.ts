import http from 'http'
import { Server } from 'socket.io'
import {
  getBoardPresence,
  joinBoard,
  leaveBoard,
} from './managers/presenceManager'
import { startNotificationSubscriber } from './subscriber'

const server = http.createServer()

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

startNotificationSubscriber()

io.on('connection', (socket) => {
  console.log('user connected:', socket.id)
  // user joins a board
  socket.on('JOIN_BOARD', ({ boardId, userId }) => {
    joinBoard(socket.id, userId, boardId)
    socket.join(boardId)
    const users = getBoardPresence(boardId)
    io.to(boardId).emit('PRESENCE_UPDATE', users)
  })

  socket.on('REGISTER', ({ userId }) => {
    socket.join(userId)
    console.log('User joined personal room:', userId)
  })

  socket.on('disconnect', () => {
    const info = leaveBoard(socket.id)
    if (info?.boardId) {
      const users = getBoardPresence(info.boardId)
      io.to(info.boardId).emit('PRESENCE_UPDATE', users)
    }
    console.log('user disconnected:', socket.id)
  })
})

server.listen(4000, () => {
  console.log('Realtime server running on port 4000')
})

export { io }
