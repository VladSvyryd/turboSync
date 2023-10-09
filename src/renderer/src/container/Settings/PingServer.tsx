import { FunctionComponent } from 'react'
import { Stack, Text } from '@chakra-ui/react'

interface OwnProps {}

type Props = OwnProps

const PingServer: FunctionComponent<Props> = () => {
  return (
    <Stack>
      <Text>Feature: PING</Text>
    </Stack>
  )
}

export default PingServer
