import { FunctionComponent } from 'react'
import { Heading, Spinner, Stack } from '@chakra-ui/react'

interface OwnProps {
  title?: string
}

type Props = OwnProps

const LoadingOverlay: FunctionComponent<Props> = ({ title }) => {
  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      pos={'fixed'}
      top={0}
      left={0}
      width={'100%'}
      height={'100%'}
      bg={'whiteAlpha.100'}
      backdropFilter={'blur(1px)'}
      zIndex={9}
    >
      <Spinner color={'teal.500'} thickness="4px" speed="0.85s" emptyColor="gray.200" size="xl" />
      <Heading size={'lg'}>{title}</Heading>
    </Stack>
  )
}

export default LoadingOverlay
