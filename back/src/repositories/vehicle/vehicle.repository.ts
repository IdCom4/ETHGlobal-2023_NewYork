import { Vehicle } from '@Schemas/vehicle/vehicle.schema'
import { VehicleBlueprint } from '@Schemas/vehicle/vehicle.blueprint'
import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { AbstractSoftDeletableRepository } from '@/repositories/base/abstract.repository'

@Injectable()
export class VehicleRepository extends AbstractSoftDeletableRepository<Vehicle, VehicleBlueprint> {
  constructor(@InjectModel(Vehicle) model: ReturnModelType<typeof Vehicle>) {
    super(model, Vehicle)
  }
}
