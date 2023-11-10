import { FunctionComponent } from 'react'
import { Spinner, Stack, Text } from '@chakra-ui/react'
import { Patient } from '../../types'

interface OwnProps {
  patient?: Patient
  loading: boolean
}

type Props = OwnProps

const PatientLable: FunctionComponent<Props> = ({ patient, loading }) => {
  return (
    <Stack alignItems={'flex-start'} px={4}>
      <Stack
        height={8}
        direction={'row'}
        bg={patient ? 'teal' : 'red'}
        px={2}
        py={1}
        alignItems={'center'}
        borderBottomLeftRadius={5}
        borderBottomRightRadius={5}
        pr={6}
      >
        <Spinner visibility={loading ? 'visible' : 'hidden'} size={'xs'} color={'white'} />)
        {patient ? (
          <>
            <Text color={'white'}>{patient?.id}</Text>
            <Text color={'white'}>{patient?.firstName}</Text>
            <Text color={'white'}>{patient?.secondName}</Text>
          </>
        ) : (
          <Text color={'white'}>Kein Patient</Text>
        )}
      </Stack>
    </Stack>
  )
}

export default PatientLable
