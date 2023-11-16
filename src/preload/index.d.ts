import { ElectronAPI } from '@electron-toolkit/preload'

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
      getExportData: (id: string) => any
      getListOfExportData: () => any
      onLogs: (logs: any) => any
      importToTurbomedById: (args: { fromId: string; toId: string; turbomedPath: string }) => void
      deleteExportById: (args: { id: string }) => void
      cleanUp: () => void
    }
  }
}
