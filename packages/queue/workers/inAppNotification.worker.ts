import * as dotenv from 'dotenv'
import path from 'path'
import { Worker } from 'bullmq'
import { connection } from '../src/connection'
import { NotifyTypes } from '../../types'
import {
  handleCommentCreation,
  handleTaskUpdate,
} from '../worker_handlers/inAppHandler'

// to make .env load explicitly for worker
const envPath = path.resolve(process.cwd(), '.env')
dotenv.config({ path: envPath })

export const notificationWorker = new Worker(
  'notification',
  async (job) => {
    switch (job.data.type) {
      case NotifyTypes.TASK_COMMENT_CREATED:
        return handleCommentCreation(job.data)

      case NotifyTypes.TASK_EDIT_GENERIC:
        return handleTaskUpdate(job.data)

      case NotifyTypes.TASK_EDIT_STATUS:
        return handleTaskUpdate(job.data)

      case NotifyTypes.TASK_EDIT_ASSIGNMENT:
        return handleTaskUpdate(job.data)

      case NotifyTypes.TASK_EDIT_METADATA:
        return handleTaskUpdate(job.data)

      default:
        throw new Error(`Unhandled type: ${job.data.type}`)
    }
  },
  {
    connection,
  },
)
