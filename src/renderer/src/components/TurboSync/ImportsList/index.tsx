import { FunctionComponent, useEffect } from 'react'
import { List, ListItem, ScaleFade, Spinner, Stack } from '@chakra-ui/react'
import ListButton from '../../ListButton/ListButton/ListButton'
import { useListStore } from '../../../store/ListStore'
import { Patient } from '../../../types'

interface OwnProps {}

type Props = OwnProps

const ImportsList: FunctionComponent<Props> = () => {
  const { exports, setExports, activeExport, setActiveExport } = useListStore()

  const getData = async () => {
    const folders = (await window.api.getListOfExportData()) as Array<Patient>
    setExports(folders)
  }
  const removeExport = (p: Patient) => {
    window.api.deleteExportById({ id: p.id })
    getData()
  }
  useEffect(() => {
    getData()
  }, [])
  return (
    <>
      <List
        boxShadow={'inset 0 4px 7px 0 rgba(0,0,0,0.16)'}
        sx={{ py: 2 }}
        spacing={1}
        flex={1}
        minWidth={300}
        maxWidth={400}
      >
        {exports?.map((p) => (
          <ListItem key={p.id}>
            <ListButton
              active={p.id === activeExport?.id}
              patient={p}
              onClick={() => {
                setActiveExport(p)
              }}
              loading={false}
              onDelete={(p) => removeExport(p)}
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

export default ImportsList
