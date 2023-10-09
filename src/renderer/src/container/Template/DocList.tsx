import { FunctionComponent, useState } from 'react'
import { List, ListItem, ScaleFade, Spinner, Stack } from '@chakra-ui/react'
import ListButton from '../../components/ListButton/ListButton'
import DeleteSubmitModal from './DeleteSubmitModal'
import ErrorModal from './ErrorModal'

interface OwnProps {
  files?: Array<string>
  loading?: boolean
  onInteractionWithList: () => void
}

type Props = OwnProps

const DocList: FunctionComponent<Props> = ({ files, onInteractionWithList, loading }) => {
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
      const processTemplate = await fetch(`http://192.168.185.59:3333/api/processTemplate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...activePatient.data,
          docTitle: docUniqTitle
        })
      })
      console.log('processTemplate', processTemplate)
    } catch (e) {
      console.log(e)
      setError(JSON.stringify(e))
    } finally {
      setLoadingProcessTemplate(null)
    }
  }
  const handleDeleteDoc = async (docUniqTitle: string) => {
    try {
      const deleteTemplate = await fetch(`http://192.168.185.59:3333/api/deleteTemplate`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          docTitle: docUniqTitle
        })
      })

      console.log('deleteTemplate', deleteTemplate)
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
        {files?.map((title) => (
          <ListItem>
            <ListButton
              key={title}
              title={title}
              onClick={handleDocClick}
              loading={loadingProcessTemplate === title}
              contextMenuLinks={[
                {
                  title: 'Löschen',
                  onClick: async () => {
                    setDeleteModal(title)
                  }
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
