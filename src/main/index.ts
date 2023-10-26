import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { format } from 'url'
import { sendPrintOrder } from '../preload/printer'

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
  const { x, y } = getNewWindowPosition(mainWindow, newWindowWidth, newWindowHeight)
  popWindow = new BrowserWindow({
    parent: mainWindow,
    height: newWindowHeight,
    width: newWindowWidth,
    show: true,
    x: x,
    y: y,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      plugins: true,
      sandbox: false
    }
  })
  popWindow.removeMenu()
  openUrlDependingFromMode(popWindow, path)
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
    alwaysOnTop: false,
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

const openUrlDependingFromMode = (currentBrowserWindow: BrowserWindow, path: string) => {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    currentBrowserWindow.loadURL(`http://localhost:5173/${path}`)
  } else {
    const loadUrl = format({
      pathname: join(__dirname, `../renderer/index.html`),
      hash: `/${path}`,
      protocol: 'file:',
      slashes: true
    })
    currentBrowserWindow.loadURL(loadUrl)
  }
}
const getNewWindowPosition = (
  parentWindow: BrowserWindow,
  windowWidth: number,
  windowHeight: number
) => {
  const { x, y, width, height } = parentWindow.getBounds()
  let newWindowX = x - windowWidth
  let newWindowY = y
  const isWithinBoundsX = isWithinDisplayBoundsX({ x: newWindowX })
  const isWithinBoundsY = isWithinDisplayBoundsY({ y: newWindowY + windowHeight })
  if (!isWithinBoundsX) newWindowX = x + width
  if (!isWithinBoundsY) newWindowY = y - height

  return { x: newWindowX, y: newWindowY }
}
