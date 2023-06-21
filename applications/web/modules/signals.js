export const createSignalBus = (url) => {
  const eventSource = new EventSource(url, {
    withCredentials: false,
  })

  let resolveReady
  let rejectReady
  const isReady = new Promise((resolve, reject) => {
    resolveReady = resolve
    rejectReady = reject
  })

  const messagesQueue = []
  const errorQueue = []
  const openQueue = []

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)

    if (data.type === 'init') {
      resolveReady()
      return
    }

    messagesQueue.forEach((callback) => callback(data))
  }

  eventSource.onerror = (event) => {
    console.error(event)
    rejectReady()
    errorQueue.forEach((callback) => callback(event))
  }

  eventSource.onopen = (event) => {
    openQueue.forEach((callback) => callback(event))
  }

  return {
    wait() {
      return isReady
    },
    onMessage(callback) {
      messagesQueue.push(callback)
    },
    onError(callback) {
      errorQueue.push(callback)
    },
    onOpen(callback) {
      openQueue.push(callback)
    },
    async send(data) {
      await this.wait()

      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((response) => response.json())
    },
  }
}
