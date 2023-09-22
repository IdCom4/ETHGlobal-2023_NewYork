import { Sex } from '@Common/enums'
import { LenientAddressDTO, StrictAddressDTO } from '@Common/request-io/request-dto'

export {}

declare global {
  type TSex = 'M' | 'W' | 'X'

  type TUpdateUserAccountData = {
    name?: string
    lastName?: string
    phone?: string
    sex?: Sex
    birthday?: Date
    picture?: TBase64File
    billingAddress?: LenientAddressDTO
    homeAddress?: StrictAddressDTO
  }
}
