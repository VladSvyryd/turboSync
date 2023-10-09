import { FunctionComponent } from 'react'
import { Progress, useToast } from '@chakra-ui/react'
import useSWR from 'swr'
import { fetcherWithQuery, ServerApi } from '../../api'
import DnD from '../../components/DnD'
import DocList from '../../container/Template/DocList'
import { useSettingsStore } from '../../store'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  const toast = useToast()
  const { apiBaseUrl } = useSettingsStore()
  const url = `${ServerApi.getUri()}/api/templates`
  const { data, isValidating, mutate } = useSWR<{ files: Array<string> }>(url, fetcherWithQuery, {
    onError: (err) => {
      console.log(err)
      toast({
        description: `Fehler beim Abrufen der Daten. (${err.message})`
      })
    }
  })

  const handleAddFiles = async (uploadFiles: Array<File>) => {
    if (uploadFiles.length === 0) {
      return
    }
    console.log(ServerApi.getUri())
    const formdata = new FormData()
    uploadFiles.forEach((file) => {
      formdata.append('fileStore', file)
    })
    const files = await ServerApi.post<{ success: boolean }>('/api/addTemplate', formdata, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const success = Boolean(files?.data?.success)
    if (!success) {
      toast({
        description: 'Datei hinzufügen fehlgeschlagen.'
      })
      return
    }
    await mutate()
  }
  if (isValidating && !data) {
    return <Progress size="xs" isIndeterminate />
  }

  return (
    <>
      {apiBaseUrl}
      <DnD blackList={data?.files ?? []} onDropFiles={handleAddFiles}>
        <DocList
          onInteractionWithList={mutate}
          files={data?.files}
          loading={Boolean(isValidating && data)}
        />
      </DnD>
    </>
  )
}

export default index
