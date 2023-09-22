export {}

declare global {
  interface IBookBoxPayloadLegacy {
    billingName: string
    name: string
    lastName: string
    email: string
    phone: number
    centerId: string
    boxCategory: TBoxCategory
    from: string //format : dd/MM/yyyy hh:mm
    to: string //format : dd/MM/yyyy hh:mm
    formula: IFormula
    bookingGoal: string
    needAdvices: boolean
    promoCodeLabel?: string
  }

  interface IBookBoxPayload {
    centerId: string
    boxCategory: TBoxCategory
    startingDay: string //format: dd/MM/yyyy
    beginHour: string //format: hh:mm
    formula: IFormula
    creditCardId: string
    promoCodeLabel?: string
  }

  interface IBookingResponse {
    id: string
    valueBoxId: string
    from: Date
    to: Date
    paymentStatus: PaymentProviderStatuses
    clientSecret?: string
  }
}
