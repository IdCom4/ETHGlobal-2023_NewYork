import { PaymentProviderStatuses } from '@/types/external_APIs/payment-provider.enum'

export {}

declare global {
  interface IPaymentData {
    paymentIntentId: string
    status: PaymentProviderStatuses
    refundId?: string
  }
}
