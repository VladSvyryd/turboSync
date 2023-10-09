import { ElectronAPI } from '@electron-toolkit/preload'
import {Patient} from "../renderer/src/types";

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      ping: () => void
      getActivePatient: () => Promise<{ data:Patient,error:any }>
      openNewWindow: (path:string) => void
    }
  }
}
