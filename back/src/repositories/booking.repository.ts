import { Booking, BookingBlueprint, OnlineUserBooking } from '@/schemas/booking'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { Injectable } from '@nestjs/common'
import { AbstractBaseRepository } from '@/repositories/base/abstract.repository'
import { InstantiatingDataWrapper } from '@Common/classes'

@Injectable()
export class BookingRepository extends AbstractBaseRepository<Booking, BookingBlueprint> {
  constructor(@InjectModel(Booking) model: ReturnModelType<typeof Booking>) {
    super(model, Booking)
  }

  public findByBookerId(bookerId: string): InstantiatingDataWrapper<Promise<Booking[]>, Booking> {
    return this.findMany({ '_booker._id': bookerId })
  }

  public findByBookingIdAndBookerId(bookingId: string, bookerId: string): InstantiatingDataWrapper<Promise<OnlineUserBooking>, OnlineUserBooking> {
    return this.findBy({ _id: bookingId, '_booker._id': bookerId }) as InstantiatingDataWrapper<Promise<OnlineUserBooking>, OnlineUserBooking>
  }

  public findAllByBoxId(id: string): InstantiatingDataWrapper<Promise<Booking[]>, Booking> {
    return this.findMany({ _valueBoxId: id })
  }

  public findByPaymentIntentId(paymentIntentId: string): InstantiatingDataWrapper<Promise<Booking>, Booking> {
    return this.findBy({ '_booker._paymentIntentId': paymentIntentId })
  }
}
