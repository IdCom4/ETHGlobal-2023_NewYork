import { StrictAddress } from '@Schemas/common/pojos'
import { WeekOpeningHours } from './pojos'
import { Center } from '@Schemas/center/center.schema'
import mongoose from 'mongoose'

/**
 * [Center](./center.schema.ts)
 *
 * Blueprints are used to ensure that the properties's name are well written when used within mongo's queries.
 * Those models must be kept up to date with their schema counterpart
 */
export abstract class CenterBlueprint extends Center {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  _deletedAt?: Date
  _name: string
  _location: StrictAddress
  _openingHours: WeekOpeningHours
}
