import { Worker } from 'bullmq'
import { connection } from '../src/connection'

new Worker(
  'push',
  async (job) => {
    console.log('🔵 PUSH WORKER')

    console.log('Data:', job.data)
  },
  { connection },
)
