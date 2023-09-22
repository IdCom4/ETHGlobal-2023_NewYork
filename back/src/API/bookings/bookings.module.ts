import { BookingRepository } from '@/repositories'
import { Booking } from '@/schemas/booking'
import { Module } from '@nestjs/common/decorators'
import { TypegooseModule } from 'nestjs-typegoose'
import { BookingsController } from './bookings.controller'
import { BookingsService } from './bookings.service'
import { SendGridMailAPI } from '@/common/external-service-providers-api'
import { TrackerDispatcher } from '@/common/external-service-providers-api/tracker'
import { PromoCodesModule } from '@Api/promo-code/promo-code.module'
import { PaymentsModule } from '@Api/payments/payments.module'
import { CentersModule } from '@Api/centers/centers.module'
import { BoxesModule } from '@Api/boxes/boxes.module'
import { UsersModule } from '@Api/users/users.module'

@Module({
  imports: [BoxesModule, CentersModule, PromoCodesModule, PaymentsModule, UsersModule, TypegooseModule.forFeature([Booking])],
  exports: [BookingsService, BookingRepository, TypegooseModule.forFeature([Booking])],
  providers: [BookingsController, BookingsService, BookingRepository, TrackerDispatcher, { provide: 'MailAPI', useClass: SendGridMailAPI }],
  controllers: [BookingsController],
})
export class BookingsModule {}
