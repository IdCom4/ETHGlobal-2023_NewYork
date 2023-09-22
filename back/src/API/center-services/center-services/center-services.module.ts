import { Module } from '@nestjs/common'
import { CenterServicesController } from '@Api/center-services/center-services/center-services.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { CenterService } from '@Schemas/center-service/center-service'
import { CenterServicesService } from '@Api/center-services/center-services/center-services.service'
import { CenterServiceRepository } from '@/repositories/center-service.repository'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { AWSS3API } from '@Common/external-service-providers-api/file-host/file-host.api'
import { HostedFileReferenceRepository } from '@/repositories'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'

@Module({
  imports: [TypegooseModule.forFeature([CenterService, HostedFileReference])],
  controllers: [CenterServicesController],
  providers: [
    CenterServicesService,
    CenterServiceRepository,
    HostedFilesService,
    { provide: 'FileHostAPI', useClass: AWSS3API },
    HostedFileReferenceRepository,
  ],
})
export class CenterServicesModule {}
