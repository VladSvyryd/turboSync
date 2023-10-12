import { FunctionComponent, useRef } from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { ModalOverlayStyle } from '../../types/variables'

interface OwnProps {}

type Props = OwnProps

const TemplateInformation: FunctionComponent<Props> = ({}) => {
  const initialRef = useRef(null)

  return (
    <Modal initialFocusRef={initialRef} isOpen={false} onClose={() => {}}>
      <ModalOverlay {...ModalOverlayStyle} />
      <ModalContent>
        <ModalHeader>Create your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>First name</FormLabel>
            <Input ref={initialRef} placeholder="First name" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Last name</FormLabel>
            <Input placeholder="Last name" />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Save
          </Button>
          <Button onClick={() => {}}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TemplateInformation
