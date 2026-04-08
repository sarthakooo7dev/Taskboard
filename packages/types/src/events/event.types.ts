export enum EventType {
  TASK_COMMENT_CREATED = 'TASK_COMMENT_CREATED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
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

export type TaskAssignEvent_0 = {
  type: EventType.TASK_ASSIGNED
  creator: string
  info: Record<string, any>
  taskId: string
  senderId: string
  receiverIds: string[]
}

/**
 * Union of all events (important for type safety)
 */
export type AppEvent = TaskCommentEvent_0 | TaskAssignEvent_0
