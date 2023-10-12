import { FunctionComponent } from 'react'
import SignTypePicker from '../../components/Modals/SignTypePicker'
import { SignType } from '../../types'
import { Stack, useToast } from '@chakra-ui/react'
import { BsPrinterFill, BsQrCodeScan } from 'react-icons/bs'
import { LiaSignatureSolid } from 'react-icons/lia'
import { ServerApi } from '../../api'

interface OwnProps {
  uploadFiles: Array<File> | null
  onAddFlowDone: () => void
}

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
const AddTemplateFlow: FunctionComponent<Props> = ({ uploadFiles, onAddFlowDone }) => {
  const toast = useToast()

  const handleAddFiles = async (signType: SignType) => {
    if (!uploadFiles) {
      return
    }
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
  }

  return (
    <SignTypePicker
      signTypeButtons={buttons}
      isOpen={uploadFiles !== null && uploadFiles.length > 0}
      onClose={onAddFlowDone}
      onPick={async (v) => {
        await handleAddFiles(v)
        onAddFlowDone()
      }}
    />
  )
}

export default AddTemplateFlow
