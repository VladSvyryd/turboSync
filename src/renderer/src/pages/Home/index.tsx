import { FunctionComponent } from 'react'
// import Versions from "../../components/Versions";

import imgUrl from '../../assets/home.svg'
import { Button, Stack } from '@chakra-ui/react'
import { FiMove } from 'react-icons/fi'
import { IoIosSettings } from 'react-icons/io'
interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  return (
    <Stack
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/*<Versions></Versions>*/}
      <button
        onClick={async () => {
          window.api.openNewWindow('templates')
        }}
        style={{
          width: '100%',
          maxWidth: 300
          // margin:10
        }}
      >
        <img src={imgUrl} alt={'home'} style={{ width: '100%', height: 'auto' }} />
      </button>

      <Stack flexDir={'row'}>
        <Button
          size={'sm'}
          onClick={async () => {
            window.api.openNewWindow('settings')
          }}
        >
          <IoIosSettings />
        </Button>
        <Button
          size={'sm'}
          sx={{
            '-webkit-app-region': 'drag',
            ' -webkit-user-select': 'none'
          }}
        >
          <FiMove />
        </Button>
      </Stack>
    </Stack>
  )
}

export default index
