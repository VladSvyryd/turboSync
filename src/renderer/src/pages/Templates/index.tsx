import { FunctionComponent } from 'react'
import { Progress, useToast } from '@chakra-ui/react'
import useSWR from 'swr'
import { fetcherWithQuery, handleDeleteTemplate } from '../../api'
import DnD from '../../components/DnD'
import DocFolders from '../../components/Doc/DocFolders'
import { ResponseFolder } from '../../types'
import AddTemplateFlow from '../../container/Template/AddTemplateFlow'
import { useUploadStore } from '../../store/UploadStore'
import ButtonContextMenu from '../../components/ListButton/ListButton/ButtonContextMenu'
import EditTemplate from '../../components/Modals/EditTemplate'
import { fetchTemplatesUrl } from '../../types/variables'
import LoadingOverlay from '../../components/Loading/LoadingOverlay'
import { useTemplatesStore } from '../../store/TemplateStore'
import DeleteSubmitModal from '../../container/Template/DeleteSubmitModal'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  const toast = useToast()
  const { fillUploadTemplates, setSignTypeModal } = useUploadStore()
  const { previewLoading, deleteTemplateUUID, setDeleteTemplateUUID } = useTemplatesStore()
  const { data, isValidating, mutate } = useSWR<{
    folders: Array<ResponseFolder>
  }>(fetchTemplatesUrl, fetcherWithQuery, {
    onError: (err) => {
      console.log(err)
      toast({
        description: `Fehler beim Abrufen der Daten. (${err.message})`
      })
    }
  })
  // const { data: activeUserData } = useSWR('activePatient', window.api.getActivePatient, {
  //   onError: (err) => {
  //     console.log(err)
  //     toast({
  //       description: `Fehler beim Abrufen der Daten. (${err.message})`
  //     })
  //   }
  // })

  const startAddTemplateFlow = (uploadFiles: Array<File>) => {
    if (uploadFiles.length === 0) {
      return
    }
    setSignTypeModal(true)
    fillUploadTemplates(uploadFiles)
  }

  const allFiles = data?.folders.flatMap((folder) => folder.templates).map((f) => f.title) ?? []

  if (isValidating && !data) {
    return <Progress size="xs" isIndeterminate />
  }

  return (
    <>
      <AddTemplateFlow
        onAddFlowDone={async () => {
          fillUploadTemplates(null)
          await mutate()
        }}
      />
      <DnD blackList={allFiles} onDropFiles={startAddTemplateFlow}>
        <DocFolders folders={data?.folders ?? []} loading={isValidating && !data} />
      </DnD>
      {previewLoading && <LoadingOverlay title={'PDF wird erzeugt..'} />}
      <DeleteSubmitModal
        isOpen={Boolean(deleteTemplateUUID)}
        onClose={() => {
          setDeleteTemplateUUID(null)
        }}
        onDelete={async () => {
          if (deleteTemplateUUID) {
            await handleDeleteTemplate(deleteTemplateUUID, () => {
              mutate()
              setDeleteTemplateUUID(null)
            })
          }
        }}
      />
      <ButtonContextMenu />
      <EditTemplate />
    </>
  )
}

export default index
