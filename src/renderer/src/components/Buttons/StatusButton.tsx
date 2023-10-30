import { FunctionComponent } from 'react'
import { motion } from 'framer-motion'
import { LiaFileSignatureSolid } from 'react-icons/lia'
import { IconButton, useToken } from '@chakra-ui/react'
import { TemplateEvaluationStatus } from '../../types'

interface OwnProps {
  isDragged: boolean
  status: TemplateEvaluationStatus
  loading?: boolean
  onClick: () => void
}

type Props = OwnProps

const StatusButton: FunctionComponent<Props> = ({ isDragged, status, onClick }) => {
  const green1 = useToken('colors', 'green.200')
  const green = useToken('colors', 'green.400')
  const red = useToken('colors', 'red.400')
  const red1 = useToken('colors', 'red.200')
  const orange = useToken('colors', 'orange.400')
  const orange1 = useToken('colors', 'orange.200')
  const renderStatusColor = () => {
    switch (status) {
      case TemplateEvaluationStatus.ERROR:
        return { color1: red1, color2: red }
      case TemplateEvaluationStatus.SUCCESS:
        return { color1: green1, color2: green }
      default:
        return { color1: orange1, color2: orange }
    }
  }
  const iconColor = renderStatusColor()
  return (
    <IconButton
      as={motion.button}
      whileHover={{ filter: `drop-shadow(0px 0px 4px ${iconColor.color2})` }}
      whileTap={{
        filter: `drop-shadow(2px 4px 6px ${orange})`,
        scale: 0.95,
        cursor: !isDragged ? 'pointer' : 'grabbing'
      }}
      variant={'ghost'}
      onClick={async () => {
        if (isDragged) return
        onClick()
      }}
      aria-label="Öffne Vorlagen"
      sx={{
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0)!important',
        filter: 'drop-shadow(0px 0px 0px red)'
      }}
      icon={
        <>
          <motion.svg height={0} width={0}>
            <radialGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#C6FFDD', stopOpacity: 1 }} />
              <motion.stop offset="50%" animate={{ stopColor: iconColor.color1, stopOpacity: 1 }} />
              <motion.stop
                offset="100%"
                animate={{ stopColor: iconColor.color2, stopOpacity: 1 }}
              />
            </radialGradient>
          </motion.svg>
          <LiaFileSignatureSolid size={'100vh'} style={{ fill: 'url(#grad1)' }} />
        </>
      }
    />
  )
}

export default StatusButton
