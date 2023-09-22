export {}

declare global {
  interface ICompany {
    siret: string
    legalForm: string
    naf: string
    denomination: string
    legalAddress: IStrictAddress
  }
}
