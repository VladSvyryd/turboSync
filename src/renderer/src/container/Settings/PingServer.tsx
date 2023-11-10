import { FunctionComponent, useEffect, useState } from 'react'
import { Divider, Heading, Stack, Text } from '@chakra-ui/react'
import StatusLamp from '../../components/Loading/StatusLamp'

interface OwnProps {}

type Props = OwnProps

const PingServer: FunctionComponent<Props> = () => {
  const [connected, setConnected] = useState<boolean>(false)
  // const [turbomed, setTurbomed] = useState<boolean>(false)
  const initiateConnection = async () => {
    const svalue = await window.api.getStoreValue({ key: 'socketConnected' })
    // const tValue = await window.api.getStoreValue({ key: 'turbomedConnected' })
    setConnected(svalue)
    // setTurbomed(tValue)
  }

  useEffect(() => {
    initiateConnection()
    window.api.onSocketConnection((_, connected) => {
      setConnected(connected)
    })
  }, [])

  return (
    <Stack px={4}>
      <Heading size={'sm'}>Verbindung</Heading>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Text>Server:</Text>
        <StatusLamp on={connected} p={2} />
      </Stack>

      <Divider />
    </Stack>
  )
}

export default PingServer
