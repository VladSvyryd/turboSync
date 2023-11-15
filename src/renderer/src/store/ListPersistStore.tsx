import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ListPersistState {
  exportTurbomedPath: string | undefined
  importTurbomedPath: string | undefined
  setExportTurbomedPath: (path: string) => void
  setImportTurbomedPath: (path: string) => void
}
export const useListPersistStore = create<ListPersistState>()(
  devtools(
    persist(
      (set) => ({
        exportTurbomedPath: undefined,
        importTurbomedPath: undefined,
        setExportTurbomedPath: (path) => {
          set({
            exportTurbomedPath: path
          })
        },
        setImportTurbomedPath: (path) => {
          set({
            importTurbomedPath: path
          })
        }
      }),
      {
        name: 'list-persist-store'
      }
    )
  )
)
