import { FunctionComponent } from 'react'
import { Input, InputGroup, InputLeftAddon, InputRightAddon } from '@chakra-ui/react'

interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  return (
    <InputGroup size="sm">
      <InputLeftAddon children="http://" />
      <Input placeholder="localhost" />
      <InputRightAddon children="/" />
    </InputGroup>
  )
}

export default index
