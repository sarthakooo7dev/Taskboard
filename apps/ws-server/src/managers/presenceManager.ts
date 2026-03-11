type SocketId = string
type BoardId = string
type UserId = string

// boardId -> sockets connected to that board
const boardSockets = new Map<BoardId, Set<SocketId>>()

// socketId -> connection info
const socketInfo = new Map<SocketId, { userId: UserId; boardId: BoardId }>()

// When a socket joins a board

export function joinBoard(
  socketId: SocketId,
  userId: UserId,
  boardId: BoardId,
) {
  socketInfo.set(socketId, { userId, boardId })

  if (!boardSockets.has(boardId)) {
    boardSockets.set(boardId, new Set())
  }

  boardSockets.get(boardId)!.add(socketId)
}

// When socket disconnects or leaves board

export function leaveBoard(socketId: SocketId) {
  const info = socketInfo.get(socketId)

  if (!info) return null

  const { boardId } = info

  const sockets = boardSockets.get(boardId)

  if (sockets) {
    sockets.delete(socketId)

    if (sockets.size === 0) {
      boardSockets.delete(boardId)
    }
  }

  socketInfo.delete(socketId)

  return info
}

// Get unique users present on a board

export function getBoardPresence(boardId: BoardId): UserId[] {
  const sockets = boardSockets.get(boardId)

  if (!sockets) return []

  const users = new Set<UserId>()

  for (const socketId of sockets) {
    const info = socketInfo.get(socketId)

    if (info) {
      users.add(info.userId)
    }
  }

  return [...users]
}
