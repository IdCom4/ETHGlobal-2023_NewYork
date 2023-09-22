import { Booking } from '@/schemas/booking'
import { DateTimeRange } from '@/schemas/common/pojos'
import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'

export class BookingReference {
  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'bookingId' })
  protected _bookingId: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'bookerName' })
  protected _bookerName: string

  @prop({ type: DateTimeRange, required: true })
  @Type(() => DateTimeRange)
  @Expose({ name: 'dateTimeRange' })
  protected _dateTimeRange: DateTimeRange

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get bookingId():     string    { return this._bookingId      }
  public get bookerName():    string    { return this._bookerName     }
  public get dateTimeRange(): DateTimeRange { return this._dateTimeRange  }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */

  /* >==== MAIN METHODS ====> */
  public isYetToCome(): boolean {
    return this._dateTimeRange.begin.isAfter(new Date())
  }

  public static of(booking: Booking): BookingReference {
    const bookingReference = new BookingReference()

    bookingReference._bookingId = booking._id.toString()
    bookingReference._bookerName = `${booking.booker.name} ${booking.booker.lastName}`
    bookingReference._dateTimeRange = DateTimeRange.of(booking.dateTimeRange.begin, booking.dateTimeRange.end)

    return bookingReference
  }
}

export abstract class BookingReferenceBlueprint extends BookingReference {
  public _bookingId: string
  public _bookerName: string
  public _dateTimeRange: DateTimeRange
}
