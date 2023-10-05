import Navigation from './navigation/routes'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'

function App() {
  return (
    <ChakraProvider
      theme={theme}
      toastOptions={{
        defaultOptions: { position: 'top', duration: 5000, isClosable: true }
      }}
    >
      <Navigation />
    </ChakraProvider>
  )
}

export default App
