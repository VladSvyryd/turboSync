import Navigation from './navigation/routes'
import { ChakraProvider, createStandaloneToast, UseToastOptions } from '@chakra-ui/react'
import theme from './theme'

const defaultToastOptions: UseToastOptions = {
  status: 'error',
  title: 'Ups! Server Problem.',
  position: 'top',
  duration: 5000,
  isClosable: true
}
const { ToastContainer, toast } = createStandaloneToast({
  theme,
  defaultOptions: defaultToastOptions
})
export const execToast = toast
function App() {
  return (
    <ChakraProvider
      theme={theme}
      toastOptions={{
        defaultOptions: defaultToastOptions
      }}
    >
      <Navigation />
      <ToastContainer />
    </ChakraProvider>
  )
}

export default App
