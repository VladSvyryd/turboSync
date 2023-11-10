import Store, { Schema } from 'electron-store'

export type Patient = {
  id: string
  firstName: string | undefined
  secondName: string | undefined
  city: string | undefined
  zip: string | undefined
  street: string | undefined
  houseNumber: string | undefined
  birthday: string //Date  | undefined
  gender: string //Date  | undefined
}
interface StoreSchema {
  patient: Patient
  apiBaseUrl: string
  socketConnected: boolean
  turbomedConnected: boolean
}
const storeSchema: Schema<StoreSchema> = {
  patient: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      firstName: { type: 'string' },
      secondName: { type: 'string' },
      city: { type: 'string' },
      zip: { type: 'string' },
      street: { type: 'string' },
      houseNumber: { type: 'string' },
      birthday: { oneOf: [{ type: 'string' }, { type: 'null' }] },
      gender: { type: 'string' }
    }
  },
  apiBaseUrl: {
    type: 'string',
    default: ''
  },
  socketConnected: {
    type: 'boolean',
    default: false
  },
  turbomedConnected: {
    type: 'boolean',
    default: false
  }
}
export const store = new Store<StoreSchema>({
  schema: storeSchema
})

// console.log(store.clear())
console.log(store.store)
