import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import { VehicleBrandBlueprint } from '@Schemas/vehicle/brand/vehicle-brand.blueprint'
import { Injectable } from '@nestjs/common'
import { AbstractSoftDeletableRepository } from '@/repositories/base/abstract.repository'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'

@Injectable()
export class VehicleBrandRepository extends AbstractSoftDeletableRepository<VehicleBrand, VehicleBrandBlueprint> {
  constructor(@InjectModel(VehicleBrand) model: ReturnModelType<typeof VehicleBrand>) {
    super(model, VehicleBrand)
  }
}
