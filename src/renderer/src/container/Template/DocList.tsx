import { FunctionComponent, useState } from 'react'
import { List, ListItem, ScaleFade, Spinner, Stack, Text, useToast } from '@chakra-ui/react'
import ListButton from '../../components/ListButton/ListButton'
import DeleteSubmitModal from './DeleteSubmitModal'
import ErrorModal from './ErrorModal'
import { ServerApi } from '../../api'
import { AxiosError } from 'axios'
import { TbArrowsTransferDown } from 'react-icons/tb'
import { FaTrash, FaFileWord, FaChevronRight } from 'react-icons/fa'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import { MdDocumentScanner } from 'react-icons/md'

import { DocFile, SignType } from '../../types'
import { useListStore } from '../../store/ListStore'
import SignTypePicker from '../../components/Modals/SignTypePicker'
import { BsPrinterFill, BsQrCodeScan } from 'react-icons/bs'
import { LiaSignatureSolid } from 'react-icons/lia'

interface OwnProps {
  listId: SignType
  files?: Array<DocFile>
  loading?: boolean
  onInteractionWithList: () => void
}

type Props = OwnProps

const PRINT_BUTTONS = [
  {
    id: SignType.SIGNPAD,
    title: 'QR-Code',
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <BsQrCodeScan size={60} />
      </Stack>
    )
  },
  {
    id: SignType.PRINT,
    title: 'SignPad',
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <LiaSignatureSolid size={64} />
      </Stack>
    )
  },
  {
    id: SignType.LINK,
    title: 'Drucken',
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <BsPrinterFill size={60} />
      </Stack>
    )
  }
]
const SIGNPAD_BUTTONS = [
  {
    id: SignType.SIGNPAD,
    title: 'QR-Code',
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <BsQrCodeScan size={60} />
      </Stack>
    )
  },
  {
    id: SignType.PRINT,
    title: 'SignPad',
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <LiaSignatureSolid size={64} />
      </Stack>
    ),
    disabled: true
  },
  {
    id: SignType.LINK,
    title: null,
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <Text>Sie haben folgende Optionen</Text>
      </Stack>
    )
  }
]
const getSelectionButtons = (signType: SignType) => {
  switch (signType) {
    case SignType.SIGNPAD: {
      return SIGNPAD_BUTTONS
    }
    case SignType.PRINT: {
      return PRINT_BUTTONS
    }
    default:
      return PRINT_BUTTONS
  }
}

const DocList: FunctionComponent<Props> = ({ files, listId, onInteractionWithList, loading }) => {
  const toast = useToast()
  const { titles } = useListStore()
  const [loadingProcessTemplate, setLoadingProcessTemplate] = useState<null | string>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [activeSignTypePicker, setActiveSignTypePicker] = useState<DocFile | null>(null)
  const selectionButtons = getSelectionButtons(listId)
  const handleDocClick = async (docFile: DocFile) => {
    if (listId === SignType.LINK) {
      await handleStartProcessTemplate(docFile)
      return
    }
    setActiveSignTypePicker(docFile)
  }

  const handleStartProcessTemplate = async (docFile: DocFile) => {
    try {
      setLoadingProcessTemplate(docFile.name)
      const activePatient = await window.api.getActivePatient()
      if (!Boolean(activePatient?.data?.id)) {
        setError(activePatient?.error)
        return
      }
      const processTemplate = await ServerApi.post(`/api/processTemplate`, {
        ...activePatient.data,
        docTitle: docFile.name,
        docPath: docFile.path
      })
      console.log('processTemplate', processTemplate)
    } catch (e) {
      const err = e as AxiosError<{ message: string }>
      toast({
        description: err.response?.data?.message ?? 'Fehler beim Verarbeiten der Vorlage.'
      })
    } finally {
      setLoadingProcessTemplate(null)
    }
  }
  const handleDeleteDoc = async (docUniqTitle: string) => {
    try {
      await ServerApi.delete(`/api/deleteTemplate`, {
        data: {
          docPath: docUniqTitle
        }
      })
    } catch (e) {
      console.log(e)
      setError(JSON.stringify(e))
    } finally {
      onInteractionWithList()
      setDeleteModal(null)
    }
  }
  const handleMoveDoc = async (docUniqTitle: string, to: SignType) => {
    try {
      await ServerApi.put(`/api/moveTemplate`, {
        from: listId,
        docTitle: docUniqTitle,
        to
      })
    } catch (e) {
      console.log(e)
      setError(JSON.stringify(e))
    } finally {
      onInteractionWithList()
      setDeleteModal(null)
    }
  }

  const handlePickSignType = async (signType: SignType) => {
    if (!activeSignTypePicker) return

    switch (signType) {
      case SignType.LINK: {
        return await handleStartProcessTemplate(activeSignTypePicker)
      }
      default:
        toast({
          title: 'Next Feature.',
          status: 'warning',
          description: 'Nicht implementiert.'
        })
        return
    }
  }

  return (
    <>
      <SignTypePicker
        signTypeButtons={selectionButtons}
        isOpen={Boolean(activeSignTypePicker)}
        onClose={() => {
          setActiveSignTypePicker(null)
        }}
        onPick={handlePickSignType}
      />
      <DeleteSubmitModal
        isOpen={Boolean(deleteModal)}
        onClose={() => {
          setDeleteModal(null)
        }}
        onDelete={async () => {
          if (deleteModal) {
            await handleDeleteDoc(deleteModal)
          }
        }}
      />
      <ErrorModal
        error={error}
        onClose={() => {
          setError(null)
        }}
      />
      <List sx={{ py: 2 }} spacing={1}>
        {files?.map((file) => (
          <ListItem key={file.name}>
            <ListButton
              docFile={file}
              onClick={handleDocClick}
              loading={loadingProcessTemplate === file.name}
              contextMenuLinks={[
                {
                  title: 'Öffnen',
                  onClick: async (_, closeMenu) => {
                    window.api.openDoc(file.networkPath)
                    if (closeMenu) closeMenu()
                  },
                  leftIcon: <FaFileWord />
                },
                {
                  title: 'Nachreichen',
                  onClick: async () => {},
                  leftIcon: <MdDocumentScanner />
                },

                {
                  title: 'Verschieben',
                  onClick: async () => {},
                  leftIcon: <TbArrowsTransferDown />,
                  rightIcon: <FaChevronRight size={10} />,
                  contextMenuLinks: Object.keys(titles)
                    .filter((k) => k !== listId)
                    .map((title) => ({
                      title: titles[title],
                      onClick: async () => {
                        await handleMoveDoc(file.name, title as SignType)
                        onInteractionWithList()
                      },
                      leftIcon: <FaArrowRightArrowLeft />
                    }))
                },
                {
                  title: 'Löschen',
                  onClick: async (_, closeMenu) => {
                    closeMenu()
                    setDeleteModal(file.path)
                  },
                  leftIcon: <FaTrash />
                }
              ]}
            />
          </ListItem>
        ))}
        <Stack alignItems={'center'}>
          <ScaleFade
            initialScale={0.3}
            in={loading}
            transition={{
              enter: {
                type: 'spring'
              }
            }}
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </ScaleFade>
        </Stack>
      </List>
    </>
  )
}

export default DocList
