import { FunctionComponent, useEffect } from 'react'
import { List, ListItem, ScaleFade, Spinner, Stack } from '@chakra-ui/react'
import ListButton from '../../ListButton/ListButton/ListButton'
import { useListStore } from '../../../store/ListStore'
import { Patient } from '../../../types'
import ModalImport from '../ModalImport'

interface OwnProps {}

type Props = OwnProps

const ExportsList: FunctionComponent<Props> = () => {
  const { exports, setExports, activeExport, setActiveExport, activeImport } = useListStore()

  const getData = async () => {
    const folders = (await window.api.getListOfExportData()) as Array<Patient>
    setExports(folders)
  }
  useEffect(() => {
    getData()
  }, [])
  return (
    <>
      {activeImport !== undefined && <ModalImport />}
      <List sx={{ py: 2 }} spacing={1} border={'2px solid red'} flex={1} maxWidth={400}>
        {exports?.map((p) => (
          <ListItem key={p.id}>
            <ListButton
              active={p.id === activeExport?.id}
              patient={p}
              onClick={() => {
                setActiveExport(p)
              }}
              loading={false}
              // onDelete={(p) => removePatient(p)}
            />
          </ListItem>
        ))}
        <Stack alignItems={'center'}>
          <ScaleFade
            initialScale={0.3}
            in={false}
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

export default ExportsList
