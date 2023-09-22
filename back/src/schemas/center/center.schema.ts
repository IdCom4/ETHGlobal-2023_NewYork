import { IllegalArgumentException } from '@/common/exceptions/illegal-argument.exception'
import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'
import { StrictAddress } from '../common/pojos'
import { SoftDeletableDBDocument } from '../db-document.abstract-schema'
import { WeekOpeningHours } from './pojos/opening-hours'

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class Center extends SoftDeletableDBDocument {
  @prop({ type: String, maxlength: 50, required: true })
  @Type(() => String)
  @Expose({ name: 'name' })
  protected _name!: string

  @prop({ type: StrictAddress, required: true, _id: false })
  @Type(() => StrictAddress)
  @Expose({ name: 'location' })
  protected _location!: StrictAddress

  @prop({ type: WeekOpeningHours, required: true, _id: false })
  @Type(() => WeekOpeningHours)
  @Expose({ name: 'openingHours' })
  protected _openingHours!: WeekOpeningHours

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(name: string, location: StrictAddress): Center {
    if (name === '') throw new IllegalArgumentException('Le nom du centre est requis')

    return new Center().update({ name, location, openingHours: WeekOpeningHours.createEmpty() })
  }
  /* <==== INIT ====< */

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get name():          string            { return this._name }
  public get location():      StrictAddress     { return this._location }
  public get openingHours():  WeekOpeningHours  { return this._openingHours }
  public get deletedAt():       Date | undefined  { return this._deletedAt }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */

  /* >==== MAIN METHODS ====> */
  public update(data: { name?: string; location?: StrictAddress; openingHours?: WeekOpeningHours }): this {
    if (data.name) this._name = data.name
    if (data.location) this._location = data.location
    if (data.openingHours) this._openingHours = data.openingHours

    return this
  }
}
