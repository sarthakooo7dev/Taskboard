import { Queue } from 'bullmq'
import { connection } from './connection'

export const notificationQueue = new Queue('notification', {
  connection,
  // Retry strategy
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: false,
    removeOnFail: false,
  },
})

export const pushQueue = new Queue('push', {
  connection,
  // Retry strategy
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: false,
    removeOnFail: false,
  },
})
