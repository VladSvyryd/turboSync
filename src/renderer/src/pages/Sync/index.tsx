import { FunctionComponent } from 'react'
import { Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import PatientList from '../../components/TurboSync/PatientList'
import PatientSelectForm from '../../components/Forms/PatientSelectForm'
import PatientExportForm from '../../components/Forms/PatientExportForm'
import ExportsList from '../../components/TurboSync/ExportsList'
import PatientImportForm from '../../components/Forms/PatientImportForm'

interface OwnProps {}

type Props = OwnProps
const TurboSync: FunctionComponent<Props> = () => {
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
            <PatientExportForm />
          </Stack>
        </TabPanel>
        <TabPanel as={Stack} flex={1}>
          <Stack flex={1} direction={'row'}>
            <Stack>
              <ExportsList />
            </Stack>
            <PatientImportForm />
          </Stack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default TurboSync
