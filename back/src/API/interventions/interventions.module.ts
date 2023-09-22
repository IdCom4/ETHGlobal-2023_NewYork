import { Module } from '@nestjs/common'
import { InterventionsController } from './interventions.controller'
import { InterventionsService } from './interventions.service'
import { Intervention } from '@Schemas/intervention'
import { TypegooseModule } from 'nestjs-typegoose'
import { InterventionRepository } from '@/repositories'

@Module({
  imports: [TypegooseModule.forFeature([Intervention])],
  exports: [InterventionsService, InterventionRepository, TypegooseModule.forFeature([Intervention])],
  controllers: [InterventionsController],
  providers: [InterventionsService, InterventionRepository],
})
export class InterventionsModule {}
