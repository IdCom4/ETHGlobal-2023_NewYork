import { PromoCode } from '@/schemas/promo-code'

export class PublicPromoCodeResponse {
  label: string

  from: Date
  to: Date

  isActive: boolean

  reductionPercentage: number

  constructor(promoCode: PromoCode) {
    this.label = promoCode.label
    this.from = promoCode.dateTimeRange.begin
    this.to = promoCode.dateTimeRange.end
    this.isActive = promoCode.isActive()
    this.reductionPercentage = promoCode.reductionPercentage
  }
}
