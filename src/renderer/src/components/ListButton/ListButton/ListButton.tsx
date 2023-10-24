import { FunctionComponent, ReactElement, useState } from 'react'
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useToken
} from '@chakra-ui/react'
import { SiGoogledocs } from 'react-icons/si'
import { MdOutlineSyncDisabled } from 'react-icons/md'
import {
  ConditionOption,
  DocumentStatus,
  ExpiredStatus,
  ExtendedDocumentStatus,
  InternalErrorNumber,
  Template
} from '../../../types'
import ErrorModal from '../../../container/Template/ErrorModal'
import { useTemplatesStore } from '../../../store/TemplateStore'

export type ContextMenu = Array<{
  title: string
  onClick: (title: string, handleClose: () => void) => void
  leftIcon?: ReactElement
  rightIcon?: ReactElement
  contextMenuLinks?: ContextMenu
}>
interface OwnProps {
  template: Template
  onClick: (file: Template) => void
  loading: boolean
  placement?: 'bottom' | 'end'
  leftIcon?: ReactElement
  rightIcon?: ReactElement
}

type Props = OwnProps

const getColorByExtendedDocStatus = (status?: ExtendedDocumentStatus) => {
  switch (status) {
    case ExpiredStatus.EXPIRED:
      return 'red.500'
    case undefined:
      return 'red.500'
    case DocumentStatus.SIGNED:
      return 'blue.500'
    case DocumentStatus.INPROGRESS:
      return 'orange.500'
    default:
      return 'green.500'
  }
}
const renderColor = (template: Template) => {
  if (template.computedConditions === null) {
    return 'initial'
  }
  const lastDocStatus = template.computedConditions.lastDocStatus
  if (lastDocStatus) {
    return getColorByExtendedDocStatus(lastDocStatus)
  }

  if (
    (Object.hasOwn(template.computedConditions, ConditionOption.FEMALE) &&
      template.computedConditions.FEMALE) ||
    (Object.hasOwn(template.computedConditions, ConditionOption.MALE) &&
      template.computedConditions.MALE) ||
    (Object.hasOwn(template.computedConditions, ConditionOption.UNDER18) &&
      template.computedConditions.UNDER18) ||
    (Object.hasOwn(template.computedConditions, ConditionOption.RETIRED) &&
      template.computedConditions.RETIRED)
  ) {
    return getColorByExtendedDocStatus(lastDocStatus)
  }

  return 'initial'
}
const ListButton: FunctionComponent<Props> = ({
  template,
  onClick,
  loading,
  leftIcon,
  rightIcon
}) => {
  const errorColor = useToken('colors', 'red.500')

  const { template: activeTemplate, setContextMenuRef } = useTemplatesStore()
  // const [arrowElement, setArrowElement] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const renderNoData = (template: Template) => {
    if (template.computedConditions) {
      if (Object.values(template.computedConditions).find((v) => v === 'NO_DATA') !== undefined) {
        return 'No Data'
      }
    }
    return undefined
  }
  const renderButton = () => {
    const lastDocDate = template.computedConditions?.lastDocDate
    const date = lastDocDate
      ? new Date(lastDocDate).toLocaleDateString('de-DE', { dateStyle: 'short' })
      : ''
    const noData = renderNoData(template)
    if (!template.noFile) {
      return (
        <Popover>
          <PopoverTrigger>
            <Button
              variant={'ghost'}
              onContextMenu={(e) => setContextMenuRef(e, template)}
              leftIcon={leftIcon ?? <SiGoogledocs />}
              w={'100%'}
              justifyContent={'start'}
              borderRadius={0}
              isLoading={loading}
              loadingText={`${template.title} (in Arbeit)`}
              isActive={Boolean(activeTemplate?.uuid === template.uuid)}
              rightIcon={<MdOutlineSyncDisabled color={errorColor} />}
              color={'blackAlpha.600'}
            >
              <Text noOfLines={1}>{template.title}</Text>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Datei fehlt!</PopoverHeader>
            <PopoverBody>
              Nach der Prüfung wurde leider festgestellt, dass diese Datei nicht gefunden werden
              konnte. Dies handelt sich um einen Serverfehler. Bitte kontaktieren Sie den Support.
              (Error: {InternalErrorNumber.FILE_NOT_FOUND})
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )
    }
    return (
      <Button
        variant={'ghost'}
        onContextMenu={(e) => setContextMenuRef(e, template)}
        onClick={() => onClick(template)}
        leftIcon={leftIcon ?? <SiGoogledocs />}
        w={'100%'}
        justifyContent={'start'}
        borderRadius={0}
        isDisabled={loading}
        isLoading={loading}
        loadingText={`${template.title} (in Arbeit)`}
        isActive={Boolean(activeTemplate?.uuid === template.uuid)}
        rightIcon={rightIcon}
        color={renderColor(template)}
      >
        <Stack
          flex={1}
          direction={'row'}
          alignItems={'center'}
          justifyContent={lastDocDate || noData ? 'space-between' : 'flex-start'}
        >
          <Text noOfLines={1}>{template.title}</Text>
          {(lastDocDate || noData) && (
            <Stack direction={'row'}>
              {lastDocDate && (
                <Text noOfLines={1} fontSize={'xs'} title={`Versendet am ${date}`}>
                  {date}
                </Text>
              )}
              {noData && (
                <Text noOfLines={1} fontSize={'xs'}>
                  {noData}
                </Text>
              )}
            </Stack>
          )}
        </Stack>
      </Button>
    )
  }
  return (
    <>
      <ErrorModal
        error={error}
        onClose={() => {
          setError(null)
        }}
      />
      {renderButton()}
    </>
  )
}

export default ListButton
