import { PaymentProviderStatuses } from './payment-provider.enum'

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

  interface ICreditCardPayload {
    owner?: string
    cardNumber: string
    expirationMonth: number
    expirationYear: number
    cvc: number
  }

  interface IDateOfBirth {
    day: number
    month: number
    year: number
  }
  interface IPersonalInfoPayload {
    name?: string
    lastName?: string
    address?: IStrictAddress
    email?: string
    phone?: string
    dateOfBirth?: IDateOfBirth
    // identityFileIdFront?: string
    // identityFileIdBack?: string
  }

  // eslint-disable-next-line prettier/prettier
  interface IStrictPersonalInfoPayload implements IPersonalInfoPayload {
    name: string
    lastName: string
    address: IStrictAddress
    email: string
    phone: string
    dateOfBirth: IDateOfBirth
    // identityFileIdFront: string
    // identityFileIdBack: string
  }

  type TSubmitFunction = (alert?: IAlertControl) => Promise<IRequestResult<ICreditCard>>
  type TSetupSubmitFunction = (alert?: IAlertControl) => Promise<IRequestResult<ICreditCard>>
  type TPaymentSubmitFunction = (clientSecret: string, alert?: IAlertControl) => Promise<IRequestResult<boolean>>
  type TMountInputType = 'payment' | 'setup'

  interface IPaymentProviderAPI {
    getPaymentMethods: (alert?: IAlertControl) => Promise<IRequestResult<ICreditCard[]>>
    getPaymentMethod: (paymentMethodId: string, alert?: IAlertControl) => Promise<IRequestResult<ICreditCard>>
    addPaymentMethod?: (payload: ICreditCardPayload, alert?: IAlertControl) => Promise<IRequestResult<ICreditCard>>
    deletePaymentMethod: (paymentMethodId: string, alert?: IAlertControl) => Promise<IRequestResult<boolean>>
    getDefaultPaymentMethod: (alert?: IAlertControl) => Promise<IRequestResult<ICreditCard>>
    updateDefaultPaymentMethod: (paymentMethodId: string, alert?: IAlertControl) => Promise<IRequestResult<boolean>>
    mountSetupInput: (elementWrapper: HTMLElement) => Promise<TSetupSubmitFunction>
    mountPaymentInput: (elementWrapper: HTMLElement, amount: number) => Promise<TPaymentSubmitFunction>
    confirmPayment: (paymentClientSecret: string, paymentMethodId: string, alert?: IAlertControl) => Promise<IRequestResult<boolean>>
    createAccountToken: (personalInformations: IPersonalInfoPayload, alert?: IAlertControl) => Promise<IRequestResult<string>>
    /* ==== LEGACY CODE => KEPT FOR DOCUMENTATION PURPOSES ==== */
    // createBankAccountToken: (iban: string, alert?: IAlertControl) => Promise<IRequestResult<string>>
    uploadIdCard: (idCardFile: File, alert?: IAlertControl) => Promise<IRequestResult<string>>
  }

  interface IPaymentIntentResponse {
    paymentIntentId: string
    clientSecret?: string
    status: PaymentProviderStatuses
  }
}
