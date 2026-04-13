import webpush from 'web-push'
import { TaskEditEvent_0 } from '../../types'
import { getSubscriptionForUsers } from '../../db/src/notificationServices/notification.services'

export async function handleTaskAssignment_pushNotify(
  jobData: TaskEditEvent_0,
) {
  {
    const { receiverIds } = jobData
    const newAssigneeID = String(jobData.info.newAssignee)
    const newAssigneName = String(jobData.info.newAssigneName)
    const taskName = (jobData.info.title || '').slice(0, 15) + '...'
    console.log('📨 Push worker running' + JSON.stringify(receiverIds))

    for (const userId of receiverIds) {
      // Get subscriptions from DB (custom)
      const subs = await getSubscriptionForUsers(userId)

      // Send push to each device
      for (const sub of subs) {
        try {
          let title = `Task Update !`
          let body = `Hey ! there is an update on 📄 ${taskName}`

          if (newAssigneeID && String(userId) === newAssigneeID) {
            title = `New Task Assigned 🎯`
            body = `Hey ! @${newAssigneName} have been assigned a new task 📄`
          }

          // web-push library → sends notification to browser
          await webpush.sendNotification(
            sub.subscription as any,
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
