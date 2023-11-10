import { join } from 'path'
import { openNewWindow, openUrlDependingFromMode, popWindow } from './helpers'
import { createPrintOrder } from '../preload/printer'
import { BrowserWindow, ipcMain } from 'electron'
import { store } from '../preload/store'
import icon from '../../resources/icon.png?asset'
import { getAllScanners } from '../preload/scan/scan'

export let pdfWindow: BrowserWindow

ipcMain.on('openNewWindow', async (_, path) => {
  await openNewWindow(path)
})

export const openPDFPreviewWindow = (path: string) => {
  console.log(path)

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
    icon,
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
}
ipcMain.on('openPDFPreviewWindow', async (_, path) => {
  openPDFPreviewWindow(path)
})

ipcMain.handle('getPrinters', async () => {
  return popWindow.webContents.getPrintersAsync()
})
ipcMain.handle('getScanners', async () => {
  const scanners = getAllScanners()
  console.log('getScanners', scanners)
  return scanners
})
ipcMain.handle('printFileByPath', async (_, { path, defaultPrinter }) => {
  try {
    createPrintOrder(path, defaultPrinter)
    return { printFile: true }
  } catch (e) {
    return { printFile: true }
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
