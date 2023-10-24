import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Patient } from '../types'

interface PatientState {
  patient?: Patient
  setPatient: (patient: Patient) => void
}
export const usePatientStore = create<PatientState>()(
  devtools((set) => ({
    patient: undefined,
    setPatient: (patient: Patient) => {
      set(() => ({
        patient: patient
      }))
    }
  }))
)
