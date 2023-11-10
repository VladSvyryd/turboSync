import { FunctionComponent } from 'react'
import { Stack, Text, useToken } from '@chakra-ui/react'
import { Patient } from '../../types'
import StatusLamp from '../Loading/StatusLamp'

interface OwnProps {
  patient?: Patient
  loading: boolean
}

type Props = OwnProps

const PatientLable: FunctionComponent<Props> = ({ patient, loading }) => {
  const teal = useToken('colors', 'teal')
  const white = useToken('colors', 'whiteAlpha.300')
  return (
    <Stack alignItems={'flex-start'} px={4}>
      <Stack
        height={8}
        direction={'row'}
        bg={!patient && !loading ? 'red' : 'teal'}
        px={2}
        py={1}
        alignItems={'center'}
        borderBottomLeftRadius={5}
        borderBottomRightRadius={5}
        pr={6}
      >
        <StatusLamp on={!loading} size={3} onColor={teal} offColor={white} />
        {/*<Spinner visibility={loading ? 'visible' : 'hidden'} size={'xs'} color={'white'} />)*/}
        {!loading && !patient ? (
          <Text color={'white'}>Kein Patient</Text>
        ) : (
          <>
            <Text color={'white'}>{patient?.id}</Text>
            <Text color={'white'}>{patient?.firstName}</Text>
            <Text color={'white'}>{patient?.secondName}</Text>
          </>
        )}
      </Stack>
    </Stack>
  )
}

export default PatientLable
