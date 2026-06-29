import { NotifyTypes } from '@repo/types'

export type Notification = {
  id: string
  userId: string
  actorId: string
  entityId: string
  type: NotifyTypes
  read: boolean
  createdAt: string
  metaData:
    | StatusMetaData
    | AssignmentMetaData
    | CommentMetaData
    | GenericMetaData
    | EditMetaData
}

export type StatusMetaData = {
  creator: string
  isStatusChanged: boolean
  title: string
  newStatus: string
  oldStatus: string
  boardId: string
  boardTitle: string
}

export type AssignmentMetaData = {
  creator: string
  isTaskAssigned: boolean
  title: string
  newAssignee: string
  oldAssignee: string
  newAssigneeName: string
  boardId: string
  boardTitle: string
}

export type CommentMetaData = {
  creator: string
  title: string
  mentionedIds?: string[]
  boardId: string
  boardTitle: string
}

export type GenericMetaData = {
  creator: string
  isStatusChanged: boolean
  isTaskAssigned: boolean
  isMetadataUpdated: boolean
  title: string
  oldTitle: string
  boardId: string
  boardTitle: string
}

export type EditMetaData = {
  creator: string
  isMetadataUpdated: boolean
  boardId: string
  oldTitle: string
  newTitle: string
  oldDesc: string
  newDesc: string
  boardTitle: string
}
