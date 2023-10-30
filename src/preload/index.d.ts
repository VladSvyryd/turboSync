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
      getPrinters: () => void
      onReceivePrinters: (callback:(event: Electron.IpcMainEvent, ...args: any[])=>void) => void
      printFile: (options:{path:string,defaultPrinter:string}) => void
      printPDF: (path:string) => void
      openTemplatesWindow: () => void
      onPrintFileResult: (callback:(event: Electron.IpcMainEvent,res: { printFile:boolean })=>void) => void
      onWindowIsDragged: (callback:(event: Electron.IpcMainEvent,res: { isDragged:boolean })=>void) => void
      onUpdatePatient: (callback:(event: Electron.IpcMainEvent,res: any|undefined)=>void) => void
      getStoreValue:(args:{key: string}) => Promise<any>
      setStoreValue:(args:{key: string,value:any}) => Promise<any>
    }
  }
}
