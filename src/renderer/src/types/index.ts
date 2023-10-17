export type Patient = {
  id: string
  firstName: string
  secondName: string
  city: string
  zip: string
  street: string
  houseNumber: string
  birthday: string
  gender: string
}

export enum SignType {
  LINK = 'LINK',
  SIGNPAD = 'SIGNPAD',
  PRINT = 'PRINT'
}

export type DocFile = {
  name: string
  path: string
  networkPath: string
}

export enum ConditionOption {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNDER18 = 'UNDER18',
  RETIRED = 'RETIRED'
}

export type TemplateWithFile = {
  templateInfo: {
    id: string
    title: string
    requiredCondition: Array<ConditionOption> | null
    signType: SignType
  }
  file: File
}

export type ResponseFolder = {
  signType: SignType
  templates: Array<Template & { networkPath: string }>
}

export type Template = {
  id: number
  uuid: string
  createdAt: Date
  updatedAt: Date
  path: string
  title: string
  deleted: boolean
  requiredCondition: ConditionOption[]
  signType: SignType
  networkPath: string
  noFile: boolean
}

export enum ContextMenuKey {
  OPEN = 'OPEN',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  MOVE = 'MOVE',
  UPLOAD = 'UPLOAD',
  PREVIEW = 'PREVIEW'
}

export const InternalErrorNumber = {
  FILE_NOT_FOUND: '404'
}
export const InternalErrors = {
  code: InternalErrorNumber.FILE_NOT_FOUND,
  title: 'Not Found'
}
