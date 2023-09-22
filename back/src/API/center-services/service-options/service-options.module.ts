import { Module } from '@nestjs/common'
import { ServiceOptionsController } from '@Api/center-services/service-options/service-options.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { ServiceOption } from '@/schemas/center-service/service-option/service-option.schema'
import { ServiceOptionsService } from '@Api/center-services/service-options/service-options.service'
import { ServiceOptionRepository } from '@/repositories/service-option.repository'

@Module({
  imports: [TypegooseModule.forFeature([ServiceOption])],
  controllers: [ServiceOptionsController],
  providers: [ServiceOptionsService, ServiceOptionRepository],
})
export class ServiceOptionsModule {}
