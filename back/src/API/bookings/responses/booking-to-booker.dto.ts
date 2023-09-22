import { Booking, BookingQuote } from '@/schemas/booking'
import { Box } from '@/schemas/box'
import { Center } from '@/schemas/center'
import { BookingBoxResponse } from './pojos/booking-box.dto'
import { BookingCenterResponse } from './pojos/booking-center.dto'

export class BookingToBookerResponse {
  id: string

  billingName: string

  valueBox: BookingBoxResponse
  valueCenter: BookingCenterResponse

  goal?: string

  from: Date

  to: Date

  createdAt: Date

  quote: BookingQuote
  invoiceId?: string

  isCancelled: boolean
  cancelledBy?: string

  validated?: boolean

  constructor(booking: Booking, box: Box, center: Center) {
    this.id = booking._id.toString()
    this.billingName = booking.booker.billingName
    this.valueBox = new BookingBoxResponse(box)
    this.valueCenter = new BookingCenterResponse(center)
    this.goal = booking.goal
    this.from = booking.from
    this.to = booking.to
    this.createdAt = booking.getCreatedAt()
    this.quote = booking.quote
    this.invoiceId = booking.invoiceId
    this.isCancelled = booking.isCanceled()
    this.cancelledBy = booking.canceledBy
    this.validated = booking.validated
  }
}
