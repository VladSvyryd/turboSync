import { FunctionComponent, RefObject } from 'react'
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Switch,
  Text
} from '@chakra-ui/react'
import { ConditionOption, EditableTemplate, SignType } from '../../types'
import { useListStore } from '../../store/ListStore'
import { templateTitleIsValid } from '../../util'

interface OwnProps {
  template: EditableTemplate
  onChange: (template: EditableTemplate) => void
  inputFocusRef?: RefObject<HTMLInputElement>
  hideSignType?: boolean
}

type Props = OwnProps
const labelStyles = {
  mt: '2',
  ml: '-2.5',
  fontSize: 'sm'
}
const TemplateForm: FunctionComponent<Props> = ({
  template,
  inputFocusRef,
  onChange,
  hideSignType = false
}) => {
  const { titles } = useListStore()

  const sliderMarkText = () => {
    const months = template.expiredEveryMonths
    if (months === 0) return 'Nie'
    return `${months} ${months > 1 ? 'Monate' : 'Monat'}`
  }
  return (
    <Stack spacing={4} flex={1}>
      <FormControl w={'100%'}>
        <FormLabel>Bezeichnung</FormLabel>
        <Input
          autoFocus
          isInvalid={!templateTitleIsValid(template.title)}
          size={'sm'}
          ref={inputFocusRef}
          placeholder="Neupatient"
          value={template.title ?? ''}
          onChange={(e) => {
            onChange({
              ...template,
              title: e.target.value
            })
          }}
        />
      </FormControl>
      <Stack direction={'row'} alignItems={'flex-end'}>
        <Text fontSize={'md'} fontWeight={'medium'}>
          Außerkraftsetzung
        </Text>
        <Stack pt={7} flex={1} pl={10} pr={10}>
          <Slider
            value={template.expiredEveryMonths}
            min={0}
            max={12}
            step={1}
            aria-label="slider-ex-6"
            onChange={(val) => {
              onChange({
                ...template,
                expiredEveryMonths: val
              })
            }}
          >
            {[...new Array(12)].map((_, i) => (
              <SliderMark value={25} {...labelStyles}>
                {i + 1}
              </SliderMark>
            ))}
            <SliderMark
              value={template.expiredEveryMonths}
              textAlign="center"
              color="blue.500"
              mt="-10"
              ml={template.expiredEveryMonths <= 0 ? '-3' : '-35'}
              sx={{
                textWrap: 'nowrap'
              }}
            >
              {sliderMarkText()}
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={5} border={'2px solid'} borderColor={'blue.400'} />
          </Slider>
        </Stack>
      </Stack>
      {!hideSignType && (
        <Select
          size={'sm'}
          variant="outline"
          value={template.signType}
          onChange={(e) => {
            onChange({
              ...template,
              signType: e.target.value as SignType
            })
          }}
        >
          {Object.values(SignType).map((type) => (
            <option value={type}>{titles[type]}</option>
          ))}
        </Select>
      )}
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="0" flex={1}>
          Mit erforderlichen Bedingungen
        </FormLabel>
        <Switch
          id="withOptions"
          isChecked={Array.isArray(template.requiredCondition)}
          onChange={(v) => {
            console.log(v.target.checked)
            onChange({
              ...template,
              requiredCondition: v.target.checked ? [] : null
            })
          }}
        />
      </FormControl>
      <Stack
        visibility={Array.isArray(template.requiredCondition) ? 'visible' : 'hidden'}
        shadow={'inner'}
        py={2}
        px={3}
      >
        {Object.values(ConditionOption).map((key) => {
          const currentConditions = new Set(template.requiredCondition)
          return (
            <FormControl display="flex" alignItems="center" key={key}>
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
                  onChange({
                    ...template,
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

export default TemplateForm
