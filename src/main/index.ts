import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as url from 'url'
import { wait } from '../preload/printer'

const minWidth = 100
const minHeight = 150

let mainWindow: BrowserWindow
let popWindow: BrowserWindow
let pdfWindow: BrowserWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 200,
    height: 300,
    minWidth,
    minHeight,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: true,
    transparent: true, // this breaks resize feature
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: true,
      plugins: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock leftIcon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('openNewWindow', (_, path) => {
  if (popWindow) {
    popWindow.destroy()
  }
  let newWindowHeight = 800
  let newWindowWidth = 600
  const { x, y, width, height } = mainWindow.getBounds()
  let newWindowX = x - newWindowWidth
  let newWindowY = y
  const isWithinBoundsX = isWithinDisplayBoundsX({ x: newWindowX })
  const isWithinBoundsY = isWithinDisplayBoundsY({ y: newWindowY + newWindowHeight })
  if (!isWithinBoundsX) newWindowX = x + width
  if (!isWithinBoundsY) newWindowY = y - height
  popWindow = new BrowserWindow({
    parent: mainWindow,
    height: newWindowHeight,
    width: newWindowWidth,
    show: true,
    x: newWindowX,
    y: newWindowY,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      plugins: true,
      sandbox: false
    }
  })
  // popWindow.setPosition()
  popWindow.removeMenu()
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    popWindow.loadURL(`http://localhost:5173/${path}`)
  } else {
    const loadUrl = url.format({
      pathname: join(__dirname, `../renderer/index.html`),
      hash: `/${path}`,
      protocol: 'file:',
      slashes: true
    })
    popWindow.loadURL(loadUrl)
  }
  console.log(path)
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
      webviewTag: true
    }
  })
  pdfWindow.removeMenu()
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    pdfWindow.loadURL(`http://localhost:5173/pdf?path=${path}`)
  } else {
    const loadUrl = url.format({
      pathname: join(__dirname, `../renderer/index.html`),
      hash: `/pdf`,
      protocol: 'file:',
      slashes: true
    })
    pdfWindow.loadURL(loadUrl)
  }
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
ipcMain.on('print', async () => {
  const printWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      plugins: true,
      sandbox: false,
      webviewTag: true,
      webSecurity: false
    }
  })
  const path =
    'file:\\192.168.185.59\\DigiSignStorage\\clipboard\\bb66e3bb-a8b0-4d2a-a86e-25ea5489bd0e.pdf'

  // const printJob = await print(path, {
  //   silent: true,
  //   printer: 'Xerox Drucker (Name)'
  // })
  // console.log(url)
  printWindow.loadURL(`http://localhost:5173/printer?path=${path}`)
  printWindow.webContents.on('did-finish-load', async () => {
    await wait(5000)

    printWindow.webContents.print({
      silent: false,
      printBackground: false,
      deviceName: 'PDFCreator'
      // deviceName: 'Xerox Drucker (Name)'
    })
    // printWindow.destroy()
  })
})

// ipcMain.on('ping', (_, path) => {
//   ;['path'].forEach(function (host) {
//     ping.promise.probe(host).then(function (res) {
//       console.log(res)
//     })
//   })
// })

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate blackList and require them here.

// function isWithinDisplayBounds(pos: { x: number; y: number }) {
//   const displays = screen.getAllDisplays()
//   return displays.reduce((result, display) => {
//     const area = display.workArea
//     return (
//       result ||
//       (pos.x >= area.x &&
//         pos.y >= area.y &&
//         pos.x < area.x + area.width &&
//         pos.y < area.y + area.height)
//     )
//   }, false)
// }
function isWithinDisplayBoundsX(pos: { x: number }) {
  const displays = screen.getAllDisplays()
  return displays.reduce((result, display) => {
    const area = display.workArea
    return result || (pos.x >= area.x && pos.x < area.x + area.width)
  }, false)
}
function isWithinDisplayBoundsY(pos: { y: number }) {
  const displays = screen.getAllDisplays()
  return displays.reduce((result, display) => {
    const area = display.workArea
    return result || (pos.y >= area.y && pos.y < area.y + area.height)
  }, false)
}
