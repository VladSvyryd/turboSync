import { FunctionComponent } from 'react'
import { Progress, useToast } from '@chakra-ui/react'
import useSWR from 'swr'
import { fetcherWithQuery } from '../../api'
import DnD from '../../components/DnD'
import DocList from '../../container/Template/DocList'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  const toast = useToast()

  const url = `http://192.168.185.59:3333/api/templates`
  const { data, isValidating, mutate } = useSWR<{ files: Array<string> }>(url, fetcherWithQuery, {
    onError: (err) => {
      console.log(err)
      toast({
        description: `Fehler beim Abrufen der Daten. (${err.message})`
      })
    }
  })

  const handleAddFiles = async (uploadFiles: Array<File>) => {
    if (uploadFiles.length > 0) {
      const formdata = new FormData()
      uploadFiles.forEach((file) => {
        formdata.append('fileStore', file)
      })
      const files = await fetch('http://192.168.185.59:3333/api/addTemplate', {
        method: 'POST',
        body: formdata
      })
      const r = await files.json()
      if (!r?.success) {
        toast({
          description: 'handleAddFiles'
        })
        return
      }
      await mutate()
    }
  }

  if (isValidating && !data) {
    return <Progress size="xs" isIndeterminate />
  }

  return (
    <DnD blackList={data?.files ?? []} onDropFiles={handleAddFiles}>
      <DocList
        onInteractionWithList={mutate}
        files={data?.files}
        loading={Boolean(isValidating && data)}
      />
    </DnD>
  )
}

export default index
