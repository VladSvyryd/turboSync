import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { getActivePatient } from './turbomed'
import { pingAddress } from './ping'
import { openDoc } from './documnet'

// Custom APIs for renderer
const api = {
  ping: pingAddress,
  getActivePatient,
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
  print: (path: string) => {
    electronAPI.ipcRenderer.send('print', path)
  },
  printPDF: (path: string) => {
    electronAPI.ipcRenderer.send('printPDF', path)
  },
  openTemplatesWindow: () => {
    electronAPI.ipcRenderer.send('openTemplatesWindow')
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
