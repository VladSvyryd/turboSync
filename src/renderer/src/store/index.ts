import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface SettingsState {
  apiBaseUrl: string
  setApiBaseUrl: (apiBaseUrl: string) => void
  defaultPrinter: Electron.PrinterInfo | null
  setDefaultPrinter: (defaultPrinter: Electron.PrinterInfo) => void
  defaultScanner: string | null
  setDefaultScanner: (defaultScanner: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        apiBaseUrl: '',
        setApiBaseUrl: (apiBaseUrl) => set(() => ({ apiBaseUrl })),
        defaultPrinter: null,
        setDefaultPrinter: (defaultPrinter) => set(() => ({ defaultPrinter })),
        defaultScanner: null,
        setDefaultScanner: (defaultScanner) => set(() => ({ defaultScanner }))
      }),
      {
        name: 'settings-storage'
      }
    )
  )
)
