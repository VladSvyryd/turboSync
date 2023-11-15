import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Patient } from '../types'

interface ListState {
  patients: Array<Patient>
  setPatients: (patients: Array<Patient>) => void
  removePatient: (patient: Patient) => void
  addPatient: (patient: Patient) => void
  exports: Array<Patient>
  setExports: (exports: Array<Patient>) => void
  activeExport: Patient | null
  setActiveExport: (patient: Patient | null) => void
  activeImport: Patient | null | undefined
  setActiveImport: (patient: Patient | null | undefined) => void
}
export const useListStore = create<ListState>()(
  devtools((set) => ({
    patients: [],
    setPatients: (patients: Array<Patient>) => {
      set({
        patients: patients
      })
    },
    removePatient: (patient: Patient) => {
      set(({ patients }) => ({
        patients: patients.filter((p) => p.id !== patient.id)
      }))
    },
    addPatient: (patient: Patient) => {
      set(({ patients }) => ({
        patients: [...patients, patient]
      }))
    },
    exports: [],
    setExports: (exports) => {
      set({
        exports: exports
      })
    },
    activeExport: null,
    setActiveExport: (patient) => {
      set({
        activeExport: patient
      })
    },
    activeImport: undefined,
    setActiveImport: (patient) => {
      set({
        activeImport: patient
      })
    }
  }))
)
