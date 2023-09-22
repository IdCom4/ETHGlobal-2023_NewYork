import { instance, mock, when } from 'ts-mockito'
import { ContactInfo, PromoCode } from '@Schemas/promo-code'
import { PromoCodesController } from '@Api/promo-code/promo-code.controller'
import { PromoCodesService } from '@Api/promo-code/promo-code.service'
import { DateTimeRange } from '@Schemas/common/pojos'
import { AdminPromoCodeResponse, PublicPromoCodeResponse } from '@Api/promo-code/response'
import { ContactInfoDTO, CreatePromoCodeRequest } from '@Api/promo-code/requests'
import { MessageResponse } from '@Common/request-io/responses-dto'
import { User } from '@Schemas/user'

const mockedPromoCodes: PromoCode[] = [
  PromoCode.of('PromoCode 1', 20, 10, ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'), DateTimeRange.of(new Date(), new Date())),
  PromoCode.of('PromoCode 2', 20, 10, ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'), DateTimeRange.of(new Date(), new Date())),
  PromoCode.of('PromoCode 3', 20, 10, ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'), DateTimeRange.of(new Date(), new Date())),
  PromoCode.of('PromoCode 4', 20, 10, ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'), DateTimeRange.of(new Date(), new Date())),
  PromoCode.of('PromoCode 5', 20, 10, ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'), DateTimeRange.of(new Date(), new Date())),
]

describe('Controller - InterventionsController', () => {
  let controller: PromoCodesController

  beforeAll(() => {
    const promoCodesService = buildPromoCodesServiceMock()

    controller = new PromoCodesController(instance(promoCodesService))
  })

  it('should return all interventions when calling GET [all]', async () => {
    // When
    const result = await controller.getAllPromoCodes()

    // Then
    expect(result).toHaveLength(mockedPromoCodes.length)
    result.forEach((intervention, index) => {
      expect(intervention).toBeInstanceOf(AdminPromoCodeResponse)
      expect(intervention.label).toEqual(mockedPromoCodes[index].label)
    })
  })

  describe('When calling GET [getById/:CODE_ID]', () => {
    it('should success with valid id', async () => {
      // When
      const result = await controller.getPromoCodeById('existingId')

      // Then
      expect(result).toStrictEqual(new AdminPromoCodeResponse(mockedPromoCodes[0]))
    })

    it('should fail with invalid id', async () => {
      // When
      const result = async (): Promise<AdminPromoCodeResponse> => await controller.getPromoCodeById('unknownId')

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  describe('When calling GET [:LABEL]', () => {
    it('should success with valid id', async () => {
      // When
      const result = await controller.getPromoCodeByLabel('existingLabel')

      // Then
      expect(result).toStrictEqual(new PublicPromoCodeResponse(mockedPromoCodes[0]))
    })

    it('should fail with invalid id', async () => {
      // When
      const result = async (): Promise<PublicPromoCodeResponse> => await controller.getPromoCodeByLabel('unknownId')

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  describe('When calling POST []', () => {
    it('should success with non-existent label', async () => {
      // Given
      const createPromoCodeRequest: CreatePromoCodeRequest = {
        label: 'newLabel',
        from: new Date(),
        to: new Date(),
        reductionPercentage: 20,
        beneficiary: Object.initClassByReflection(ContactInfoDTO, {
          name: 'John',
          lastName: 'Doe',
          phone: '0612345678',
          email: 'john@doe.fr',
        }),
        beneficiaryCommissionPercentage: 10,
      }

      // When
      const result = await controller.createPromoCode(createPromoCodeRequest)

      // Then
      expect(result).toBeInstanceOf(MessageResponse)
      expect(result.statusCode).toBe(201)
    })

    it('should fail with existent', async () => {
      // Given
      const createPromoCodeRequest: CreatePromoCodeRequest = {
        label: 'existingLabel',
        from: new Date(),
        to: new Date(),
        reductionPercentage: 20,
        beneficiary: Object.initClassByReflection(ContactInfoDTO, {
          name: 'John',
          lastName: 'Doe',
          phone: '0612345678',
          email: 'john@doe.fr',
        }),
        beneficiaryCommissionPercentage: 10,
      }

      // When
      const result = async (): Promise<MessageResponse> => await controller.createPromoCode(createPromoCodeRequest)

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  describe('When calling DELETE [getById/:CODE_ID]', () => {
    it('should success with valid id', async () => {
      // When
      const result = await controller.cancelPromoCode('existingId')

      expect(result).toBeInstanceOf(MessageResponse)
      expect(result.statusCode).toBe(200)
    })

    it('should fail with invalid id', async () => {
      // When
      const result = async (): Promise<MessageResponse> => await controller.cancelPromoCode('unknownId')

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  describe('When calling PUT [:LABEL]', () => {
    it('should success with an unused promo code', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const label = 'existingLabel'

      // When
      const result = await controller.checkIfUserAlreadyUsedCode(loggedUserWrapper, label)

      // Then
      expect(result).toBeInstanceOf(MessageResponse)
      expect(result.statusCode).toBe(200)
    })

    it('should fail with an already used promo code', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const label = 'existingUsedLabel'

      // When
      const result = async (): Promise<MessageResponse> => await controller.checkIfUserAlreadyUsedCode(loggedUserWrapper, label)

      // Then
      await expect(result).rejects.toThrow()
    })
  })
})

function buildPromoCodesServiceMock(): PromoCodesService {
  const mockedPromoCodesService: PromoCodesService = mock(PromoCodesService)

  when(mockedPromoCodesService.getAllPromoCodes).thenReturn(async () => mockedPromoCodes)
  when(mockedPromoCodesService.getPromoCodeById).thenReturn(async (codeId) => {
    if (codeId !== 'existingId') throw new Error('Promo code not found')

    return mockedPromoCodes[0]
  })
  when(mockedPromoCodesService.getPromoCodeByLabel).thenReturn(async (codeId) => {
    if (codeId !== 'existingLabel') throw new Error('Promo code not found')

    return mockedPromoCodes[0]
  })
  when(mockedPromoCodesService.createPromoCode).thenReturn(async (label) => {
    if (label === 'existingLabel') throw new Error('Promo code with this label already exists')

    return PromoCode.of(label, 20, 10, ContactInfo.of('John', 'Doe', '0612345678', 'john@doe.fr'), DateTimeRange.of(new Date(), new Date()))
  })
  when(mockedPromoCodesService.cancelCode).thenReturn(async (codeId) => {
    if (codeId !== 'existingId') throw new Error('Promo code not found')
  })
  when(mockedPromoCodesService.checkIfUserAlreadyUsedCodeAndThrowIfInactive).thenReturn(async (userId, label) => {
    return label === 'existingUsedLabel'
  })

  return mockedPromoCodesService
}
