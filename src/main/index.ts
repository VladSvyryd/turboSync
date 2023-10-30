import './helpers'
import './store'
import './subscriptions'
import { app, shell, BrowserWindow, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import contextMenu from 'electron-context-menu'
import { creaeteWindowDragControl, openNewWindow } from './helpers'
const minWidth = 50
const minHeight = 50
export let mainWindow: BrowserWindow

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
    append: () => [
      {
        icon: nativeTheme.shouldUseDarkColors
          ? join(__dirname, '../../resources/settings-white.png')
          : join(__dirname, '../../resources/settings-black.png'),
        label: 'Einstellungen',
        click: () => {
          openNewWindow('settings')
        }
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
