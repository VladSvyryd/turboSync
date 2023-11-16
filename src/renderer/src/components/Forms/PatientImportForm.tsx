import { FunctionComponent, useEffect, useState } from 'react'
import { Button, Input, Progress, Stack, Text } from '@chakra-ui/react'
import { useListStore } from '../../store/ListStore'
import { useListPersistStore } from '../../store/ListPersistStore'
import ModalImport from '../TurboSync/ModalImport'

interface OwnProps {}

type Props = OwnProps

const PatientImportForm: FunctionComponent<Props> = () => {
  const { importTurbomedPath, setImportTurbomedPath } = useListPersistStore()
  const { setActiveImport, activeExport, activeImport } = useListStore()
  const [progressCount, setProgressCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const progressValue = Math.ceil((progress / progressCount) * 100)
  const progressUI = progressValue > 0 ? progressValue : 0
  const [logs, setLogs] = useState<Array<string>>([])

  const handleOnSubmit = async (v: string) => {
    let id = v.trim()

    if (!activeExport?.id) return
    try {
      setLogs([])
      window.api.importToTurbomedById({
        fromId: activeExport.id,
        toId: id,
        turbomedPath: importTurbomedPath ?? ''
      })
    } catch (e) {}
  }
  const addLog = (l: string) => {
    const bla = logs
    bla.push(l)
    setLogs(bla)
  }
  useEffect(() => {
    window.api.setProgress((_, progress) => {
      console.log({ progress })
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
      {activeImport !== undefined && <ModalImport onSubmit={handleOnSubmit} />}
      <Stack p={2} boxShadow={'inset 0 4px 7px 0 rgba(0,0,0,0.16)'} flex={1} overflowY={'auto'}>
        {logs.map((log) => (
          <Text
            fontSize={'xs'}
            sx={{
              _odd: { background: 'gray.200' }
            }}
          >
            {log}
          </Text>
        ))}
      </Stack>
      <Stack>
        <Progress hasStripe isAnimated={progressUI != 100} value={progressUI ?? 0} />
      </Stack>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Input
          value={importTurbomedPath}
          name={'path'}
          autoFocus
          placeholder="Turbomed Path"
          onChange={(e) => {
            setImportTurbomedPath(e.target.value)
          }}
        />
        <Button
          onClick={async () => {
            if (activeExport?.id) {
              const importPatient = await window.api.getPatientById(activeExport.id)

              if (importPatient.error) {
                setActiveImport(null)
                return
              }
              setActiveImport(importPatient.data)
            }
          }}
          isDisabled={!activeExport}
          isLoading={progress !== progressCount}
        >
          Import
        </Button>
      </Stack>
    </Stack>
  )
}

export default PatientImportForm
