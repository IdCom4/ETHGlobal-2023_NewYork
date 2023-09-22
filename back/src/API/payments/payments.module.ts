import { Module } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { PaymentsController } from './payments.controller'
import { StripePaymentAPI } from '@/common/external-service-providers-api/payment/payment.api'
import { UserRepository } from '@/repositories'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '@/schemas/user'

@Module({
  imports: [TypegooseModule.forFeature([User])],
  exports: [PaymentsService, { provide: 'PaymentAPI', useClass: StripePaymentAPI }],
  controllers: [PaymentsController],
  providers: [{ provide: 'PaymentAPI', useClass: StripePaymentAPI }, PaymentsService, UserRepository],
})
export class PaymentsModule {}
