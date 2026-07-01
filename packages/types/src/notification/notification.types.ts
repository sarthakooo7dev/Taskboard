export enum NotifyTypes {
  TASK_COMMENT_CREATED = 'TASK_COMMENT_CREATED',
  TASK_EDIT_ASSIGNMENT = 'TASK_EDIT_ASSIGNMENT',
  TASK_EDIT_STATUS = 'TASK_EDIT_STATUS',
  TASK_EDIT_METADATA = 'TASK_EDIT_METADATA',
  TASK_EDIT_GENERIC = 'TASK_EDIT_GENERIC',
  TASK_UPDATE_EVENT = 'TASK_UPDATE_EVENT',
}

export type CreateNotificationInput = {
  userId: string
  actorId: string
  type: NotifyTypes
  entityId: string
  metaData?: Record<string, any>
}
