export const createPeer = () => {
  const peer = new Peer()

  let resolveOpen
  let rejectOpen
  let isPeerReady = new Promise((res, rej) => {
    resolveOpen = res
    rejectOpen = rej
  })

  const onopen = []
  const onconnectionopen = []
  const ondata = []

  let connection
  let resolveConnection
  let rejectConnection
  let isConnectionReady = new Promise((res, rej) => {
    resolveConnection = res
    rejectConnection = rej
  })

  peer.on('open', function (peerId) {
    resolveOpen()
    onopen.forEach((callback) => callback(peerId))
  })

  peer.on('error', function (error) {
    console.error('error', {...error})
    rejectOpen(error)
  })

  const handleConnection = (_connection) => {
    connection = _connection

    _connection.on('data', function (data) {
      ondata.forEach((callback) => callback(data))
    })

    _connection.on('open', function () {
      resolveConnection()
      onconnectionopen.forEach((callback) => callback(_connection.peer))
    })

    _connection.on('error', function (error) {
      console.error('error', error)
      rejectConnection(error)
    })
  }

  peer.on('connection', function (_connection) {
    handleConnection(_connection)
  })

  return {
    get id() {
      if (!peer.id) {
        throw new Error("Peer ID don't exits")
      }

      return peer.id
    },
    connect(id) {
      if (connection) {
        console.warn('Connection will be replaced')
      }

      connection = peer.connect(id)
      handleConnection(connection)

      return this
    },
    waitPeer() {
      return isPeerReady
    },
    waitConnection() {
      return isConnectionReady
    },
    onOpen(callback) {
      onopen.push(callback)
    },
    onConnectionOpen(callback) {
      onconnectionopen.push(callback)
    },
    onData(callback) {
      ondata.push(callback)
    },
    async send(data) {
      await this.waitConnection()
      connection.send(data)
    },
    disconnect() {
      peer.disconnect()
    },
  }
}
