import { FunctionComponent } from 'react'
// import Versions from "../../components/Versions";

import imgUrl from '../../assets/home.svg'
import { Box, Button, Stack } from '@chakra-ui/react'
import { FiMove } from 'react-icons/fi'

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
          window.api.open()
        }}
        style={{
          width: '100%',
          maxWidth: 300
          // margin:10
        }}
      >
        <img src={imgUrl} alt={'home'} style={{ width: '100%', height: 'auto' }} />
      </button>

      <Button
        sx={{
          '-webkit-app-region': 'drag',
          ' -webkit-user-select': 'none'
        }}
      >
        <FiMove />
      </Button>
    </Stack>
  )
}

export default index
