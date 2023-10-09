import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface SettingsState {
  apiBaseUrl: string
  setApiBaseUrl: (apiBaseUrl: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        apiBaseUrl: '',
        setApiBaseUrl: (apiBaseUrl) => set(() => ({ apiBaseUrl }))
      }),
      {
        name: 'bear-storage'
      }
    )
  )
)
