import { notificationQueue, pushQueue } from '@repo/queue'
import { EventType, AppEvent } from '@repo/types'

export async function eventDispatcher(event: AppEvent) {
  const errorEventType: string = event.type + ''

  switch (event.type) {
    case EventType.TASK_COMMENT_CREATED: {
      await notificationQueue.add('notify', event)
      break
    }

    case EventType.TASK_EDIT_ASSIGNMENT: {
      await notificationQueue.add('notify', event)
      await pushQueue.add('push', event)
      break
    }

    case EventType.TASK_EDIT_STATUS: {
      await notificationQueue.add('notify', event)
      break
    }

    case EventType.TASK_EDIT_METADATA: {
      await notificationQueue.add('notify', event)
      break
    }

    case EventType.TASK_EDIT_GENERIC: {
      await notificationQueue.add('notify', event)
      break
    }

    default: {
      throw new Error(`Unhandled event ${errorEventType}`)
    }
  }
}
