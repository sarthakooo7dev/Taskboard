import http from 'http'

import './inAppNotification.worker'
import './pushNotification.worker'

const PORT = Number(process.env.PORT) || 4001

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    })

    res.end(
      JSON.stringify({
        status: 'ok',
        service: 'klyro-workers',
      }),
    )

    return
  }

  res.writeHead(404)
  res.end()
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 KLYRO workers running on port ${PORT}`)
})
