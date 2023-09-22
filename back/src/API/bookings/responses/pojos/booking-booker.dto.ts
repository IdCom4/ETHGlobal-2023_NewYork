import { Booker } from '@/schemas/booking'

export class BookingBookerResponse {
  id?: string
  name: string
  lastName: string
  phone: string
  email?: string
  billingName?: string

  constructor(booker: Booker) {
    this.id = booker.id?.toString()
    this.name = booker.name
    this.lastName = booker.lastName
    this.email = booker.email
    this.phone = booker.phone
    this.billingName = booker.billingName
  }
}
