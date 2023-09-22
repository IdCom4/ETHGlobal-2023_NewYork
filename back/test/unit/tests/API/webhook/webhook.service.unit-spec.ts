import { WebhookService } from '@Api/webhook/webhook.service'
import { instance, mock, when } from 'ts-mockito'
import { BookingsService } from '@Api/bookings/bookings.service'
import { MissionsService } from '@Api/missions/missions.service'
import { ProfessionalRepository } from '@/repositories'
import { PaymentsService } from '@Api/payments/payments.service'
import { DocumentTypes, VmcCompaniesKeyNames } from '@Common/enums'
import { PaymentAPI } from '@Common/external-service-providers-api/payment/payment.api'
import { DataWrapper, InstantiatingDataWrapper } from '@Common/classes'
import { ProfessionalUser, User } from '@Schemas/user'

const mockedUser = User.of('John', 'Doe', '0612345678', 'john@doe.fr', 'password')

describe('Controller - WebhookController', () => {
  let service: WebhookService

  beforeAll(() => {
    const mockedPaymentAPI = buildPaymentAPIMock()
    const bookingsService = mock(BookingsService)
    const missionsService = mock(MissionsService)
    const professionalRepository = buildProfessionalRepositoryMock()
    const paymentService = mock(PaymentsService)

    service = new WebhookService(
      instance(mockedPaymentAPI),
      instance(bookingsService),
      instance(missionsService),
      instance(professionalRepository),
      instance(paymentService)
    )
  })

  it('should success when handling stripe payment webhook', async () => {
    // Given
    const rawBody = 'rawBody'
    const signature = 'signature'
    const vmcCompaniesKeyName = VmcCompaniesKeyNames.PLATEFORME

    // When
    const webhookTook = async (): Promise<void> => await service.handlePaymentWebhookEvent(rawBody, signature, vmcCompaniesKeyName)

    // Then
    await expect(webhookTook()).resolves.not.toThrow()
  })

  describe('When requesting to handle stripe account webhook', () => {
    it('should success with valid request', async () => {
      // Given
      const rawBody = `{"id": "${mockedUser._id.toString()}"}`
      const signature = 'signature'
      const vmcCompaniesKeyName = VmcCompaniesKeyNames.PLATEFORME

      // When
      const webhookTook = async (): Promise<void> => await service.handleAccountWebhookEvent(rawBody, signature, vmcCompaniesKeyName)

      // Then
      await expect(webhookTook()).resolves.not.toThrow()
    })

    it('should fail When handling stripe account webhook', async () => {
      // Given
      const rawBody = '{}'
      const signature = 'signature'
      const vmcCompaniesKeyName = VmcCompaniesKeyNames.PLATEFORME

      // When
      const webhookTook = async (): Promise<void> => await service.handleAccountWebhookEvent(rawBody, signature, vmcCompaniesKeyName)

      // Then
      await expect(webhookTook()).rejects.toThrow()
    })
  })
})

function buildPaymentAPIMock(): PaymentAPI {
  const mockedPaymentAPI = mock<PaymentAPI>()

  when(mockedPaymentAPI.convertWebhookPayloadToPaymentEvent).thenReturn(() => {
    return DataWrapper.fromData(
      Promise.resolve({
        eventType: 'payment',
        eventStatus: 'success',
        paymentId: 'ct_65z1eg651z61g5z1',
        documentType: DocumentTypes.MISSION,
        documentId: '5f9f5f5f5f5f5f5f5f5f5f5f',
        metadata: {},
      })
    )
  })
  when(mockedPaymentAPI.convertWebhookPayloadToAccountEvent).thenReturn((rawBody) => {
    const parsedBody = JSON.parse(rawBody.toString())
    return DataWrapper.fromData(Promise.resolve({ accountId: parsedBody.id, pastDue: [], metadata: {} }))
  })

  return mockedPaymentAPI
}

function buildProfessionalRepositoryMock(): ProfessionalRepository {
  const mockedProfessionalRepository = mock<ProfessionalRepository>()

  when(mockedProfessionalRepository.findProfessionalByAccountId).thenReturn((accountId) => {
    if (accountId === mockedUser._id.toString()) return InstantiatingDataWrapper.fromData(Promise.resolve(mockedUser) as Promise<ProfessionalUser>)
    return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<ProfessionalUser>)
  })

  return mockedProfessionalRepository
}
