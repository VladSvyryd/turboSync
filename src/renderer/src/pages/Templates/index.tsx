import { FunctionComponent } from 'react'
import { Progress, useToast } from '@chakra-ui/react'
import useSWR from 'swr'
import { fetcherWithQuery, ServerApi } from '../../api'
import DnD from '../../components/DnD'
import DocFolders from '../../components/Doc/DocFolders'
import { ResponseFolder } from '../../types'
import AddTemplateFlow from '../../container/Template/AddTemplateFlow'
import { useUploadStore } from '../../store/UploadStore'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  const toast = useToast()
  const { fillUploadTemplates, setSignTypeModal } = useUploadStore()

  const url = `${ServerApi.getUri()}/api/templates`
  const { data, isValidating, mutate } = useSWR<{
    folders: Array<ResponseFolder>
  }>(url, fetcherWithQuery, {
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
        <DocFolders
          folders={data?.folders ?? []}
          loading={isValidating && !data}
          onInteractionWithList={mutate}
        />
      </DnD>
    </>
  )
}

export default index
