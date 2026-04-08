export enum NotifyTypes {
  TASK_COMMENT_CREATED = 'TASK_COMMENT_CREATED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
}

export type CreateNotificationInput = {
  userId: string
  actorId: string
  type: NotifyTypes
  entityId: string
}
