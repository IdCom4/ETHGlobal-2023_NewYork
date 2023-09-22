import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'

export class Formula {
  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'label' })
  private _label: string

  @prop({ type: Number, required: true })
  @Type(() => Number)
  @Expose({ name: 'nbrQuarterHour' })
  private _nbrQuarterHour: number

  @prop({ type: Number, required: true })
  @Type(() => Number)
  @Expose({ name: 'price' })
  private _price: number

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(label: string, nbrQuarterHour: number, price: number): Formula {
    const formula = new Formula()

    formula._label = label
    formula._nbrQuarterHour = nbrQuarterHour
    formula._price = price

    return formula
  }
  /* <==== INIT ====< */

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get label():           string  { return this._label          }
  public get nbrQuarterHour():  number  { return this._nbrQuarterHour }
  public get price():           number  { return this._price          }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */

  /* >==== MAIN METHODS ====> */
  public getDurationAsHoursAndMinutes(): { hours: number; minutes: number } {
    const hours: number = Math.floor(this._nbrQuarterHour / 4)
    const minutes: number = (this._nbrQuarterHour % 4) * 15

    return { hours, minutes }
  }
}
