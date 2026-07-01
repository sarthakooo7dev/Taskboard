export enum EventType {
  TASK_COMMENT_CREATED = 'TASK_COMMENT_CREATED',
  TASK_EDIT_ASSIGNMENT = 'TASK_EDIT_ASSIGNMENT',
  TASK_EDIT_STATUS = 'TASK_EDIT_STATUS',
  TASK_EDIT_METADATA = 'TASK_EDIT_METADATA',
  TASK_EDIT_GENERIC = 'TASK_EDIT_GENERIC',
   TASK_UPDATE_EVENT = 'TASK_UPDATE_EVENT',
}

export type TaskCommentEvent_0 = {
  type: EventType.TASK_COMMENT_CREATED
  boardId: string
  creator: string
  info: Record<string, any>
  taskId: string
  senderId: string
  mentionedIds: string[]
  receiverIds: string[]
}

export type TaskEditEvent_0 = {
  type: EventType.TASK_EDIT_ASSIGNMENT
  boardId: string
  creator: string
  info: Record<string, any>
  taskId: string
  senderId: string
  receiverIds: string[]
}
export type TaskEditEvent_1 = {
  type: EventType.TASK_EDIT_STATUS
  boardId: string
  creator: string
  info: Record<string, any>
  taskId: string
  senderId: string
  receiverIds: string[]
}
export type TaskEditEvent_2 = {
  type: EventType.TASK_EDIT_METADATA
  boardId: string
  creator: string
  info: Record<string, any>
  taskId: string
  senderId: string
  receiverIds: string[]
}

export type TaskEditEvent_3 = {
  type: EventType.TASK_EDIT_GENERIC
  boardId: string
  creator: string
  info: Record<string, any>
  taskId: string
  senderId: string
  receiverIds: string[]
}

export type TaskEditEvent_4 = {
  type: EventType.TASK_UPDATE_EVENT
  boardId: string
  creator: string
  info: Record<string, any>
  taskId: string
  senderId: string
  receiverIds: string[]
}

/**
 * Union of all events (important for type safety)
 */
export type AppEvent =
  | TaskCommentEvent_0
  | TaskEditEvent_0
  | TaskEditEvent_1
  | TaskEditEvent_2
  | TaskEditEvent_3
  | TaskEditEvent_4
