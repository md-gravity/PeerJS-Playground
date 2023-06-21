import http from 'node:http'
import {EventEmitter} from 'node:events'

const server = http.createServer()

const bus = new EventEmitter()

server.on('request', async (request, response) => {
  console.log(`[${request.method}] ${request.url}`)

  if (request.method === 'GET' && request.url === '/signals') {
    bus.on('signal', (signal) => {
      response.write(`data: ${JSON.stringify(signal)}\n\n`)
    })

    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
    })

    response.write(`data: ${JSON.stringify({type: 'init'})}\n\n`)
  }

  if (request.method === 'POST' && request.url === '/signals') {
    const body = await getBody(request)
    bus.emit('signal', body)

    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    })

    response.end(JSON.stringify({status: 'ok'}))
  }
})

const getBody = (request) => {
  return new Promise((resolve, reject) => {
    let body = []
    request
      .on('data', (chunk) => {
        body.push(chunk)
      })
      .on('end', () => {
        body = Buffer.concat(body).toString()
        resolve(JSON.parse(body))
      })
  })
}

server.listen(3000, () => {
  console.log('Server ready')
})
