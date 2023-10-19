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
import { useTemplatesStore } from '../../store/TemplateStore'
import { Template } from '../../types'

interface OwnProps {
  onDelete: (uuid: Template['uuid']) => void
}

type Props = OwnProps

const DeleteSubmitModal: FunctionComponent<Props> = ({ onDelete }) => {
  const initialDeleteModalRef = useRef<any>()
  const { deleteTemplateUUID, setDeleteTemplateUUID } = useTemplatesStore()
  const onClose = () => {
    setDeleteTemplateUUID(null)
  }
  return (
    <Modal
      isCentered
      initialFocusRef={initialDeleteModalRef}
      isOpen={Boolean(deleteTemplateUUID)}
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
              if (deleteTemplateUUID) onDelete(deleteTemplateUUID)
              setDeleteTemplateUUID(null)
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
