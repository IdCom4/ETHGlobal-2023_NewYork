import { Controller, Post, Param, Headers, BadRequestException } from '@nestjs/common'
import { MessageResponse } from '@Common/request-io/responses-dto/message.dto'
import { Req } from '@nestjs/common/decorators'
import { WebhookService } from './webhook.service'
import { VmcCompaniesKeyNames } from '@/common/enums'
import { VmcCompaniesValidationPipe } from '@/common/request-io/query-validation-pipes/vmc-companies.validation-pipes'

@Controller('webhook/:COMPANY')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  /**
   * Handle a webhook event from Stripe.
   * @see https://stripe.com/docs/webhooks
   *
   * @param company The company key name.
   * @param rawBody The raw body of the request.
   * @param eventSignature Signature of the event contained in the header request
   * @return {MessageResponse} The response.
   */
  @Post('stripe')
  async handleStripeWebhook(
    @Param('COMPANY', new VmcCompaniesValidationPipe()) company: VmcCompaniesKeyNames,
    @Req() { rawBody }: { rawBody?: string | Buffer },
    @Headers('stripe-signature') eventSignature: string
  ): Promise<MessageResponse> {
    if (!eventSignature || !rawBody) throw new BadRequestException('Missing signature or body')

    //construct event and check webhook signature
    await this.webhookService.handlePaymentWebhookEvent(rawBody, eventSignature, company)

    return new MessageResponse(200, 'Webhook géré avec succès')
  }

  @Post('stripe/account')
  async handleAccountWebhook(
    @Param('COMPANY', new VmcCompaniesValidationPipe()) company: VmcCompaniesKeyNames,
    @Req() { rawBody }: { rawBody?: string | Buffer },
    @Headers('stripe-signature') eventSignature: string
  ): Promise<MessageResponse> {
    if (!eventSignature || !rawBody) throw new BadRequestException('Missing signature or body')

    await this.webhookService.handleAccountWebhookEvent(rawBody, eventSignature, company)

    return new MessageResponse(200, 'Webhook géré avec succès')
  }
}
