import { FunctionComponent, useEffect, useState } from 'react'
import { Button, Input, Progress, Stack, Text } from '@chakra-ui/react'
import { useListStore } from '../../store/ListStore'
import { useListPersistStore } from '../../store/ListPersistStore'

interface OwnProps {}

type Props = OwnProps

const PatientExportForm: FunctionComponent<Props> = () => {
  const { patients } = useListStore()
  const { exportTurbomedPath, setExportTurbomedPath } = useListPersistStore()
  const [progressCount, setProgressCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<Array<string>>([])
  const [loading, setLoading] = useState(false)
  const handleImport = async () => {
    console.log({ exportTurbomedPath })
    try {
      setLoading(true)
      setLogs([])
      setProgress(0)
      setProgressCount(0)
      await window.api.initPatientImport({
        id: patients[0].id,
        turbomedPath: exportTurbomedPath ?? ''
      })
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
  const progressValue = Math.ceil((progress / progressCount) * 100)
  const progressUI = progressValue > 0 ? progressValue : 0
  useEffect(() => {
    window.api.setProgress((_, progress) => {
      console.log({ progress })
      setProgressCount(progress)
    })
    window.api.onProgressChanged((_, progress) => {
      setProgress(progress)
    })
    window.api.onLogs((_, logs) => {
      console.log({ logs })
      setLogs((prev) => [...prev, logs])
    })
  }, [])

  return (
    <Stack flex={1}>
      <Stack border={'1px solid green'} height={'calc(100% - 68px)'} overflowY={'auto'}>
        {logs.map((log) => (
          <Text fontSize={'xs'}>{log}</Text>
        ))}
      </Stack>
      <Stack>
        <Progress hasStripe isAnimated={progressUI != 100} value={progressUI ?? 0} />
      </Stack>
      <Stack direction={'row'}>
        <Input
          name={'path'}
          autoFocus
          value={exportTurbomedPath}
          placeholder="Turbomed Path"
          onChange={(e) => setExportTurbomedPath(e.target.value)}
        />

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

export default PatientExportForm
