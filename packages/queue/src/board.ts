import express from 'express'
import { serverAdapter } from './bullBoard'

const app = express()

app.use('/queues', serverAdapter.getRouter())

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`🚀 Bull Board running at http://localhost:${PORT}/queues`)
})
