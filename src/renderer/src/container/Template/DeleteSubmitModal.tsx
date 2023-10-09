import { FunctionComponent, useRef } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'

interface OwnProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

type Props = OwnProps

const DeleteSubmitModal: FunctionComponent<Props> = ({ isOpen, onClose, onDelete }) => {
  const initialDeleteModalRef = useRef<any>()

  return (
    <Modal
      isCentered
      initialFocusRef={initialDeleteModalRef}
      isOpen={isOpen}
      onClose={onClose}
      size={'xs'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={'md'}>Confirmation!</ModalHeader>
        <ModalBody>Sind Sie sicher, dass Sie mit Ihrer Aktion fortfahren möchten?</ModalBody>
        <ModalCloseButton />

        <ModalFooter>
          <Button
            ref={initialDeleteModalRef}
            size={'sm'}
            colorScheme="blue"
            mr={3}
            onClick={() => {
              onDelete()
              onClose()
            }}
          >
            Löschen
          </Button>
          <Button size={'sm'} onClick={onClose}>
            Nein
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteSubmitModal
