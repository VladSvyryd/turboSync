import { FunctionComponent } from 'react'
import { Divider, Heading, Stack, Text } from '@chakra-ui/react'

interface OwnProps {}

type Props = OwnProps

const PingServer: FunctionComponent<Props> = () => {
  return (
    <Stack px={4}>
      <Heading size={'sm'}>Ping</Heading>
      <Text>Feature: PING</Text>
      <Divider />
    </Stack>
  )
}

export default PingServer
