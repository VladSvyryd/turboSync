import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { pingAddress } from './ping'
import { getPatientById } from './turbomed'
import { initPatientImport } from '../main/turbomedMain'
// Custom APIs for renderer
const api = {
  ping: pingAddress,
  getPatientById: getPatientById,
  initPatientImport: initPatientImport,
  onProgressChanged: (c) => {
    electronAPI.ipcRenderer.on('onProgressChanged', c)
  },
  setProgress: (c) => {
    electronAPI.ipcRenderer.on('setProgress', c)
  },
  test: (c) => {
    console.log('test')
    ipcRenderer.send('test', c)
  },
  getExportData: (c) => {
    return ipcRenderer.invoke('getExportData', c)
  },
  getListOfExportData: (c) => {
    return ipcRenderer.invoke('getListOfExportData', c)
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
