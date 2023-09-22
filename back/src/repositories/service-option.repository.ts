import { ServiceOption, ServiceOptionBlueprint } from '@/schemas/center-service/service-option'
import { Injectable } from '@nestjs/common'
import { AbstractBaseRepository } from '@/repositories/base/abstract.repository'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'

@Injectable()
export class ServiceOptionRepository extends AbstractBaseRepository<ServiceOption, ServiceOptionBlueprint> {
  constructor(@InjectModel(ServiceOption) model: ReturnModelType<typeof ServiceOption>) {
    super(model, ServiceOption)
  }
}
