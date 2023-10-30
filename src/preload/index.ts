import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { pingAddress } from './ping'
import { openDoc } from './documnet'
import { getCurrentPatient } from './turbomed'

// Custom APIs for renderer
const api = {
  ping: pingAddress,
  getActivePatient: getCurrentPatient,
  openNewWindow: (path: string) => {
    electronAPI.ipcRenderer.send('openNewWindow', path)
  },
  openDoc,
  openPDFPreviewWindow: (path: string) => {
    electronAPI.ipcRenderer.send('openPDFPreviewWindow', path)
  },
  onPDFWindowClose: (callback: () => void) => {
    electronAPI.ipcRenderer.on('onPDFWindowClose', callback)
  },
  getPrinters: () => {
    electronAPI.ipcRenderer.send('getPrinters')
  },
  onReceivePrinters: (c) => {
    electronAPI.ipcRenderer.on('receivePrinters', c)
  },
  printFile: (options) => {
    electronAPI.ipcRenderer.send('printFile', options)
  },
  onPrintFileResult: (c) => {
    electronAPI.ipcRenderer.on('onPrintFileResult', c)
  },
  printPDF: (path: string) => {
    electronAPI.ipcRenderer.send('printPDF', path)
  },
  openTemplatesWindow: () => {
    electronAPI.ipcRenderer.send('openTemplatesWindow')
  },
  onWindowIsDragged: (c) => {
    electronAPI.ipcRenderer.on('onWindowIsDragged', c)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
