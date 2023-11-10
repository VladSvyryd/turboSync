import { FunctionComponent, useEffect, useState } from 'react'

import { Stack } from '@chakra-ui/react'
import { useSettingsStore } from '../../store'
import useSWR from 'swr'
import { Patient, TemplateEvaluationStatus } from '../../types'
import { usePatientStore } from '../../store/PatientStore'
import { fetcherTemplateQuery } from '../../api'
import { fetchStatusUrl } from '../../types/variables'
import StatusButton from '../../components/Buttons/StatusButton'
interface OwnProps {}

type Props = OwnProps
const fetchActivePatient = async () => {
  return window.api.getActivePatient()
}

const index: FunctionComponent<Props> = () => {
  const { apiBaseUrl } = useSettingsStore()
  const { patient, setPatient, status, setStatus } = usePatientStore()
  const [isDragged, setIsDragged] = useState(false)
  const { isValidating: userLoading } = useSWR<{
    data?: Patient
    error?: string
  }>('getActivePatient', fetchActivePatient, {
    refreshInterval: 1000,
    onSuccess: async (data) => {
      if (data.error) {
        console.log('error', data.error)
      }
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
  const openSettings = () => {
    window.api.openNewWindow('settings')
  }
  const opentTamplates = () => {
    window.api.openNewWindow('templates')
  }

  useEffect(() => {
    if (apiBaseUrl === '') {
      openSettings()
    }
    window.api.onWindowIsDragged((_, { isDragged }) => {
      setIsDragged(isDragged)
    })
  }, [apiBaseUrl])
  return (
    <Stack justifyContent={'center'} alignItems={'center'} height={'100%'} overflow={'hidden'}>
      <Stack>
        <StatusButton
          status={status}
          isDragged={isDragged}
          loading={userLoading || statusLoading}
          onClick={() => {
            if (apiBaseUrl === '') {
              openSettings()
              return
            }
            opentTamplates()
          }}
        />
      </Stack>
    </Stack>
  )
}

export default index
