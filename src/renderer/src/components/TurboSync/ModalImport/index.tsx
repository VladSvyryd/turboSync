import { FunctionComponent, useEffect, useRef, useState } from 'react'
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react'
import { useListStore } from '../../../store/ListStore'
import { Patient } from '../../../types'
import { IoCheckmarkDoneSharp, IoClose } from 'react-icons/io5'

interface OwnProps {
  onSubmit: (toId: string) => void
}

type Props = OwnProps

const ModalImport: FunctionComponent<Props> = ({ onSubmit }) => {
  const toast = useToast()
  const [finalPatient, setFinalPatient] = useState<Patient | undefined>(undefined)
  const { activeExport, setActiveImport } = useListStore()
  const initialRef = useRef(null)
  const handleCloseModal = () => {
    setActiveImport(undefined)
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = event.target['patientId'].value
    getPatient(value)
  }

  const getPatient = async (value: string) => {
    console.log('NOW')
    try {
      const patient = await window.api.getPatientById(value)
      if (patient?.error) {
        toast({
          title: 'Warnung',
          description: 'Patient wurde nicht gefunden.'
        })
        setFinalPatient(undefined)
        return
      }
      toast({
        status: 'success',
        title: 'Patient gefunden',
        description: `${patient.data.firstName} ${patient.data.secondName}`
      })
      setFinalPatient(patient.data)
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Turbomed.'
      })
    } finally {
    }
  }
  const renderFinalPatient = () => {
    if (!finalPatient)
      return (
        <Stack direction={'row'} alignItems={'center'}>
          <Text color={'red'}> {'==>'} Patient mit dem selben ID wurde nicht gefunden</Text>
          <IoClose color={'red'} />
        </Stack>
      )
    return (
      <Stack direction={'row'} alignItems={'center'}>
        <Text>
          {'==>'} {`${finalPatient?.id} - ${finalPatient?.secondName} ${finalPatient?.secondName}`}
        </Text>
        <IoCheckmarkDoneSharp color={'green'} />
      </Stack>
    )
  }

  useEffect(() => {
    if (!activeExport) return
    getPatient(activeExport.id)
  }, [])

  return (
    <Modal
      size={'xl'}
      isCentered
      initialFocusRef={initialRef}
      isOpen={true}
      onClose={handleCloseModal}
      motionPreset="slideInBottom"
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Start Import</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack>
            <Stack direction={'row'} alignItems={'center'}>
              <Text>
                {'<=='}{' '}
                {`${activeExport?.id} - ${activeExport?.secondName} ${activeExport?.secondName}`}
              </Text>
              <IoCheckmarkDoneSharp color={'green'} />
            </Stack>
            {renderFinalPatient()}
            <Stack alignItems={'center'} direction={'row'}>
              <form onSubmit={handleFormSubmit}>
                <InputGroup size="md">
                  <Input autoFocus name={'patientId'} pr="4.5rem" placeholder="Patientnummer" />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" type={'submit'}>
                      {'Suchen'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </form>
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            isDisabled={!finalPatient}
            onClick={() => {
              if (finalPatient) {
                onSubmit(finalPatient?.id)
                handleCloseModal()
              }
            }}
          >
            Importieren
          </Button>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalImport
