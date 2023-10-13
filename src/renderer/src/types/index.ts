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
  PRINT = 'PRINT',
  LINK = 'LINK',
  SIGNPAD = 'SIGNPAD'
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
