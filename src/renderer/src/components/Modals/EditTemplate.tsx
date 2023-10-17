import { Dispatch, FunctionComponent, SetStateAction, useRef } from 'react'
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
import { Template } from '../../types'
import { getBlurColorBySignType, templateTitleIsValid } from '../../util'
import TemplateForm from '../Forms/TemplateForm'

interface OwnProps {
  template: Template | null
  setTemplate: Dispatch<SetStateAction<Template | null>>
  onSubmit: (template: Template | null) => void
}

type Props = OwnProps

const EditTemplate: FunctionComponent<Props> = ({ onSubmit, template, setTemplate }) => {
  const initialRef = useRef(null)

  const handleCloseModal = () => {
    setTemplate(null)
  }

  const overlayColors = getBlurColorBySignType(template?.signType)
  if (!template) return null
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
      <ModalOverlay bg={overlayColors.bg} />
      <ModalContent boxShadow={overlayColors.boxShadow}>
        <ModalHeader>Vorlage einstellen</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <TemplateForm
            hideSignType
            template={template}
            inputFocusRef={initialRef}
            onChange={(result) => {
              setTemplate((prev) =>
                prev
                  ? {
                      ...prev,
                      title: result.title,
                      signType: result.signType,
                      requiredCondition: result.requiredCondition
                        ? result.requiredCondition
                        : (null as any)
                    }
                  : null
              )
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              onSubmit(template)
            }}
            isDisabled={!templateTitleIsValid(template.title)}
          >
            Übernehmen
          </Button>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EditTemplate
