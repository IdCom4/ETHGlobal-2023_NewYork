import { PromoCodeAlreadyExistsException, PromoCodeIsInactiveException, PromoCodeNotFoundException } from '@/common/exceptions/schemas/promo-code'
import { PromoCodeRepository } from '@/repositories'
import { OnlineUserBooking } from '@/schemas/booking'
import { DateTimeRange } from '@/schemas/common/pojos'
import { ContactInfo, PromoCode } from '@/schemas/promo-code'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

@Injectable()
export class PromoCodesService {
  constructor(private readonly promoCodeRepository: PromoCodeRepository) {}

  /**
   * Retrieves the promo code by label.
   *
   * @param label The promo code label
   * @return The promo code
   */
  public async getPromoCodeByLabel(label: string): Promise<PromoCode> {
    const promoCode = await this.promoCodeRepository.findByLabel(label.toUpperCase()).getOrThrow(new PromoCodeNotFoundException())
    if (!promoCode.isActive()) throw new PromoCodeIsInactiveException()

    return promoCode
  }

  /**
   * Retrieves the promo code by id.
   * @param codeId The promo code id
   * @return The promo code
   * @throws PromoCodeNotFoundException If the promo code is not found
   */
  public async getPromoCodeById(codeId: string): Promise<PromoCode> {
    return this.promoCodeRepository.findById(codeId).getOrThrow(new PromoCodeNotFoundException())
  }

  /**
   * Get all promo codes.
   *
   * @return The promo codes
   * @throws PromoCodeNotFoundException If no promo code is found
   */
  public async getAllPromoCodes(): Promise<PromoCode[]> {
    return this.promoCodeRepository.findAll().getOrThrow(new PromoCodeNotFoundException())
  }

  /**
   * Get all active promo codes.
   *
   * @return The active promo codes
   * @throws PromoCodeNotFoundException If no promo code is found
   */
  public async getAllActivePromoCodes(): Promise<PromoCode[]> {
    return (await this.getAllPromoCodes()).filter((promoCode) => promoCode.isActive())
  }

  /**
   * Check if the user already used the promo code and throw an exception if the promo code is inactive.
   *
   * @param userId The user id
   * @param label The promo code label
   * @return True if the user already used the promo code, false otherwise
   * @throws PromoCodeIsInactiveException If the promo code is inactive
   * @throws PromoCodeNotFoundException If the promo code is not found
   */
  public async checkIfUserAlreadyUsedCodeAndThrowIfInactive(userId: string, label: string): Promise<boolean> {
    const promoCode = await this.getPromoCodeByLabel(label)

    if (!promoCode.isActive()) throw new PromoCodeIsInactiveException()

    return promoCode.isAlreadyUsedByUser(userId)
  }

  /**
   * Check if the user already used the promo code
   * This method won't throw an exception if the promo code is inactive.
   *
   * @param userId The user id
   * @param label The promo code label
   * @return True if the user already used the promo code, false otherwise
   */
  public async checkIfUserAlreadyUsedCode(userId: string, label: string): Promise<boolean> {
    return (await this.getPromoCodeByLabel(label)).isAlreadyUsedByUser(userId)
  }

  /**
   * Set the promo code of a booking as used for this booking in the promo code object.
   *
   * @param booking The booking
   */
  public async usePromoCode(booking: OnlineUserBooking): Promise<void> {
    if (!booking.promoCodeId) throw new PromoCodeNotFoundException()

    const promoCode = await this.getPromoCodeById(booking.promoCodeId)
    promoCode.addToUsedOn(booking)

    await this.promoCodeRepository.updateAsIs(promoCode)
  }

  /**
   * Remove the promo code of a booking as used for this booking in the promo code object.
   *
   * @param booking The booking
   */
  public async cancelPromoCodeUse(booking: OnlineUserBooking): Promise<void> {
    if (!booking.promoCodeId) throw new PromoCodeNotFoundException()

    const promoCode = await this.getPromoCodeById(booking.promoCodeId)
    promoCode.removeFromUsedOn(booking)

    await this.promoCodeRepository.updateAsIs(promoCode)
  }

  /**
   * Create a new promo code.
   *
   * @param label The promo code label
   * @param reductionPercentage The reduction percentage
   * @param beneficiaryCommissionPercentage The beneficiary commission percentage
   * @param beneficiaryContact The beneficiary contact
   * @param dateTimeRange The date time range
   * @return The created promo code
   * @throws PromoCodeAlreadyExistsException If the promo code already exists
   */
  public async createPromoCode(
    label: string,
    reductionPercentage: number,
    beneficiaryCommissionPercentage: number,
    beneficiaryContact: ContactInfo,
    dateTimeRange: DateTimeRange
  ): Promise<PromoCode> {
    if (await this.promoCodeRepository.findByLabel(label).getOrNull()) throw new PromoCodeAlreadyExistsException()

    const newPromoCode = PromoCode.of(label, reductionPercentage, beneficiaryCommissionPercentage, beneficiaryContact, dateTimeRange)

    return this.promoCodeRepository.create(newPromoCode)
  }

  /**
   * Update a promo code.
   *
   * @param codeId The promo code id
   * @throws PromoCodeNotFoundException If the promo code is not found
   */
  public async cancelCode(codeId: string): Promise<void> {
    const promoCodeToCancel = await this.getPromoCodeById(codeId)

    promoCodeToCancel.cancel()

    await this.promoCodeRepository.updateAsIs(promoCodeToCancel)
  }

  /* public async generateXlsx(codeId: string): Promise<Pair<string, ByteArray> {

      const promoCode = this.getPromoCodeById(codeId)

      // create a new file builder and provide the file name
      const fileBuilder = XSSFFileBuilder("${LocalDate.now().month}_${promoCode.label}_promoCode.xlsx")

      fileBuilder.createSheet("${promoCode.label}_promoCode")

      fileBuilder.setHeader(arrayListOf("CLIENT", "BOOK. DURATION", "% REDUC.", "PRICE HT", "PRICE TTC", "SOLDE VMC HT", "BENEFICIARY", "BENEF. COM. %", "BENEF. COM. HT", "BENEF. COM. TTC"))

      // loop through all the bookings and create a row for each one that used this code
      bookingRepository.findAll().forEach { booking ->

          if (promoCode.bookingsUsedOn.contains(booking.id))> {
              fileBuilder.addRow(XSSFPromoCodeRow(promoCode, booking))
          }
      }

      return fileBuilder.exportToByteArray()

  } */
}
