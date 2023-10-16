import { extendTheme } from '@chakra-ui/react'

const colors = {
  // brand: {
  //   900: '#1a365d',
  //   800: '#153e75',
  //   700: '#2a69ac'
  // }
}

const styles = {
  global: {
    body: {
      backgroundColor: 'transparent'
    },
    'html, #root': {
      height: '100vh'
    }
  }
}

const theme = extendTheme({
  colors,
  styles,
  components: {
    Modal: {
      baseStyle: {
        overlay: {
          bg: 'transparent',
          backdropFilter: 'blur(1px)'
        }
      }
    }
  }
})

export default theme
