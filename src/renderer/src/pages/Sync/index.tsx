import { FunctionComponent } from 'react'
import { Button, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import PatientList from '../../components/TurboSync/PatientList'
import PatientSelectForm from '../../components/Forms/PatientSelectForm'
import PatientImportForm from '../../components/Forms/PatientImportForm'
import ExportsList from '../../components/TurboSync/ExportsList'
import { useListStore } from '../../store/ListStore'

interface OwnProps {}

type Props = OwnProps
const TurboSync: FunctionComponent<Props> = () => {
  const { activeExport, setActiveImport } = useListStore()
  return (
    <Tabs
      isLazy
      display={'flex'}
      flexDirection={'column'}
      h={'100%'}
      variant="enclosed"
      defaultIndex={0}
    >
      <TabList>
        <Tab>Export</Tab>
        <Tab>Import</Tab>
      </TabList>
      <TabPanels display={'flex'} flex={1}>
        <TabPanel as={Stack} flex={1}>
          <Stack flex={1} direction={'row'}>
            <Stack>
              <PatientList />
              <PatientSelectForm />
            </Stack>
            <PatientImportForm />
          </Stack>
        </TabPanel>
        <TabPanel as={Stack} flex={1}>
          <Stack flex={1} direction={'row'}>
            <Stack flex={1}>
              <ExportsList />
            </Stack>
            <Stack justifyContent={'flex-start'}>
              <Button
                onClick={async () => {
                  if (activeExport?.id) {
                    const importPatient = await window.api.getPatientById(activeExport.id)
                    setActiveImport(null)
                    return
                    if (importPatient.error) {
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
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default TurboSync
