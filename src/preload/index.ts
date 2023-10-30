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
  getPrinters: (args) => {
    return electronAPI.ipcRenderer.invoke('getPrinters', args)
  },

  printPDF: (path: string) => {
    electronAPI.ipcRenderer.send('printPDF', path)
  },
  openTemplatesWindow: () => {
    electronAPI.ipcRenderer.send('openTemplatesWindow')
  },
  onWindowIsDragged: (c) => {
    electronAPI.ipcRenderer.on('onWindowIsDragged', c)
  },
  onUpdatePatient: (c) => {
    electronAPI.ipcRenderer.on('onUpdatePatient', c)
  },
  getStoreValue: (args) => {
    return electronAPI.ipcRenderer.invoke('getStoreValue', args)
  },
  setStoreValue: (args) => {
    return electronAPI.ipcRenderer.invoke('setStoreValue', args)
  },
  printFileByPath: (args) => {
    return electronAPI.ipcRenderer.invoke('printFileByPath', args)
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
