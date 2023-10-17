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
import { VirtualElement } from '@popperjs/core'
import { InternalErrorNumber, Template } from '../../../types'
import ErrorModal from '../../../container/Template/ErrorModal'
import ButtonContextMenu from './ButtonContextMenu'

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
  onInteractionWithList: () => void
}

type Props = OwnProps
function generateGetBoundingClientRect(x = 0, y = 0) {
  return () => ({
    width: 0,
    height: 0,
    top: y,
    right: x + 75,
    bottom: y,
    left: x + 75
  })
}

const ListButton: FunctionComponent<Props> = ({
  template,
  onClick,
  loading,
  leftIcon,
  rightIcon,
  onInteractionWithList
}) => {
  const errorColor = useToken('colors', 'red.500')
  const [referenceElement, setReferenceElement] = useState<
    (VirtualElement & { contextMenu: string }) | null
  >(null)

  // const [arrowElement, setArrowElement] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleContextMenu = (event: React.MouseEvent, doc: string) => {
    event.preventDefault()
    setReferenceElement({
      contextMenu: doc,
      getBoundingClientRect: generateGetBoundingClientRect(event.clientX, event.clientY) as any
    })
  }

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
              onContextMenu={(e) => handleContextMenu(e, template.uuid)}
              leftIcon={leftIcon ?? <SiGoogledocs />}
              w={'100%'}
              justifyContent={'start'}
              borderRadius={0}
              isLoading={loading}
              loadingText={`${template.title} (in Arbeit)`}
              isActive={Boolean(referenceElement?.contextMenu === template.uuid)}
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
        onContextMenu={(e) => handleContextMenu(e, template.uuid)}
        onClick={() => onClick(template)}
        leftIcon={leftIcon ?? <SiGoogledocs />}
        w={'100%'}
        justifyContent={'start'}
        borderRadius={0}
        isDisabled={loading}
        isLoading={loading}
        loadingText={`${template.title} (in Arbeit)`}
        isActive={Boolean(referenceElement?.contextMenu === template.uuid)}
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
      <ButtonContextMenu
        referenceElement={referenceElement}
        setReferenceElement={setReferenceElement}
        template={template}
        onInteractionWithList={onInteractionWithList}
      />
    </>
  )
}

export default ListButton
