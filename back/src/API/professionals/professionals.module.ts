import { Module } from '@nestjs/common'
import { ProfessionalsController } from '@Api/professionals/professionals.controller'
import { ProfessionalsService } from '@Api/professionals/professionals.service'
import { ProfessionalRepository } from '@/repositories'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '@Schemas/user'
import { ProfessionalProfileUpdater } from '@Common/data-updaters/professionnal-profile.updater'
import { MapAPIModule } from '@/common/external-service-providers-api'
import { JWTModule } from '@/common/auth/strategies'
import { HostedFilesModule } from '@Api/hosted-files/hosted-files.module'

@Module({
  imports: [TypegooseModule.forFeature([User]), HostedFilesModule, JWTModule, MapAPIModule],
  exports: [ProfessionalsService, ProfessionalRepository],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService, ProfessionalRepository, ProfessionalProfileUpdater],
})
export class ProfessionalsModule {}
