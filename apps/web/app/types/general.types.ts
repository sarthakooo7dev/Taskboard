import { PriorityType } from '@repo/db'

export type User = {
  name: string
  email: string
  id: string
  avatar: string
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

export type BoardDetails = {
  id: string
  title: string
  description: string
}

export type BoardStore = {
  currentBoard: BoardDetails | null
  setCurrentBoard: (board: BoardDetails) => void
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

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'
export interface TaskItem {
  id: string
  title: string
  description: string
  column: {
    id: string
    name: string
    type: TaskStatus
  }
  Priority: TaskPriority
  estimate: number
  progress: number
  comments: number
  selected?: boolean
  createdAt: string
  createdById: string
  updatedAt: string
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
  order?: number
}

export interface TaskRowProps {
  task: TaskItem
  availableStatus: availableStatusType[]
  boardId: string
  handleSelectedTask: (currentTask: TaskItem, editMode?: boolean) => void
  updateTaskListRef: React.RefObject<boolean>
  currentUserMembership: boardMember
  onDelete: (taskId: string) => void
}

export type TaskDetailsSheetProps = {
  openTask: boolean
  onOpenChange: (open: boolean) => void
  task: TaskItem | null
  isEditMode: boolean
  setIsEditMode: (isEditMode: boolean) => void
  availableStatus: availableStatusType[]
  boardId: string
  membersList: boardMember[]
  updateTaskListRef: React.RefObject<boolean>
}

export type boardMember = {
  id: string
  name: string
  avatar: string
  role: string
}

export type TaskTabsProps = {
  taskId: string
  boardId: string
  isEditMode: boolean
  isExpanded: boolean
}

export type CommentTabProps = {
  taskId: string
  boardId: string
  setCount: (count: number) => void
  isEditMode: boolean
}

export type TaskComment = {
  id: string
  message: string
  createdAt: string

  user: {
    id: string
    name: string
    avatar: string
  }
}

export type ActivityTabProps = {
  taskId: string
  boardId: string
  isExpanded: boolean
}

export type Activity = {
  id: string
  type: string
  createdAt: string
  metadata: Record<string, any>
  actor: {
    id: string
    name: string
    avatar?: string
  }
}

export type TaskToolbarProps = {
  availableStatus: availableStatusType[]
  membersList: boardMember[]
  tasks: TaskItem[]
  visibleTasks: TaskItem[]
  setVisibleTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>
  registerApplyFilter: (fn: () => TaskItem[]) => void
  boardId: string
  updateTaskListRef: React.RefObject<boolean>
}

export type AppliedFilters = {
  statuses: string[]
  priorities: string[]
  members: string[]
}

export interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableStatus: availableStatusType[]
  membersList: boardMember[]
  isPending?: boolean
  onSubmit: (data: CreateTaskFormData) => void
}

export interface CreateTaskFormData {
  title: string
  description: string
  priority?: TaskPriority
  assignedToId?: string | null
}

export interface InfoToolbarProps {
  blockedCount: number
  totalTasks: number
}

export type WorkspaceOverviewItem = {
  id: string
  name: string
  totalTasks: number
  doneTasks: number
  inProgressTasks: number
  blockedTasks: number
  progress: number
  lastActivityAt: string
}
export type TeamWorkloadItem = {
  id: string
  name: string
  avatar: string | null
  activeTasks: number
  workloadMinutes: number
}
export type DashboardTaskItem = {
  id: string
  title: string
  estimate: number
  Priority: 'LOW' | 'MEDIUM' | 'HIGH'

  updatedAt: string

  progress: number

  board: {
    id: string
    name: string
  }

  assignedTo: {
    id: string
    name: string
    avatar: string | null
  }

  column: {
    type: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE' | 'CUSTOM'
  }
}
export type PriorityQueueItem = DashboardTaskItem

export type RecentWorkItem = DashboardTaskItem

export type DashboardData = {
  workspaceOverview: WorkspaceOverviewItem[]

  teamWorkload: TeamWorkloadItem[]

  priorityQueue: PriorityQueueItem[]

  recentWork: RecentWorkItem[]
}

export type WorkloadProps = {
  workloadData: TeamWorkloadItem[]
  isLoading: boolean
}

export type WorkspaceProps = {
  workspaceData: WorkspaceOverviewItem[]
  isLoading: boolean
}

export type ActivityType =
  | 'TASK_CREATED'
  | 'TASK_MOVED'
  | 'TASK_UPDATED'
  | 'TASK_DELETED'
  | 'TASK_ASSIGNED'
  | 'COMMENT_CREATED'

export type ActivityData = {
  id: string
  type: ActivityType
  entityId: string
  metadata: Record<string, any>
  createdAt: string
  actor: Members
  board: {
    id: string
    name: string
  }
}
