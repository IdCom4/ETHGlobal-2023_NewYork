import { Vehicle } from '@Schemas/vehicle/vehicle.schema'

export abstract class VehicleBlueprint extends Vehicle {
  createdAt: Date
  updatedAt: Date
  _deletedAt?: Date
  _ownerId: string
  _model: string
  _brandId: string
  _year: number
  _plate: string
  _mileage: number
  _invoiceIds: string[]
}
