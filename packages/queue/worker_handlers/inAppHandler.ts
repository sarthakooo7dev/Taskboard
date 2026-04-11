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
import webpush from 'web-push'

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
    const notification = await createNotification({
      userId,
      actorId: senderId,
      type: NotifyTypes.TASK_COMMENT_CREATED,
      entityId: taskId,
    })
    //  NON-CRITICAL → safe to fail
    try {
      const notifyObj_ws = { ...notification, creator, info, mentionedIds }
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
    const notification = await createNotification({
      userId,
      actorId: senderId,
      type: type,
      metaData: info,
      entityId: taskId,
    })
    //  NON-CRITICAL → safe to fail
    try {
      const notifyObj_ws = { ...notification, creator, info }
      await publishNotification(userId, notifyObj_ws)
    } catch (err) {
      console.error('❌ WS publish failed for user:', userId, err)
    }
  }
}

export async function handleTaskAssignment_pushNotify(
  jobData: TaskEditEvent_0,
) {
  {
    const {
      receiverIds,
      senderId,
      taskId,
      type,
      boardId,
      creator,
      info,
    } = jobData
    const newAssigneeID = String(jobData.info.newAssignee)
    console.log('📨 Push worker running' + JSON.stringify(receiverIds))
    console.log('##########   ' + JSON.stringify(jobData))
    console.log('##########   ' + JSON.stringify(newAssigneeID))

    for (const userId of receiverIds) {
      // const isOnline = await redis.get(`user:${userId}:online`)

      // if (isOnline) {
      //   console.log("⏭️ Skip push (user online):", userId)
      //   continue
      // }
      console.log('userId:', userId, typeof userId)
      // Get subscriptions from DB (custom)
      const subs = await getSubscriptionForUsers(userId)
      console.log('📨 Push worker running' + JSON.stringify(subs))

      // Send push to each device
      for (const sub of subs) {
        try {
          // 🔥 personalize message
          let title = `Task Update ${userId}`
          let body = 'Assignment updated on a task'
          const cleanUserId = String(userId)
          console.log(
            'COMPARE:',
            cleanUserId,
            newAssigneeID,
            cleanUserId === newAssigneeID,
          )
          if (newAssigneeID && String(userId) === newAssigneeID) {
            title = `New Task Assigned 🎯 ${userId}`
            body = `Hey! You have been assigned a new task`
          }

          // web-push library → sends notification to browser
          console.log('SENDING🎯🎯🎯🎯 PUSH:', userId, title, body)
          await webpush.sendNotification(
            sub.subscription as any, // full JSON
            JSON.stringify({
              title,
              body,
            }),
          )

          console.log('Push sent:', userId)
        } catch (err) {
          console.error('Push failed:', userId, err)
        }
      }
    }
  }
}
