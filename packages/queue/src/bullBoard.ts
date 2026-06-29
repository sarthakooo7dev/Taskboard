import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'

import { notificationQueue, pushQueue } from './queues'

const serverAdapter = new ExpressAdapter()

serverAdapter.setBasePath('/queues')

createBullBoard({
  queues: [new BullMQAdapter(notificationQueue), new BullMQAdapter(pushQueue)],
  serverAdapter,
})

export { serverAdapter }
