import { Inject, Injectable } from '@nestjs/common'
import { PaymentAPI } from '@/common/external-service-providers-api/payment/payment.api'
import { VmcCompaniesKeyNames } from '@/common/enums/payments'
import { BookingsService } from '@/API/bookings/bookings.service'
import { DocumentTypes } from '@/common/enums'
import { MissionsService } from '../missions/missions.service'
import { ProfessionalRepository } from '@/repositories'
import { ProfessionalUser } from '@/schemas/user'
import { ProfessionalNotFoundException } from '@/common/exceptions/schemas'
import { PaymentsService } from '../payments/payments.service'

@Injectable()
export class WebhookService {
  constructor(
    @Inject('PaymentAPI') private readonly paymentAPI: PaymentAPI,
    private readonly bookingsService: BookingsService,
    private readonly missionsService: MissionsService,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly paymentService: PaymentsService
  ) {}

  /**
   * Handle a webhook event from Stripe.
   * @see https://stripe.com/docs/webhooks
   *
   * @param rawBody The raw body of the request.
   * @param signature The event signature.
   * @param vmcCompaniesKeyName The company key name.
   */
  public async handlePaymentWebhookEvent(rawBody: string | Buffer, signature: string, vmcCompaniesKeyName: VmcCompaniesKeyNames): Promise<void> {
    const paymentEvent: IPaymentEvent = await this.paymentAPI
      .convertWebhookPayloadToPaymentEvent(rawBody, signature, vmcCompaniesKeyName)
      .getOrThrow()

    if (paymentEvent.eventType === 'payment') {
      if (!paymentEvent.paymentId) return

      // update status of the payment in the database
      if (paymentEvent.documentType === DocumentTypes.BOOKING) await this.bookingsService.updateBookingByEvent(paymentEvent)
      if (paymentEvent.documentType === DocumentTypes.MISSION) await this.missionsService.validateClientPayment(paymentEvent)
    }
  }

  public async handleAccountWebhookEvent(rawBody: string | Buffer, signature: string, vmcCompaniesKeyName: VmcCompaniesKeyNames): Promise<void> {
    const accountEvent: IAccountEvent = await this.paymentAPI
      .convertWebhookPayloadToAccountEvent(rawBody, signature, vmcCompaniesKeyName)
      .getOrThrow()

    const professional: ProfessionalUser = await this.professionalRepository
      .findProfessionalByAccountId(accountEvent.accountId)
      .getOrThrow(new ProfessionalNotFoundException())
    await this.paymentService.updateAndSavePaymentAccount(professional, accountEvent.pastDue)
  }
}
