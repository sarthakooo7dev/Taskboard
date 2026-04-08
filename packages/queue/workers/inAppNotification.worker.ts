import * as dotenv from 'dotenv'
import path from 'path'
import { Worker } from 'bullmq'
import { connection } from '../src/connection'
import { NotifyTypes } from '../../types'
import {
  handleCommentCreation,
  handleTaskAssignment,
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

      case NotifyTypes.TASK_ASSIGNED:
        return handleTaskAssignment(job.data)

      default:
        throw new Error(`Unhandled type: ${job.data.type}`)
    }
  },
  {
    connection,
  },
)
