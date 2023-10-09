import { FunctionComponent, useState } from 'react'
import {
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Spinner,
  useToast
} from '@chakra-ui/react'
import { useSettingsStore } from '../../store'
import { CheckIcon } from '@chakra-ui/icons'
import axios from 'axios'

interface OwnProps {}

type Props = OwnProps

const ipPlusPortRegex =
  '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\\d){4}|[1-9](\\d){0,3})$'
const index: FunctionComponent<Props> = () => {
  const { apiBaseUrl, setApiBaseUrl } = useSettingsStore()
  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const checkConnection = async (address: string) => {
    setLoading(true)
    try {
      const res = await axios.get<{ sync: true }>(`http://${address}/api`, { timeout: 3000 })
      return res.data.sync
    } catch (e) {
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const formElement = e.target as HTMLFormElement
        let value = new FormData(formElement)?.get('apiBaseUrl')
        const hasConnection = await checkConnection(value as string)
        if (hasConnection) {
          setApiBaseUrl(value as string)
          axios.defaults.baseURL = `http://${value}`
          return toast({
            title: 'Verbindung hergestellt',
            status: 'success'
          })
        }
        formElement.reset()
        return toast({
          title: 'Keine Verbindung',
          description:
            'Es konnte keine Verbindung hergestellt werden. Bitte überprüfen Sie die Eingabe.'
        })
      }}
    >
      <InputGroup size="sm">
        <InputLeftAddon children="http://" />
        <Input
          autoFocus={apiBaseUrl !== ''}
          title={'***.***.***.***:***'}
          pattern={ipPlusPortRegex}
          placeholder="localhost"
          defaultValue={apiBaseUrl ?? '192.168.0.1'}
          name={'apiBaseUrl'}
          isDisabled={loading}
        />
        {apiBaseUrl !== '' && (
          <InputRightElement>
            <CheckIcon color="green.500" />
          </InputRightElement>
        )}
        {loading && (
          <InputRightElement mr={7}>
            <Spinner size={'sm'} colorScheme={'blue'} />
          </InputRightElement>
        )}
      </InputGroup>
    </form>
  )
}

export default index
