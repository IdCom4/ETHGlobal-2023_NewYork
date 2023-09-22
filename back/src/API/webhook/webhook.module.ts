import { Module } from '@nestjs/common'
import { PaymentsModule } from '@/API/payments/payments.module'
import { BookingsModule } from '../bookings/bookings.module'
import { WebhookService } from './webhook.service'
import { WebhookController } from './webhook.controller'
import { MissionsModule } from '../missions/missions.module'
import { ProfessionalsModule } from '../professionals/professionals.module'

@Module({
  imports: [BookingsModule, MissionsModule, PaymentsModule, ProfessionalsModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
