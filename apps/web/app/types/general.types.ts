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

export type BoardModalState = {
  open?: boolean
  openModal: () => void
  closeModal: () => void
}

export type Members = {
  id: string
  name: string
  avatar?: string
}

export type BoardCardProps = {
  title: string
  boardId: string
  role: 'MANAGER' | 'LEAD' | 'MEMBER'
  description?: string
  totalTasks?: number
  blockedTasks: number
  inProgressTasks?: number
  totalMembers: number
  updatedAt?: string
  members?: Members[]
}

export type TaskStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'DONE'
  | 'CUSTOM'

export interface TaskItem {
  id: string
  title: string
  description: string
  column: {
    id: string
    name: string
    type: TaskStatus
  }
  Priority: 'LOW' | 'MEDIUM' | 'HIGH'
  estimate: number
  progress: number
  comments: number
  selected?: boolean
  createdAt: string
  assignedTo: {
    id: string
    name: string
    avatar: string
  }
  _count: {
    comments: number
  }
}

export interface availableStatusType {
  id: string
  name: string
  type: TaskStatus
  order: number
}

export interface TaskRowProps {
  task: TaskItem
  availableStatus: availableStatusType[]
  boardId: string
  handleSelectedTask: (currentTask: TaskItem, editMode?: boolean) => void
}

export type TaskDetailsSheetProps = {
  openTask: boolean
  onOpenChange: (open: boolean) => void
  task: TaskItem | null
  isEditMode: boolean
  setIsEditMode: (isEditMode: boolean) => void
}
