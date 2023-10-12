import { FunctionComponent, useState } from 'react'
import { Progress, useToast } from '@chakra-ui/react'
import useSWR from 'swr'
import { fetcherWithQuery, ServerApi } from '../../api'
import DnD from '../../components/DnD'
import DocFolders from '../../components/Doc/DocFolders'
import { DocFile, SignType } from '../../types'
import AddTemplateFlow from '../../container/Template/AddTemplateFlow'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  const toast = useToast()
  const url = `${ServerApi.getUri()}/api/templates`
  const [uploadFiles, setUploadFiles] = useState<Array<File> | null>(null)
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

  const startAddTemplateFlow = (uploadFiles: Array<File>) => {
    if (uploadFiles.length === 0) {
      return
    }
    setUploadFiles(uploadFiles)
  }

  const allFiles = data?.folders.flatMap((folder) => folder.files).map((f) => f.name) ?? []

  if (isValidating && !data) {
    return <Progress size="xs" isIndeterminate />
  }

  return (
    <>
      <AddTemplateFlow
        uploadFiles={uploadFiles}
        onAddFlowDone={async () => {
          setUploadFiles(null)
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
