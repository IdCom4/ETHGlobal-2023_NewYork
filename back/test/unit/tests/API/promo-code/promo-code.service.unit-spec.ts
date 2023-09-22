import { instance, mock, when } from 'ts-mockito'
import { PromoCodeRepository } from '@/repositories'
import { ContactInfo, PromoCode } from '@Schemas/promo-code'
import { DateTimeRange, StrictAddress } from '@Schemas/common/pojos'
import { PromoCodesService } from '@Api/promo-code/promo-code.service'
import { InstantiatingDataWrapper } from '@Common/classes'
import { Booking, OnlineUserBooking } from '@Schemas/booking'
import { Box, Formula } from '@Schemas/box'
import { Center } from '@Schemas/center'
import { BoxCategories } from '@Common/enums'
import { User } from '@Schemas/user'

// Creating 4 active and one inactive promo code
const mockedPromoCodes: PromoCode[] = [
  PromoCode.of(
    'PROMOCODE 1',
    20,
    10,
    ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
    DateTimeRange.of(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  ),
  PromoCode.of(
    'PROMOCODE 2',
    20,
    10,
    ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
    DateTimeRange.of(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  ),
  PromoCode.of(
    'PROMOCODE 3',
    20,
    10,
    ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
    DateTimeRange.of(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  ),
  PromoCode.of(
    'PROMOCODE 4',
    20,
    10,
    ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'),
    DateTimeRange.of(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  ),
  PromoCode.of('PROMOCODE 5', 20, 10, ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'), DateTimeRange.of(new Date(), new Date())),
]

describe('Service - PromoCodesService', () => {
  let service: PromoCodesService

  beforeAll(() => {
    const interventionsService = buildPromoCodeRepositoryMock()

    service = new PromoCodesService(instance(interventionsService))
  })

  describe('When getting promo code by label', () => {
    it('should success with a valid label', async () => {
      // Given
      const label = 'PromoCode 1'

      // When
      const result = await service.getPromoCodeByLabel(label)

      // Then
      expect(result).toStrictEqual(mockedPromoCodes[0])
    })

    it('should fail with an unknown label', async () => {
      // Given
      const label = 'unknownLabel'

      // When
      const result = async (): Promise<PromoCode> => await service.getPromoCodeByLabel(label)

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  describe('When getting promo code by id', () => {
    it('should success with a valid id', async () => {
      // Given
      const id = mockedPromoCodes[0]._id.toString()

      // When
      const result = await service.getPromoCodeById(id)

      // Then
      expect(result).toStrictEqual(mockedPromoCodes[0])
    })

    it('should fail with an invalid id', async () => {
      // Given
      const id = 'unknownId'

      // When
      const result = async (): Promise<PromoCode> => await service.getPromoCodeById(id)

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  describe('When getting all promo codes', () => {
    it('should return all promo codes when requesting', async () => {
      // When
      const result = await service.getAllPromoCodes()

      // Then
      expect(result).toHaveLength(mockedPromoCodes.length)
      result.forEach((intervention, index) => {
        expect(intervention).toBeInstanceOf(PromoCode)
        expect(intervention.label).toEqual(mockedPromoCodes[index].label)
      })
    })

    it('should return all only active promo code', async () => {
      // When
      const result = await service.getAllActivePromoCodes()

      // Then
      expect(result).toHaveLength(4)
      result.forEach((intervention, index) => {
        expect(intervention).toBeInstanceOf(PromoCode)
        expect(intervention.label).toEqual(mockedPromoCodes[index].label)
      })
    })
  })

  describe('When checking if user already used the promo code', () => {
    it('should success with valid information', async () => {
      // When
      const result = await service.checkIfUserAlreadyUsedCodeAndThrowIfInactive('existingId', 'PROMOCODE 2')

      // Then
      expect(result).toBe(true)
    })

    it('should return false with an unused promocode', async () => {
      // When
      const result = await service.checkIfUserAlreadyUsedCode('existingId', 'PROMOCODE 1')

      // Then
      expect(result).toBe(false)
    })

    it('should return false with an unused promocode', async () => {
      // When
      const result = await service.checkIfUserAlreadyUsedCodeAndThrowIfInactive('existingId', 'PROMOCODE 1')

      // Then
      expect(result).toBe(false)
    })

    it('should throw with inactive promocode', async () => {
      // When
      const result = async (): Promise<boolean> => await service.checkIfUserAlreadyUsedCodeAndThrowIfInactive('existingId', 'PROMOCODE 5')

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  describe('When canceling the use of a promo code', () => {
    it('should success with valid booking', async () => {
      // Given
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
        Booking.of(box, user, DateTimeRange.of(new Date('2021-01-01'), new Date('2021-01-02')), Formula.of('Truc', 2, 15), mockedPromoCodes[0])
      )
      mockedPromoCodes[0].addToUsedOn(booking)

      // When
      const result = async (): Promise<void> => await service.cancelPromoCodeUse(booking)

      // Then
      await expect(result).not.toThrow()
    })

    it('should return false with a booking without promo code', async () => {
      // Given
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
      const result = async (): Promise<void> => await service.cancelPromoCodeUse(booking)

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  describe('When creating a promo code', () => {
    it('should success with a valid information', async () => {
      // Given
      const label = 'NOUVEAU LABEL'
      const reductionPercentage = 99
      const beneficiaryCommissionPercentage = 10
      const beneficiaryContact = ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr')
      const dateTimeRange = DateTimeRange.of(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)))

      // When
      const result = await service.createPromoCode(label, reductionPercentage, beneficiaryCommissionPercentage, beneficiaryContact, dateTimeRange)

      // Then
      expect(result).toBeDefined()
      expect(result.label).toBe(label)
      expect(result.reductionPercentage).toBe(reductionPercentage)
      expect(result.beneficiaryCommissionPercentage).toBe(beneficiaryCommissionPercentage)
      expect(result.beneficiary).toBe(beneficiaryContact)
      expect(result.dateTimeRange).toBe(dateTimeRange)
    })

    it('should fail with an already known label', async () => {
      // Given
      const label = 'PROMOCODE 1'
      const reductionPercentage = 99
      const beneficiaryCommissionPercentage = 10
      const beneficiaryContact = ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr')
      const dateTimeRange = DateTimeRange.of(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)))

      // When
      const result = async (): Promise<PromoCode> =>
        await service.createPromoCode(label, reductionPercentage, beneficiaryCommissionPercentage, beneficiaryContact, dateTimeRange)

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  describe('When cancelling a promo code', () => {
    it('should success with an existing promo code', async () => {
      // Given
      const label = 'PROMOCODE 1'

      // When
      const result = async (): Promise<void> => await service.cancelCode(label)

      // Then
      expect(result).toBeDefined()
    })

    it('should fail with unknown label', async () => {
      // Given
      const label = 'unknown label'

      // When
      const result = async (): Promise<void> => await service.cancelCode(label)

      // Then
      expect(result).toBeDefined()
    })
  })
})

function buildPromoCodeRepositoryMock(): PromoCodeRepository {
  const mockedPromoCodeRepository: PromoCodeRepository = mock(PromoCodeRepository)

  when(mockedPromoCodeRepository.findByLabel).thenReturn((label: string) => {
    const promoCode = mockedPromoCodes.find((promoCode) => promoCode.label === label)
    if (!promoCode) InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<PromoCode>)
    if (label === 'PROMOCODE 2') Reflect.set(<PromoCode>promoCode, '_alreadyUsedBy', ['existingId'])
    return InstantiatingDataWrapper.fromData(Promise.resolve(<PromoCode>promoCode))
  })
  when(mockedPromoCodeRepository.findById).thenReturn((id) => {
    const filteredUsers = mockedPromoCodes.filter((promoCode) => promoCode._id.toString() === id.toString())[0]

    return filteredUsers
      ? InstantiatingDataWrapper.fromData(Promise.resolve(filteredUsers))
      : InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<PromoCode>)
  })
  when(mockedPromoCodeRepository.findAll).thenReturn(() => InstantiatingDataWrapper.fromData(Promise.all(mockedPromoCodes)))
  when(mockedPromoCodeRepository.create).thenReturn(async (promoCode) => promoCode)

  return mockedPromoCodeRepository
}
