import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SignType, TemplateWithFile } from '../types'

interface UploadState {
  uploadTemplates: Array<TemplateWithFile> | null
  fillUploadTemplates: (files: Array<File> | null) => void
  setUploadTemplates: (templates: Array<TemplateWithFile> | null) => void
  signTypeModal: boolean
  setSignTypeModal: (signTypeModal: boolean) => void
  signType: SignType | null
  setSignType: (signType: SignType | null) => void
  updateUploadTemplate: (id: string, templateInfo: TemplateWithFile['templateInfo']) => void
}
export const useUploadStore = create<UploadState>()(
  devtools((set) => ({
    uploadTemplates: null,
    fillUploadTemplates: (files) => {
      if (!files) {
        set(() => ({
          uploadTemplates: null
        }))
        return
      }
      set(() => ({
        uploadTemplates: files.map((file) => ({
          templateInfo: {
            id: file.name,
            title: file.name.split('.')[0] ?? '',
            signType: SignType.LINK,
            requiredCondition: null
          },
          file
        }))
      }))
    },
    signType: null,
    setSignType: (signType) => {
      set(() => ({
        signType
      }))
    },
    setUploadTemplates: (templates) => {
      set(() => ({
        uploadTemplates: templates
      }))
    },
    signTypeModal: false,
    setSignTypeModal: (signTypeModal) => {
      set(() => ({
        signTypeModal
      }))
    },
    updateUploadTemplate: (id, payload) => {
      set((state) => ({
        uploadTemplates: state.uploadTemplates?.map((template) => {
          if (template.templateInfo.id === id) {
            return {
              ...template,
              templateInfo: {
                ...template.templateInfo,
                ...payload
              }
            }
          }
          return template
        })
      }))
    }
  }))
)
