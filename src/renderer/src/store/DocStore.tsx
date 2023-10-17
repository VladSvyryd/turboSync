import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { VirtualElement } from '@popperjs/core'
import { Template } from '../types'
import { MouseEvent } from 'react'

interface TemplatesState {
  template: Template | null
  setTemplate: (template: Template | null) => void
  contextMenuRef: VirtualElement | null
  setContextMenuRef: (event: MouseEvent, doc: Template) => void
  editTemplate: Template | null
  setEditTemplate: (template: Template | null) => void
  closeContextMenu: () => void
}
export const useTemplatesStore = create<TemplatesState>()(
  devtools((set) => ({
    contextMenuRef: null,
    setContextMenuRef: (event: MouseEvent, doc: Template) => {
      event.preventDefault()
      set({
        contextMenuRef: {
          getBoundingClientRect: generateGetBoundingClientRect(event.clientX, event.clientY) as any
        },
        template: doc
      })
    },
    editTemplate: null,
    setEditTemplate: (template: Template | null) => {
      set({
        editTemplate: template
      })
    },
    template: null,
    setTemplate: (template: Template | null) => {
      set({
        template: template
      })
    },
    closeContextMenu: () => {
      set({
        template: null,
        contextMenuRef: null
      })
    }
  }))
)

function generateGetBoundingClientRect(x = 0, y = 0) {
  return () => ({
    width: 0,
    height: 0,
    top: y,
    right: x + 75,
    bottom: y,
    left: x + 75
  })
}
