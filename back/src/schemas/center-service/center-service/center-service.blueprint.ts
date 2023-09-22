import { CenterService, PricesByVehicleType } from '@Schemas/center-service'
import { BoxCategories } from '@Common/enums/schemas/box.schema.enum'
import { PublicFile } from '@Schemas/common/pojos'
import mongoose from 'mongoose'

/**
 * [CenterService](./center-service.schema.ts)
 *
 * Blueprints are used to ensure that the properties's name are well written when used within mongo's queries.
 * Those models must be kept up to date with their schema counterpart
 */
export abstract class CenterServiceBlueprint extends CenterService {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  _title: string
  _subtitle: string
  _optionIds: string[]
  _prices: PricesByVehicleType
  _categories: BoxCategories[]
  _description: string
  _numberOfSales: number
  _isActive: boolean
  _picture: PublicFile
  _deletedAt: Date
}
