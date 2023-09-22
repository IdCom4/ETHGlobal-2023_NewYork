import { BoxCategories, BoxTypes } from '@Common/enums/schemas'
import { WeekOpeningHours } from '@Schemas/center/pojos'
import { StrictAddressBlueprint } from '@Schemas/common/pojos'
import { BookingReferenceBlueprint, Formula } from './pojos'
import { Box } from '@Schemas/box/box.schema'

/**
 * [Box](./box.schema.ts)
 *
 * Blueprints are used to ensure that the properties's name are well written when used within mongo's queries.
 * Those models must be kept up to date with their schema counterpart
 */
export abstract class BoxBlueprint extends Box {
  public _name: string
  public _description: string
  public _category: BoxCategories
  public _type: BoxTypes
  public _centerId: string
  public _openingHours: WeekOpeningHours
  public _location: StrictAddressBlueprint
  public _controllerId?: string
  public _isAvailable: boolean
  public _formulas: Formula[]
  public _shortAvailabilityPriority: boolean
  public _bookingsRef: BookingReferenceBlueprint[]
  public _deletedAt?: Date
  public createdAt: Date
  public updatedAt: Date
}
