export type User = {
  name: string
  email: string
  id: string
  avatar?: string
  createdAt: string
  role?: string
}

export type userBoardRole = 'MANAGER' | 'LEAD' | 'MEMBER' | 'VIEWER'

export type UserStore = {
  user: User | null
  counter: string
  setUser: (user: User) => void
  clearUser: () => void
}

export type Members = {
  id: string
  name: string
  image?: string
}

export type BoardCardProps = {
  title: string
  boardId: string
  role: 'MANAGER' | 'LEAD' | 'MEMBER'
  description?: string
  totalTasks?: number
  blockedTasks: number
  inProgress?: number
  updatedAt?: string
  members?: Members[]
}
