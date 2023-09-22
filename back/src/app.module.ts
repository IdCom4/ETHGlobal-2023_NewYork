import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'

import { AuthModule } from '@Api/auth/auth.module'
import { ProfessionalsModule } from '@Api/professionals/professionals.module'
import { UsersModule } from '@Api/users/users.module'
import { PaymentsModule } from '@Api/payments/payments.module'
import { CenterServicesModule } from '@Api/center-services/center-services/center-services.module'
import { CentersModule } from '@/API/centers/centers.module'
import { BoxesModule } from '@Api/boxes/boxes.module'
import { PromoCodesModule } from '@Api/promo-code/promo-code.module'
import { BookingsModule } from '@Api/bookings/bookings.module'
import { ServiceOptionsModule } from '@Api/center-services/service-options/service-options.module'
import { SkillsModule } from '@Api/skills/skills.module'
import { ScheduleModule } from '@nestjs/schedule'
import * as process from 'process'
import { InvoicesModule } from '@Api/invoices/invoices.module'
import { WebhookModule } from '@Api/webhook/webhook.module'
import { VehiclesModule } from '@Api/vehicles/vehicles.module'
import { IssuesModule } from '@Api/issues/issues.module'
import { MissionsModule } from './API/missions/missions.module'
import { InterventionsModule } from './API/interventions/interventions.module'

const ENV_FOLDER = 'envs'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${ENV_FOLDER}/.${process.env.NODE_ENV}.env`, `${ENV_FOLDER}/.env`],
      isGlobal: true,
    }),
    TypegooseModule.forRoot(<string>process.env.DB_URI),
    ScheduleModule.forRoot(),
    AuthModule,
    BookingsModule,
    BoxesModule,
    CenterServicesModule,
    CentersModule,
    MissionsModule,
    UsersModule,
    PaymentsModule,
    ProfessionalsModule,
    IssuesModule,
    CentersModule,
    BoxesModule,
    BookingsModule,
    PromoCodesModule,
    ServiceOptionsModule,
    InvoicesModule,
    SkillsModule,
    InterventionsModule,
    VehiclesModule,
    WebhookModule,
  ],
  providers: [],
})
export class AppModule {}
