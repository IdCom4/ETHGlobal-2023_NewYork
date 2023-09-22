import { CenterService } from '@Schemas/center-service/center-service'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { Injectable } from '@nestjs/common'
import { AbstractBaseRepository } from '@/repositories/base/abstract.repository'
import { CenterServiceBlueprint } from '@Schemas/center-service/center-service/center-service.blueprint'

@Injectable()
export class CenterServiceRepository extends AbstractBaseRepository<CenterService, CenterServiceBlueprint> {
  constructor(@InjectModel(CenterService) model: ReturnModelType<typeof CenterService>) {
    super(model, CenterService)
  }
}
