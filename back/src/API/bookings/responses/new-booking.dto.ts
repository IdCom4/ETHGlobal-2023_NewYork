import { PaymentProviderStatuses } from '@/common/enums'
import { Booking } from '@/schemas/booking'
import { Expose } from 'class-transformer'

export class NewBookingResponse {
  @Expose()
  id: string

  @Expose()
  valueBoxId: string

  @Expose()
  from: Date

  @Expose()
  to: Date

  @Expose()
  paymentStatus: PaymentProviderStatuses

  @Expose()
  clientSecret?: string

  constructor(booking: Booking, paymentStatus: PaymentProviderStatuses, clientSecret?: string) {
    this.id = booking._id.toString()
    this.valueBoxId = booking.valueBoxId

    this.from = booking.dateTimeRange.begin
    this.to = booking.dateTimeRange.end

    this.paymentStatus = paymentStatus
    this.clientSecret = clientSecret
  }
}
