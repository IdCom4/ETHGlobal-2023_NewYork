// Libs
import { Expose, Type } from 'class-transformer'
import { modelOptions, prop, Severity } from '@typegoose/typegoose'
// Schemas
import { TimestampedDBDocument } from '@Schemas/db-document.abstract-schema'
import { PromoCode } from '@Schemas/promo-code/promo-code.schema'
import { DateTimeRange } from '@Schemas/common/pojos'
import { Box, Formula } from '@Schemas/box'
import { User } from '@Schemas/user'
// Pojos
import { BookingQuote } from './pojos/booking-quote'
import { Booker, CustomAdminBooker, RegisteredUserBooker } from './pojos/booker'
// Enums
import { BookingTypes, PaymentStatuses, UserGroups } from '@/common/enums'
import { BadRequestException } from '@nestjs/common/exceptions'

// TODO: refactor bookings & booker when free from old admin
// TODO: remove authorizeId, useless
@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class Booking extends TimestampedDBDocument {
  // box data
  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'valueBoxId' })
  protected _valueBoxId: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'valueCenterId' })
  protected _valueCenterId: string

  // if booking is a VMC service
  @prop({ type: Boolean, required: false })
  @Type(() => Boolean)
  @Expose({ name: 'vmcService' })
  protected _vmcService: boolean

  @prop({ type: String, required: false })
  @Type(() => String)
  @Expose({ name: 'vmcWorkerId' })
  protected _vmcWorkerId?: string

  // booker data
  @prop({ type: Booker, required: true })
  @Type(() => Booker)
  @Expose({ name: 'booker' })
  protected _booker: Booker

  @prop({ type: Boolean, required: false })
  @Type(() => Boolean)
  @Expose({ name: 'needAdvices' })
  protected _needAdvices?: boolean

  // booking data
  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'bookingType' })
  protected _bookingType: BookingTypes

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'paymentStatus' })
  protected _paymentStatus: PaymentStatuses

  @prop({ type: DateTimeRange, required: true, _id: false })
  @Type(() => DateTimeRange)
  @Expose({ name: 'dateTimeRange' })
  protected _dateTimeRange: DateTimeRange

  @prop({ type: BookingQuote, required: true, _id: false })
  @Type(() => BookingQuote)
  @Expose({ name: 'quote' })
  protected _quote: BookingQuote

  @prop({ type: String, required: false })
  @Type(() => String)
  @Expose({ name: 'promoCodeId', groups: [UserGroups.ADMIN_REQUEST] })
  protected _promoCodeId?: string

  @prop({ type: String, required: false })
  @Type(() => String)
  @Expose({ name: 'invoiceId' })
  protected _invoiceId?: string

  @prop({ type: String, required: false })
  @Type(() => String)
  @Expose({ name: 'goal' })
  protected _goal?: string

  @prop({ type: String, required: false })
  @Type(() => String)
  @Expose({ name: 'teamComment', groups: [UserGroups.ADMIN_REQUEST] })
  protected _teamComment?: string

  @prop({ type: Boolean, required: true, default: false })
  @Type(() => Boolean)
  @Expose({ name: 'validated' })
  protected _validated: boolean

  @prop({ type: Date, required: false })
  @Type(() => Date)
  @Expose({ name: 'cancelledAt' })
  protected _canceledAt?: Date

  @prop({ type: String, required: false })
  @Type(() => String)
  @Expose({ name: 'cancelledBy' })
  protected _canceledBy?: string

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(box: Box, user: User, dateTimeRange: DateTimeRange, formula: Formula, promoCode?: PromoCode): Booking {
    const booking = new Booking()

    /* eslint-disable prettier/prettier */
    booking._bookingType =    BookingTypes.ONLINE_USER
    booking._valueBoxId =     box._id.toString()
    booking._valueCenterId =  box.centerId
    booking._booker =         Booker.of(user, user.getFullName())
    booking._needAdvices =    false
    booking._dateTimeRange =  dateTimeRange
    booking._paymentStatus =  PaymentStatuses.NOT_PAID
    booking._quote =          BookingQuote.of(formula, promoCode?.reductionPercentage)
    booking._promoCodeId =    promoCode?._id?.toString()
    booking._validated =      false
    booking._vmcService =     false
    /* eslint-enable prettier/prettier */

    return booking
  }

  public static ofCustomAdminRequest(
    box: Box,
    type: BookingTypes,
    dateTimeRange: DateTimeRange,
    paymentStatus: PaymentStatuses,
    priceTTC: number,
    vmcService: boolean,
    needAdvices: boolean,
    name: string,
    lastName: string,
    phone: string,
    email?: string,
    billingName?: string,
    goal?: string,
    vmcWorkerId?: string,
    teamComment?: string
  ): Booking {
    const booking = new Booking()

    /* eslint-disable prettier/prettier */
    booking._bookingType =    type // BookingType enum
    booking._valueBoxId =     box._id.toString()
    booking._valueCenterId =  box.centerId
    booking._booker =         Booker.ofCustomAdminRequest(name, lastName, phone, email, billingName)
    booking._dateTimeRange =  dateTimeRange
    booking._paymentStatus =  paymentStatus // PaymentStatus enum
    booking._quote =          BookingQuote.ofCustomAdminRequest(priceTTC)
    booking._goal =           goal
    booking._needAdvices =    needAdvices
    booking._vmcService =     vmcService
    booking._vmcWorkerId =    vmcWorkerId
    booking._teamComment =    teamComment
    booking._validated =      true
    /* eslint-enable prettier/prettier */

    return booking
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get bookingType():   BookingTypes        { return this._bookingType    }
  public get valueBoxId():    string              { return this._valueBoxId     }
  public get valueCenterId(): string              { return this._valueCenterId  }
  public get booker():        Booker              { return this._booker         }
  public get dateTimeRange(): DateTimeRange       { return this._dateTimeRange  }
  /* >==== FOR RETRO COMPATIBILITY ONLY ====> */
  @Expose()
  public get from():          Date                { return this._dateTimeRange.begin  }
  @Expose()
  public get to():            Date                { return this._dateTimeRange.end    }
  /* <==== FOR RETRO COMPATIBILITY ONLY ====< */
  public get paymentStatus(): PaymentStatuses     { return this._paymentStatus  }
  public get quote():         BookingQuote        { return this._quote          }
  public get goal():          string | undefined  { return this._goal           }
  public get needAdvices():   boolean | undefined { return this._needAdvices    }
  public get promoCodeId():   string | undefined  { return this._promoCodeId    }
  public get vmcService():    boolean             { return this._vmcService     }
  public get vmcWorkerId():   string | undefined  { return this._vmcWorkerId    }
  public get teamComment():   string | undefined  { return this._teamComment    }
  public get invoiceId():     string | undefined  { return this._invoiceId      }
  public get validated():     boolean             { return this._validated      }
  public get canceledAt():    Date | undefined    { return this._canceledAt     }
  public get canceledBy():    string | undefined  { return this._canceledBy     }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */

  /* >==== MAIN METHODS ====> */
  /**
   *  Returns a List<String> where every entry is a slice of 15 minutes time between the beginning and the end of this booking
   *
   *  ex: '08:00', '08:15', etc ...
   */
  public generate15MinutesSlots(): string[] {
    return this._dateTimeRange.generate15MinutesSlots()
  }

  public update(data: { goal?: string; teamComment?: string; paymentStatus?: PaymentStatuses }): void {
    this._goal = data.goal
    this._teamComment = data.teamComment

    if (data.paymentStatus) this.setPaymentStatus(data.paymentStatus)
  }

  public isBookedByAUser(): this is OnlineUserBooking {
    return this._booker.isARegisteredUser()
  }

  public setPaymentStatus(status: PaymentStatuses): void {
    this._paymentStatus = status
  }

  public updateBoxId(id: string): void {
    this._valueBoxId = id
  }

  public validateAsAdmin(): void {
    this._validated = true
  }

  public isValidated(): boolean {
    return this._validated
  }

  public canBeCanceledByBooker(): boolean {
    // cannot cancel an already canceled booking
    if (this._canceledAt) return false

    // check that the cancellation date is not already past
    // max cancellation date is J -2
    const twoDaysInMs = 48 * 60 * 60 * 1000
    const maxCancellationDateTime = new Date(this._dateTimeRange.begin.getTime() - twoDaysInMs)

    // compare it with current date
    return new Date().isBefore(maxCancellationDateTime)
  }

  public cancel(userId?: string): void {
    this._canceledAt = new Date()
    this._canceledBy = userId
  }

  public isCanceled(): boolean {
    return !!this._canceledAt
  }
}

export class OnlineUserBooking extends Booking {
  @prop({ type: RegisteredUserBooker, _id: false })
  @Type(() => RegisteredUserBooker)
  @Expose()
  protected _booker!: RegisteredUserBooker

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  /**
   * @deprecated this method will throw an error if used, as it doesn't initalize correctly a {@link OnlineUserBooking}. Use {@link of} instead.
   * @returns nothing. Will throw an error
   */
  public static ofCustomAdminRequest(): Booking {
    throw new BadRequestException(`Cannot instantiate a ${OnlineUserBooking.name} from the "ofCustomAdminRequest()" method`)
  }

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get booker(): RegisteredUserBooker { return this._booker }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS && SETTERS ====< */
}

export class CustomAdminBooking extends Booking {
  @prop({ type: CustomAdminBooker, _id: false })
  @Type(() => CustomAdminBooker)
  @Expose()
  protected _booker!: CustomAdminBooker

  /* >==== INIT ====> */
  protected constructor() {
    super()
  }

  /**
   * @deprecated this method will throw an error if used, as it doesn't initalize correctly a {@link CustomAdminBooking}. Use {@link ofCustomAdminRequest} instead.
   * @returns nothing. Will throw an error
   */
  public static of(): Booking {
    throw new BadRequestException(`Cannot instantiate a ${CustomAdminBooking.name} from the "of()" method`)
  }

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get booker(): CustomAdminBooker { return this._booker }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS && SETTERS ====< */
}

export type TOnlineUserBooking = {
  box: Box
  dateTimeRange: DateTimeRange
  needAdvices: boolean
  goal?: string
  promoCode?: PromoCode

  type: BookingTypes.ONLINE_USER
  name: string
  lastName: string
  phone: string
  email?: string
  billingName?: string
  priceTTC: number
  paymentStatus: PaymentStatuses
  vmcService: boolean
  vmcWorkerId?: string
  teamComment?: string
}

export type TAdminCustomBooking = Omit<TOnlineUserBooking, 'user' | 'formula'> & {
  type: BookingTypes
  name: string
  lastName: string
  phone: string
  email?: string
  billingName?: string
  priceTTC: number
  paymentStatus: PaymentStatuses
  vmcService: boolean
  vmcWorkerId?: string
  teamComment?: string
}
