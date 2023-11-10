import { ElectronAPI } from '@electron-toolkit/preload'

declare global {

  interface Window {
    electron: ElectronAPI
    api: {
      ping: (address:string) => void
      getActivePatient: () => Promise<{ data:Patient,error:any }>
      openNewWindow: (path:string) => void
      openPDFPreviewWindow: (path:string) => void
      openDoc: (docTitle:string) => void
      onPDFWindowClose: (callback:()=>void) => void
      getPrinters: () => Promise<Electron.PrinterInfo[]>
      getScanners: () => Promise<{ name:string,deviceId:string }[]>
      printPDF: (path:string) => void
      openTemplatesWindow: () => void
      onWindowIsDragged: (callback:(event: Electron.IpcMainEvent,res: { isDragged:boolean })=>void) => void
      onUpdatePatient: (callback:(event: Electron.IpcMainEvent,res: any|undefined)=>void) => void
      getStoreValue:(args:{key: string}) => Promise<any>
      setStoreValue:(args:{key: string,value:any}) => Promise<any>
      printFileByPath:(args:{path: string,defaultPrinter:string}) => Promise<{ printFile:boolean }>
      onSocketConnection: (args:(event: Electron.IpcMainEvent,connection:boolean)=> void) => void
      onTurbomedConnection: (args:(event: Electron.IpcMainEvent,connection:boolean)=> void) => void
    }
  }
}
