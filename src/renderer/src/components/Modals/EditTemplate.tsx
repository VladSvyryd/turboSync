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
import { getBlurColorBySignType, templateTitleIsValid } from '../../util'
import TemplateForm from '../Forms/TemplateForm'
import { updateTemplate } from '../../api'
import { useTemplatesStore } from '../../store/DocStore'
import { mutate } from 'swr'
import { fetchTemplatesUrl } from '../../types/variables'
interface OwnProps {}

type Props = OwnProps

const EditTemplate: FunctionComponent<Props> = ({}) => {
  const initialRef = useRef(null)
  const { editTemplate, setEditTemplate } = useTemplatesStore()

  const handleCloseModal = () => {
    setEditTemplate(null)
  }

  const handleOnSubmit = async () => {
    if (!editTemplate) return

    // if requiredCondition is null, set it to empty array cause BE
    await updateTemplate(
      {
        ...editTemplate,
        requiredCondition: editTemplate.requiredCondition ? editTemplate.requiredCondition : []
      },
      () => {
        handleCloseModal()
      }
    )
    await mutate(fetchTemplatesUrl)
  }

  const overlayColors = getBlurColorBySignType(editTemplate?.signType)
  if (!editTemplate) return null
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
            template={editTemplate}
            inputFocusRef={initialRef}
            onChange={(result) => {
              setEditTemplate({
                ...editTemplate,
                title: result.title,
                signType: result.signType,
                requiredCondition: result.requiredCondition
                  ? result.requiredCondition
                  : (null as any)
              })
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleOnSubmit}
            isDisabled={!templateTitleIsValid(editTemplate.title)}
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
