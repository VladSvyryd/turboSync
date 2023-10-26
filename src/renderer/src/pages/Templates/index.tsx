import { FunctionComponent, useEffect } from 'react'
import { Progress, useToast } from '@chakra-ui/react'
import useSWR from 'swr'
import { fetcherTemplateQuery, handleDeleteTemplate } from '../../api'
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
const fetchActivePatient = async () => {
  return window.api.getActivePatient()
}

const index: FunctionComponent<Props> = () => {
  const toast = useToast()
  const { fillUploadTemplates, setSignTypeModal } = useUploadStore()
  const { folders, setFolders, previewLoading } = useTemplatesStore()
  const { patient, setPatient } = usePatientStore()
  const { isValidating: patientIsValidating } = useSWR<{
    data: Patient
  }>('getActivePatient', fetchActivePatient, {
    focusThrottleInterval: 1000,
    onSuccess: (data) => {
      setPatient(data.data)
    }
  })
  const { isValidating, mutate } = useSWR<{
    folders: Array<ResponseFolder>
  }>({ url: fetchTemplatesUrl, args: patient }, fetcherTemplateQuery, {
    focusThrottleInterval: 1000,
    onSuccess: (data) => {
      setFolders(data?.folders)
    },
    onError: (err) => {
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

  const allFiles = folders.flatMap((folder) => folder.templates).map((f) => f.title) ?? []

  const handleDelete = async (uuid: string) => {
    await handleDeleteTemplate(uuid, () => {
      mutate()
    })
  }
  if (isValidating && !folders) {
    return <Progress size="xs" isIndeterminate />
  }
  useEffect(() => {
    window.api.onPrintFileResult((_, result) => {
      console.log('onPrintFileResult')
      if (result.printFile) {
        toast({
          status: 'success',
          title: 'Drucker',
          description: 'Druckauftrag wurde erfolgreich gestartet.'
        })
      } else {
        toast({
          description: 'Fehler beim Drucken.'
        })
      }
    })
  }, [])
  return (
    <>
      <PatientLable patient={patient} loading={patientIsValidating} />
      <AddTemplateFlow
        onAddFlowDone={async () => {
          fillUploadTemplates(null)
          await mutate()
        }}
      />
      <DnD blackList={allFiles} onDropFiles={startAddTemplateFlow}>
        <DocFolders folders={folders ?? []} loading={isValidating && !folders} />
      </DnD>
      {previewLoading && <LoadingOverlay title={'PDF wird erzeugt..'} />}
      <DeleteSubmitModal onDelete={handleDelete} />
      <ButtonContextMenu />
      <EditTemplate />
    </>
  )
}

export default index
