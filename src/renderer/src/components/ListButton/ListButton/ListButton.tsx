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
  Text,
  useToken
} from '@chakra-ui/react'
import { SiGoogledocs } from 'react-icons/si'
import { MdOutlineSyncDisabled } from 'react-icons/md'
import { InternalErrorNumber, Template } from '../../../types'
import ErrorModal from '../../../container/Template/ErrorModal'
import { useTemplatesStore } from '../../../store/DocStore'

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

  const renderColor = (template: Template) => {
    if (template.requiredCondition.length !== 0) {
      return 'red.500'
    }
    return 'initial'
  }
  const renderButton = () => {
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
        <Text noOfLines={1}>{template.title}</Text>
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
