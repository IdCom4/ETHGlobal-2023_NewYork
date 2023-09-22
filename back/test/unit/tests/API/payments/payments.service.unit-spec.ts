import { PaymentsService } from '@/API/payments/payments.service'
import { DataWrapper } from '@/common/classes'
import { DocumentTypes, PaymentProviderStatuses, RefundProviderStatuses, VmcCompaniesKeyNames } from '@/common/enums'
import { StripePaymentAPI } from '@/common/external-service-providers-api/payment/payment.api'
import { UserRepository } from '@/repositories'
import { User } from '@/schemas/user'
import { instance, mock, when } from 'ts-mockito'
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'

describe('Service - PaymentsService', () => {
  let paymentService: PaymentsService
  let mockedCreditCard: ICreditCard
  let mockedCreditCardList: ICreditCard[]
  let mockedPaymentResponse: IPaymentResponse
  let mockedClientSecret: string
  let mockedRefundResponse: IRefundResponse

  beforeEach(() => {
    mockedCreditCard = {
      id: 'valid',
      brand: 'test',
      country: null,
      expMonth: 8,
      expYear: 25,
      funding: 'test',
      last4: '2145',
      threeDSecureSupported: true,
    }

    mockedCreditCardList = [mockedCreditCard, mockedCreditCard, mockedCreditCard]

    mockedPaymentResponse = {
      paymentIdClientSecret: 'client_secret',
      status: PaymentProviderStatuses.SUCCESS,
      paymentId: 'paymentId',
    }

    mockedClientSecret = 'valid_client_secret'

    mockedRefundResponse = {
      refundId: 'refund_id',
      status: RefundProviderStatuses.SUCCESS,
    }
  })

  beforeAll(() => {
    const mockedPaymentAPI = mock(StripePaymentAPI)
    const mockedUserRepository = mock(UserRepository)

    when(mockedPaymentAPI.createCustomer).thenReturn((user, vmcCompanyAccountName: TVmcCompanyKeyName) => {
      if (vmcCompanyAccountName === VmcCompaniesKeyNames.CENTER) return DataWrapper.fromData(Promise.resolve('center'))
      if (vmcCompanyAccountName === VmcCompaniesKeyNames.PLATEFORME) return DataWrapper.fromData(Promise.resolve('platform'))

      return DataWrapper.fromData(Promise.resolve(''))
    })

    when(mockedPaymentAPI.getCreditCard).thenReturn((user, creditCardId) => {
      if (creditCardId === 'valid') return DataWrapper.fromData(Promise.resolve(mockedCreditCard))

      return DataWrapper.fromData<Promise<ICreditCard>>(Promise.resolve(null) as unknown as Promise<ICreditCard>)
    })

    when(mockedPaymentAPI.getCreditCardList).thenReturn(() => {
      return DataWrapper.fromData<Promise<ICreditCard[]>>(Promise.resolve(mockedCreditCardList))
    })

    when(mockedPaymentAPI.debitCreditCard).thenReturn((customerId, creditCardId) => {
      if (creditCardId === 'valid') return DataWrapper.fromData<Promise<IPaymentResponse>>(Promise.resolve(mockedPaymentResponse))
      if (creditCardId === 'not_found')
        return DataWrapper.fromData<Promise<IPaymentResponse>>(Promise.resolve(null) as unknown as Promise<IPaymentResponse>)
      if (creditCardId === '3D_secure') {
        mockedPaymentResponse.status = PaymentProviderStatuses.REQUIRE_AUTHENTICATION
        return DataWrapper.fromData<Promise<IPaymentResponse>>(Promise.resolve(mockedPaymentResponse))
      }
      return DataWrapper.fromData<Promise<IPaymentResponse>>(Promise.resolve(null) as unknown as Promise<IPaymentResponse>)
    })

    when(mockedPaymentAPI.createPaymentIntent).thenReturn(() => {
      return DataWrapper.fromData<Promise<IPaymentResponse>>(Promise.resolve(mockedPaymentResponse))
    })

    when(mockedPaymentAPI.getNewCreditCardCreationKey).thenReturn(() => {
      return DataWrapper.fromData<Promise<string>>(Promise.resolve('valid_client_secret'))
    })

    when(mockedPaymentAPI.refundPayment).thenReturn(() => {
      return DataWrapper.fromData<Promise<IRefundResponse>>(Promise.resolve(mockedRefundResponse))
    })

    when(mockedPaymentAPI.deleteCreditCard).thenReturn((user, creditCardId) => {
      if (creditCardId === 'valid') return DataWrapper.fromData(Promise.resolve(true))

      return DataWrapper.fromData<Promise<boolean>>(Promise.resolve(null) as unknown as Promise<boolean>)
    })

    when(mockedPaymentAPI.setDefaultCreditCard).thenReturn((user, creditCardId) => {
      if (creditCardId === 'valid') return DataWrapper.fromData(Promise.resolve(true))

      return DataWrapper.fromData<Promise<boolean>>(Promise.resolve(null) as unknown as Promise<boolean>)
    })

    when(mockedPaymentAPI.getDefaultCreditCard).thenReturn(() => {
      return DataWrapper.fromData(Promise.resolve(mockedCreditCard))
    })

    when(mockedUserRepository.updateAsIs).thenReturn(() => Promise.resolve(true))

    paymentService = new PaymentsService(instance(mockedPaymentAPI), instance(mockedUserRepository))
  })

  describe('when getting user customer id', () => {
    it('should get the customer id of the correct company if there is one', async () => {
      //Given
      const centerCustomerId = 'center'
      const platformCustomerId = 'platform'

      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)
      mockedUser.centerClientProfile.setCustomerId('center')
      mockedUser.missionClientProfile.setCustomerId('platform')

      //When
      const customerIds = await paymentService.getOrCreateAndSaveCustomerIds(mockedUser)

      //Then
      expect(customerIds).toMatchObject({ [VmcCompaniesKeyNames.CENTER]: centerCustomerId })
      expect(customerIds).toMatchObject({ [VmcCompaniesKeyNames.PLATEFORME]: platformCustomerId })
    })

    it('should create the customer ids for the user', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)
      const centerCustomerId = 'center'
      const platformCustomerId = 'platform'

      //When
      const customerIds = await paymentService.getOrCreateAndSaveCustomerIds(mockedUser)

      //Then
      expect(customerIds).toMatchObject({ [VmcCompaniesKeyNames.CENTER]: centerCustomerId })
      expect(customerIds).toMatchObject({ [VmcCompaniesKeyNames.PLATEFORME]: platformCustomerId })
    })
  })

  describe('when creating user customer id', () => {
    it('should create the customer ids for the user', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)
      const centerCustomerId = 'center'
      const platformCustomerId = 'platform'

      //When
      const customerIds = await paymentService.getOrCreateAndSaveCustomerIds(mockedUser)

      //Then
      expect(customerIds).toMatchObject({ [VmcCompaniesKeyNames.CENTER]: centerCustomerId })
      expect(customerIds).toMatchObject({ [VmcCompaniesKeyNames.PLATEFORME]: platformCustomerId })
    })
  })

  describe('when getting user card', () => {
    it('should return a card if it exist', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)

      //When
      const card = await paymentService.getCard(mockedUser, VmcCompaniesKeyNames.CENTER, 'valid')

      //Then
      expect(card).toMatchObject(mockedCreditCard)
    })

    it("should throw if the card doesn't exist", async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)

      //When
      const card = async (): Promise<ICreditCard> => await paymentService.getCard(mockedUser, VmcCompaniesKeyNames.CENTER, 'invalid')

      // Then
      await expect(card()).rejects.toThrow(NotFoundException)
    })
  })

  describe('when getting all user cards', () => {
    it('should return user card list', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)

      //When
      const cards = await paymentService.getCreditCardList(mockedUser, VmcCompaniesKeyNames.CENTER)

      //Then
      expect(cards).toMatchObject(mockedCreditCardList)
    })
  })

  describe('when getting debiting user card', () => {
    it('should successfully debit the user', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)

      //When
      const paymentResponse = await paymentService.debitCreditCard(mockedUser, VmcCompaniesKeyNames.CENTER, 'valid', 15, {
        documentType: DocumentTypes.BOOKING,
        documentId: 'some-id',
      })

      //Then
      expect(paymentResponse).toMatchObject(mockedPaymentResponse)
    })

    it('should throw if the card is not found', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)

      //When
      const debitCard = async (): Promise<IPaymentResponse> =>
        await paymentService.debitCreditCard(mockedUser, VmcCompaniesKeyNames.CENTER, 'not_found', 15, {
          documentType: DocumentTypes.BOOKING,
          documentId: 'some-id',
        })

      // Then
      await expect(debitCard()).rejects.toThrow(NotFoundException)
    })

    it('should return require_authentication status', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)

      //When
      const paymentResponse = await paymentService.debitCreditCard(mockedUser, VmcCompaniesKeyNames.CENTER, '3D_secure', 15, {
        documentType: DocumentTypes.BOOKING,
        documentId: 'some-id',
      })

      //Then
      expect(paymentResponse).toMatchObject(mockedPaymentResponse)
    })
  })

  describe('when creating a payment intent that the user need to confirm in front', () => {
    it('should return a paymentResponse with a clientSecret', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)
      mockedPaymentResponse.status = PaymentProviderStatuses.REQUIRE_AUTHENTICATION

      //When
      const paymentResponse = await paymentService.createPaymentIntent(mockedUser, VmcCompaniesKeyNames.CENTER, 15, {
        documentType: DocumentTypes.BOOKING,
        documentId: 'some-id',
      })

      //Then
      expect(paymentResponse).toMatchObject(mockedPaymentResponse)
    })
  })

  describe('when creating a card registration intent that the user need to confirm in front', () => {
    it('should return a string containing a clientSecret', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)

      //When
      const paymentResponse = await paymentService.createCardSetup(mockedUser, VmcCompaniesKeyNames.CENTER)

      //Then
      expect(paymentResponse).toEqual(mockedClientSecret)
    })
  })

  describe('when refunding a payment', () => {
    it('should return a refundResponse with success status', async () => {
      //Given
      mockedRefundResponse.status = RefundProviderStatuses.SUCCESS

      //When
      const paymentResponse = await paymentService.refundPayment('paymentId', VmcCompaniesKeyNames.CENTER, 15)

      //Then
      expect(paymentResponse).toMatchObject(mockedRefundResponse)
    })
  })

  describe('when deleting a user card', () => {
    it('should return a boolean with true', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)

      //When
      const deleteResponse = await paymentService.deleteCreditCard(mockedUser, VmcCompaniesKeyNames.CENTER, 'valid')

      //Then
      expect(deleteResponse).toEqual(true)
    })

    it('should throw if the card is not found', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)

      //When
      const deleteCard = async (): Promise<boolean> => await paymentService.deleteCreditCard(mockedUser, VmcCompaniesKeyNames.CENTER, 'invalid')

      // Then
      await expect(deleteCard()).rejects.toThrow(NotFoundException)
    })
  })

  describe('when setting default user card', () => {
    it('should return a success response', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)

      //When
      const response = await paymentService.setDefaultCreditCard(mockedUser, VmcCompaniesKeyNames.CENTER, 'valid')

      //Then
      expect(response).toEqual(true)
    })
  })

  describe('when getting default user card', () => {
    it('should return the default user card', async () => {
      //Given
      const mockedUser: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)

      //When
      const response = await paymentService.getDefaultCreditCard(mockedUser, VmcCompaniesKeyNames.CENTER)

      //Then
      expect(response).toMatchObject(mockedCreditCard)
    })
  })
})
