import { FunctionComponent, ReactElement, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  List,
  ListItem,
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
import { FaChevronRight, FaFileWord, FaTrash } from 'react-icons/fa'
import { MdDocumentScanner, MdOutlineSyncDisabled } from 'react-icons/md'
import { usePopper } from 'react-popper'
import { VirtualElement } from '@popperjs/core'
import ListButtonWithContext from './ListButtonWithContext'
import { ContextMenuKey, InternalErrorNumber, SignType, TemplateType } from '../../types'
import DeleteSubmitModal from '../../container/Template/DeleteSubmitModal'
import { handleDeleteTemplate, handleMoveTemplate } from '../../api'
import ErrorModal from '../../container/Template/ErrorModal'
import { TbArrowsTransferDown } from 'react-icons/tb'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import { useListStore } from '../../store/ListStore'

export type ContextMenu = Array<{
  title: string
  onClick: (title: string, handleClose: () => void) => void
  leftIcon?: ReactElement
  rightIcon?: ReactElement
  contextMenuLinks?: ContextMenu
}>
interface OwnProps {
  template: TemplateType
  onClick: (file: TemplateType) => void
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
  const { titles } = useListStore()

  const [popperElement, setPopperElement] = useState<any>(null)
  // const [arrowElement, setArrowElement] = useState<any>(null)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { styles, attributes } = usePopper(referenceElement, popperElement)
  const initialFocusRef = useRef<any>()
  const handleMenuClose = () => {
    setReferenceElement(null)
  }

  const handleContextMenu = (event: React.MouseEvent, doc: string) => {
    event.preventDefault()
    setReferenceElement({
      contextMenu: doc,
      getBoundingClientRect: generateGetBoundingClientRect(event.clientX, event.clientY) as any
    })
  }

  const renderContextMenu = useMemo(() => {
    const menuPoints = [
      {
        id: ContextMenuKey.OPEN,
        title: 'Öffnen',
        onClick: () => {
          window.api.openDoc(template.networkPath)
          handleMenuClose()
        },
        leftIcon: <FaFileWord />
      },
      {
        id: ContextMenuKey.UPLOAD,
        title: 'Nachreichen',
        onClick: async () => {},
        leftIcon: <MdDocumentScanner />
      },

      {
        id: ContextMenuKey.MOVE,
        title: 'Verschieben',
        onClick: async () => {},
        leftIcon: <TbArrowsTransferDown />,
        rightIcon: <FaChevronRight size={10} />,
        contextMenuLinks: Object.keys(titles)
          .filter((k) => k !== template.signType)
          .map((title) => ({
            title: titles[title],
            onClick: async () => {
              await handleMoveTemplate(template.uuid, title as SignType, () => {
                onInteractionWithList()
              })
            },
            leftIcon: <FaArrowRightArrowLeft />
          }))
      },
      {
        id: ContextMenuKey.DELETE,
        title: 'Löschen',
        onClick: async () => {
          handleMenuClose()
          setDeleteModal(template.uuid)
        },
        leftIcon: <FaTrash />
      }
    ]
    if (!template.noFile) {
      return menuPoints.filter((m) => m.id === ContextMenuKey.DELETE)
    }
    return menuPoints
  }, [template.noFile])
  const renderButton = () => {
    if (!template.noFile) {
      return (
        <Popover>
          <PopoverTrigger>
            <Button
              variant={'ghost'}
              onContextMenu={(e) => handleContextMenu(e, template.uuid)}
              // onClick={() => onClick(template)}
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
      <DeleteSubmitModal
        isOpen={Boolean(deleteModal)}
        onClose={() => {
          setDeleteModal(null)
        }}
        onDelete={async () => {
          if (deleteModal) {
            handleDeleteTemplate(deleteModal, () => {
              onInteractionWithList()
              setDeleteModal(null)
            })
          }
        }}
      />
      {renderButton()}
      {Boolean(referenceElement?.contextMenu === template.uuid) && (
        <Box
          pos={'absolute'}
          top={0}
          left={0}
          width={'100%'}
          height={'100%'}
          backdropFilter="blur(1px)"
          zIndex={1}
          onClick={handleMenuClose}
          onContextMenu={handleMenuClose}
        />
      )}

      {Boolean(referenceElement?.contextMenu === template.uuid) && (
        <Box
          ref={setPopperElement}
          zIndex={101}
          bg={'white'}
          style={{ ...styles.popper }}
          {...attributes.popper}
        >
          <List>
            {renderContextMenu.map((link) =>
              link.contextMenuLinks ? (
                <ListButtonWithContext
                  title={link.title}
                  onClick={() => link.onClick()}
                  loading={false}
                  contextMenuLinks={link.contextMenuLinks}
                  placement={'end-start'}
                  leftIcon={link.leftIcon}
                  rightIcon={<FaChevronRight />}
                />
              ) : (
                <ListItem key={link.title}>
                  <Button
                    onClick={() => {
                      if (link.onClick) link.onClick()
                    }}
                    width={'100%'}
                    ref={initialFocusRef}
                    justifyContent={'start'}
                    borderRadius={0}
                    loadingText={`${template.title} (in Arbeit)`}
                    leftIcon={link.leftIcon}
                    colorScheme={'teal'}
                  >
                    {link.title}
                  </Button>
                </ListItem>
              )
            )}
          </List>
        </Box>
      )}
    </>
  )
}

export default ListButton
