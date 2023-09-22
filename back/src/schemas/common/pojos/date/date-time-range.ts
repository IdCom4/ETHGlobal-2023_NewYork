import { prop } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'
import '@/extensions/date.extension'

export class DateTimeRange {
  @prop({ type: Date, required: true })
  @Expose({ name: 'begin' })
  protected _begin: Date

  @prop({ type: Date, required: true })
  @Expose({ name: 'end' })
  protected _end: Date

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(begin: Date, end: Date): DateTimeRange {
    const dateRange = new DateTimeRange()

    dateRange._begin = begin
    dateRange._end = end

    return dateRange
  }
  /* <==== INIT ====< */

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get begin(): Date    { return this._begin  }
  public get end():   Date    { return this._end    }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */

  /* >==== MAIN METHODS ====> */
  /**
   *  Returns the duration of the range
   *
   *  @return the hours and minutes of the range
   */
  public getDuration(): { hours: number; minutes: number } {
    // get the differences in minutes
    const milliseconds = this._end.getTime() - this._begin.getTime()
    let minutes = Math.round(milliseconds / 1000 / 60)

    // deduce the hours from it
    const hours = Math.round(minutes / 60)

    // set the minutes in a 0 - 60 range to get the remaining time
    minutes %= 60

    return { hours, minutes }
  }

  /* >==== COMPARISON METHODS ====> */
  /**
   *  Check if this DateTimeRange is shorter than the other
   *
   *  @param other The DateTimeRange to be compared with
   *  @return true if shorter, false if equal or greater
   */
  public isShorterThan(other: DateTimeRange): boolean {
    const { hours: thisDurationHours, minutes: thisDurationMinutes } = this.getDuration()
    const { hours: otherDurationHours, minutes: otherDurationMinutes } = other.getDuration()

    return thisDurationHours < otherDurationHours || (thisDurationHours == otherDurationHours && thisDurationMinutes < otherDurationMinutes)
  }

  /**
   *  Checks if 2 DateTimeRange overlaps
   *
   *  @param other The other DateTimeRange to check
   *
   *  @return true if it does overlap, else false
   */
  public overlapsWith(other: DateTimeRange): boolean {
    // check if begin is inside the dateTimeRange
    if (other.begin.isAfterOrEqual(this.begin) && other.begin.isBefore(this.end)) return true
    // check if end is inside the dateTimeRange
    if (other.end.isAfterOrEqual(this.begin) && other.end.isBefore(this.end)) return true
    // check if the dateTimeRange is inside begin and end
    if (other.begin.isBeforeOrEqual(this.begin) && other.end.isAfterOrEqual(this.end)) return true

    return false
  }

  /**
   *  Checks if the Date is between the beginning and the end of this DateTimeRange
   *
   *  @param date The Date to check
   *  @return true if contained, else false
   */
  public contains(date: Date): boolean {
    return date.getTime() >= this._begin.getTime() && date.getTime() < this._end.getTime()
  }

  /**
   *  Returns an Array of 15 minutes slots where every entry is a time between the beginning and the end of this DateTimeRange, by slice of 15 minutes.
   *
   *  ex: '08:00', '08:15', etc ...
   */
  public generate15MinutesSlots(): string[] {
    const slots: string[] = []

    const localBegin = new Date(this._begin)
    if (localBegin.getUTCMinutes() % 15 !== 0) throw new Error("La durée n'est pas configurée pour être découpée en quart d'heure")

    const quarterHourInMilliseconds = 15 * 60 * 1000

    while (localBegin.isBefore(this._end)) {
      const hours = localBegin.getUTCHours()
      const minutes = localBegin.getUTCMinutes()
      // store time
      slots.push(`${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`)
      // add 15 minutes
      localBegin.setTime(localBegin.getTime() + quarterHourInMilliseconds)
    }

    return slots
  }
}

export abstract class DateTimeRangeBlueprint extends DateTimeRange {
  _begin: Date
  _end: Date
}
