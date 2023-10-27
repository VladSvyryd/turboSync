import { app, shell, BrowserWindow, ipcMain, screen, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { format } from 'url'
import { sendPrintOrder } from '../preload/printer'
import contextMenu from 'electron-context-menu'
const minWidth = 50
const minHeight = 50

let mainWindow: BrowserWindow
let popWindow: BrowserWindow
let pdfWindow: BrowserWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 150,
    height: 150,
    maxWidth: 500,
    maxHeight: 500,
    minWidth,
    minHeight,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: true,
    // focusable: false,
    transparent: true, // this breaks resize feature
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // devTools: true,
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
  contextMenu({
    window: mainWindow,
    showSelectAll: false,
    append: (defaultActions, params, browserWindow) => [
      {
        icon: nativeTheme.shouldUseDarkColors
          ? join(__dirname, '../../resources/settings-white.png')
          : join(__dirname, '../../resources/settings-black.png'),
        label: 'Einstellungen',
        role: 'quit'
      },

      {
        icon: nativeTheme.shouldUseDarkColors
          ? join(__dirname, '../../resources/close-white.png')
          : join(__dirname, '../../resources/close-black.png'),
        label: 'Fenster schließen',
        role: 'quit'
      }
    ]
  })
  creaeteWindowDragControl(mainWindow)
  mainWindow.setAspectRatio(0.78)
  // const m = new Menu()
  // m.append({checked: true, label: 'test', type: 'checkbox'})
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

function isWithinDisplayBoundsX(pos: { x: number; display: BrowserWindow }) {
  const winBounds = pos.display.getBounds()
  const activeScreen = screen.getDisplayNearestPoint({ x: winBounds.x, y: winBounds.y })
  const area = activeScreen.workArea
  return pos.x >= area.x && pos.x < area.x + area.width
}
function isWithinDisplayBoundsY(pos: { y: number; display: BrowserWindow }) {
  const winBounds = pos.display.getBounds()
  const activeScreen = screen.getDisplayNearestPoint({ x: winBounds.x, y: winBounds.y })
  const area = activeScreen.workArea
  return pos.y >= area.y && pos.y < area.y + area.height
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
  const isWithinBoundsX = isWithinDisplayBoundsX({ x: newWindowX, display: parentWindow })
  const isWithinBoundsY = isWithinDisplayBoundsY({
    y: newWindowY + windowHeight,
    display: parentWindow
  })
  if (!isWithinBoundsX) newWindowX = x + width
  if (!isWithinBoundsY) newWindowY = y - windowHeight + height

  return { x: newWindowX, y: newWindowY }
}

const creaeteWindowDragControl = (currentWindow: BrowserWindow) => {
  const WM_MOUSEMOVE = 0x0200 // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-mousemove
  const WM_LBUTTONUP = 0x0202 // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-lbuttonup

  const MK_LBUTTON = 0x0001
  let isDragging = false
  let initialPos = {
    x: 0,
    y: 0
  }

  currentWindow.hookWindowMessage(WM_LBUTTONUP, () => {
    isDragging = false

    currentWindow.webContents.send('onWindowIsDragged', { isDragged: isDragging })
  })
  currentWindow.hookWindowMessage(WM_MOUSEMOVE, (wParam, lParam) => {
    if (!currentWindow) {
      return
    }
    const wParamNumber: number = wParam.readInt16LE(0)
    if (!(wParamNumber & MK_LBUTTON)) {
      // <-- checking if left mouse button is pressed
      return
    }

    const x = lParam.readInt16LE(0)
    const y = lParam.readInt16LE(2)
    if (!isDragging) {
      isDragging = true
      initialPos.x = x
      initialPos.y = y
      return
    }
    currentWindow.setBounds({
      x: x + currentWindow.getPosition()[0] - initialPos.x,
      y: y + currentWindow.getPosition()[1] - initialPos.y
    })
    currentWindow.webContents.send('onWindowIsDragged', { isDragged: isDragging })
  })
}
