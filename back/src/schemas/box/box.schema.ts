import { Expose, Type } from 'class-transformer'
import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { SoftDeletableDBDocument } from '@Schemas/db-document.abstract-schema'
import { Center, WeekOpeningHours } from '@Schemas/center'
import { DateTimeRange, StrictAddress } from '@Schemas/common/pojos'
import { BoxCategories, BoxTypes } from '@/common/enums/schemas'
import { BookingReference } from '@Schemas/box/pojos'
import { Formula } from './pojos/formula'
import { BoxHasPendingBookingsException } from '@/common/exceptions/schemas/box'
import { IllegalArgumentException } from '@/common/exceptions'
import { UserGroups } from '@/common/enums'
import { Booking } from '../booking'

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class Box extends SoftDeletableDBDocument {
  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'name' })
  protected _name!: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'description' })
  protected _description!: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'category' })
  protected _category!: BoxCategories

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'type' })
  protected _type!: BoxTypes

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'centerId' })
  protected _centerId!: string

  @prop({ type: WeekOpeningHours, required: true, _id: false })
  @Type(() => WeekOpeningHours)
  @Expose({ name: 'openingHours' })
  protected _openingHours!: WeekOpeningHours

  @prop({ type: StrictAddress, required: true, _id: false })
  @Type(() => StrictAddress)
  @Expose({ name: 'location' })
  protected _location!: StrictAddress

  @prop({ type: String })
  @Type(() => String)
  @Expose({ name: 'controllerId' })
  protected _controllerId?: string

  @prop({ type: Boolean, required: true })
  @Type(() => Boolean)
  @Expose({ name: 'isAvailable' })
  protected _isAvailable!: boolean

  @prop({ type: Array<Formula>, required: true })
  @Type(() => Formula)
  @Expose({ name: 'formulas' })
  protected _formulas!: Formula[]

  @prop({ type: Boolean })
  @Type(() => Boolean)
  @Expose({ name: 'shortAvailabilityPriority' })
  protected _shortAvailabilityPriority!: boolean

  @prop({ type: Array<BookingReference>, required: true })
  @Type(() => BookingReference)
  @Expose({ name: 'bookingsRef', groups: [UserGroups.ADMIN_REQUEST] })
  protected _bookingsReference!: BookingReference[]

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(data: IBoxUpdatePayload): Box {
    Box.validateInitData(data)

    const box = new Box()

    box.initialize(data)
    box.update(data)

    return box
  }

  private static validateInitData(data: IBoxUpdatePayload): void {
    if (!Object.isDefined(data.name) || data.name === '') throw new IllegalArgumentException('Le nom du box est requis')
    if (!Object.isDefined(data.description) || data.description === '') throw new IllegalArgumentException('La description du box est requise')
    if (!data.category) throw new IllegalArgumentException('La catégorie du box est requise')
    if (!data.center) throw new IllegalArgumentException('Le centre du box est requis')
    if (!Object.isDefined(data.isAvailable)) throw new IllegalArgumentException('La disponibilité du centre du box est requise')
    if (!Object.isDefined(data.formulas)) throw new IllegalArgumentException('Les formules du box sont requises')
  }

  private initialize(data: IBoxUpdatePayload): void {
    this._centerId = data.center._id.toString()
    this._location = data.center.location

    this._type = BoxTypes.VALUEBOX
    this._isAvailable = data.isAvailable
    this._formulas = data.formulas
    this._shortAvailabilityPriority = false
    this._bookingsReference = []
  }

  /* <==== INIT ====< */

  /* >==== GETTERS & SETTERS ====> */

  /* eslint-disable prettier/prettier */
  public get name()                      : string              { return this._name                      }
  public get description()               : string              { return this._description               }
  public get category()                  : BoxCategories       { return this._category                  }
  public get type()                      : string              { return this._type                      }
  public get centerId()                  : string              { return this._centerId                  }
  public get openingHours()              : WeekOpeningHours    { return this._openingHours              }
  public get location()                  : StrictAddress       { return this._location                  }
  public get controllerId()              : string | undefined  { return this._controllerId              }
  public get isAvailable()               : boolean             { return this._isAvailable               }
  public get formulas()                  : Formula[]           { return this._formulas                  }
  public get shortAvailabilityPriority() : boolean             { return this._shortAvailabilityPriority }
  public get bookingsReference()         : BookingReference[]  { return this._bookingsReference         }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */

  /* >==== UPDATE ====> */
  public update(data: Partial<IBoxUpdatePayload>): void {
    /* eslint-disable prettier/prettier */
    if (data.name)                      this._name = data.name
    if (data.description)               this._description = data.description
    if (data.category)                  this._category = data.category
    if (data.isAvailable !== undefined) this._isAvailable = data.isAvailable
    if (data.center?.openingHours)      this._openingHours = data.center.openingHours
    /* eslint-enable prettier/prettier */
  }

  public updateFormulas(formulas: Formula[]): void {
    this._formulas = formulas
  }

  /* <==== UPDATE ====< */

  /**
   *  Find the booking ref corresponding to the booking id, if there is.
   *
   *  @param bookingId The id of the booking whose booking ref we want
   *
   *  @return the booking ref if it has been found, null else
   */
  public getBookingReference(bookingId: string): BookingReference | undefined {
    return this._bookingsReference.find((ref) => ref.bookingId == bookingId)
  }

  /**
   *  Add a new booking ref to the list.
   *
   *  @param booking The booking for which to create a new booking ref
   *
   *  @return the newly created booking ref
   */
  public addBookingReference(booking: Booking): BookingReference {
    const bookingReference = BookingReference.of(booking)

    this._bookingsReference.push(bookingReference)
    return bookingReference
  }

  /**
   *  Remove a booking ref from the list
   *
   *  @param bookingId The id of the booking to remove
   *
   *  @return <true> if the booking was found et removed, <false> else
   */
  public removeBookingReference(bookingId: string): boolean {
    const removed = this._bookingsReference.removeInPlace((ref) => ref.bookingId === bookingId)
    return !!removed.length
  }

  public isBookable(): boolean {
    return !!(!this._deletedAt && this._isAvailable && this.formulas.length)
  }

  public checkAvailability(from: Date, to: Date): boolean {
    // if box ain't bookable, it's not available by default
    if (!this.isBookable()) return false

    const wantedDateRange = DateTimeRange.of(from, to)

    for (const ref of this._bookingsReference) {
      if (ref.dateTimeRange.overlapsWith(wantedDateRange)) return false
    }

    return true
  }

  public updateLocation(newLocation: StrictAddress): void {
    this._location = newLocation
  }

  public updateOpeningHours(openingHours: WeekOpeningHours): void {
    this._openingHours = openingHours
  }

  public softDelete(): void {
    if (this.hasPendingBookings()) throw new BoxHasPendingBookingsException()

    super.softDelete()
  }

  /* >==== PRIVATE METHODS ====> */

  private hasPendingBookings(): boolean {
    for (const ref of this._bookingsReference) {
      if (ref.isYetToCome()) return true
    }

    return false
  }
}

export interface IBoxUpdatePayload {
  name: string
  description: string
  center: Center
  category: BoxCategories
  isAvailable: boolean
  formulas: Formula[]
}
