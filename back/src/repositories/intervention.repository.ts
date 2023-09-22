import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { Injectable } from '@nestjs/common'
import { AbstractBaseRepository } from '@/repositories/base/abstract.repository'
import { Intervention, InterventionBlueprint } from '@/schemas/intervention'

@Injectable()
export class InterventionRepository extends AbstractBaseRepository<Intervention, InterventionBlueprint> {
  constructor(@InjectModel(Intervention) model: ReturnModelType<typeof Intervention>) {
    super(model, Intervention)
  }
}
