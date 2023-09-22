import { User } from '@/schemas/user'
import { BadRequestException } from '@nestjs/common'
import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'

export class Booker {
  // user data
  @prop({ type: String, required: false })
  @Type(() => String)
  @Expose({ name: 'id' })
  protected _id?: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'name' })
  protected _name: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'lastName' })
  protected _lastName: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'billingName' })
  protected _billingName: string

  // user contact
  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'phone' })
  protected _phone: string

  @prop({ type: String, required: false })
  @Type(() => String)
  @Expose({ name: 'email' })
  protected _email?: string

  // TODO: when new admin comes, refactor those payment data to store them in their own object
  // user data only for online bookings
  @prop({ type: String, required: false })
  @Type(() => String)
  protected _customerId?: string

  // payment data (only for online bookings)
  @prop({ type: String, required: false })
  @Type(() => String)
  protected _paymentIntentId?: string

  @prop({ type: String, required: false })
  @Type(() => String)
  protected _authorizeId?: string

  @prop({ type: String, required: false })
  @Type(() => String)
  protected _refundId?: string

  @prop({ type: String, required: false })
  @Type(() => String)
  @Expose({ name: 'invoice' })
  protected _invoice?: string

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(user: User, billingName?: string): Booker {
    const booker = new Booker()

    booker._id = user._id.toString()
    booker._name = user.name
    booker._lastName = user.lastName
    booker._email = user.email
    booker._phone = user.phone
    booker._billingName = billingName || user.getFullName()
    booker._customerId = user.centerClientProfile.customerId

    return booker
  }

  public static ofCustomAdminRequest(name: string, lastName: string, phone: string, email?: string, billingName?: string): Booker {
    const booker = new Booker()

    booker._name = name
    booker._lastName = lastName
    booker._phone = phone
    booker._email = email
    booker._billingName = billingName || `${name} ${lastName}`

    return booker
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get id():              string | undefined  { return this._id               }
  public get name():            string              { return this._name             }
  public get lastName():        string              { return this._lastName         }
  public get billingName():     string              { return this._billingName      }
  public get phone():           string              { return this._phone            }
  public get email():           string | undefined  { return this._email            }
  public get customerId():      string | undefined  { return this._customerId       }
  public get paymentId():       string | undefined  { return this._paymentIntentId  }
  public get authorizeId():     string | undefined  { return this._authorizeId      }
  public get refundId():        string | undefined  { return this._refundId         }
  public get invoice():         string | undefined  { return this._invoice          }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */

  /* >==== MAIN METHODS ====> */

  setPaymentId(id: string): void {
    this._paymentIntentId = id
  }

  setRefundId(id: string): void {
    this._refundId = id
  }

  isARegisteredUser(): boolean {
    return !!this._id
  }
}

export class RegisteredUserBooker extends Booker {
  @prop({ type: String })
  @Type(() => String)
  @Expose({ name: 'id' })
  protected _id: string

  @prop({ type: String })
  @Type(() => String)
  @Expose({ name: 'email' })
  protected _email: string

  @prop({ type: String })
  @Type(() => String)
  @Expose({ name: 'paymentIntentId' })
  protected _paymentIntentId: string

  /* >==== INIT ====> */
  protected constructor() {
    super()
  }

  /**
   * @deprecated this method will throw an error if used, as it doesn't initalize correctly a {@link RegisteredUserBooker}. Use {@link of} instead.
   * @returns nothing. Will throw an error
   */
  public static ofCustomAdminRequest(): Booker {
    throw new BadRequestException(`Cannot instantiate a ${RegisteredUserBooker.name} from the "ofCustomAdminRequest()" method`)
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get id():        string  { return this._id               }
  public get email():     string  { return this._email            }
  public get paymentId(): string  { return this._paymentIntentId  }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */
}

export class CustomAdminBooker extends Booker {
  @prop({ type: undefined })
  @Type()
  @Expose({ name: 'id' })
  protected _id: undefined

  /* >==== INIT ====> */
  protected constructor() {
    super()
  }

  /**
   * @deprecated this method will throw an error if used, as it doesn't initalize correctly a {@link CustomAdminBooker}. Use {@link ofCustomAdminRequest} instead.
   * @returns nothing. Will throw an error
   */
  public static of(): Booker {
    throw new BadRequestException(`Cannot instantiate a ${CustomAdminBooker.name} from the "of()" method`)
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get id():  undefined  { return this._id  }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */
}
