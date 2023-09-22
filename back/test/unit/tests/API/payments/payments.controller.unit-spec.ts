import { PaymentsController } from '@/API/payments/payments.controller'
import { PaymentsService } from '@/API/payments/payments.service'
import { instance, mock, when } from 'ts-mockito'
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'
import { VmcCompaniesKeyNames } from '@/common/enums'
import { User } from '@/schemas/user'

describe('Controller - PaymentsController', () => {
  let paymentsController: PaymentsController
  let mockedCreditCard: ICreditCard
  let mockedCreditCardList: ICreditCard[]
  let mockedClientSecret: string

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

    mockedClientSecret = 'valid_client_secret'
  })

  beforeAll(() => {
    const mockedPaymentsService = mock(PaymentsService)

    when(mockedPaymentsService.createCardSetup).thenReturn(async () => {
      return mockedClientSecret
    })

    when(mockedPaymentsService.getCreditCardList).thenReturn(async () => {
      return mockedCreditCardList
    })

    when(mockedPaymentsService.getCard).thenReturn(async (user, vmcCompaniesName, creditCardId) => {
      if (creditCardId === 'valid') return mockedCreditCard
      throw new NotFoundException()
    })

    when(mockedPaymentsService.getDefaultCreditCard).thenReturn(async () => {
      return mockedCreditCard
    })

    when(mockedPaymentsService.setDefaultCreditCard).thenReturn(async (user, vmcCompaniesName, creditCardId) => {
      if (creditCardId === 'valid') return true
      throw new NotFoundException()
    })

    paymentsController = new PaymentsController(instance(mockedPaymentsService))
  })

  describe('when creating card-setup', () => {
    it('should return the clientSecret of the intent', async () => {
      //Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser

      // When
      const clientSecret = await paymentsController.createSetup(VmcCompaniesKeyNames.CENTER, loggedUserWrapper)

      // Then
      expect(clientSecret).toEqual(mockedClientSecret)
    })
  })

  describe("when getting all user's cards", () => {
    it('should return all the credit cards of the user', async () => {
      //Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser

      // When
      const cardList = await paymentsController.getCardList(VmcCompaniesKeyNames.CENTER, loggedUserWrapper)

      // Then
      expect(cardList).toMatchObject(mockedCreditCardList)
    })
  })

  describe('when getting a card by Id', () => {
    it('should return the credit card of the user', async () => {
      //Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser

      // When
      const card = await paymentsController.getCard(VmcCompaniesKeyNames.CENTER, loggedUserWrapper, 'valid')

      // Then
      expect(card).toMatchObject(mockedCreditCard)
    })

    it('should throw not found exception', async () => {
      //Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser

      //When
      const card = async (): Promise<ICreditCard> => await paymentsController.getCard(VmcCompaniesKeyNames.CENTER, loggedUserWrapper, 'invalid')

      // Then
      await expect(card()).rejects.toThrow(NotFoundException)
    })
  })

  describe('when updating default card', () => {
    it('should return a success response', async () => {
      //Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser

      // When
      const card = await paymentsController.setDefaultCreditCard(VmcCompaniesKeyNames.CENTER, loggedUserWrapper, 'valid')

      // Then
      expect(card.statusCode).toEqual(200)
    })

    it("should throw if the card doesn't exist", async () => {
      //Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser

      //When
      const card = async (): Promise<ICreditCard> => await paymentsController.getCard(VmcCompaniesKeyNames.CENTER, loggedUserWrapper, 'invalid')

      // Then
      await expect(card()).rejects.toThrow(NotFoundException)
    })
  })

  describe('when getting default card', () => {
    it('should return the default credit card of the user', async () => {
      //Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser

      // When
      const card = await paymentsController.getCard(VmcCompaniesKeyNames.CENTER, loggedUserWrapper, 'valid')

      // Then
      expect(card).toMatchObject(mockedCreditCard)
    })
  })
})
