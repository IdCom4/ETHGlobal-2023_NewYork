import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import { HostedFilesController } from '@Api/hosted-files/hosted-files.controller'
import { AWSS3API } from '@Common/external-service-providers-api/file-host/file-host.api'
import { HostedFileReferenceRepository } from '@/repositories/hosted-file-reference.repository'
import { ConfigService } from '@nestjs/config'
import { HostedFilesService } from './hosted-files.service'

@Module({
  imports: [TypegooseModule.forFeature([HostedFileReference])],
  controllers: [HostedFilesController],
  providers: [HostedFilesService, HostedFileReferenceRepository, ConfigService, { provide: 'FileHostAPI', useClass: AWSS3API }],
  exports: [HostedFilesService, HostedFileReferenceRepository],
})
export class HostedFilesModule {}
