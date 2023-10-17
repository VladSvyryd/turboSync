import { FunctionComponent, useRef } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useSteps
} from '@chakra-ui/react'
import { SignType, TemplateWithFile } from '../../types'
import { useUploadStore } from '../../store/UploadStore'
import UploadTemplatesStepper from '../Steppers/UploadTemplatesStepper'
import { getBlurColorBySignType, templateTitleIsValid } from '../../util'
import TemplateForm from '../Forms/TemplateForm'

interface OwnProps {
  onSubmit: (templateWithFile: Array<TemplateWithFile>) => void
}

type Props = OwnProps

const TemplateInformation: FunctionComponent<Props> = ({ onSubmit }) => {
  const initialRef = useRef(null)
  const { uploadTemplates, signType, setSignType, updateUploadTemplate, fillUploadTemplates } =
    useUploadStore()
  const dummyFinishTemplate = {
    file: new File([], ''),
    templateInfo: {
      id: 'FINISH',
      title: 'Finish',
      requiredCondition: null,
      signType: SignType.PRINT
    }
  }
  const steps: Array<TemplateWithFile> = uploadTemplates
    ? [...uploadTemplates, dummyFinishTemplate]
    : []
  const { activeStep, setActiveStep, isCompleteStep } = useSteps({
    index: 1,
    count: steps.length + 1
  })
  const isLast = isCompleteStep(steps.length - 1)
  const activeUploadTemplateIndex = activeStep - 1
  const activeUploadTemplate = steps[activeUploadTemplateIndex]
  const stepperDisabled = !templateTitleIsValid(activeUploadTemplate?.templateInfo.title ?? '')
  const renderForm = () => {
    if (isLast && uploadTemplates && steps.length !== 2) {
      return
    }
    return (
      <TemplateForm
        template={{
          title: activeUploadTemplate.templateInfo.title,
          signType: activeUploadTemplate.templateInfo.signType,
          requiredCondition: activeUploadTemplate.templateInfo.requiredCondition
        }}
        inputFocusRef={initialRef}
        onChange={(result) => {
          updateUploadTemplate(activeUploadTemplate.templateInfo.id, {
            ...activeUploadTemplate.templateInfo,
            title: result.title,
            signType: result.signType,
            requiredCondition: result.requiredCondition
          })
        }}
      />
    )
  }

  const renderContent = () => {
    if (steps.length === 2) {
      return renderForm()
    }
    return (
      <Stack gap={4} direction={'row'}>
        <UploadTemplatesStepper
          activeStep={activeStep}
          steps={steps}
          onClick={(nextValue) => setActiveStep(nextValue)}
          isDisabled={stepperDisabled}
        />

        {renderForm()}
      </Stack>
    )
  }

  const handleCloseModal = () => {
    fillUploadTemplates(null)
    setSignType(null)
  }
  const overlayColors = getBlurColorBySignType(signType)
  const isOpen = Boolean(signType)
  return (
    <Modal
      size={'xl'}
      isCentered
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={handleCloseModal}
    >
      <ModalOverlay bg={overlayColors.bg} />
      <ModalContent boxShadow={overlayColors.boxShadow}>
        <ModalHeader>Vorlage einstellen</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{renderContent()}</ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              if (!isLast && steps.length === 2) {
                const stepsCopy = steps
                stepsCopy.pop()
                console.log(stepsCopy)
                onSubmit(stepsCopy)
                handleCloseModal()
                return
              }
              setActiveStep(activeStep + 1)
            }}
            isDisabled={stepperDisabled}
          >
            {!isLast && steps.length === 2 ? 'Hinzufügen' : 'Weiter'}
          </Button>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TemplateInformation
