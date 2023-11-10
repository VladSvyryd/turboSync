import io, { Socket } from 'socket.io-client'
import { showNotification } from './notifications'
import { store } from '../preload/store'

export enum ServerEmitterEvents {
  notify = 'notify'
}

export type ServerDocument = {
  ownerId: string
  signedPath: string
}
export interface ServerToClientEvents {
  [ServerEmitterEvents.notify]: (doc: ServerDocument) => void
}

export interface ClientToServerEvents {}

const createConnection = (base: string) => {
  const s = io(`http://${base}`, { reconnectionDelay: 5000 })
  s.on('connect', () => {
    console.log('connected')
    store.set('socketConnected', true)
  })

  s.on('connect_error', (err) => {
    console.log('connect_error', err?.message)
  })
  s.on(ServerEmitterEvents.notify, (doc) => {
    console.log('doc: ', doc)
    showNotification(doc)
  })
  s.on('disconnect', () => {
    store.set('socketConnected', false)
  })
  return s
}
export let socket: Socket<ServerToClientEvents, ClientToServerEvents> = createConnection(
  store.get('apiBaseUrl')
)
store.onDidChange('apiBaseUrl', (value) => {
  if (value) {
    socket.disconnect()
    socket = createConnection(value)
  }
})
