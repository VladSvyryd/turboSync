import { FunctionComponent } from 'react'
import { FormControl, FormLabel, Input, Select, Stack, Switch } from '@chakra-ui/react'
import { ConditionOption, SignType, TemplateWithFile } from '../../types'
import { useListStore } from '../../store/ListStore'

interface OwnProps {
  templateWithFile: TemplateWithFile
  onTemplateInfoChange: (templateWithFile: TemplateWithFile) => void
  inputFocusRef: React.RefObject<HTMLInputElement>
}

type Props = OwnProps
const changeStepperDisabled = (templateInfo: TemplateWithFile['templateInfo']) => {
  const v = templateInfo.title
  return !!!v && String(v).trim().length === 0
}
const TemplateInfoForm: FunctionComponent<Props> = ({
  templateWithFile,
  inputFocusRef,
  onTemplateInfoChange
}) => {
  const stepperDisabled = changeStepperDisabled(templateWithFile.templateInfo)
  const { titles } = useListStore()
  return (
    <Stack spacing={4} flex={1}>
      <FormControl w={'100%'}>
        <FormLabel>Bezeichnung</FormLabel>
        <Input
          autoFocus
          isInvalid={stepperDisabled}
          size={'sm'}
          ref={inputFocusRef}
          placeholder="Neupatient"
          value={templateWithFile?.templateInfo.title ?? ''}
          onChange={(e) => {
            onTemplateInfoChange({
              ...templateWithFile,
              templateInfo: {
                ...templateWithFile.templateInfo,
                title: e.target.value
              }
            })
          }}
        />
      </FormControl>
      <Select
        size={'sm'}
        variant="outline"
        value={templateWithFile?.templateInfo?.signType}
        onChange={(e) => {
          onTemplateInfoChange({
            ...templateWithFile,
            templateInfo: {
              ...templateWithFile.templateInfo,
              signType: e.target.value as SignType
            }
          })
        }}
      >
        {Object.values(SignType).map((type) => (
          <option value={type}>{titles[type]}</option>
        ))}
      </Select>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="0" flex={1}>
          Mit erforderlichen Bedingungen
        </FormLabel>
        <Switch
          id="withOptions"
          isChecked={Array.isArray(templateWithFile.templateInfo.requiredCondition)}
          onChange={(v) => {
            onTemplateInfoChange({
              ...templateWithFile,
              templateInfo: {
                ...templateWithFile.templateInfo,
                requiredCondition: v.target.checked ? [] : null
              }
            })
          }}
        />
      </FormControl>
      <Stack
        visibility={templateWithFile.templateInfo.requiredCondition ? 'visible' : 'hidden'}
        shadow={'inner'}
        py={2}
        px={3}
      >
        {Object.values(ConditionOption).map((key) => {
          const currentConditions = new Set(templateWithFile.templateInfo.requiredCondition)

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
                  onTemplateInfoChange({
                    ...templateWithFile,
                    templateInfo: {
                      ...templateWithFile.templateInfo,
                      requiredCondition: Array.from(conditions)
                    }
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

export default TemplateInfoForm
