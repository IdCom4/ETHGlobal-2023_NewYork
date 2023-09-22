import { BadRequestException } from '@nestjs/common/exceptions'
import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'
import { DateTimeRange } from './date-time-range'

export class TimeRange {
  /* eslint-disable prettier/prettier */
  @prop({ type: String, required: true }) @Type(() => String) @Expose({ name: 'begin' })  protected _begin: string  // in 'HH:mm' format
  @prop({ type: String, required: true }) @Type(() => String) @Expose({ name: 'end' })    protected _end:   string  // in 'HH:mm' format
  /* eslint-enable prettier/prettier */

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(begin: string, end: string): TimeRange {
    // check that data are well formatted
    if (!this.validateFormat(begin)) throw new BadRequestException('Le début du créneau horaire est invalide')
    if (!this.validateFormat(end)) throw new BadRequestException('La fin du créneau horaire est invalide')

    const timeRange = new TimeRange()
    timeRange._begin = begin
    timeRange._end = end

    // check that begin is not after end
    const { hours } = timeRange.getDuration()
    if (hours < 0) throw new BadRequestException('Le créneau horaire est invalide, le début est après la fin')

    return timeRange
  }

  /**
   * Checks if the string that represents the time is in the 'HH:mm' format
   *
   * @param timeStr The string to check the format of
   *
   * @return a boolean representing whether the string was in the right format or not
   */
  private static validateFormat(timeStr: string): boolean {
    const validFormatRegex = /^([0-9]{2}:[0-9]{2})$/

    return !!timeStr.match(validFormatRegex)
  }
  /* <==== INIT ====< */

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get begin(): string  { return this._begin  }
  public get end():   string  { return this._end    }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */

  /* >==== MAIN METHODS ====> */
  /**
   * Returns the duration of this TimeRange as hours and minutes
   */
  public getDuration(): { hours: number; minutes: number } {
    const [beginHours, beginMinutes] = this._begin.split(':').map((timeStr) => parseInt(timeStr))
    const [endHours, endMinutes] = this._end.split(':').map((timeStr) => parseInt(timeStr))

    let hours = endHours - beginHours
    let minutes = endMinutes - beginMinutes

    if (minutes < 0) {
      hours -= 1
      minutes += 60
    }

    return { hours, minutes }
  }

  /**
   * Returns the amount of quarter-hour between the beginning and the end of this TimeRange
   *
   * @return an int representing the amount of quarter-hour of the duration
   */
  public getDurationAsNumberOfQuarterHour(): number {
    const { hours, minutes } = this.getDuration()

    return hours * 4 + minutes / 15
  }

  public generate15MinutesSlots(): string[] {
    // create 2 dates
    const beginDate = new Date()
    const endDate = new Date()

    // set their time so that they match their time equivalents
    const [beginHours, beginMinutes] = this._begin.split(':').map((timeData) => parseInt(timeData))
    beginDate.setUTCHours(beginHours, beginMinutes, 0, 0)

    const [endHours, endMinutes] = this._end.split(':').map((timeData) => parseInt(timeData))
    endDate.setUTCHours(endHours, endMinutes, 0, 0)

    // create a DateTimeRange & generate the slots
    return DateTimeRange.of(beginDate, endDate).generate15MinutesSlots()
  }
}

export abstract class TimeRangeBlueprint extends TimeRange {
  _begin: string
  _end: string
}
