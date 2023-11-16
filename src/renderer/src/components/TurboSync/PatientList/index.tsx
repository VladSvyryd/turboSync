import { FunctionComponent } from 'react'
import { List, ListItem, ScaleFade, Spinner, Stack } from '@chakra-ui/react'
import ListButton from '../../ListButton/ListButton/ListButton'
import { useListStore } from '../../../store/ListStore'

interface OwnProps {}

type Props = OwnProps

const PatientList: FunctionComponent<Props> = () => {
  const { patients, removePatient } = useListStore()
  return (
    <List
      boxShadow={'inset 0 4px 7px 0 rgba(0,0,0,0.16)'}
      sx={{ py: 2 }}
      spacing={1}
      flex={1}
      maxWidth={400}
    >
      {patients?.map((p) => (
        <ListItem key={'p.id'}>
          <ListButton
            patient={p}
            onClick={() => {}}
            loading={false}
            onDelete={(p) => removePatient(p)}
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
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </ScaleFade>
      </Stack>
    </List>
  )
}

export default PatientList
