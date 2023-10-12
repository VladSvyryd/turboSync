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
