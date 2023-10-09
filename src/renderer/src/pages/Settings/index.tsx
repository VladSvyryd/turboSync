import { FunctionComponent } from 'react'
import { Stack } from '@chakra-ui/react'
import BaseUrlSetter from '../../container/Settings/BaseUrlSetter'
import PingServer from '../../container/Settings/PingServer'

interface OwnProps {}

type Props = OwnProps
const index: FunctionComponent<Props> = () => {
  return (
    <Stack>
      <BaseUrlSetter />
      <PingServer />
    </Stack>
  )
}

export default index
