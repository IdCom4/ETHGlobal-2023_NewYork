import { prop } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'
import '@/extensions/date.extension'

export class FlexibleDateTimeRange {
  @prop({ type: Date, required: true })
  @Expose({ name: 'begin' })
  protected _begin: Date

  @prop({ type: Date, required: false })
  @Expose({ name: 'end' })
  protected _end?: Date

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(begin: Date, end?: Date): FlexibleDateTimeRange {
    const dateRange = new FlexibleDateTimeRange()

    dateRange._begin = begin
    dateRange._end = end

    return dateRange
  }

  /* <==== INIT ====< */

  /* >==== GETTERS & SETTERS ====> */

  /* eslint-disable prettier/prettier */
  public get begin(): Date { return this._begin }
  public get end(): Date | undefined { return this._end }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */
}

export abstract class FlexibleDateTimeRangeBlueprint extends FlexibleDateTimeRange {
  _begin: Date
  _end?: Date
}
