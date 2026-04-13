import * as dotenv from 'dotenv'
import path from 'path'
import { Worker } from 'bullmq'
import { connection } from '../src/connection'
import webpush from 'web-push'
import { getSubscriptionForUsers } from '../../db/src/notificationServices/notification.services'
import { NotifyTypes } from '../../types'
import { handleTaskAssignment_pushNotify } from '../worker_handlers/pushNotifyHandler'

// to make .env load explicitly for worker
const envPath = path.resolve(process.cwd(), '.env')
dotenv.config({ path: envPath })

// Configure web-push (library)
webpush.setVapidDetails(
  'mailto:test@test.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY!,
)

export const pushWorker = new Worker(
  'push',
  async (job) => {
    switch (job.data.type) {
      case NotifyTypes.TASK_EDIT_ASSIGNMENT:
        return handleTaskAssignment_pushNotify(job.data)

      default:
        throw new Error(`Unhandled type: ${job.data.type}`)
    }
  },
  { connection },
)

console.log('🚀 Push Worker running')
