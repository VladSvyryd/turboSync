import { FunctionComponent } from 'react'
import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  useToken
} from '@chakra-ui/react'
import { TemplateWithFile } from '../../types'
import { useListStore } from '../../store/ListStore'

interface OwnProps {
  activeStep: number
  steps: Array<TemplateWithFile>
  isDisabled: boolean
  onClick: (index: number) => void
}

type Props = OwnProps

const UploadTemplatesStepper: FunctionComponent<Props> = ({
  activeStep,
  steps,
  isDisabled,
  onClick
}) => {
  const errorColor = useToken('colors', 'red.400')
  const { titles } = useListStore()
  return (
    <Stepper
      size="md"
      colorScheme="green"
      orientation={'vertical'}
      sx={{
        width: '100%',
        maxWidth: activeStep === steps.length ? '100%' : 150
      }}
      index={activeStep}
    >
      {steps.map((step, index) => (
        <Step
          key={index}
          style={{
            cursor: 'pointer',
            alignItems: activeStep !== steps.length ? 'flex-start' : 'center'
          }}
          onClick={() => {
            if (isDisabled) return
            onClick(Math.min(index + 1, steps.length - 1))
          }}
        >
          <StepIndicator
            zIndex={9999}
            bg={isDisabled && activeStep - 1 === index ? `${errorColor}!important` : 'inherit'}
          >
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink="0">
            <StepTitle
              style={{
                maxWidth: activeStep !== steps.length ? 120 : 200,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              {step.templateInfo.title}
            </StepTitle>
            {activeStep !== steps.length && (
              <StepDescription
                style={{
                  visibility: index === activeStep - 1 ? 'visible' : 'hidden'
                }}
              >
                {'bearbeiten'}
              </StepDescription>
            )}
          </Box>
          {activeStep === steps.length && <Text> {titles[step.templateInfo.signType]}</Text>}
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  )
}

export default UploadTemplatesStepper
