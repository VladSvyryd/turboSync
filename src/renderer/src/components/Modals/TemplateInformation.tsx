import { FunctionComponent, useRef } from 'react'
import {
  Box,
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
  ModalOverlay,
  Select,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Switch,
  useSteps
} from '@chakra-ui/react'
import { ConditionOption, SignType } from '../../types'
import { useUploadStore } from '../../store/UploadStore'

interface OwnProps {}

type Props = OwnProps
// const steps = [
//   { title: 'First', description: 'Contact Info' },
//   { title: 'Second', description: 'Date & Time' },
//   { title: 'Third', description: 'Select Rooms' },
//   { title: 'Finish', description: 'Select Rooms' },
//   { title: 'Second', description: 'Date & Time' },
//   { title: 'Third', description: 'Select Rooms' },
//   { title: 'Finish', description: 'Select Rooms' }
// ]

const TemplateInformation: FunctionComponent<Props> = ({}) => {
  const initialRef = useRef(null)
  const { uploadTemplates, signType, updateUploadTemplate, setSignType, fillUploadTemplates } =
    useUploadStore()

  const steps = uploadTemplates
    ? [
        ...uploadTemplates,
        {
          templateInfo: {
            id: 'FINISH',
            title: 'Finish',
            requiredCondition: null,
            signType: SignType.PRINT
          }
        }
      ]
    : []
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length + 1
  })
  const activeUploadTemplateIndex = activeStep - 1
  const activeUploadTemplate = steps[activeUploadTemplateIndex]

  const renderForm = () => {
    return (
      <Stack spacing={4} flex={1}>
        <FormControl w={'100%'}>
          <FormLabel>Bezeichnung</FormLabel>
          <Input
            size={'sm'}
            ref={initialRef}
            placeholder="Neupatient"
            value={activeUploadTemplate?.templateInfo.title ?? ''}
          />
        </FormControl>
        <Select
          size={'sm'}
          variant="outline"
          value={activeUploadTemplate?.templateInfo?.signType}
          onChange={(e) => {
            console.log(e.target.value)
            if (!activeUploadTemplate) return
            updateUploadTemplate(activeUploadTemplate.templateInfo.id, {
              ...activeUploadTemplate.templateInfo,
              signType: e.target.value as SignType
            })
          }}
        >
          {Object.values(SignType).map((type) => (
            <option value={type}>{type}</option>
          ))}
        </Select>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="email-alerts" mb="0" flex={1}>
            Mit erforderlichen Bedingungen
          </FormLabel>
          <Switch
            id="withOptions"
            isChecked={Array.isArray(activeUploadTemplate.templateInfo.requiredCondition)}
            onChange={(v) => {
              updateUploadTemplate(activeUploadTemplate.templateInfo.id, {
                ...activeUploadTemplate.templateInfo,
                requiredCondition: v.target.checked ? [] : null
              })
            }}
          />
        </FormControl>
        <Stack
          visibility={activeUploadTemplate.templateInfo.requiredCondition ? 'visible' : 'hidden'}
          shadow={'inner'}
          py={2}
          px={3}
        >
          {Object.values(ConditionOption).map((key) => {
            const currentConditions = new Set(activeUploadTemplate.templateInfo.requiredCondition)

            return (
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="options" mb="0" flex={1}>
                  {key}
                </FormLabel>
                <Switch
                  id={key}
                  onChange={() => {
                    let conditions = new Set(currentConditions)
                    if (currentConditions.has(key as ConditionOption)) {
                      conditions.delete(key as ConditionOption)
                    } else {
                      conditions.add(key as ConditionOption)
                    }
                    updateUploadTemplate(activeUploadTemplate.templateInfo.id, {
                      ...activeUploadTemplate.templateInfo,
                      requiredCondition: Array.from(conditions)
                    })
                  }}
                  isChecked={currentConditions.has(key as ConditionOption)}
                />
              </FormControl>
            )
          })}
        </Stack>
      </Stack>
    )
  }

  const renderContent = () => {
    if (steps.length === 2) {
      return renderForm()
    }
    if (!activeUploadTemplate) return
    return (
      <Stack gap={4} direction={'row'}>
        <Stepper size="md" colorScheme="green" orientation={'vertical'} index={activeStep}>
          {steps.map((step, index) => (
            <Step
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveStep(Math.min(index + 1, steps.length - 1))}
            >
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle
                  style={{
                    maxWidth: 120,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }}
                >
                  {step.templateInfo.title}
                </StepTitle>
                {
                  <StepDescription
                    style={{
                      visibility: index === activeStep - 1 ? 'visible' : 'hidden'
                    }}
                  >
                    {'bearbeiten'}
                  </StepDescription>
                }
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        {renderForm()}
      </Stack>
    )
  }

  const getBlurColor = () => {
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
  const overlayColors = getBlurColor()
  const handleCloseModal = () => {
    fillUploadTemplates(null)
    setSignType(null)
  }
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
          <Button colorScheme="blue" mr={3}>
            Weiter
          </Button>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TemplateInformation
