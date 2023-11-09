import { Notification } from 'electron'
import { ServerDocument } from './socket'
import { openPDFPreviewWindow } from './subscriptions'
import icon from '../../resources/iconNotification.png?asset'

const NOTIFICATION_TITLE_SUCCESS = 'Neues Dokument erhalten.'

export function showNotification(doc: ServerDocument) {
  try {
    const n = new Notification({
      icon,
      title: NOTIFICATION_TITLE_SUCCESS,
      body: `Patient ${doc.ownerId} hat ein neues Dokument unterzeichnet.`,
      urgency: 'critical'
    })
    n.on('click', () => {
      openPDFPreviewWindow(doc.signedPath)
    })
    n.show()
    return
  } catch (e) {
    console.log(e)
  }
}
