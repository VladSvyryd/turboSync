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
import TemplateInfoForm from '../Forms/TemplateInfoForm'
import UploadTemplatesStepper from '../Steppers/UploadTemplatesStepper'

interface OwnProps {
  onSubmit: (templateWithFile: Array<TemplateWithFile>) => void
}

type Props = OwnProps
const getBlurColor = (signType: SignType | null) => {
  switch (signType) {
    case SignType.LINK: {
      const r = 245
      const g = 101
      const b = 101
      return {
        bg: `rgba(${r}, ${g}, ${b},0.12)}`,
        boxShadow: `rgba(${r}, ${g}, ${b},0.1) 0px 0px 0px 1px,rgba(${r}, ${g}, ${b},0.2) 0px 5px 10px,rgba(${r}, ${g}, ${b},0.4) 0px 0px 30px;`
      }
    }
    case SignType.SIGNPAD: {
      const r = 237
      const g = 137
      const b = 54
      return {
        bg: `rgba(${r}, ${g}, ${b},0.12)`,
        boxShadow: `rgba(${r}, ${g}, ${b},0.1) 0px 0px 0px 1px,rgba(${r}, ${g}, ${b},0.2) 0px 5px 10px,rgba(${r}, ${g}, ${b},0.4) 0px 0px 30px;`
      }
    }
    default:
      const r = 72
      const g = 187
      const b = 120
      return {
        bg: `rgba(${r}, ${g}, ${b},0.12)`,
        boxShadow: `rgba(${r}, ${g}, ${b},0.1) 0px 0px 0px 1px,rgba(${r}, ${g}, ${b},0.2) 0px 5px 10px,rgba(${r}, ${g}, ${b},0.4) 0px 0px 30px;`
      }
  }
}

const TemplateInformation: FunctionComponent<Props> = ({ onSubmit }) => {
  const initialRef = useRef(null)
  const { uploadTemplates, signType, updateUploadTemplate, setSignType, fillUploadTemplates } =
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
  const changeStepperDisabled = () => {
    const v = activeUploadTemplate?.templateInfo.title
    return !!!v && String(v).trim().length === 0
  }
  const stepperDisabled = changeStepperDisabled()
  const renderForm = () => {
    if (isLast && uploadTemplates && steps.length !== 2) {
      return
    }
    return (
      <TemplateInfoForm
        templateWithFile={activeUploadTemplate}
        inputFocusRef={initialRef}
        onTemplateInfoChange={(result) =>
          updateUploadTemplate(activeUploadTemplate.templateInfo.id, result.templateInfo)
        }
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
  const overlayColors = getBlurColor(signType)

  return (
    <Modal
      size={'xl'}
      isCentered
      initialFocusRef={initialRef}
      isOpen={Boolean(signType)}
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
