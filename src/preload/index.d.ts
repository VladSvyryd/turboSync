import { ElectronAPI } from '@electron-toolkit/preload'
import { initPatientImport } from './turbomed'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      ping: (address: string) => void
      getActivePatient: () => Promise<{ data: Patient; error: any }>
      getPatientById: (id: string) => Promise<{ data: Patient; error: any }>
      initPatientImport: (args: {
        id: string
        turbomedPath: string
      }) => Promise<{ data: Patient; error: any }>
      onProgressChanged: (args: (event: Electron.IpcMainEvent, progress: number) => void) => void
      setProgress: (args: (event: Electron.IpcMainEvent, progress: number) => void) => void
      importToTurbomedById: (id: string) => void
      getExportData: (id: string) => any
      getListOfExportData: () => any
      onLogs: (logs: any) => any
    }
  }
}
