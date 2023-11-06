import { FunctionComponent, useMemo, useRef, useState } from 'react'
import { Box, Button, List, ListItem } from '@chakra-ui/react'
import ListButtonWithContext from './ListButtonWithContext'
import { FaChevronRight, FaFileWord, FaTrash } from 'react-icons/fa'
import { usePopper } from 'react-popper'
import { ContextMenuKey, SignType } from '../../../types'
import { AiFillEdit } from 'react-icons/ai'
import { getTemplatePdfPreview, handleCancelDocuments, handleMoveTemplate } from '../../../api'
import { FaArrowRightArrowLeft, FaFilePdf } from 'react-icons/fa6'
import { MdDocumentScanner, MdOutlineCancelScheduleSend } from 'react-icons/md'
import { GoListOrdered, GoTasklist } from 'react-icons/go'
import { TbArrowsTransferDown } from 'react-icons/tb'
import { useListStore } from '../../../store/ListStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useTemplatesStore } from '../../../store/TemplateStore'
import { mutate } from 'swr'
import { fetchTemplatesUrl } from '../../../types/variables'
import { usePatientStore } from '../../../store/PatientStore'

interface OwnProps {}

type Props = OwnProps

const ButtonContextMenu: FunctionComponent<Props> = ({}) => {
  const {
    template,
    contextMenuRef,
    setDeleteTemplateUUID,
    closeContextMenu,
    setEditTemplate,
    setPreviewLoading
  } = useTemplatesStore()
  const { patient } = usePatientStore()
  const { titles } = useListStore()
  const [popperElement, setPopperElement] = useState<any>(null)

  const { styles, attributes } = usePopper(contextMenuRef, popperElement)
  const initialFocusRef = useRef<any>()

  const isOpen = Boolean(template)
  const handleMenuClose = () => {
    closeContextMenu()
  }

  const renderContextMenu = useMemo(() => {
    if (!template || !patient) return []

    const discardButtons = [
      {
        title: 'Alle',
        onClick: async () => {
          await handleCancelDocuments(template.uuid, patient, undefined, async () => {
            await mutate({ url: fetchTemplatesUrl, args: patient })
          })
          handleMenuClose()
        },
        leftIcon: <GoListOrdered />
      },
      {
        title: 'Letztes Dokument',
        onClick: async () => {
          await handleCancelDocuments(template.uuid, patient, 1, async () => {
            await mutate({ url: fetchTemplatesUrl, args: patient })
          })
          handleMenuClose()
        },
        leftIcon: <GoTasklist />
      }
    ]

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
        id: ContextMenuKey.EDIT,
        title: 'Ändern',
        onClick: () => {
          setEditTemplate(template)
          handleMenuClose()
        },
        leftIcon: <AiFillEdit />
      },
      {
        id: ContextMenuKey.PREVIEW,
        title: 'Vorschau',
        onClick: async () => {
          setPreviewLoading(true)
          handleMenuClose()
          const networkPath = await getTemplatePdfPreview(template.uuid, patient)
          window.api.openPDFPreviewWindow(networkPath ?? 'error')
          setPreviewLoading(false)
        },
        leftIcon: <FaFilePdf />
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
              await handleMoveTemplate(template.uuid, title as SignType, async () => {
                await mutate({ url: fetchTemplatesUrl, args: patient })
              })
              handleMenuClose()
            },
            leftIcon: <FaArrowRightArrowLeft />
          }))
      },

      {
        id: ContextMenuKey.DELETE,
        title: 'Löschen',
        onClick: async () => {
          handleMenuClose()
          setDeleteTemplateUUID(template.uuid)
        },
        leftIcon: <FaTrash />
      },
      {
        id: ContextMenuKey.DISCARD,
        title: 'Widerrufen',
        onClick: async () => {},
        leftIcon: <MdOutlineCancelScheduleSend />,
        rightIcon: <FaChevronRight size={10} />,
        contextMenuLinks: discardButtons
      }
    ]
    if (!template.noFile) {
      return menuPoints.filter((m) => m.id === ContextMenuKey.DELETE)
    }
    if (template.computedConditions?.lastDocStatus === undefined) {
      return menuPoints.filter((m) => m.id !== ContextMenuKey.DISCARD)
    }
    return menuPoints
  }, [template?.noFile, patient])
  if (!template) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <Box
              pos={'fixed'}
              top={0}
              left={0}
              width={'100%'}
              height={'100%'}
              zIndex={1}
              onClick={handleMenuClose}
              onContextMenu={handleMenuClose}
              as={motion.div}
              initial={{ backdropFilter: 'blur(0px)', background: 'transparent' }}
              animate={{ backdropFilter: 'blur(1px)', background: 'rgba(255,255,255,.2)' }}
              exit={{ opacity: 0 }}
            />
            <Box
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transitionDelay={'3000'}
              zIndex={99}
              ref={setPopperElement}
              bg={'white'}
              style={{ ...styles.popper }}
              {...attributes.popper}
            >
              <List>
                {renderContextMenu.map((link) =>
                  link.contextMenuLinks ? (
                    <ListButtonWithContext
                      key={link.title}
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
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ButtonContextMenu
