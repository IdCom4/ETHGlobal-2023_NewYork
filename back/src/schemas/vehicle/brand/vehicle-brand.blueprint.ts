import { VehicleType } from '@Common/enums/schemas/vehicle-brand.schema.enum'
import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import mongoose from 'mongoose'

export abstract class VehicleBrandBlueprint extends VehicleBrand {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  _deletedAt?: Date
  _name: string
  _vehicleType: VehicleType
}
