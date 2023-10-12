import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface SettingsState {
  apiBaseUrl: string
  setApiBaseUrl: (apiBaseUrl: string) => void
  defaultPrinter: string | null
  setDefaultPrinter: (defaultPrinter: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        apiBaseUrl: '',
        setApiBaseUrl: (apiBaseUrl) => set(() => ({ apiBaseUrl })),
        defaultPrinter: null,
        setDefaultPrinter: (defaultPrinter) => set(() => ({ defaultPrinter }))
      }),
      {
        name: 'settings-storage'
      }
    )
  )
)
