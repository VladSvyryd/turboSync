import { FunctionComponent, useEffect, useState } from 'react'
import { Button, Stack, Text } from '@chakra-ui/react'
import { useListStore } from '../../store/ListStore'

interface OwnProps {}

type Props = OwnProps

const PatientImportForm: FunctionComponent<Props> = () => {
  const { patients } = useListStore()
  const [progressCount, setProgressCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const handleImport = async () => {
    try {
      setLoading(true)
      await window.api.initPatientImport(patients[0].id)
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }
  console.log({ loading })
  const handleExportData = () => {
    setLoading(true)
    try {
      const data = window.api.getExportData(patients[0].id)
      console.log({ data })
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.api.setProgress((_, progress) => {
      console.log({ progress })
      setProgressCount(progress)
    })
    window.api.onProgressChanged((_, progress) => {
      setProgress(progress)
    })
  }, [])

  return (
    <Stack flex={1}>
      <Stack border={'1px solid red'} flex={1} />
      <Stack>
        <Text>{progress}</Text> / <Text>{progressCount}</Text>
      </Stack>
      <Stack alignSelf={'flex-end'}>
        <Button onClick={handleExportData} isDisabled={patients.length === 0} isLoading={loading}>
          Export Datei
        </Button>
        <Button onClick={handleImport} isDisabled={patients.length === 0} isLoading={loading}>
          Export
        </Button>
      </Stack>
    </Stack>
  )
}

export default PatientImportForm
