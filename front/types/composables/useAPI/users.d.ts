export {}

declare global {
  export interface IUpdateProfileRequest {
    name?: string
    lastName?: string
    phone?: string
    email?: string
    sex?: Sexes
    birthday?: string
    homeAddress?: IAddress
    billingAddress?: IAddress
    picture?: TBase64File
  }
}
