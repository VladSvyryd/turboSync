import { FunctionComponent, useEffect, useState } from 'react'
import { Box, Button, Input, Progress, Stack, Text } from '@chakra-ui/react'
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
  const handleImport = async () => {
    try {
      setLogs(['Starte Export'])
      setProgress(0)
      setProgressCount(0)
      await window.api.initPatientImport({
        id: patients[0].id,
        turbomedPath: exportTurbomedPath ?? ''
      })
    } catch (e) {}
  }
  const handleExportData = async () => {
    try {
      const data = await window.api.getExportData(patients[0].id)
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(data)
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute('href', dataStr)
      downloadAnchorNode.setAttribute('download', patients[0].id + '.json')
      document.body.appendChild(downloadAnchorNode) // required for firefox
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    } catch (e) {}
  }
  const addLog = (l: string) => {
    const bla = logs
    bla.push(l)
    setLogs(bla)
  }
  const progressValue = Math.ceil((progress / progressCount) * 100)
  const progressUI = progressValue > 0 ? progressValue : 0
  useEffect(() => {
    window.api.setProgress((_, progress) => {
      setProgressCount(progress)
    })
    window.api.onProgressChanged((_, progress) => {
      setProgress(progress)
    })
    window.api.onLogs((_, log) => {
      addLog(log)
    })
    return () => {
      window.api.cleanUp()
    }
  }, [logs])
  return (
    <Stack flex={1} height={'calc(100vh - 73px)'}>
      <Stack p={2} boxShadow={'inset 0 4px 7px 0 rgba(0,0,0,0.16)'} flex={1} overflowY={'auto'}>
        {logs.map((log, index) => (
          <Text
            key={'logExpo' + index}
            fontSize={'xs'}
            sx={{
              _odd: { background: 'gray.200' }
            }}
          >
            {log}
          </Text>
        ))}
      </Stack>
      <Stack direction={'row'} alignItems={'center'}>
        <Box flex={1}>
          <Progress hasStripe isAnimated={progressUI != 100} value={progressUI ?? 0} />
        </Box>
        <Text>
          {progress}/{progressCount}
        </Text>
      </Stack>
      <Stack direction={'row'}>
        <Input
          name={'path'}
          autoFocus
          value={exportTurbomedPath}
          placeholder="Turbomed Path"
          onChange={(e) => setExportTurbomedPath(e.target.value)}
        />

        <Button
          onClick={handleExportData}
          isDisabled={patients.length === 0 || progress !== progressCount}
        >
          Export Datei
        </Button>
        <Button
          onClick={handleImport}
          isDisabled={patients.length === 0}
          isLoading={progress !== progressCount}
        >
          Export
        </Button>
      </Stack>
    </Stack>
  )
}

export default PatientExportForm
