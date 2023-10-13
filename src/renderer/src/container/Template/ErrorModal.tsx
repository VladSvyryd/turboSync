import { FunctionComponent } from 'react'
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import Error from '../../components/Alert/Error'

interface OwnProps {
  error: string | null
  onClose: () => void
}

type Props = OwnProps

const ErrorModal: FunctionComponent<Props> = ({ error, onClose }) => {
  return (
    <Modal isCentered isOpen={Boolean(error)} onClose={onClose}>
      <ModalOverlay bg={'blackAlpha.500'} />
      <ModalContent>
        <Error
          cause={'Sind Sie sicher, dass Turbomed an ist und ein Patient ausgewählt ist?'}
          moreInfo={error}
        />
      </ModalContent>
    </Modal>
  )
}

export default ErrorModal
