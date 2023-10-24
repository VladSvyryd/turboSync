import { FunctionComponent, useState } from 'react'
import { List, ListItem, ScaleFade, Spinner, Stack, Text, useToast } from '@chakra-ui/react'
import ListButton from '../../components/ListButton/ListButton/ListButton'
import ErrorModal from './ErrorModal'
import { fetcherUserBeforeQuery, ServerApi } from '../../api'
import { AxiosError } from 'axios'

import { SignType, Template } from '../../types'
import SignTypePicker from '../../components/Modals/SignTypePicker'
import { BsPrinterFill, BsQrCodeScan } from 'react-icons/bs'
import { LiaSignatureSolid } from 'react-icons/lia'
import { mutate } from 'swr'
import { usePatientStore } from '../../store/PatientStore'

interface OwnProps {
  listId: SignType
  files?: Array<Template>
  loading?: boolean
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

const DocList: FunctionComponent<Props> = ({ files, listId, loading }) => {
  const toast = useToast()
  const { patient } = usePatientStore()
  const [loadingProcessTemplate, setLoadingProcessTemplate] = useState<Array<string>>([])
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
  const toggleProcessToLoadingArray = (uuid: string) => {
    console.log(uuid)

    setLoadingProcessTemplate((prev) => {
      const a = new Set(prev)
      if (a.has(uuid)) {
        return prev.filter((p) => p !== uuid)
      } else {
        return [...prev, uuid]
      }
    })
  }
  const handleStartProcessTemplate = async (docFile: Template) => {
    try {
      toggleProcessToLoadingArray(docFile.uuid)
      const activePatient = patient
      if (!Boolean(activePatient?.id)) {
        return
      }
      const processTemplate = await ServerApi.post(`/api/processTemplate`, {
        ...activePatient,
        uuid: docFile.uuid
      })
      console.log('processTemplate', processTemplate)
    } catch (e) {
      const err = e as AxiosError<{ message: string }>
      toast({
        description: err.response?.data?.message ?? 'Fehler beim Verarbeiten der Vorlage.'
      })
    } finally {
      toggleProcessToLoadingArray(docFile.uuid)
      if (loadingProcessTemplate.length === 1) await mutate(fetcherUserBeforeQuery)
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
              loading={new Set(loadingProcessTemplate).has(file.uuid)}
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
