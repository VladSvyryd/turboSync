import { FunctionComponent, useEffect, useState } from 'react'
import { Button, Input, Stack, Text } from '@chakra-ui/react'
import { useListStore } from '../../store/ListStore'
import { useListPersistStore } from '../../store/ListPersistStore'

interface OwnProps {}

type Props = OwnProps

const PatientImportForm: FunctionComponent<Props> = () => {
  const { importTurbomedPath, setImportTurbomedPath } = useListPersistStore()
  const { setActiveImport, activeExport } = useListStore()
  const [progressCount, setProgressCount] = useState(0)
  const [progress, setProgress] = useState(0)

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
        >
          Import
        </Button>
      </Stack>
    </Stack>
  )
}

export default PatientImportForm
