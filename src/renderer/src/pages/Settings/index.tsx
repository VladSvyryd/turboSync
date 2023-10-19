import { FunctionComponent } from 'react'
import { Stack } from '@chakra-ui/react'
import BaseUrlSetter from '../../container/Settings/BaseUrlSetter'
import PingServer from '../../container/Settings/PingServer'
import PrinterPicker from '../../container/Settings/PrinterPicker'

interface OwnProps {}

type Props = OwnProps
const index: FunctionComponent<Props> = () => {
  return (
    <Stack spacing={6}>
      <BaseUrlSetter />
      <PingServer />
      <PrinterPicker />
    </Stack>
  )
}

export default index
