import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { SignType } from '../types'

interface ListState {
  titles: { [key in SignType]: string }
  activeTitle: SignType | null
  changeTitle: (title: SignType, newTitle: string) => void
  setActiveTitle: (title: SignType | null) => void
}
export const useListStore = create<ListState>()(
  devtools(
    persist(
      (set) => ({
        titles: {
          [SignType.LINK]: 'Hoch',
          [SignType.SIGNPAD]: 'Mittel',
          [SignType.PRINT]: 'Niedrig'
        },
        activeTitle: null,
        setActiveTitle: (title: SignType | null) => {
          set(() => ({
            activeTitle: title
          }))
        },
        changeTitle: (title: SignType, newTitle: string) => {
          set((state) => ({
            titles: {
              ...state.titles,
              [title]: newTitle
            }
          }))
        }
      }),
      {
        name: 'list-storage'
      }
    )
  )
)
