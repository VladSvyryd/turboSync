import axios, { AxiosError } from 'axios'
import { useSettingsStore } from '../store'
import { TemplateType } from '../types'
import { execToast } from '../App'

export const ServerApi = axios.create({
  baseURL: `http://${useSettingsStore.getState().apiBaseUrl}`,
  headers: {
    'Content-Type': 'application/json'
  }
})
export const fetcherWithQuery = async (url: string, options?: RequestInit) => {
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
  uuid: TemplateType['uuid'],
  to: TemplateType['signType'],
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
export const handleDeleteTemplate = async (uuid: TemplateType['uuid'], finallyCb?: () => void) => {
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

const handleAxiosError = (e: any) => {
  if (e instanceof AxiosError) {
    execToast({
      description: e?.response?.statusText ?? 'Fehler beim Verschieben der Vorlage.'
    })
    console.log(e?.response?.data?.error ?? 'No Error from BE')
  }
  console.log('Unknown Error', e)
}
