import { DateTimeRange } from '@Schemas/common/pojos'
import { BookingQuote } from './pojos/booking-quote'
import { Booker } from './pojos/booker'
import { BookingTypes, PaymentStatuses } from '@/common/enums'
import mongoose from 'mongoose'
import { Booking } from '@Schemas/booking/booking.schema'

/**
 * [Booking](./booking.schema.ts)
 *
 * Blueprints are used to ensure that the property names are well written when used within mongo's queries.
 * Those models must be kept up to date with their schema counterpart
 */
export abstract class BookingBlueprint extends Booking {
  // box data
  public _valueBoxId: string
  public _valueCenterId: string

  // if booking is a VMC service
  public _vmcService: boolean
  public _vmcWorkerId?: string

  // booker data
  public _booker: Booker
  public _needAdvices?: boolean

  // booking data
  public _bookingType: BookingTypes
  public _paymentStatus: PaymentStatuses
  public _dateTimeRange: DateTimeRange
  public _quote: BookingQuote
  public _promoCodeId?: string
  public _invoiceId?: string
  public _goal?: string
  public _teamComment?: string

  public _validated: boolean
  public _canceledAt?: Date
  public _canceledBy?: string
  public _id: mongoose.Types.ObjectId
  public createdAt: Date
  public updatedAt: Date
}
