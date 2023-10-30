import { FunctionComponent, useEffect, useState } from 'react'

import { IconButton, Stack, Text, useToken } from '@chakra-ui/react'
import { LiaFileSignatureSolid } from 'react-icons/lia'
import { useSettingsStore } from '../../store'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { Patient, TemplateEvaluationStatus } from '../../types'
import { usePatientStore } from '../../store/PatientStore'
import { fetcherTemplateQuery } from '../../api'
import { fetchStatusUrl } from '../../types/variables'
interface OwnProps {}

type Props = OwnProps
const fetchActivePatient = async () => {
  return window.api.getActivePatient()
}

const index: FunctionComponent<Props> = () => {
  const green1 = useToken('colors', 'green.200')
  const green = useToken('colors', 'green.400')
  const red = useToken('colors', 'red.400')
  const red1 = useToken('colors', 'red.200')
  const orange = useToken('colors', 'orange.400')
  const orange1 = useToken('colors', 'orange.200')
  const { apiBaseUrl } = useSettingsStore()
  const { patient, setPatient, status, setStatus } = usePatientStore()

  const [blockClicks, setBlockClicks] = useState(false)
  const { isValidating: userLoading } = useSWR<{
    data: Patient
  }>('getActivePatient', fetchActivePatient, {
    refreshInterval: 1000,
    onSuccess: async (data) => {
      setPatient(data.data)
    }
  })
  const { isValidating: statusLoading } = useSWR<{
    status: TemplateEvaluationStatus
  }>(patient ? { url: fetchStatusUrl, args: patient } : null, fetcherTemplateQuery, {
    refreshInterval: 1000,
    onSuccess: (data) => {
      console.log('data', data)
      setStatus(data.status)
    }
  })
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
  useEffect(() => {
    if (apiBaseUrl === '') {
      window.api.openNewWindow('settings')
    }
    window.api.onWindowIsDragged((_, { isDragged }) => {
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
          {'Loading' + String(userLoading || statusLoading)}
        </Text>
        <IconButton
          as={motion.button}
          whileHover={{ filter: `drop-shadow(2px 4px 6px ${red})` }}
          whileTap={{
            filter: `drop-shadow(2px 4px 6px ${orange})`,
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
            background: 'rgba(0, 0, 0, 0)!important',
            // maxWidth: 300,
            filter: 'drop-shadow(0px 0px 0px red)'
          }}
          icon={
            <>
              <svg height={0} width={0}>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#C6FFDD', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: iconColor.color1, stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: iconColor.color2, stopOpacity: 1 }} />
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
