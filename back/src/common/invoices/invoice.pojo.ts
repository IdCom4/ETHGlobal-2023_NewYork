import { BoxCategories } from '@Common/enums'

export interface BookingInvoiceData {
  invoiceNumber: number
  bookerName: string
  valueboxCategory: BoxCategories
  valuecenterName: string
  duration: string
  totalBeforeTVA: number
  quoteTotal: number
  quoteTVA: number
}
export interface MissionInvoiceVariables {
  invoiceNumber: number
  todayDate: string
  vehicle: string
  /* workPlaceHours: string
  workPlacePrice: string
  workPlaceTotal: string */
  professionalName: string
  professionalStreet: string
  professionalZipCodeAndCity: string
  clientName: string
  clientStreet: string
  clientZipCodeAndCity: string
  mileage: number
  placeAndEquipments: string
  workForces: string
  consumables: string
  tvaMessage: string
  totalHT: string
  TVAOnly: string
  totalTTC: string
}

export interface MonthlyInvoiceVariables {
  INVOICE_NUMBER: 'INVOICE_NUMBER'
  TODAY_DATE: 'TODAY_DATE'
  PROFESSIONAL_NAME: 'PROFESSIONAL_NAME'
  PROFESSIONAL_STREET: 'PROFESSIONAL_STREET'
  PROFESSIONAL_ZIP_CODE_AND_CITY: 'PROFESSIONAL_ZIP_CODE_AND_CITY'
  FROM_DATE: 'FROM_DATE'
  TO_DATE: 'TO_DATE'

  TOTAL_MISSIONS: 'TOTAL_MISSIONS'
  TOTAL_COMMISSIONS: 'TOTAL_COMMISSIONS'
  TOTAL_INCOME: 'TOTAL_INCOME'
  TVA_MESSAGE: 'TVA_MESSAGE'
  TOTAL_HT: 'TOTAL_HT'
  QUOTE_TVA_ONLY: 'QUOTE_TVA_ONLY'
  QUOTE_TOTAL_TTC: 'QUOTE_TOTAL_TTC'
}
