import { join } from 'path'
import { openNewWindow, openUrlDependingFromMode, popWindow } from './helpers'
import { sendPrintOrder } from '../preload/printer'
import { BrowserWindow, ipcMain } from 'electron'
import { store } from './store'

export let pdfWindow: BrowserWindow

ipcMain.on('openNewWindow', (_, path) => {
  openNewWindow(path)
})

ipcMain.on('openPDFPreviewWindow', async (_, path) => {
  if (pdfWindow) {
    pdfWindow.destroy()
  }
  let newWindowHeight = 800
  let newWindowWidth = 600

  pdfWindow = new BrowserWindow({
    parent: popWindow,
    height: newWindowHeight,
    width: newWindowWidth,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      plugins: true,
      sandbox: false,
      webviewTag: true,
      devTools: true
    }
  })
  pdfWindow.removeMenu()
  openUrlDependingFromMode(pdfWindow, `pdf?path=${path}`)
  pdfWindow.maximize()
  pdfWindow.show()
  pdfWindow.on('close', async () => {
    pdfWindow.webContents.send('onPDFWindowClose')
  })
})

ipcMain.on('getPrinters', async (event) => {
  let list = await popWindow.webContents.getPrintersAsync()
  event.sender.send('receivePrinters', list)
})
ipcMain.on('printFile', async (event, { path, defaultPrinter }) => {
  console.log(path)
  try {
    sendPrintOrder(path, defaultPrinter)
    event.sender.send('onPrintFileResult', { printFile: true })
  } catch (e) {
    console.log('LKANDKLANWDKLNAWKLD', e)
    event.sender.send('onPrintFileResult', { printFile: false })
  }
})
ipcMain.handle('getStoreValue', async (_, { key }) => {
  try {
    return store.get(key)
  } catch (e) {
    console.log('getStoreValue', e)
    return null
  }
})
ipcMain.handle('setStoreValue', async (_, { key, value }) => {
  try {
    return store.set(key, value)
  } catch (e) {
    console.log('getStoreValue', e)
    return null
  }
})
