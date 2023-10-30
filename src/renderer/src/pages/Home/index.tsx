import { FunctionComponent, useEffect, useState } from 'react'

import { IconButton, Stack, Text, useToken } from '@chakra-ui/react'
import { LiaFileSignatureSolid } from 'react-icons/lia'
import { useSettingsStore } from '../../store'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { Patient } from '../../types'
import { usePatientStore } from '../../store/PatientStore'
import { fetcherTemplateQuery } from '../../api'
import { fetchTemplatesUrl } from '../../types/variables'
import { useTemplatesStore } from '../../store/TemplateStore'
interface OwnProps {}

type Props = OwnProps
const fetchActivePatient = async () => {
  return window.api.getActivePatient()
}

const index: FunctionComponent<Props> = () => {
  const red = useToken('colors', 'red.400')
  const orange = useToken('colors', 'orange.400')
  const { apiBaseUrl } = useSettingsStore()
  const { patient, setPatient } = usePatientStore()
  const { setFolders } = useTemplatesStore()

  const [blockClicks, setBlockClicks] = useState(false)
  const { isValidating } = useSWR<{
    data: Patient
  }>('getActivePatient', fetchActivePatient, {
    focusThrottleInterval: 1000,
    refreshInterval: 500,
    onSuccess: async (data) => {
      console.log(data)
      setPatient(data.data)
      const foldersData = await fetcherTemplateQuery({ url: fetchTemplatesUrl, args: data.data })
      console.log({ foldersData })
      setFolders(foldersData?.folders)
    }
  })
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
        <Text mb={'-40px'} mr={'-40px'}>
          {'awdawd' + String(patient?.id)}
        </Text>
        <IconButton
          as={motion.button}
          whileHover={{ filter: `drop-shadow(2px 4px 6px ${red})`, background: 'transparent' }}
          whileTap={{
            filter: `drop-shadow(2px 4px 6px ${orange})`,
            background: 'transparent',
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
