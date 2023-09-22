import { BookingTypes, PaymentStatuses } from '@/common/enums'
import { Booking, BookingQuote } from '@/schemas/booking'
import { Box } from '@/schemas/box'
import { Center } from '@/schemas/center'
import { User } from '@/schemas/user'
import { BookingBookerResponse } from './pojos/booking-booker.dto'
import { BookingBoxResponse } from './pojos/booking-box.dto'
import { BookingCenterResponse } from './pojos/booking-center.dto'

export class BookingToAdminResponse {
  _id: string

  valueBox: BookingBoxResponse
  valueCenter: BookingCenterResponse

  booker: BookingBookerResponse
  needAdvices: boolean

  from: Date

  to: Date

  createdAt: Date

  type: BookingTypes
  paymentStatus: PaymentStatuses
  invoiceId?: string

  vmcService: boolean
  vmcWorkerId?: string
  vmcWorkerName?: string

  quote: BookingQuote

  goal?: string
  teamComment?: string

  isCancelled: boolean
  cancelledBy?: string
  validated?: boolean

  constructor(booking: Booking, box: Box, center: Center, vmcWorker?: User) {
    this._id = booking._id.toString()
    this.valueBox = new BookingBoxResponse(box)
    this.valueCenter = new BookingCenterResponse(center)
    this.booker = new BookingBookerResponse(booking.booker)
    this.needAdvices = !!booking.needAdvices
    this.from = booking.from
    this.to = booking.to
    this.createdAt = booking.getCreatedAt()
    this.type = booking.bookingType
    this.paymentStatus = booking.paymentStatus
    this.invoiceId = booking.invoiceId
    this.vmcService = booking.vmcService
    this.vmcWorkerId = booking.vmcWorkerId
    this.vmcWorkerName = vmcWorker ? `${vmcWorker.name} ${vmcWorker.lastName}` : undefined
    this.quote = booking.quote
    this.goal = booking.goal
    this.teamComment = booking.teamComment
    this.isCancelled = booking.isCanceled()
    this.cancelledBy = booking.canceledBy
    this.validated = booking.validated
  }
}
