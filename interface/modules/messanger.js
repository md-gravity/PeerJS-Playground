const createMessanger = () => {
    const messages = document.querySelector('#messages')
    
    return {
        addMessage(text) {
            const item = document.createElement('li')
            item.innerText = text
            document.querySelector('#messages').append(item)
        },
        onSendClick(callback) {
            document.querySelector('#send').addEventListener('click', () => {
                const text = document.querySelector('#message').value
                callback(text)
            })
        },
        setUserId(id) {
            document.querySelector('#peerId').value = id
        },
        onConnectClick(callback) {
            document.querySelector('#connect').addEventListener('click', () => {
                const friendId = document.querySelector('#firendId').value
                callback(friendId)
            })
        }
    }
}

export {createMessanger}