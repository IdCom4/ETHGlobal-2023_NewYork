import { PaymentProviderStatuses } from '@/common/enums/payments'

export class PaymentIntentResponse {
  constructor(public readonly paymentIntentId: string, public readonly status: PaymentProviderStatuses, public readonly clientSecret?: string) {}
}
