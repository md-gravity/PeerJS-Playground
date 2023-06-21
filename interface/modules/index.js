import {createPeer} from './peer.js'
import {createMessanger} from './messanger.js'

const messanger = createMessanger()
const peer = createPeer()

peer.onOpen((id) => {
    messanger.setUserId(id)
})

peer.onData((data) => {
    messanger.addMessage(data.text)
})

messanger.onConnectClick((friendId) => {
    peer.connect(friendId)
})

messanger.onSendClick(async (text) => {
    await peer.send({text})
    messanger.addMessage(text)
})