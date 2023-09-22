import { MissionRepository } from '@/repositories/mission.repository'
import { Mission } from '@/schemas/mission'
import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { MissionsController } from './missions.controller'
import { MissionsService } from './missions.service'
import { SendGridMailAPI } from '@/common/external-service-providers-api'
import { ProfessionalsModule } from '@Api/professionals/professionals.module'
import { HostedFilesModule } from '@Api/hosted-files/hosted-files.module'
import { VehicleBrandsModule } from '@Api/vehicles/brands/vehicle-brands.module'
import { VehiclesModule } from '@Api/vehicles/vehicles.module'
import { UsersModule } from '@Api/users/users.module'
import { IssuesModule } from '@Api/issues/issues.module'
import { PaymentsModule } from '@Api/payments/payments.module'
import { InvoicesModule } from '../invoices/invoices.module'

@Module({
  imports: [
    TypegooseModule.forFeature([Mission]),
    IssuesModule,
    ProfessionalsModule,
    UsersModule,
    HostedFilesModule,
    VehiclesModule,
    VehicleBrandsModule,
    PaymentsModule,
    InvoicesModule,
  ],
  exports: [MissionsService, MissionRepository],
  providers: [MissionsService, MissionRepository, { provide: 'MailAPI', useClass: SendGridMailAPI }],
  controllers: [MissionsController],
})
export class MissionsModule {}
