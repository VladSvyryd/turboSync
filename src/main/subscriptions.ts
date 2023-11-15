import { join } from 'path'
import { openNewWindow, openUrlDependingFromMode, popWindow } from './helpers'
import { app, BrowserWindow, ipcMain } from 'electron'
import { store } from '../preload/store'
import icon from '../../resources/icon.png?asset'
import { initPatientImport } from './turbomedMain'
import { readdirSync, readFileSync } from 'fs'

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

ipcMain.on('setProgress', async (event, progress) => {
  event.reply('setProgress', progress)
})

ipcMain.on('test', async (_, id) => {
  console.log('test', app.getAppPath(), id)
  initPatientImport(id)
})
ipcMain.handle('getExportData', (_, id) => {
  const filePath = app.getAppPath() + `/temp/export/${id}`
  return readFileSync(filePath + '/data.json', 'utf8')
})

ipcMain.handle('getListOfExportData', () => {
  const filePath = app.getAppPath() + `/temp/export/`
  const folders = readdirSync(filePath, { withFileTypes: true })
  const exports: any = []
  folders.forEach((d) => {
    const f = readFileSync(filePath + d.name + '/data.json', 'utf8')
    const data = JSON.parse(f)
    exports.push({
      id: data?.id,
      firstName: data?.firstName,
      secondName: data?.secondName
    })
  })
  return exports
})
