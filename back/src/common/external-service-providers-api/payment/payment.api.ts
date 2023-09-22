import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import { PaymentProviderStatuses, RefundProviderStatuses } from '@/common/enums/payments/payment-provider.enum'
import { CardNotFountException } from '@/common/exceptions/schemas/payment/credit-card-not-found.exception'
import { User } from '@/schemas/user'
import { VmcCompaniesKeyNames } from '@/common/enums/payments'
import { DataWrapper } from '@Common/classes'
import { DocumentTypes } from '@/common/enums/schemas'

export type TDocumentData = { documentType: DocumentTypes; documentId: string }
export type TAccountResponse = { accountId: string; pastDue: Array<string> }

/**
 * Represents the behavior of a payment API
 * and so abstract the implementation details of each possible payment API.
 *
 * A payment API is the entry point to an external payment service.
 * It is used for interacting with a payment service.
 */
export interface PaymentAPI {
  /**
   * Retrieves a new credit card creation key of a customer.
   * @param {String} customerId                        The ID of the customer.
   * @param {TVmcCompanyKeyName} vmcCompanyAccountName The VMC company account name.
   * @returns A DataWrapper containing the new credit card creation key.
   */
  getNewCreditCardCreationKey(customerId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<string>>

  /**
   * Retrieves a credit card of a customer.
   * @param {String} customerId            The ID of the customer.
   * @param {String} creditCardId          The ID of the credit card.
   * @param {TVmcCompanyKeyName} vmcCompanyAccountName The VMC company account name.
   * @returns A DataWrapper containing the retrieved credit card.
   */
  getCreditCard(customerId: string, creditCardId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<ICreditCard>>

  /**
   * Retrieves a list of credit cards of a customer.
   * @param {String} customerId            The ID of the customer.
   * @param {TVmcCompanyKeyName} vmcCompanyAccountName The VMC company account name.
   * @returns A DataArrayWrapper containing the list of credit cards.
   */
  getCreditCardList(customerId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<ICreditCard[]>>

  /**
   * Deletes a credit card of a customer.
   * @param {String} customerId            The ID of the customer.
   * @param {String} creditCardId          The ID of the credit card.
   * @param {TVmcCompanyKeyName} vmcCompanyAccountName The VMC company account name.
   * @returns A DataWrapper indicating whether the deletion was successful.
   */
  deleteCreditCard(customerId: string, creditCardId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<boolean>>

  /**
   * Retrieves the default credit card of a customer.
   * @param {String} customerId The ID of the customer.
   * @param {TVmcCompanyKeyName} vmcCompanyAccountName The VMC company account name.
   * @returns A DataWrapper containing the default credit card.
   */
  getDefaultCreditCard(customerId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<ICreditCard>>

  /**
   * Debits a credit card for a specified amount.
   * @param {String} customerId   The ID of the customer.
   * @param {String} creditCardId The ID of the credit card.
   * @param {number} amount       The amount to debit.
   * @param {TVmcCompanyKeyName}  vmcCompanyAccountName - The VMC company account name.
   * @param {TDocumentData} documentData The information of the document related to the payment
   * @param {Record<string, string>} metadata An object with any wanted metadata
   * @returns A DataWrapper containing the payment responses.
   */
  // eslint-disable-next-line prettier/prettier
  debitCreditCard(customerId: string, creditCardId: string, amount: number, vmcCompanyAccountName: TVmcCompanyKeyName, documentData: TDocumentData, metadata?: Record<string, string>): DataWrapper<Promise<IPaymentResponse>>

  /**
   * Setup a payment that the client have to pay locally
   * @param {IPaymentIntentPayload} payload   The payload with all required data to create the payment intent.
   * @param {Stripe} stripe the stripe instance
   * @returns A DataWrapper containing the payment response.
   */
  createPaymentIntent(payload: IPaymentIntentPayload, stripe?: Stripe): DataWrapper<Promise<IPaymentResponse>>

  /**
   * Sets a credit card as the default of a customer.
   * @param {String} customerId                        The ID of the customer.
   * @param {String} creditCardId                      The ID of the credit card.
   * @param {TVmcCompanyKeyName} vmcCompanyAccountName The VMC company account name.
   * @returns A DataWrapper indicating whether the setting of the default credit card was successful.
   */
  setDefaultCreditCard(customerId: string, creditCardId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<boolean>>

  /**
   * Refunds a payment for a specified payment intent.
   * @param {String} paymentIntentId                   The ID of the payment intent.
   * @param {TVmcCompanyKeyName} vmcCompanyAccountName The VMC company account name.
   * @param {number} amount                            The amount to refund (optional).
   * @returns A DataWrapper containing the refund responses.
   */
  refundPayment(paymentIntentId: string, vmcCompanyAccountName: TVmcCompanyKeyName, amount?: number): DataWrapper<Promise<IRefundResponse>>

  /**
   * Creates a customer in the payment system.
   * @param {User} user                                The user for whom the customer is created.
   * @param {TVmcCompanyKeyName} vmcCompanyAccountName The VMC company account name.
   * @returns A DataWrapper containing the ID of the created customer.
   */
  createCustomer(user: User, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<string>>

  /**
   * Creates an account for a user
   * @param user The user the account is for
   * @param accountToken The account token created by stripe in the frontend
   * @param vmcCompanyAccountName The VMC company name related to the transfer operation
   *
   * @returns the account id
   */
  createAccount(user: User, accountToken: string, vmcCompanyAccountName: TVmcCompanyKeyName): Promise<TAccountResponse>

  /**
   * Update an account for a user
   * @param user The user the account is for
   * @param accountToken The account token created by stripe in the frontend
   * @param vmcCompanyAccountName The VMC company name related to the transfer operation
   *
   * @returns the account id
   */
  updateAccount(accountId: string, accountToken: string, vmcCompanyAccountName: TVmcCompanyKeyName): Promise<TAccountResponse>

  /**
   * Transfer funds from VMC vault to the customer
   * @param documentId The Id of the document related to the transfer operation
   * @param customerAccountId The accountId of the customer
   * @param transferAmountInEuros The amount to transfer in euros
   * @param vmcCompanyAccountName The VMC company name related to the transfer operation
   *
   * @returns the transfer id
   */
  // eslint-disable-next-line prettier/prettier
  transferFundsToCustomerAccount(documentId: string, customerAccountId: string, transferAmountInEuros: number, vmcCompanyAccountName: TVmcCompanyKeyName): Promise<string>

  createAndAssignIBAN(accountId: string, iban: string, vmcCompanyAccountName: TVmcCompanyKeyName): Promise<void>

  verifyIdentityDocument(
    accountId: string,
    vmcCompanyAccountName: TVmcCompanyKeyName,
    identityDocumentRecto?: TBase64File,
    identityDocumentVerso?: TBase64File
  ): Promise<void>

  convertWebhookPayloadToPaymentEvent(
    rawBody: string | Buffer,
    signature: string,
    vmcCompanyAccountName: TVmcCompanyKeyName
  ): DataWrapper<Promise<IPaymentEvent>>

  convertWebhookPayloadToAccountEvent(
    rawBody: string | Buffer,
    signature: string,
    vmcCompanyAccountName: TVmcCompanyKeyName
  ): DataWrapper<Promise<IAccountEvent>>
}

/**
 * Implementation of {@link PaymentAPI} for Stripe.
 */
@Injectable()
export class StripePaymentAPI implements PaymentAPI {
  private _stripe: Stripe[] = []

  constructor(private readonly configService: ConfigService) {
    Object.values(VmcCompaniesKeyNames).map((key) => (this._stripe[key] = this.getStripe(key)))
  }

  public async createAndAssignIBAN(accountId: string, iban: string, vmcCompanyAccountName: TVmcCompanyKeyName): Promise<void> {
    const stripe = this._stripe[vmcCompanyAccountName]

    await stripe.accounts.createExternalAccount(accountId, {
      external_account: {
        object: 'bank_account',
        country: 'FR',
        currency: 'eur',
        account_number: iban,
      },
    })
  }

  public async verifyIdentityDocument(
    accountId: string,
    vmcCompanyAccountName: TVmcCompanyKeyName,
    identityDocumentRecto?: TBase64File,
    identityDocumentVerso?: TBase64File
  ): Promise<void> {
    const stripe = this._stripe[vmcCompanyAccountName] as Stripe

    const account = await stripe.accounts.retrieve(accountId)

    if (!account.individual?.id) throw new NotFoundException("Person_id associé à l'account Stripe inctrouvable")

    await stripe.accounts.updatePerson(accountId, account.individual?.id, {
      verification: {
        document: {
          front: identityDocumentRecto,
          back: identityDocumentVerso,
        },
      },
    })
  }

  public async createAccount(user: User, accountToken: string, vmcCompanyAccountName: TVmcCompanyKeyName): Promise<TAccountResponse> {
    const stripe = this._stripe[vmcCompanyAccountName] as Stripe

    const params: Stripe.AccountCreateParams = {
      country: 'FR',
      default_currency: 'EUR',
      email: user.email,
      type: 'custom',
      business_profile: {
        mcc: '7538',
        url: 'valuemycar.fr',
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      account_token: accountToken,
    }

    const account = await stripe.accounts.create(params)

    return { accountId: account.id, pastDue: account.requirements?.past_due || [] }
  }

  public async updateAccount(accountId: string, accountToken: string, vmcCompanyAccountName: TVmcCompanyKeyName): Promise<TAccountResponse> {
    const stripe = this._stripe[vmcCompanyAccountName] as Stripe

    const params: Stripe.AccountUpdateParams = {
      account_token: accountToken,
    }

    const account = await stripe.accounts.update(accountId, params)

    return { accountId: account.id, pastDue: account.requirements?.past_due || [] }
  }

  public createCustomer(user: User, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<string>> {
    const stripe = this._stripe[vmcCompanyAccountName]

    const customerIdPromise = (async (): Promise<string> => (await stripe.customers.create({ name: user.getFullName() })).id)()

    return DataWrapper.fromData(customerIdPromise)
  }

  public getNewCreditCardCreationKey(customerId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<string>> {
    const stripe = this._stripe[vmcCompanyAccountName]

    const clientSecret = (async (): Promise<string | null> =>
      (await stripe.setupIntents.create({ payment_method_types: ['card'], customer: customerId })).client_secret)() as Promise<string>

    return DataWrapper.fromData(clientSecret)
  }

  public getCreditCard(customerId: string, creditCardId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<ICreditCard>> {
    const stripe = this._stripe[vmcCompanyAccountName]

    const creditCard = (async (): Promise<ICreditCard | null> => {
      const stripeCard = await stripe.customers.retrievePaymentMethod(customerId, creditCardId)
      if (!stripeCard) throw new CardNotFountException()
      return this.stripePaymentMethodToCard(stripeCard)
    })() as Promise<ICreditCard>

    return DataWrapper.fromData(creditCard)
  }

  public getCreditCardList(customerId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<ICreditCard[]>> {
    const stripe = this._stripe[vmcCompanyAccountName]

    const creditCardsPromise = (async (): Promise<ICreditCard[]> => {
      const paymentMethods = (await stripe.customers.listPaymentMethods(customerId, { type: 'card' })).data

      const creditCards: ICreditCard[] = []
      for (const paymentMethod of paymentMethods) {
        const card = this.stripePaymentMethodToCard(paymentMethod)
        if (!card) continue

        creditCards.push(card)
      }

      return creditCards
    })() as Promise<ICreditCard[]>

    return DataWrapper.fromData(creditCardsPromise)
  }

  public deleteCreditCard(customerId: string, creditCardId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<boolean>> {
    const stripe = this._stripe[vmcCompanyAccountName]

    const hasBeenDeleted = (async (): Promise<boolean> => {
      await this.getCreditCard(customerId, creditCardId, vmcCompanyAccountName).getOrThrow('')

      return !!(await stripe.paymentMethods.detach(creditCardId))
    })()

    return DataWrapper.fromData(hasBeenDeleted)
  }

  public getDefaultCreditCard(customerId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<ICreditCard>> {
    const stripe = this._stripe[vmcCompanyAccountName]

    const defaultCard = (async (): Promise<ICreditCard | null> => {
      const customer = (await stripe.customers.retrieve(customerId, {
        expand: ['invoice_settings.default_payment_method'],
      })) as Stripe.Customer

      if (!customer.invoice_settings.default_payment_method) throw new CardNotFountException()
      return this.stripePaymentMethodToCard(customer.invoice_settings.default_payment_method as Stripe.PaymentMethod)
    })() as Promise<ICreditCard>

    return DataWrapper.fromData(defaultCard)
  }

  public debitCreditCard(
    customerId: string,
    creditCardId: string,
    amount: number,
    vmcCompanyAccountName: VmcCompaniesKeyNames,
    documentData: TDocumentData,
    metadata: Record<string, string> = {}
  ): DataWrapper<Promise<IPaymentResponse>> {
    const paymentIntentPromise = (async (): Promise<IPaymentResponse> => {
      const paymentIntentResponse = await this.createAndDebitPaymentIntent(
        customerId,
        creditCardId,
        amount,
        vmcCompanyAccountName,
        documentData,
        metadata
      )

      return paymentIntentResponse
    })()

    return DataWrapper.fromData(paymentIntentPromise)
  }
  public createPaymentIntent(payload: IPaymentIntentPayload): DataWrapper<Promise<IPaymentResponse>> {
    const paymentIntentPromise = (async (): Promise<IPaymentResponse> => {
      // get stripeJs
      const stripe = this._stripe[payload.vmcCompanyAccountName]

      // create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(payload.amountInEuros * 100),
        currency: payload.currency || 'eur',
        customer: payload.customerId,
        payment_method: payload.creditCardId,
        payment_method_types: ['card'],
        setup_future_usage: payload.setupFutureUsage,
        confirm: payload.confirm || false,
        metadata: {
          ...payload.documentData,
          ...(payload.metadata || {}),
        },
      })

      // convert payment intent to inner response format
      return {
        paymentIdClientSecret: paymentIntent.client_secret || undefined,
        status: this.convertStripeStatusesToPaymentProviderStatuses(paymentIntent.status),
        paymentId: paymentIntent.id,
      }
    })()

    return DataWrapper.fromData(paymentIntentPromise)
  }

  public refundPayment(paymentIntentId: string, vmcCompanyAccountName: VmcCompaniesKeyNames, amount?: number): DataWrapper<Promise<IRefundResponse>> {
    const stripe = this._stripe[vmcCompanyAccountName]

    const refund = (async (): Promise<IRefundResponse> => {
      const refund = await stripe.refunds.create({ payment_intent: paymentIntentId, amount: amount })
      if (!refund.status) throw new InternalServerErrorException('Erreur rencontrée lors du remboursement')

      return {
        status: this.convertStripeStatusesToRefundProviderStatuses(refund.status),
        refundId: refund.id,
      }
    })()

    return DataWrapper.fromData(refund)
  }

  public setDefaultCreditCard(customerId: string, creditCardId: string, vmcCompanyAccountName: TVmcCompanyKeyName): DataWrapper<Promise<boolean>> {
    const stripe = this._stripe[vmcCompanyAccountName]

    const defaultCardSuccess = (async (): Promise<boolean> => {
      const customer = (await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: creditCardId,
        },
      })) as Stripe.Customer

      if (!customer.invoice_settings.default_payment_method) throw new CardNotFountException()
      return true
    })()

    return DataWrapper.fromData(defaultCardSuccess)
  }

  public async checkIfCustomerAccountCanReceivePayouts(customerId: string, vmcCompanyAccountName: TVmcCompanyKeyName): Promise<boolean> {
    const stripe = this._stripe[vmcCompanyAccountName]

    const account = await stripe.accounts.retrieve({}, { stripeAccount: customerId })

    return account.payouts_enabled
  }

  public async transferFundsToCustomerAccount(
    documentId: string,
    customerAccountId: string,
    transferAmountInEuros: number,
    vmcCompanyAccountName: TVmcCompanyKeyName
  ): Promise<string> {
    const stripe = this._stripe[vmcCompanyAccountName]

    // get account
    const account = await stripe.accounts.retrieve({}, { stripeAccount: customerAccountId })

    // check that it can receive payouts
    if (!account.payouts_enabled)
      throw new ForbiddenException("Le spécialiste n'a pas encore renseigné les informations banquaires requises pour recevoir un paiement")

    // create transfer payload
    const params: Stripe.TransferCreateParams = {
      amount: Math.round(transferAmountInEuros * 100),
      currency: 'EUR',
      destination: customerAccountId,
      transfer_group: documentId,
    }

    try {
      // try to transfer the funds
      const transfer = await stripe.transfers.create(params)
      return transfer.id
    } catch (e) {
      throw new BadRequestException(`Une erreur est survenue lors du transfert des fonds à l'utilisateur: ${e.message || e}`)
    }
  }

  public convertWebhookPayloadToPaymentEvent(
    rawBody: string | Buffer,
    signature: string,
    vmcCompanyAccountName: TVmcCompanyKeyName
  ): DataWrapper<Promise<IPaymentEvent>> {
    const stripe = this._stripe[vmcCompanyAccountName]

    const webhookSecret = <string>this.configService.get(`${vmcCompanyAccountName}_WEBHOOK`)

    if (!signature || typeof signature !== 'string') throw new BadRequestException('Invalid webhook signature')

    try {
      const event: Stripe.Event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)

      return DataWrapper.fromData(
        (async (): Promise<IPaymentEvent | null> => this.convertStripeEventToPaymentEvent(event))() as Promise<IPaymentEvent>
      )
    } catch (err) {
      throw new InternalServerErrorException(`Webhook Error: ${err.message}`)
    }
  }

  public convertWebhookPayloadToAccountEvent(
    rawBody: string | Buffer,
    signature: string,
    vmcCompanyAccountName: TVmcCompanyKeyName
  ): DataWrapper<Promise<IAccountEvent>> {
    const stripe = this._stripe[vmcCompanyAccountName]

    const webhookSecret = <string>this.configService.get(`${vmcCompanyAccountName}_WEBHOOK`)

    if (!signature || typeof signature !== 'string') throw new BadRequestException('Invalid webhook signature')

    try {
      const event: Stripe.Event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)

      return DataWrapper.fromData(
        (async (): Promise<IAccountEvent | null> => this.convertStripeEventToAccountEvent(event))() as Promise<IAccountEvent>
      )
    } catch (err) {
      throw new InternalServerErrorException(`Webhook Error: ${err.message}`)
    }
  }

  private getStripe(vmcCompanyAccountName: TVmcCompanyKeyName): Stripe {
    return new Stripe(<string>this.configService.get(vmcCompanyAccountName), { apiVersion: '2022-11-15' })
  }

  private convertStripeStatusesToPaymentProviderStatuses(statuses: Stripe.PaymentIntent.Status): PaymentProviderStatuses {
    switch (statuses) {
      case 'succeeded':
        return PaymentProviderStatuses.SUCCESS
      case 'canceled':
        return PaymentProviderStatuses.CANCELED
      case 'requires_payment_method':
        return PaymentProviderStatuses.REQUIRE_AUTHENTICATION
      case 'requires_action':
        return PaymentProviderStatuses.REQUIRE_AUTHENTICATION
      case 'requires_confirmation':
        return PaymentProviderStatuses.REQUIRE_AUTHENTICATION
      case 'processing':
        return PaymentProviderStatuses.PROCESSING
      default:
        return PaymentProviderStatuses.FAILED
    }
  }

  private convertStripeStatusesToRefundProviderStatuses(statuses: string): RefundProviderStatuses {
    switch (statuses) {
      case 'succeeded':
        return RefundProviderStatuses.SUCCESS
      case 'canceled':
        return RefundProviderStatuses.CANCELED
      case 'processing':
        return RefundProviderStatuses.PROCESSING
      default:
        return RefundProviderStatuses.FAILED
    }
  }

  private convertStripeEventToPaymentEvent(event: Stripe.Event): IPaymentEvent | null {
    let eventStatus: TPaymentEventStatus = 'failed'

    switch (event.type) {
      case 'payment_intent.canceled':
        eventStatus = 'canceled'
        // Then define and call a function to handle the event payment_intent.canceled
        break
      case 'payment_intent.partially_funded':
        eventStatus = 'partially_funded'
        // Then define and call a function to handle the event payment_intent.partially_funded
        break
      case 'payment_intent.payment_failed':
        eventStatus = 'failed'
        // Then define and call a function to handle the event payment_intent.payment_failed
        break
      case 'payment_intent.requires_action':
        eventStatus = 'require_action'
        // Then define and call a function to handle the event payment_intent.requires_action
        break
      case 'payment_intent.succeeded':
        eventStatus = 'success'
        // Then define and call a function to handle the event payment_intent.succeeded
        break
      // ... handle other event types
      default:
        return null
    }

    const paymentEvent: IPaymentEvent = {
      eventStatus,
      eventType: 'payment',
      paymentId: event.data.object['id'],
      documentType: event.data.object['metadata']['documentType'],
      documentId: event.data.object['metadata']['documentId'],
      metadata: event.data.object['metadata'],
    }

    return paymentEvent
  }

  private convertStripeEventToAccountEvent(event: Stripe.Event): IAccountEvent | null {
    switch (event.type) {
      case 'account.updated':
        // Then define and call a function to handle the event account.updated
        break
      // ... handle other event types
      default:
        return null
    }

    const paymentEvent: IAccountEvent = {
      accountId: event.data.object['id'],
      pastDue: event.data.object['requirements']['past_due'],
      metadata: event.data.object['metadata'],
    }

    return paymentEvent
  }

  private stripePaymentMethodToCard(paymentMethod: Stripe.PaymentMethod): ICreditCard | null {
    const creditCardStripe = paymentMethod.card
    if (!creditCardStripe) return null

    return {
      id: paymentMethod.id,
      brand: creditCardStripe.brand,
      country: creditCardStripe.country,
      expMonth: creditCardStripe.exp_month,
      expYear: creditCardStripe.exp_year,
      fingerprint: creditCardStripe.fingerprint,
      funding: creditCardStripe.funding,
      last4: creditCardStripe.last4,
      threeDSecureSupported: creditCardStripe.three_d_secure_usage?.supported || null,
    }
  }

  private async createAndDebitPaymentIntent(
    customerId: string,
    creditCardId: string,
    amountInEuros: number,
    vmcCompanyAccountName: VmcCompaniesKeyNames,
    documentData: TDocumentData,
    metadata: Record<string, string> = {}
  ): Promise<IPaymentResponse> {
    const stripe = this._stripe[vmcCompanyAccountName]

    try {
      const paymentResponse = await this.createPaymentIntent({
        customerId,
        amountInEuros,
        vmcCompanyAccountName,
        setupFutureUsage: 'off_session',
        confirm: true,
        creditCardId,
        documentData,
        metadata,
      }).getOrThrow()

      return paymentResponse
    } catch (err) {
      if (err.code && err.code === 'authentication_required') {
        const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id)

        return {
          status: PaymentProviderStatuses.REQUIRE_AUTHENTICATION,
          paymentIdClientSecret: paymentIntentRetrieved.client_secret || undefined,
          paymentId: paymentIntentRetrieved.id,
        }
      } else {
        throw err
      }
    }
  }
}
