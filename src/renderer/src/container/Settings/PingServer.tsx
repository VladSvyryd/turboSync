import { FunctionComponent, useEffect, useState } from 'react'
import { Box, Divider, Heading, Stack, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

interface OwnProps {}

type Props = OwnProps
const greenColor = 'rgba(0,255,0,.8)'
const redColor = 'rgba(255,0,0,.6)'

const sx = {
  position: 'relative',
  width: 4,
  height: 4,
  borderRadius: '50%',
  backgroundColor: 'currentColor',
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2)',
      opacity: 0
    }
  }
}
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
        <Box p={2}>
          <Box as={motion.div} sx={sx} animate={{ color: connected ? greenColor : redColor }}>
            <Box
              pos={'absolute'}
              top={0}
              left={0}
              width={4}
              height={4}
              borderRadius={'50%'}
              animation={'ripple 1.2s infinite ease-in-out'}
              border={'1px solid currentColor'}
            />
          </Box>
        </Box>
      </Stack>

      <Divider />
    </Stack>
  )
}

export default PingServer
