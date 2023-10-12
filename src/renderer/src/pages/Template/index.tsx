import { FunctionComponent, useState } from 'react'
import { Progress, Stack, useToast } from '@chakra-ui/react'
import useSWR from 'swr'
import { fetcherWithQuery, ServerApi } from '../../api'
import DnD from '../../components/DnD'
import DocFolders from '../../components/Doc/DocFolders'
import { DocFile, SignType } from '../../types'
import SignTypePicker from '../../components/Modals/SignTypePicker'
import { BsPrinterFill, BsQrCodeScan } from 'react-icons/bs'
import { LiaSignatureSolid } from 'react-icons/lia'

interface OwnProps {}

type Props = OwnProps

const buttons = [
  {
    id: SignType.SIGNPAD,
    title: 'QR-Code',
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <BsQrCodeScan size={60} />
      </Stack>
    )
  },
  {
    id: SignType.PRINT,
    title: 'QR-Code / SignPad',
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <BsQrCodeScan size={60} />, <LiaSignatureSolid size={64} />
      </Stack>
    )
  },
  {
    id: SignType.LINK,
    title: 'QR-Code / SignPad / Drucken',
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <BsQrCodeScan size={60} /> <LiaSignatureSolid size={60} /> <BsPrinterFill size={60} />
      </Stack>
    )
  }
]
const index: FunctionComponent<Props> = () => {
  const toast = useToast()
  const url = `${ServerApi.getUri()}/api/templates`
  const [activeSignTypePicket, setActiveSignTypePicket] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<Array<File>>([])
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

  const handleAddFiles = async (signType: SignType) => {
    const formdata = new FormData()
    uploadFiles.forEach((file) => {
      formdata.append('fileStore', file)
    })
    formdata.append('signType', signType)

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

  const startSignTypePicker = (uploadFiles: Array<File>) => {
    if (uploadFiles.length === 0) {
      return
    }
    setUploadFiles(uploadFiles)
    setActiveSignTypePicket(true)
  }

  const allFiles = data?.folders.flatMap((folder) => folder.files).map((f) => f.name) ?? []

  if (isValidating && !data) {
    return <Progress size="xs" isIndeterminate />
  }

  return (
    <>
      <SignTypePicker
        signTypeButtons={buttons}
        isOpen={activeSignTypePicket}
        onClose={() => {
          setActiveSignTypePicket(false)
        }}
        onPick={async (v) => {
          await handleAddFiles(v)
        }}
      />
      <DnD blackList={allFiles} onDropFiles={startSignTypePicker}>
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
