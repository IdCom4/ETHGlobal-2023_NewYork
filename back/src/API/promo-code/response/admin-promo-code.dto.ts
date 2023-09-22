import { ContactInfo, PromoCode } from '@/schemas/promo-code'

export class AdminPromoCodeResponse {
  id: string
  label: string
  beneficiary: ContactInfo

  from: Date

  to: Date
  status: string

  totalNbrUsages: number

  reductionPercentage: number
  beneficiaryCommissionPercentage: number

  totalBookingsTTC: number
  totalBeneficiaryCommissionTTC: number
  totalVMCSoldeHT: number

  alreadyUsedBy: string[]
  bookingsUsedOn: string[]

  createdAt
  cancelledAt

  constructor(promoCode: PromoCode) {
    this.id = promoCode._id.toString()
    this.label = promoCode.label
    this.beneficiary = promoCode.beneficiary
    this.from = promoCode.dateTimeRange.begin
    this.to = promoCode.dateTimeRange.end
    this.status = promoCode.canceledAt
      ? 'Annulé'
      : promoCode.isActive()
      ? 'Actif'
      : promoCode.dateTimeRange.begin.isAfter(new Date())
      ? 'A venir'
      : 'Terminé'
    this.totalNbrUsages = promoCode.totalNbrUsages
    this.reductionPercentage = promoCode.reductionPercentage
    this.beneficiaryCommissionPercentage = promoCode.beneficiaryCommissionPercentage
    this.totalBookingsTTC = promoCode.totalBookingsTTC
    this.totalBeneficiaryCommissionTTC = promoCode.totalBeneficiaryCommissionTTC
    this.totalVMCSoldeHT = promoCode.totalVMCSoldHT
    this.alreadyUsedBy = promoCode.alreadyUsedBy
    this.bookingsUsedOn = promoCode.bookingsUsedOn
    this.createdAt = promoCode.getCreatedAt()
    this.cancelledAt = promoCode.canceledAt
  }
}
