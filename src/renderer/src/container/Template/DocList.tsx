import { FunctionComponent, useState } from 'react'
import { List, ListItem, ScaleFade, Spinner, Stack, useToast } from '@chakra-ui/react'
import ListButton from '../../components/ListButton/ListButton'
import DeleteSubmitModal from './DeleteSubmitModal'
import ErrorModal from './ErrorModal'
import { ServerApi } from '../../api'
import { AxiosError } from 'axios'
import { TbArrowsTransferDown } from 'react-icons/tb'
import { FaTrash, FaFileWord, FaChevronRight } from 'react-icons/fa'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import { DocFile, SignType } from '../../types'
import { useListStore } from '../../store/ListStore'

interface OwnProps {
  listId: SignType
  files?: Array<DocFile>
  loading?: boolean
  onInteractionWithList: () => void
}

type Props = OwnProps

const DocList: FunctionComponent<Props> = ({ files, listId, onInteractionWithList, loading }) => {
  const toast = useToast()
  const { titles } = useListStore()
  const [loadingProcessTemplate, setLoadingProcessTemplate] = useState<null | string>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)

  const handleDocClick = async (docUniqTitle: string) => {
    try {
      setLoadingProcessTemplate(docUniqTitle)
      const activePatient = await window.api.getActivePatient()
      if (!Boolean(activePatient?.data?.id)) {
        setError(activePatient?.error)
        return
      }
      const processTemplate = await ServerApi.post(`/api/processTemplate`, {
        ...activePatient.data,
        docTitle: docUniqTitle
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
  return (
    <>
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
              title={file.name}
              onClick={handleDocClick}
              loading={loadingProcessTemplate === file.name}
              contextMenuLinks={[
                {
                  title: 'Öffnen',
                  onClick: async (_, closeMenu) => {
                    window.api.openDoc(file.path)
                    if (closeMenu) closeMenu()
                  },
                  leftIcon: <FaFileWord />
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
                  onClick: async () => {
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
