import { ContactInfo, PromoCode } from '@Schemas/promo-code'
import { DateTimeRange, StrictAddress } from '@Schemas/common/pojos'
import { Booking, OnlineUserBooking } from '@Schemas/booking'
import { Box, Formula } from '@Schemas/box'
import { Center } from '@Schemas/center'
import { BoxCategories } from '@Common/enums'
import { User } from '@Schemas/user'

describe('Schema - Promo Code', () => {
  it('should instantiate with all arguments constructor and nominal values when instantiating', () => {
    // Given
    const label = 'CODE2023'
    const reductionPercentage = 50
    const beneficiaryCommissionPercentage = 50
    const beneficiary = ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr')
    const dateTimeRange = DateTimeRange.of(new Date('2021-01-01'), new Date('2031-12-31'))

    // When
    const promoCode = PromoCode.of(label, reductionPercentage, beneficiaryCommissionPercentage, beneficiary, dateTimeRange)

    // Then
    expect(promoCode).toBeTruthy()
    expect(promoCode.label).toBe(label)
    expect(promoCode.reductionPercentage).toBe(reductionPercentage)
    expect(promoCode.beneficiaryCommissionPercentage).toBe(beneficiaryCommissionPercentage)
    expect(promoCode.beneficiary).toBe(beneficiary)
    expect(promoCode.dateTimeRange).toBe(dateTimeRange)
    expect(promoCode.totalNbrUsages).toBe(0)
    expect(promoCode.totalBeneficiaryCommissionTTC).toBe(0)
    expect(promoCode.totalBookingsTTC).toBe(0)
    expect(promoCode.totalVMCSoldHT).toBe(0)
    expect(promoCode.alreadyUsedBy).toStrictEqual([])
    expect(promoCode.bookingsUsedOn).toStrictEqual([])
    expect(promoCode.canceledAt).toBeFalsy()
  })

  describe('When adding a booking using a promo code', () => {
    it('should add an user when the user did not already used it', () => {
      // Given
      const promoCode: PromoCode = PromoCode.of(
        'CODE2023',
        50,
        50,
        ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
        DateTimeRange.of(new Date('2021-01-01'), new Date('2031-12-31'))
      )
      const box: Box = Box.of({
        name: 'string',
        description: 'string',
        center: Center.of('Centre', StrictAddress.of('123 Main Street', 'Anytown', '12345', [0, 0])),
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas: [Formula.of('Truc', 2, 15)],
      })
      const user: User = User.of('Doe', 'John', '0612345678', 'john@doe.com', 'hashedPassword', undefined)
      const booking: OnlineUserBooking = <OnlineUserBooking>(
        Booking.of(box, user, DateTimeRange.of(new Date('2021-01-01'), new Date('2021-01-02')), Formula.of('Truc', 2, 15), undefined)
      )

      // When
      promoCode.addToUsedOn(booking)

      // Then
      expect(promoCode.alreadyUsedBy).toHaveLength(1)
      expect(promoCode.alreadyUsedBy).toContain(user._id.toString())
      expect(promoCode.bookingsUsedOn).toHaveLength(1)
      expect(promoCode.bookingsUsedOn).toContain(booking._id.toString())
    })

    it('should add an user when used by an user', async () => {
      // Given
      const promoCode: PromoCode = PromoCode.of(
        'CODE2093',
        50,
        50,
        ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
        DateTimeRange.of(new Date('2021-01-01'), new Date('2031-12-31'))
      )
      const box: Box = Box.of({
        name: 'Nameee',
        description: 'string',
        center: Center.of('Centre', StrictAddress.of('123 Main Street', 'Anytown', '12345', [0, 0])),
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas: [Formula.of('Truc', 2, 15)],
      })
      const user: User = User.of('Doe', 'John', '0612345678', 'john@doe.com', 'hashedPassword', undefined)
      const booking: OnlineUserBooking = <OnlineUserBooking>(
        Booking.of(box, user, DateTimeRange.of(new Date('2021-01-01'), new Date('2021-01-02')), Formula.of('Truc', 2, 15), undefined)
      )
      promoCode.addToUsedOn(booking)

      // When
      const addingBooking = async (): Promise<void> => promoCode.addToUsedOn(booking)

      // Then
      await expect(addingBooking).rejects.toThrow()
    })
  })

  describe('When checking if user already used', () => {
    it('should return true if user already used', () => {
      // Given
      const promoCode: PromoCode = PromoCode.of(
        'CODE2024',
        50,
        50,
        ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
        DateTimeRange.of(new Date('2021-01-01'), new Date('2031-12-31'))
      )
      const box: Box = Box.of({
        name: 'Name',
        description: 'string',
        center: Center.of('Centre', StrictAddress.of('123 Main Street', 'Anytown', '12345', [0, 0])),
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas: [Formula.of('Truc', 2, 15)],
      })
      const user: User = User.of('Doe', 'John', '0612345678', 'john@doe.com', 'hashedPassword', undefined)
      const booking: OnlineUserBooking = <OnlineUserBooking>(
        Booking.of(box, user, DateTimeRange.of(new Date('2021-01-01'), new Date('2021-01-02')), Formula.of('Truc', 2, 15), undefined)
      )
      promoCode.addToUsedOn(booking)

      // When
      const result = promoCode.isAlreadyUsedByUser(user._id.toString())

      // Then
      expect(result).toBeTruthy()
    })

    it('should return true if user already used', () => {
      // Given
      const promoCode: PromoCode = PromoCode.of(
        'CODE2021',
        50,
        50,
        ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
        DateTimeRange.of(new Date('2021-01-01'), new Date('2031-12-31'))
      )
      const user: User = User.of('Doe', 'John', '0612345678', 'john@doe.com', 'hashedPassword', undefined)

      // When
      const result = promoCode.isAlreadyUsedByUser(user._id.toString())

      // Then
      expect(result).toBeFalsy()
    })
  })

  describe('When checking if promo code is active', () => {
    it('should return true if promo code is active', () => {
      // Given
      const promoCode: PromoCode = PromoCode.of(
        'CODE2024',
        50,
        50,
        ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
        DateTimeRange.of(new Date('2021-01-01'), new Date('2031-12-31'))
      )

      // When
      const result = promoCode.isActive()

      expect(result).toBeTruthy()
    })

    it('should return false if promo code is not active', () => {
      // Given
      const promoCode: PromoCode = PromoCode.of(
        'CODE2024',
        50,
        50,
        ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
        DateTimeRange.of(new Date('2021-01-01'), new Date('2031-12-31'))
      )
      promoCode.cancel()

      // When
      const result = promoCode.isActive()

      expect(result).toBeFalsy()
    })
  })

  describe('When removing a booking', () => {
    it('should remove the booking from the list', () => {
      // Given
      const promoCode: PromoCode = PromoCode.of(
        'CODE2025',
        50,
        50,
        ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
        DateTimeRange.of(new Date('2021-01-01'), new Date('2031-12-31'))
      )
      const box: Box = Box.of({
        name: 'Naïme',
        description: 'string',
        center: Center.of('Centre', StrictAddress.of('123 Main Street', 'Anytown', '12345', [0, 0])),
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas: [Formula.of('Truc', 2, 15)],
      })
      const user: User = User.of('Doe', 'John', '0612345678', 'john@doe.com', 'hashedPassword', undefined)
      const booking: OnlineUserBooking = <OnlineUserBooking>(
        Booking.of(box, user, DateTimeRange.of(new Date('2021-01-01'), new Date('2021-01-02')), Formula.of('Truc', 2, 15), undefined)
      )
      promoCode.addToUsedOn(booking)

      // When
      promoCode.removeFromUsedOn(booking)

      // Then
      expect(promoCode.isAlreadyUsedByUser(user._id.toString())).toBeFalsy()
      expect(promoCode.totalVMCSoldHT).toBe(0)
    })

    it('should remove nothing the booking from the list with a not used booking', () => {
      // Given
      const promoCode: PromoCode = PromoCode.of(
        'CODE2026',
        50,
        50,
        ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
        DateTimeRange.of(new Date('2021-01-01'), new Date('2031-12-31'))
      )
      const box: Box = Box.of({
        name: 'Nname',
        description: 'string',
        center: Center.of('Centre', StrictAddress.of('123 Main Street', 'Anytown', '12345', [0, 0])),
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas: [Formula.of('Truc', 2, 15)],
      })
      const user: User = User.of('Doe', 'John', '0612345679', 'john@doe.com', 'hashedPassword', undefined)
      const booking: OnlineUserBooking = <OnlineUserBooking>(
        Booking.of(box, user, DateTimeRange.of(new Date('2021-01-02'), new Date('2021-01-09')), Formula.of('Truc', 2, 15), undefined)
      )

      // When
      const removing = (): void => promoCode.removeFromUsedOn(booking)

      // Then
      expect(removing).toThrowError()
    })
  })
})
