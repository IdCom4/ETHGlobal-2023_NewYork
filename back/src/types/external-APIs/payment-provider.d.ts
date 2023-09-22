import { DocumentTypes } from '@/common/enums'
import { VmcCompaniesKeyNames } from '@/common/enums/payments'
import { PaymentProviderStatuses, RefundProviderStatuses } from '@/common/enums/payments/payment-provider.enum'
import { TDocumentData } from '@/common/external-service-providers-api/payment/payment.api'

export {}

declare global {
  interface ICreditCard {
    id: string
    /**
     * Card brand. Can be `amex`, `diners`, `discover`, `jcb`, `mastercard`, `unionpay`, `visa`, or `unknown`.
     */
    brand: string

    /**
     * Two-letter ISO code representing the country of the card. You could use this attribute to get a sense of the international breakdown of cards you've collected.
     */
    country: string | null

    /**
     * A high-level description of the type of cards issued in this range. (For internal use only and not typically available in standard API requests.)
     */
    description?: string | null

    /**
     * Two-digit number representing the card's expiration month.
     */
    expMonth: number

    /**
     * Four-digit number representing the card's expiration year.
     */
    expYear: number

    /**
     * Uniquely identifies this particular card number. You can use this attribute to check whether two customers who've signed up with you are using the same card number, for example. For payment methods that tokenize card information (Apple Pay, Google Pay), the tokenized number might be provided instead of the underlying card number.
     *
     * *Starting May 1, 2021, card fingerprint in India for Connect will change to allow two fingerprints for the same card --- one for India and one for the rest of the world.*
     */
    fingerprint?: string | null

    /**
     * Card funding type. Can be `credit`, `debit`, `prepaid`, or `unknown`.
     */
    funding: string

    /**
     * Issuer identification number of the card. (For internal use only and not typically available in standard API requests.)
     */
    iin?: string | null

    /**
     * The name of the card's issuing bank. (For internal use only and not typically available in standard API requests.)
     */
    issuer?: string | null

    /**
     * The last four digits of the card.
     */
    last4: string

    /**
     * Whether 3D Secure is supported on this card.
     */
    threeDSecureSupported: boolean | null
  }

  type TVmcCompanyKeyName = VmcCompaniesKeyNames

  type TDebitCardIntentClientSecret = string

  interface IPaymentResponse {
    status: PaymentProviderStatuses
    paymentIdClientSecret?: string
    paymentId: string
  }

  interface IRefundResponse {
    status: RefundProviderStatuses
    refundId: string
  }

  type TPaymentEventType = 'payment' | 'charge'
  type TPaymentEventStatus = 'success' | 'failed' | 'require_action' | 'canceled' | 'partially_funded'

  interface IPaymentEvent {
    eventType: TPaymentEventType
    eventStatus: TPaymentEventStatus
    paymentId?: string
    documentType: DocumentTypes
    documentId: string
    metadata: Record<string, string>
  }

  type TAccountEventType = 'account'
  type TAccountEventStatus = 'updated'
  interface IAccountEvent {
    accountId: string
    pastDue: Array<string>
    metadata: Record<string, string>
  }

  interface ICreditCardPayload {
    owner?: string
    cardNumber: string
    expirationMonth: number
    expirationYear: number
    cvc: number
  }

  interface IPaymentIntentPayload {
    amountInEuros: number
    currency?: 'eur'
    customerId: string
    setupFutureUsage?: 'on_session' | 'off_session'
    documentData: TDocumentData
    metadata?: Record<string, string>
    creditCardId?: string
    confirm?: boolean
    vmcCompanyAccountName: VmcCompaniesKeyNames
  }
}
