import { UserGroups } from '@/common/enums'
import { PaymentProviderStatuses } from '@/common/enums/payments'
import { prop } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'

export class PaymentData {
  @prop({ required: true, _id: false })
  @Expose({ name: 'paymentIntentId', groups: [UserGroups.ADMIN_REQUEST] })
  protected _paymentIntentId: string

  @prop({ required: true, _id: false })
  @Expose({ name: 'status', groups: [UserGroups.ADMIN_REQUEST] })
  protected _status: PaymentProviderStatuses

  @prop({ required: false, _id: false })
  @Expose({ name: 'refundId', groups: [UserGroups.ADMIN_REQUEST] })
  protected _refundId?: string

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(paymentIntentId: string, status: PaymentProviderStatuses): PaymentData {
    const data = new PaymentData()

    data._paymentIntentId = paymentIntentId
    data._status = status

    return data
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get paymentIntentId():    string                      { return this._paymentIntentId    }
  get status():             PaymentProviderStatuses     { return this._status             }                      
  get refundId():           string | undefined          { return this._refundId           }
  /* eslint-enable prettier/prettier */

  /* >==== METHODS ====> */

  public setStatus(status: PaymentProviderStatuses): void {
    this._status = status
  }

  public setRefundId(refundId: string, status: PaymentProviderStatuses): void {
    this._refundId = refundId
    this.setStatus(status)
  }

  public update(status: PaymentProviderStatuses, paymentId?: string): void {
    if (paymentId) this._paymentIntentId = paymentId
    this.setStatus(status)
  }
}

export abstract class PaymentDataBlueprint extends PaymentData {
  public _paymentIntentId: string
  public _status: PaymentProviderStatuses
  public _refundId?: string
}
