import { ServerApi } from '../api'

export const ModalOverlayStyle = {
  bg: 'transparent',
  backdropFilter: 'blur(1px)'
}

export const fetchTemplatesUrl = `${ServerApi.getUri()}/api/templates`
export const fetchPrintTextPath = `${ServerApi.getUri()}/api/printTest`
