import axios, { AxiosError } from 'axios'
import { useSettingsStore } from '../store'
import { Patient, Template, TemplateEvaluationStatus } from '../types'
import { execToast } from '../App'

export const ServerApi = axios.create({
  baseURL: `http://${useSettingsStore.getState().apiBaseUrl}`,
  headers: {
    'Content-Type': 'application/json'
  }
})

const createUrlWithOption = (url: string, patient?: Patient) => {
  if (!patient) return url
  const linkWithPatient = new URL(url)
  linkWithPatient.searchParams.append('id', patient.id)
  linkWithPatient.searchParams.append('firstName', patient.firstName)
  linkWithPatient.searchParams.append('secondName', patient.secondName)
  linkWithPatient.searchParams.append('street', patient.street)
  linkWithPatient.searchParams.append('zip', patient.zip)
  linkWithPatient.searchParams.append('birthday', patient.birthday)
  linkWithPatient.searchParams.append('city', patient.city)
  linkWithPatient.searchParams.append('gender', patient.gender)
  linkWithPatient.searchParams.append('houseNumber', patient.houseNumber)
  return linkWithPatient
}

export const fetcherTemplateQuery = async ({
  url,
  args
}: {
  url: string
  args?: Patient
}): Promise<any> => {
  const res = await fetch(createUrlWithOption(url, args))

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const errorResult = await res.json()
    console.log(res)
    const error = new Error(
      errorResult?.error ?? 'An error occurred while fetching the data.'
    ) as any
    // Attach extra info to the error object.
    error.status = res.status
    throw error
  }
  return res.json()
}
export const fetcherQuery = async (url: string, options?: RequestInit): Promise<any> => {
  const res = await fetch(url, options)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const errorResult = await res.json()
    console.log(res)
    const error = new Error(
      errorResult?.error ?? 'An error occurred while fetching the data.'
    ) as any
    // Attach extra info to the error object.
    error.status = res.status
    throw error
  }
  return res.json()
}

export const handleMoveTemplate = async (
  uuid: Template['uuid'],
  to: Template['signType'],
  finallyCb?: () => void
) => {
  try {
    await ServerApi.put(`/api/moveTemplate`, {
      uuid,
      to
    })
  } catch (e) {
    handleAxiosError(e)
  } finally {
    if (finallyCb) finallyCb()
  }
}
export const handleDeleteTemplate = async (uuid: Template['uuid'], finallyCb?: () => void) => {
  try {
    await ServerApi.delete(`/api/deleteTemplate`, {
      data: {
        uuid
      }
    })
  } catch (e) {
    handleAxiosError(e)
  } finally {
    if (finallyCb) finallyCb()
  }
}
export const getTemplatePdfPreview = async (
  uuid: Template['uuid'],
  data?: Patient,
  finallyCb?: () => void
) => {
  try {
    const res = await ServerApi.post<{ networkPath: string }>(`/api/createPreviewPdf`, {
      uuid,
      ...data
    })
    return res.data.networkPath
  } catch (e) {
    handleAxiosError(e)
    return null
  } finally {
    if (finallyCb) finallyCb()
  }
}
export const getTemplateWordPreview = async (
  uuid: Template['uuid'],
  data?: Patient,
  finallyCb?: () => void
) => {
  try {
    const res = await ServerApi.post<{ networkPath: string }>(`/api/createPreviewWord`, {
      uuid,
      ...data
    })
    return res.data.networkPath
  } catch (e) {
    handleAxiosError(e)
    return null
  } finally {
    if (finallyCb) finallyCb()
  }
}
export const deleteTemplatePdfPreview = async (path: Template['uuid']) => {
  try {
    const res = await ServerApi.delete(`/api/deletePreviewPdf`, {
      data: { path }
    })
    return res.data.networkPath
  } catch (e) {
    handleAxiosError(e)
    return null
  }
}

export const updateTemplate = async (template: Template, finallyCb?: () => void) => {
  try {
    await ServerApi.put(`/api/updateTemplate`, template)
  } catch (e) {
    handleAxiosError(e)
  } finally {
    if (finallyCb) finallyCb()
  }
}
export const getTestPrintFile = async (finallyCb?: () => void) => {
  try {
    return (await ServerApi.get<{ path: string }>(`/api/printTest`)).data
  } catch (e) {
    handleAxiosError(e)
    return null
  } finally {
    if (finallyCb) finallyCb()
  }
}

export const getCheckDocStatus = async (finallyCb?: () => void) => {
  try {
    return (await ServerApi.get<{ status: TemplateEvaluationStatus }>(`/api/checkDocStatus`)).data
  } catch (e) {
    handleAxiosError(e)
    return null
  } finally {
    if (finallyCb) finallyCb()
  }
}

export const handleCancelDocuments = async (
  uuid: Template['uuid'],
  data?: Patient,
  size?: number,
  finallyCb?: () => void
) => {
  try {
    await ServerApi.post(`/api/cancelDocuments`, {
      uuid,
      ...data,
      size
    })
  } catch (e) {
    handleAxiosError(e)
  } finally {
    if (finallyCb) finallyCb()
  }
}

const handleAxiosError = (e: any) => {
  if (e instanceof AxiosError) {
    console.log(e)
    execToast({
      description:
        e?.response?.data?.error ??
        e?.response?.statusText ??
        'Unterbrochene Verbindung mit dem Server'
    })
  }
  console.log('Unknown Error', e)
}
