import { FunctionComponent, useEffect, useState } from 'react'

import { IconButton, Stack, useToken } from '@chakra-ui/react'
import { LiaFileSignatureSolid } from 'react-icons/lia'
import { useSettingsStore } from '../../store'
import { motion } from 'framer-motion'
interface OwnProps {}

type Props = OwnProps

const index: FunctionComponent<Props> = () => {
  const red = useToken('colors', 'red.400')
  const orange = useToken('colors', 'orange.400')
  const { apiBaseUrl } = useSettingsStore()
  const [blockClicks, setBlockClicks] = useState(false)

  useEffect(() => {
    if (apiBaseUrl === '') {
      window.api.openNewWindow('settings')
    }
    window.api.onWindowIsDragged((_, { isDragged }) => {
      console.log({ isDragged })
      setBlockClicks(isDragged)
    })
  }, [apiBaseUrl])
  return (
    <Stack
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <Stack>
        <IconButton
          as={motion.button}
          whileHover={{ filter: `drop-shadow(2px 4px 6px ${red})`, background: 'initial' }}
          whileTap={{
            filter: `drop-shadow(2px 4px 6px ${orange})`,
            background: 'initial',
            scale: 0.95,
            cursor: !blockClicks ? 'pointer' : 'grabbing'
          }}
          variant={'ghost'}
          onClick={async () => {
            if (blockClicks) return
            window.api.openNewWindow('templates')
          }}
          aria-label="Öffne Vorlagen"
          sx={{
            width: '100%',
            height: '100%',
            // maxWidth: 300,
            filter: 'drop-shadow(0px 0px 0px red)'
          }}
          icon={
            <>
              <svg height={0} width={0}>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#C6FFDD', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#FBD786', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#f7797d', stopOpacity: 1 }} />
                </linearGradient>
              </svg>
              <LiaFileSignatureSolid size={'100vh'} style={{ fill: 'url(#grad1)' }} />
            </>
          }
        />
      </Stack>
      {/*<Stack flexDir={'row'}>*/}
      {/*  <Button*/}
      {/*    size={'sm'}*/}
      {/*    onClick={async () => {*/}
      {/*      window.api.openNewWindow('settings')*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <IoIosSettings />*/}
      {/*  </Button>*/}
      {/*</Stack>*/}
    </Stack>
  )
}

export default index
