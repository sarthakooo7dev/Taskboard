import { metadata } from '@/app/layout'
import { useUserStore } from '@/app/store/user-store'
import {
  AssignmentMetaData,
  CommentMetaData,
  EditMetaData,
  GenericMetaData,
  Notification,
  StatusMetaData,
} from '@/app/types/notification.types'
import { NotifyTypes } from '@repo/types'
import { CircleAlert, UserPlus } from 'lucide-react'

export const formatNotification = (n: Notification, userID: string) => {
  switch (n.type) {
    case NotifyTypes.TASK_EDIT_STATUS: {
      const metaData = n.metaData as StatusMetaData

      return {
        icon: CircleAlert,
        time: n.createdAt,
        entityId: n.entityId,
        boardId: metaData.boardId,
        boardTitle: metaData.boardTitle,
        info: `${metaData.creator} moved "${metaData.title}" to ${metaData.newStatus}`,
      }
    }

    case NotifyTypes.TASK_EDIT_ASSIGNMENT: {
      const metaData = n.metaData as AssignmentMetaData
      const assignee =
        metaData.newAssignee === userID ? 'you' : `${n.metaData.creator}`
      return {
        icon: UserPlus,
        time: n.createdAt,
        entityId: n.entityId,
        boardId: metaData.boardId,
        boardTitle: metaData.boardTitle,
        info: `${metaData.creator} assigned "${metaData.title}" to ${assignee}`,
      }
    }

    case NotifyTypes.TASK_EDIT_GENERIC: {
      const metaData = n.metaData as GenericMetaData
      return {
        icon: UserPlus,
        time: n.createdAt,
        entityId: n.entityId,
        boardId: metaData.boardId,
        boardTitle: metaData.boardTitle,
        info: `${metaData.creator} has updated ${metaData.title}`,
      }
    }

    case NotifyTypes.TASK_EDIT_METADATA: {
      const metaData = n.metaData as EditMetaData
      const notifyInfo =
        metaData.oldTitle === metaData.newTitle
          ? `updated details for ${metaData.newTitle}`
          : ` changed ${metaData.oldTitle} to ${metaData.newTitle}`

      return {
        icon: UserPlus,
        time: n.createdAt,
        entityId: n.entityId,
        boardId: metaData.boardId,
        boardTitle: metaData.boardTitle,
        info: `${metaData.creator} ${notifyInfo}`,
      }
    }

    case NotifyTypes.TASK_COMMENT_CREATED: {
      const metaData = n.metaData as CommentMetaData
      return {
        icon: UserPlus,
        time: n.createdAt,
        entityId: n.entityId,
        boardId: metaData.boardId,
        boardTitle: metaData.boardTitle,
        info: `${metaData.creator} commented on ${metaData.title}`,
      }
    }
  }
}
