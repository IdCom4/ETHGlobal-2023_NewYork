import { DaysOfWeek } from '@/common/enums/time'
import { TimeRange } from '@/schemas/common/pojos'
import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'

export type TWeekOpeningHours = Record<DaysOfWeek, TimeRange>
export type TOpeningHours = Partial<TWeekOpeningHours>

export class WeekOpeningHours {
  /* eslint-disable prettier/prettier */
  @prop({ type: TimeRange, required: true, _id: false }) @Type(() => TimeRange) @Expose()
  [DaysOfWeek.MONDAY    ]:  TimeRange
  
  @prop({ type: TimeRange, required: true, _id: false }) @Type(() => TimeRange) @Expose()
  [DaysOfWeek.TUESDAY   ]:  TimeRange
  
  @prop({ type: TimeRange, required: true, _id: false }) @Type(() => TimeRange) @Expose()
  [DaysOfWeek.WEDNESDAY ]:  TimeRange
  
  @prop({ type: TimeRange, required: true, _id: false }) @Type(() => TimeRange) @Expose()
  [DaysOfWeek.THURSDAY  ]:  TimeRange
  
  @prop({ type: TimeRange, required: true, _id: false }) @Type(() => TimeRange) @Expose()
  [DaysOfWeek.FRIDAY    ]:  TimeRange
  
  @prop({ type: TimeRange, required: true, _id: false }) @Type(() => TimeRange) @Expose()
  [DaysOfWeek.SATURDAY  ]:  TimeRange
  
  @prop({ type: TimeRange, required: true, _id: false }) @Type(() => TimeRange) @Expose()
  [DaysOfWeek.SUNDAY    ]:  TimeRange
  /* eslint-enable prettier/prettier */

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link createEmpty} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static createEmpty(): WeekOpeningHours {
    const weekOpeningHours = new WeekOpeningHours()

    /* eslint-disable prettier/prettier */
    weekOpeningHours.MONDAY     = TimeRange.of('00:00', '00:00')
    weekOpeningHours.TUESDAY    = TimeRange.of('00:00', '00:00')
    weekOpeningHours.WEDNESDAY  = TimeRange.of('00:00', '00:00')
    weekOpeningHours.THURSDAY   = TimeRange.of('00:00', '00:00')
    weekOpeningHours.FRIDAY     = TimeRange.of('00:00', '00:00')
    weekOpeningHours.SATURDAY   = TimeRange.of('00:00', '00:00')
    weekOpeningHours.SUNDAY     = TimeRange.of('00:00', '00:00')
    /* eslint-enable prettier/prettier */

    return weekOpeningHours
  }
  /* <==== INIT ====< */

  /* >==== MAIN METHODS ====> */
  public setDaysOfWeekOpeningHours(openingHours: TOpeningHours): this {
    for (const day in openingHours) this[day] = openingHours[day]

    return this
  }
}
