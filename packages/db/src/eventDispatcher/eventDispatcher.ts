import { notificationQueue, pushQueue } from '@repo/queue'
import { EventType, AppEvent } from '@repo/types'

export async function eventDispatcher(event: AppEvent) {
  switch (event.type) {
    case EventType.TASK_COMMENT_CREATED: {
      // send to In-App notification queue
      await notificationQueue.add('notify', event)

      // send to browser push notify queue
      await pushQueue.add('push', event)

      break
    }

    case EventType.TASK_EDIT_ASSIGNMENT: {
      // send to In-App notification queue
      await notificationQueue.add('notify', event)

      // send to browser push notify queue
      await pushQueue.add('push', event)

      break
    }
    case EventType.TASK_EDIT_STATUS: {
      // send to In-App notification queue
      await notificationQueue.add('notify', event)

      // send to browser push notify queue
      await pushQueue.add('push', event)

      break
    }

    case EventType.TASK_EDIT_METADATA: {
      console.log('RANNNN------ dispatcher')
      // send to In-App notification queue
      await notificationQueue.add('notify', event)

      // send to browser push notify queue
      await pushQueue.add('push', event)

      break
    }

    case EventType.TASK_EDIT_GENERIC: {
      // send to In-App notification queue
      await notificationQueue.add('notify', event)

      // send to browser push notify queue
      await pushQueue.add('push', event)

      break
    }

    default: {
      throw new Error('Unhandled event ')
    }
  }
}
