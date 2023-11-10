import { FunctionComponent } from 'react'
import { Box, BoxProps } from '@chakra-ui/react'
import { motion } from 'framer-motion'

interface OwnProps {
  on: boolean
  onColor?: string
  offColor?: string
  size?: number
}

type Props = OwnProps & BoxProps
const greenColor = 'rgba(0,255,0,.8)'
const redColor = 'rgba(255,0,0,.6)'

const sx = {
  position: 'relative',
  width: 4,
  height: 4,
  borderRadius: '50%',
  backgroundColor: 'currentColor',
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2)',
      opacity: 0
    }
  }
}
const StatusLamp: FunctionComponent<Props> = ({ on, onColor, size, offColor, ...rest }) => {
  return (
    <Box {...rest}>
      <Box
        as={motion.div}
        sx={{ ...sx, width: size ?? sx.width, height: size ?? sx.width }}
        animate={{ color: on ? onColor ?? greenColor : offColor ?? redColor }}
      >
        <Box
          pos={'absolute'}
          top={0}
          left={0}
          width={size ?? sx.width}
          height={size ?? sx.width}
          borderRadius={'50%'}
          animation={'ripple 1.2s infinite ease-in-out'}
          border={'1px solid currentColor'}
        />
      </Box>
    </Box>
  )
}

export default StatusLamp
