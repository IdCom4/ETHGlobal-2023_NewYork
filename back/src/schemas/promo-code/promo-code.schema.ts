import { TimestampedDBDocument } from '@Schemas/db-document.abstract-schema'
import { DateTimeRange } from '@Schemas/common/pojos'
import { ContactInfo } from './pojos/contact-info'
import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'
import { UserAlreadyUsedPromoCodeException } from '@/common/exceptions/schemas/promo-code/user-already-used-promo-code.exception'
import { OnlineUserBooking } from '@Schemas/booking/booking.schema'
import { LegalRates } from '@/common/enums'
import { PricesUtils } from '@/common/utils/prices.utils'

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class PromoCode extends TimestampedDBDocument {
  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'label' })
  protected _label: string

  @prop({ type: Object as unknown as ContactInfo, required: true, _id: false })
  @Type(() => ContactInfo)
  @Expose({ name: 'beneficiary' })
  protected _beneficiary: ContactInfo

  @prop({ type: DateTimeRange, required: true, _id: false })
  @Type(() => DateTimeRange)
  @Expose({ name: 'dateTimeRange' })
  protected _dateTimeRange: DateTimeRange

  @prop({ type: Number, required: true })
  @Type(() => Number)
  @Expose({ name: 'totalNbrUsages' })
  protected _totalNbrUsages: number

  @prop({ type: Number, required: true })
  @Type(() => Number)
  @Expose({ name: 'beneficiaryCommissionPercentage' })
  protected _beneficiaryCommissionPercentage: number

  @prop({ type: Number, required: true })
  @Type(() => Number)
  @Expose({ name: 'reductionPercentage' })
  protected _reductionPercentage: number

  // total bookings
  @prop({ type: Number, required: true })
  @Type(() => Number)
  @Expose({ name: 'totalBookingsTTC' })
  protected _totalBookingsTTC: number

  // total beneficiary commission
  @prop({ type: Number, required: true })
  @Type(() => Number)
  @Expose({ name: 'totalBeneficiaryCommissionTTC' })
  protected _totalBeneficiaryCommissionTTC: number

  // total VMC sold HT
  @prop({ type: Number, required: true })
  @Type(() => Number)
  @Expose({ name: 'totalVMCSoldHT' })
  protected _totalVMCSoldHT: number

  @prop({ type: Array<string>, required: true })
  @Type(() => String)
  @Expose({ name: 'alreadyUsedBy' })
  protected _alreadyUsedBy: string[]

  @prop({ type: Array<string>, required: true })
  @Type(() => String)
  @Expose({ name: 'bookingsUsedOn' })
  protected _bookingsUsedOn: string[]

  @prop({ type: Date, required: false })
  @Type(() => Date)
  @Expose({ name: 'canceledAt' })
  protected _canceledAt?: Date

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(
    label: string,
    reductionPercentage: number,
    beneficiaryCommissionPercentage: number,
    beneficiary: ContactInfo,
    dateTimeRange: DateTimeRange
  ): PromoCode {
    const promoCode = new PromoCode()

    promoCode._label = label
    promoCode._beneficiary = beneficiary
    promoCode._dateTimeRange = dateTimeRange
    promoCode._beneficiaryCommissionPercentage = beneficiaryCommissionPercentage
    promoCode._reductionPercentage = reductionPercentage
    promoCode._totalBookingsTTC = 0
    promoCode._totalBeneficiaryCommissionTTC = 0
    promoCode._totalVMCSoldHT = 0
    promoCode._totalNbrUsages = 0
    promoCode._alreadyUsedBy = []
    promoCode._bookingsUsedOn = []

    return promoCode
  }

  /* >==== GETTERS & SETTERS ====> */

  /* eslint-disable prettier/prettier */
  public get label(): string {
    return this._label
  }

  public get beneficiary(): ContactInfo {
    return this._beneficiary
  }

  public get dateTimeRange(): DateTimeRange {
    return this._dateTimeRange
  }

  public get totalNbrUsages(): number {
    return this._totalNbrUsages
  }

  public get beneficiaryCommissionPercentage(): number {
    return this._beneficiaryCommissionPercentage
  }

  public get reductionPercentage(): number {
    return this._reductionPercentage
  }

  public get totalBookingsTTC(): number {
    return this._totalBookingsTTC
  }

  public get totalBeneficiaryCommissionTTC(): number {
    return this._totalBeneficiaryCommissionTTC
  }

  public get totalVMCSoldHT(): number {
    return this._totalVMCSoldHT
  }

  public get alreadyUsedBy(): string[] {
    return this._alreadyUsedBy
  }

  public get bookingsUsedOn(): string[] {
    return this._bookingsUsedOn
  }

  public get canceledAt(): Date | undefined {
    return this._canceledAt
  }

  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */

  /* >==== MAIN METHODS ====> */
  public isAlreadyUsedByUser(userId: string): boolean {
    return this.alreadyUsedBy.includes(userId)
  }

  /**
   * Add the promo code to the list of already used promo codes for a user Booking
   *
   * @param booking the booking to add to the list of usedOn
   */
  public addToUsedOn(booking: OnlineUserBooking): void {
    // calculate financial values
    this._totalBookingsTTC += booking.quote.totalTTC

    const beneficiaryBookingTTCCommission = PricesUtils.getTTCCommissionFromPercentage(booking.quote.totalTTC, this._beneficiaryCommissionPercentage)
    this._totalBeneficiaryCommissionTTC += beneficiaryBookingTTCCommission

    this._totalVMCSoldHT += booking.quote.totalHT - PricesUtils.getHTFromTTC(beneficiaryBookingTTCCommission, LegalRates.TVA)

    // update usedOn list
    this._bookingsUsedOn.push(booking._id.toString())

    // add user to usedBy
    // promo codes can only be used by users with accounts,
    // so the booker id should always be not null if there is a promo code
    this.addToUsedBy(booking.booker.id)

    // count this usage
    this._totalNbrUsages += 1
  }

  /**
   * Remove the promo code from the list of already used promo codes for a user Booking
   *
   * @param booking the booking to remove from the list of usedOn
   * @throws Error if the promo code was not used on the booking
   */
  public removeFromUsedOn(booking: OnlineUserBooking): void {
    // try to update usedOn list
    const removed = this._bookingsUsedOn.removeInPlace((id) => id === booking._id.toString())
    if (removed.length === 0) throw new Error(`Promo code ${this._id} was not used on booking ${booking._id}`)

    // calculate financial values
    this._totalBookingsTTC -= booking.quote.totalTTC

    // commissionPercentage / 100 * total = commission
    const beneficiaryBookingTTCCommission = PricesUtils.getTTCCommissionFromPercentage(booking.quote.totalTTC, this._beneficiaryCommissionPercentage)
    this._totalBeneficiaryCommissionTTC -= beneficiaryBookingTTCCommission

    this._totalVMCSoldHT -= booking.quote.totalHT - PricesUtils.getHTFromTTC(beneficiaryBookingTTCCommission, LegalRates.TVA)

    // remove user from usedBy
    this.removeFromUsedBy(booking.booker.id)
  }

  public isActive(): boolean {
    return !this._canceledAt && this._dateTimeRange.contains(new Date())
  }

  public cancel(): void {
    this._canceledAt = new Date()
  }

  private addToUsedBy(userId: string): void {
    if (this.isAlreadyUsedByUser(userId)) throw new UserAlreadyUsedPromoCodeException()

    this._alreadyUsedBy.push(userId)
  }

  private removeFromUsedBy(userId: string): void {
    this._alreadyUsedBy.removeInPlace((id) => id === userId)
  }
}
