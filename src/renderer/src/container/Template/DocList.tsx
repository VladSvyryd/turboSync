import { FunctionComponent, useState } from 'react'
import { List, ListItem, ScaleFade, Spinner, Stack, Text, useToast } from '@chakra-ui/react'
import ListButton from '../../components/ListButton/ListButton'
import ErrorModal from './ErrorModal'
import { ServerApi } from '../../api'
import { AxiosError } from 'axios'

import { SignType, Template } from '../../types'
import SignTypePicker from '../../components/Modals/SignTypePicker'
import { BsPrinterFill, BsQrCodeScan } from 'react-icons/bs'
import { LiaSignatureSolid } from 'react-icons/lia'

interface OwnProps {
  listId: SignType
  files?: Array<Template>
  loading?: boolean
  onInteractionWithList: () => void
}

type Props = OwnProps

const PRINT_BUTTONS = [
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
    title: 'SignPad',
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <LiaSignatureSolid size={64} />
      </Stack>
    )
  },
  {
    id: SignType.LINK,
    title: 'Drucken',
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <BsPrinterFill size={60} />
      </Stack>
    )
  }
]
const SIGNPAD_BUTTONS = [
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
    title: 'SignPad',
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <LiaSignatureSolid size={64} />
      </Stack>
    ),
    disabled: true
  },
  {
    id: SignType.LINK,
    title: null,
    header: (
      <Stack direction={'row'} justifyContent={'center'} gap={5}>
        <Text>Sie haben folgende Optionen</Text>
      </Stack>
    )
  }
]
const getSelectionButtons = (signType: SignType) => {
  switch (signType) {
    case SignType.SIGNPAD: {
      return SIGNPAD_BUTTONS
    }
    case SignType.PRINT: {
      return PRINT_BUTTONS
    }
    default:
      return PRINT_BUTTONS
  }
}

const DocList: FunctionComponent<Props> = ({ files, listId, onInteractionWithList, loading }) => {
  const toast = useToast()
  const [loadingProcessTemplate, setLoadingProcessTemplate] = useState<null | string>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeSignTypePicker, setActiveSignTypePicker] = useState<Template | null>(null)
  const selectionButtons = getSelectionButtons(listId)
  const handleDocClick = async (docFile: Template) => {
    if (listId === SignType.LINK) {
      await handleStartProcessTemplate(docFile)
      return
    }
    setActiveSignTypePicker(docFile)
  }

  const handleStartProcessTemplate = async (docFile: Template) => {
    try {
      setLoadingProcessTemplate(docFile.uuid)
      const activePatient = await window.api.getActivePatient()
      if (!Boolean(activePatient?.data?.id)) {
        setError(activePatient?.error)
        return
      }
      const processTemplate = await ServerApi.post(`/api/processTemplate`, {
        ...activePatient.data,
        uuid: docFile.uuid
      })
      console.log('processTemplate', processTemplate)
    } catch (e) {
      const err = e as AxiosError<{ message: string }>
      toast({
        description: err.response?.data?.message ?? 'Fehler beim Verarbeiten der Vorlage.'
      })
    } finally {
      setLoadingProcessTemplate(null)
    }
  }

  const handlePickSignType = async (signType: SignType) => {
    if (!activeSignTypePicker) return

    switch (signType) {
      case SignType.LINK: {
        return await handleStartProcessTemplate(activeSignTypePicker)
      }
      default:
        toast({
          title: 'Next Feature.',
          status: 'warning',
          description: 'Nicht implementiert.'
        })
        return
    }
  }

  return (
    <>
      <SignTypePicker
        signTypeButtons={selectionButtons}
        isOpen={Boolean(activeSignTypePicker)}
        onClose={() => {
          setActiveSignTypePicker(null)
        }}
        onPick={handlePickSignType}
      />

      <ErrorModal
        error={error}
        onClose={() => {
          setError(null)
        }}
      />
      <List sx={{ py: 2 }} spacing={1}>
        {files?.map((file) => (
          <ListItem key={file.uuid}>
            <ListButton
              template={file}
              onClick={handleDocClick}
              loading={loadingProcessTemplate === file.uuid}
              onInteractionWithList={onInteractionWithList}
            />
          </ListItem>
        ))}
        <Stack alignItems={'center'}>
          <ScaleFade
            initialScale={0.3}
            in={loading}
            transition={{
              enter: {
                type: 'spring'
              }
            }}
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </ScaleFade>
        </Stack>
      </List>
    </>
  )
}

export default DocList
