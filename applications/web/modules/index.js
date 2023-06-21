import {createPeer} from './peer.js'
import {createMessanger} from './messanger.js'
import {createSignalBus} from './signals.js'

const messanger = createMessanger()
const peer = createPeer()
const signalBus = createSignalBus('http://localhost:3000/signals')

signalBus.onMessage(async ({type, peerId}) => {
  if (type === 'signal' && peerId !== peer.id) {
    messanger.setFriendId(peerId)
    peer.connect(peerId)
  }
})

peer.onOpen(async (peerId) => {
  messanger.setUserId(peerId)
  await signalBus.send({type: 'signal', peerId: peerId})
})

peer.onConnectionOpen(async (peerId) => {
  messanger.setFriendId(peerId)
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
  messanger.setMessageText('')
})
