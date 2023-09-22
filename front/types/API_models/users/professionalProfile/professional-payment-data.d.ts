export enum ProfessionalPaymentDataStatuses {
  EMPTY = 'EMPTY',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

declare global {
  interface IProfessionalPaymentData {
    iban?: string
    documentationType?: string
    additionalDocumentation: boolean
    pastDue?: string[]
    status: ProfessionalPaymentDataStatuses
    accountId: string
    errors: Array<string>
  }
}
