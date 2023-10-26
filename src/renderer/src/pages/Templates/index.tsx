import { FunctionComponent } from 'react'
import { Progress, useToast } from '@chakra-ui/react'
import useSWR from 'swr'
import { fetcherUserBeforeQuery, handleDeleteTemplate } from '../../api'
import DnD from '../../components/DnD'
import DocFolders from '../../components/Doc/DocFolders'
import { Patient, ResponseFolder } from '../../types'
import AddTemplateFlow from '../../container/Template/AddTemplateFlow'
import { useUploadStore } from '../../store/UploadStore'
import ButtonContextMenu from '../../components/ListButton/ListButton/ButtonContextMenu'
import EditTemplate from '../../components/Modals/EditTemplate'
import { fetchTemplatesUrl } from '../../types/variables'
import LoadingOverlay from '../../components/Loading/LoadingOverlay'
import { useTemplatesStore } from '../../store/TemplateStore'
import DeleteSubmitModal from '../../container/Template/DeleteSubmitModal'
import PatientLable from '../../components/Lables/PatientLable'
import { usePatientStore } from '../../store/PatientStore'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  const toast = useToast()
  const { fillUploadTemplates, setSignTypeModal } = useUploadStore()
  const { previewLoading } = useTemplatesStore()
  const { setPatient } = usePatientStore()
  const { data, isValidating, mutate } = useSWR<{
    folders: Array<ResponseFolder>
  }>(fetchTemplatesUrl, fetcherUserBeforeQuery, {
    focusThrottleInterval: 0,
    // onSuccess: (data) => {
    //   console.log(data)
    //   setPatient(data.patient)
    // },
    onError: (err) => {
      console.log(err)
      toast({
        description: `Fehler beim Abrufen der Daten. (${err.message})`
      })
    }
  })

  const startAddTemplateFlow = (uploadFiles: Array<File>) => {
    if (uploadFiles.length === 0) {
      return
    }
    setSignTypeModal(true)
    fillUploadTemplates(uploadFiles)
  }

  const allFiles = data?.folders.flatMap((folder) => folder.templates).map((f) => f.title) ?? []

  const handleDelete = async (uuid: string) => {
    await handleDeleteTemplate(uuid, () => {
      mutate()
    })
  }
  if (isValidating && !data) {
    return <Progress size="xs" isIndeterminate />
  }

  return (
    <>
      {/*<PatientLable patient={data?.patient} loading={isValidating} />*/}
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
      <DeleteSubmitModal onDelete={handleDelete} />
      <ButtonContextMenu />
      <EditTemplate />
    </>
  )
}

export default index
