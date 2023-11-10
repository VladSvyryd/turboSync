import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Patient, TemplateEvaluationStatus } from '../types'

interface PatientState {
  patient?: Patient
  setPatient: (patient: Patient | undefined) => void
  status: TemplateEvaluationStatus
  setStatus: (status: TemplateEvaluationStatus) => void
}
export const usePatientStore = create<PatientState>()(
  devtools((set) => ({
    patient: undefined,
    setPatient: (patient) => {
      set(() => ({
        patient: patient
      }))
    },
    status: TemplateEvaluationStatus.WARNING,
    setStatus: (status) => {
      set(() => ({
        status: status
      }))
    }
  }))
)
