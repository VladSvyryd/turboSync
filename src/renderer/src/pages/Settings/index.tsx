import { FunctionComponent } from 'react'
import { Stack } from '@chakra-ui/react'
import BaseUrlSetter from '../../container/Settings/BaseUrlSetter'
import PingServer from '../../container/Settings/PingServer'
import PrinterPicker from '../../container/Settings/PrinterPicker'
import ScannerPicker from '../../container/Settings/ScannerPicker'

interface OwnProps {}

type Props = OwnProps
const index: FunctionComponent<Props> = () => {
  return (
    <Stack spacing={6}>
      <BaseUrlSetter />
      <PingServer />
      <PrinterPicker />
      <ScannerPicker />
    </Stack>
  )
}

export default index
