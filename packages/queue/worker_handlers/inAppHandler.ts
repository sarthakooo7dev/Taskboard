import {
  createNotification,
  getSubscriptionForUsers,
} from '../../db/src/notificationServices/notification.services'
import {
  AppEvent,
  NotifyTypes,
  TaskCommentEvent_0,
  TaskEditEvent_0,
} from '../../types'
import { publishNotification, usersViewingBoard } from '../src/connection'

export async function handleCommentCreation(jobData: TaskCommentEvent_0) {
  const {
    receiverIds,
    senderId,
    taskId,
    type,
    boardId,
    creator,
    info,
    mentionedIds,
  } = jobData

  // const currentViewers = await usersViewingBoard(boardId)
  // console.log('RAW:', currentViewers)

  for (const userId of receiverIds) {
    // CRITICAL → must succeed (no try/catch)

    const metadataObj = { ...info, creator, mentionedIds, boardId }
    const notification = await createNotification({
      userId,
      actorId: senderId,
      type: NotifyTypes.TASK_COMMENT_CREATED,
      entityId: taskId,
      metaData: metadataObj,
    })
    //  NON-CRITICAL → safe to fail
    try {
      const notifyObj_ws = { ...notification }
      await publishNotification(userId, notifyObj_ws)
    } catch (err) {
      console.error('❌ WS publish failed for user:', userId, err)
    }
  }
}

export async function handleTaskUpdate(jobData: any) {
  const {
    receiverIds,
    senderId,
    taskId,
    type,
    boardId,
    creator,
    info,
  } = jobData

  // const currentViewers = await usersViewingBoard(boardId)
  // console.log('RAW:', currentViewers)

  for (const userId of receiverIds) {
    // CRITICAL → must succeed (no try/catch)

    const metadataObj = { ...info, creator, boardId }

    const notification = await createNotification({
      userId,
      actorId: senderId,
      type: type,
      metaData: metadataObj,
      entityId: taskId,
    })
    //  NON-CRITICAL → safe to fail
    try {
      const notifyObj_ws = { ...notification }
      await publishNotification(userId, notifyObj_ws)
    } catch (err) {
      console.error('❌ WS publish failed for user:', userId, err)
    }
  }
}
