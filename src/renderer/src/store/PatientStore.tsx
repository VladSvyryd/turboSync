import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Patient, TemplateEvaluationStatus } from '../types'

interface PatientState {
  patient?: Patient
  setPatient: (patient: Patient) => void
  status: TemplateEvaluationStatus
  setStatus: (status: TemplateEvaluationStatus) => void
}
export const usePatientStore = create<PatientState>()(
  devtools((set) => ({
    patient: undefined,
    setPatient: (patient: Patient) => {
      set(() => ({
        patient: patient
      }))
    },
    status: TemplateEvaluationStatus.WARNING,
    setStatus: (status: TemplateEvaluationStatus) => {
      set(() => ({
        status: status
      }))
    }
  }))
)
