import { WebhookController } from '@Api/webhook/webhook.controller'
import { WebhookService } from '@Api/webhook/webhook.service'
import { instance, mock } from 'ts-mockito'
import { MessageResponse } from '@Common/request-io/responses-dto'
import { VmcCompaniesKeyNames } from '@Common/enums'

describe('Controller - WebhookController', () => {
  let webhookController: WebhookController
  let mockedWebhookService: WebhookService

  beforeEach(() => {
    mockedWebhookService = mock(WebhookService)
    webhookController = new WebhookController(instance(mockedWebhookService))
  })

  describe('When handling stripe webhook', () => {
    it('should success with a valid webhook', async () => {
      const response = await webhookController.handleStripeWebhook(VmcCompaniesKeyNames.PLATEFORME, { rawBody: 'someRawBody' }, 'signature')

      expect(response.statusCode).toEqual(200)
    })

    describe('With an invalid request', () => {
      it('should fail with missing eventSignature', async () => {
        // When

        const requesting = async (): Promise<MessageResponse> =>
          await webhookController.handleStripeWebhook(VmcCompaniesKeyNames.PLATEFORME, { rawBody: 'someRawBody' }, '')

        await expect(requesting).rejects.toThrow()
      })

      it('should fail with missing eventSignature', async () => {
        // When

        const requesting = async (): Promise<MessageResponse> =>
          await webhookController.handleStripeWebhook(VmcCompaniesKeyNames.CENTER, {}, 'signature')

        await expect(requesting).rejects.toThrow()
      })
    })
  })

  describe('When handling stripe account webhook', () => {
    it('should success with a valid webhook', async () => {
      const response = await webhookController.handleAccountWebhook(VmcCompaniesKeyNames.PLATEFORME, { rawBody: 'someRawBody' }, 'signature')

      expect(response.statusCode).toEqual(200)
    })

    describe('With an invalid request', () => {
      it('should fail with missing eventSignature', async () => {
        // When

        const requesting = async (): Promise<MessageResponse> =>
          await webhookController.handleAccountWebhook(VmcCompaniesKeyNames.PLATEFORME, { rawBody: 'someRawBody' }, '')

        await expect(requesting).rejects.toThrow()
      })

      it('should fail with missing eventSignature', async () => {
        // When

        const requesting = async (): Promise<MessageResponse> =>
          await webhookController.handleAccountWebhook(VmcCompaniesKeyNames.CENTER, {}, 'signature')

        await expect(requesting).rejects.toThrow()
      })
    })
  })
})
