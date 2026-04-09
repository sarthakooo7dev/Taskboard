export enum NotifyTypes {
  TASK_COMMENT_CREATED = 'TASK_COMMENT_CREATED',
  TASK_EDIT_ASSIGNMENT = 'TASK_EDIT_ASSIGNMENT',
  TASK_EDIT_STATUS = 'TASK_EDIT_STATUS',
  TASK_EDIT_METADATA = 'TASK_EDIT_METADATA',
  TASK_EDIT_GENERIC = 'TASK_EDIT_GENERIC',
}

export type CreateNotificationInput = {
  userId: string
  actorId: string
  type: NotifyTypes
  entityId: string
}
