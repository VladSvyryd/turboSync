import { FunctionComponent, useRef, useState } from 'react'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text
} from '@chakra-ui/react'
import { useListStore } from '../../../store/ListStore'
interface OwnProps {}

type Props = OwnProps

const ModalImport: FunctionComponent<Props> = ({}) => {
  const [values, setValues] = useState('')
  const { activeImport, activeExport, setActiveImport } = useListStore()
  const initialRef = useRef(null)
  const handleCloseModal = () => {
    setActiveImport(undefined)
  }

  const handleOnSubmit = async () => {}

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
          <Text>
            {`${activeExport?.id}- ${activeExport?.secondName} ${activeExport?.secondName}`}
          </Text>
          <Text>{`=>`}</Text>
          {activeImport ? (
            <Text>{activeImport?.id}</Text>
          ) : (
            <Stack>
              <Text>
                Patient {activeExport?.id} wurde nicht gefunden. Tragen Sie bitte ein, unter welchem
                Patient soll man Daten importieren.
              </Text>
              <Input
                value={values}
                name={'patientId'}
                autoFocus
                placeholder="Patientnummer"
                onChange={(e) => {
                  setValues(e.target.value)
                }}
              />
            </Stack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} isDisabled={values === ''} onClick={handleOnSubmit}>
            Importieren
          </Button>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalImport
