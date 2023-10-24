import axios, { AxiosError } from 'axios'
import { useSettingsStore } from '../store'
import { Patient, Template } from '../types'
import { execToast } from '../App'

export const ServerApi = axios.create({
  baseURL: `http://${useSettingsStore.getState().apiBaseUrl}`,
  headers: {
    'Content-Type': 'application/json'
  }
})
export const fetcherUserBeforeQuery = async (url: string, options?: RequestInit) => {
  const { data } = await window.api.getActivePatient()
  const createQueryParams = new URL(url)
  createQueryParams.searchParams.append('id', data.id)
  createQueryParams.searchParams.append('firstName', data.firstName)
  createQueryParams.searchParams.append('secondName', data.secondName)
  createQueryParams.searchParams.append('street', data.street)
  createQueryParams.searchParams.append('zip', data.zip)
  createQueryParams.searchParams.append('birthday', data.birthday)
  createQueryParams.searchParams.append('city', data.city)
  createQueryParams.searchParams.append('gender', data.gender)
  createQueryParams.searchParams.append('houseNumber', data.houseNumber)
  const res = await fetch(createQueryParams, options)

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

const handleAxiosError = (e: any) => {
  if (e instanceof AxiosError) {
    execToast({
      description: e?.response?.statusText ?? 'Fehler beim Verschieben der Vorlage.'
    })
    console.log(e?.response?.data?.error ?? 'No Error from BE')
  }
  console.log('Unknown Error', e)
}
