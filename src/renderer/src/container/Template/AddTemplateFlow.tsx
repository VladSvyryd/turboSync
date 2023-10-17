import { FunctionComponent } from 'react'
import SignTypePicker from '../../components/Modals/SignTypePicker'
import { SignType, TemplateWithFile } from '../../types'
import { Stack, useToast } from '@chakra-ui/react'
import { BsPrinterFill, BsQrCodeScan } from 'react-icons/bs'
import { LiaSignatureSolid } from 'react-icons/lia'
import { ServerApi } from '../../api'
import TemplateInformation from '../../components/Modals/TemplateInformation'
import { useUploadStore } from '../../store/UploadStore'

interface OwnProps {
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
const AddTemplateFlow: FunctionComponent<Props> = ({ onAddFlowDone }) => {
  const toast = useToast()
  const {
    signType,
    setSignTypeModal,
    setSignType,
    uploadTemplates,
    signTypeModal,
    setUploadTemplates
  } = useUploadStore()
  const handleAddFiles = async (templateWithFile: Array<TemplateWithFile>) => {
    const formdata = new FormData()
    templateWithFile.forEach(({ file, ...rest }) => {
      formdata.append('fileStore', file)
      formdata.append('templateInfo', JSON.stringify(rest.templateInfo))
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
    onAddFlowDone()
  }
  const setupUploadTemplates = (signType: SignType) => {
    setUploadTemplates(
      uploadTemplates
        ? uploadTemplates.map((template) => ({
            ...template,
            templateInfo: {
              ...template.templateInfo,
              signType
            }
          }))
        : null
    )
    setSignType(signType)
    setSignTypeModal(false)
  }

  return (
    <>
      <SignTypePicker
        signTypeButtons={buttons}
        isOpen={signTypeModal}
        onClose={() => setSignTypeModal(false)}
        onPick={async (v) => {
          setupUploadTemplates(v)
        }}
      />
      {signType && <TemplateInformation onSubmit={handleAddFiles} />}
    </>
  )
}

export default AddTemplateFlow
