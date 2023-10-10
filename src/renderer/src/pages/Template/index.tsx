import { FunctionComponent } from 'react'
import { Progress, useToast } from '@chakra-ui/react'
import useSWR from 'swr'
import { fetcherWithQuery, ServerApi } from '../../api'
import DnD from '../../components/DnD'
import DocFolders from '../../components/Doc/DocFolders'
import { DocFile, SignType } from '../../types'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  const toast = useToast()
  const url = `${ServerApi.getUri()}/api/templates`
  const { data, isValidating, mutate } = useSWR<{
    folders: Array<{ name: SignType; files: Array<DocFile> }>
  }>(url, fetcherWithQuery, {
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

  const allFiles = data?.folders.flatMap((folder) => folder.files).map((f) => f.name) ?? []

  if (isValidating && !data) {
    return <Progress size="xs" isIndeterminate />
  }

  return (
    <DnD blackList={allFiles} onDropFiles={handleAddFiles}>
      <DocFolders
        folders={data?.folders ?? []}
        loading={isValidating && !data}
        onInteractionWithList={mutate}
      />
    </DnD>
  )
}

export default index
