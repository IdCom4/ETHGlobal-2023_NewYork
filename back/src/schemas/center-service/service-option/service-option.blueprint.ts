import { PricesByVehicleType, ServiceOption } from '@Schemas/center-service'
import mongoose from 'mongoose'

/**
 * [ServiceOption](./service-option.schema.ts)
 *
 * Blueprints are used to ensure that the properties's name are well written when used within mongo's queries.
 * Those models must be kept up to date with their schema counterpart
 */
export abstract class ServiceOptionBlueprint extends ServiceOption {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  _title: string
  _extraPrices: PricesByVehicleType
}
