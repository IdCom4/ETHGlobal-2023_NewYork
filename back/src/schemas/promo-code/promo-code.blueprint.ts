import { DateTimeRange } from '@Schemas/common/pojos'
import { ContactInfo } from './pojos/contact-info'
import { PromoCode } from '@Schemas/promo-code/promo-code.schema'
import mongoose from 'mongoose'

/**
 * [PromoCode](./promo-code.schema.ts)
 *
 * Blueprints are used to ensure that the properties's name are well written when used within mongo's queries.
 * Those models must be kept up to date with their schema counterpart
 */
export abstract class PromoCodeBlueprint extends PromoCode {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date

  _label: string

  _beneficiary: ContactInfo
  _dateTimeRange: DateTimeRange

  _totalNbrUsages: number

  _beneficiaryCommissionPercentage: number
  _reductionPercentage: number

  // total bookings
  _totalBookingsTTC: number

  // total beneficiary commission
  _totalBeneficiaryCommissionTTC: number

  // total VMC sold HT
  _totalVMCSoldHT: number

  _alreadyUsedBy: string[]
  _bookingsUsedOn: string[]

  _canceledAt?: Date
}
