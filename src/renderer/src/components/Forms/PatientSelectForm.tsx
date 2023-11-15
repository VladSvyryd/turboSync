import { FunctionComponent, useRef, useState } from 'react'
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Stack,
  useToast
} from '@chakra-ui/react'
import { useListStore } from '../../store/ListStore'
import { IoSearch } from 'react-icons/io5'

interface OwnProps {}

type Props = OwnProps

const PatientSelectForm: FunctionComponent<Props> = ({}) => {
  const toast = useToast()
  const { patients, addPatient } = useListStore()
  const ref = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)
  const getPatient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (new Set(patients.map((p) => p.id)).has(event.target['patientId'].value)) {
      toast({
        title: 'Patient',
        description: 'Patient wurde bereits hinzugefügt.'
      })

      return
    }
    const value = event.target['patientId'].value
    try {
      setLoading(true)
      const patient = await window.api.getPatientById(value)
      if (patient?.error) {
        toast({
          title: 'Warnung',
          description: 'Patient wurde nicht gefunden.'
        })
        return
      }
      toast({
        status: 'success',
        title: 'Patient hinzugefügt',
        description: `${patient.data.firstName} ${patient.data.secondName}`
      })
      addPatient(patient.data)
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Turbomed.'
      })
    } finally {
      setLoading(false)
      ref?.current?.reset()
    }
  }
  return (
    <Stack spacing={4} maxWidth={400}>
      <form ref={ref} onSubmit={(e) => getPatient(e)}>
        <InputGroup>
          <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
            <IoSearch />
          </InputLeftElement>
          <Input name={'patientId'} autoFocus placeholder="Patientnummer" />
          <InputRightElement>
            {loading && <Spinner size={'xs'} color={'cyan.500'} />}
          </InputRightElement>
        </InputGroup>
      </form>
    </Stack>
  )
}

export default PatientSelectForm
