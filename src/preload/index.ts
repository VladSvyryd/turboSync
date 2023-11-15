import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { pingAddress } from './ping'
import { getPatientById } from './turbomed'
// Custom APIs for renderer
const api = {
  ping: pingAddress,
  getPatientById: getPatientById,
  onProgressChanged: (c) => {
    electronAPI.ipcRenderer.on('onProgressChanged', c)
  },
  setProgress: (c) => {
    electronAPI.ipcRenderer.on('setProgress', c)
  },
  initPatientImport: (c) => {
    electronAPI.ipcRenderer.send('initPatientImport', c)
  },
  importToTurbomedById: (c) => {
    electronAPI.ipcRenderer.send('importToTurbomedById', c)
  },
  getExportData: (c) => {
    return electronAPI.ipcRenderer.invoke('getExportData', c)
  },
  getListOfExportData: (c) => {
    return electronAPI.ipcRenderer.invoke('getListOfExportData', c)
  },
  onLogs: (c) => {
    return electronAPI.ipcRenderer.on('onLogs', c)
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
