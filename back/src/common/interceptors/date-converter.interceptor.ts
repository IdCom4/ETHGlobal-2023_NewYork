import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { BadRequestException } from '@nestjs/common/exceptions'

/**
 * This interceptor is used to convert all dates in the responses to the timezone and locale
 * specified in the request headers.
 *
 * The request headers should contain the following:
 * - tz: The timezone to convert the dates to.
 * (e.g. 'Europe/Paris')
 * - locale: The locale to convert the dates to.
 * (e.g. 'fr-FR')
 *
 * If the headers are not present, the interceptor will not convert the dates.
 */
@Injectable()
export class DateConverterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const timezone: string = context.switchToHttp().getRequest().headers['tz']
    const locale: string = context.switchToHttp().getRequest().headers['locale']

    return next.handle().pipe(
      map((data: unknown | unknown[]) => {
        const dateOptions = !timezone && !locale ? null : new DateOptions(locale, timezone)

        return dateOptions ? new TimezoneConverter(dateOptions).convert(data) : data
      })
    )
  }
}

/**
 * This class is used to convert all dates in an object to the timezone and locale depending on the
 * given DateOptions.
 * The purpose of this class is to be abstract the conversion logic from the interceptor.
 */
export class TimezoneConverter {
  private static readonly ISO_DATE_REGEX = /^([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z)$/

  private _dateOptions: DateOptions

  constructor(dateOptions: DateOptions) {
    this._dateOptions = dateOptions
  }

  /**
   * This method is the entry point of the class.
   * It is used to convert all dates in an object to the timezone and locale depending on the given DateOptions.
   * @param object
   */
  public convert(object: unknown | unknown[]): unknown | unknown[] {
    if (Array.isArray(object)) {
      return object.map((item) => this.recursivelyFindAndConvert(item))
    } else {
      return this.recursivelyFindAndConvert(object)
    }
  }

  /**
   * This method is used to recursively find all dates in an object and convert them.
   * @param data The object to convert.
   * @private
   */
  private recursivelyFindAndConvert(data: unknown): unknown {
    // check if value is a string
    if (typeof data === 'string' && data.match(TimezoneConverter.ISO_DATE_REGEX)) return this.convertString(data)
    // else if value is an instance of Date
    else if (data instanceof Date) return this.convertDate(data)
    // else if it is an object go recursively about it
    else if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) data[key] = this.recursivelyFindAndConvert(data[key])
      }
    }

    return data
  }

  /**
   * Convert a string to the timezone and locale depending on the given DateOptions.
   * @param string The string to convert.
   * @private
   */
  private convertString(string: string): string {
    const date = new Date(string)
    return this.convertDate(date)
  }

  /**
   * Convert a {@link Date} to the timezone and locale depending on the given DateOptions.
   * @param date The date to convert.
   * @private
   */
  private convertDate(date: Date): string {
    try {
      return date.toLocaleString(this._dateOptions.locale, { timeZone: this._dateOptions.timezone })
    } catch (error) {
      throw new BadRequestException(`La timezone du header Date-Options est invalide. ('${this._dateOptions.timezone}')`)
    }
  }
}

/**
 * This class is an immutable class used to store the timezone and locale of the request.
 */
export class DateOptions {
  private readonly _locale?: string
  private readonly _timezone?: string

  private readonly _formatOptions: Intl.DateTimeFormatOptions

  constructor(locale: string | undefined, timezone: string | undefined, formatOptions?: Intl.DateTimeFormatOptions) {
    if (!this.isLocaleSupported(locale)) throw new BadRequestException("Given locale isn't supported")
    if (!this.isTimezoneSupported(timezone)) throw new BadRequestException("Given timezone isn't supported")

    this._locale = locale
    this._timezone = timezone
    this._formatOptions = formatOptions || {}
  }

  get locale(): string | undefined {
    return this._locale
  }

  get timezone(): string | undefined {
    return this._timezone
  }

  get formatOptions(): Intl.DateTimeFormatOptions {
    return this._formatOptions
  }

  private isLocaleSupported(locale: string | undefined): boolean {
    if (!locale) return true

    try {
      return Intl.DateTimeFormat.supportedLocalesOf(locale).length > 0
    } catch (error) {
      throw new BadRequestException('Given locale is invalid')
    }
  }

  private isTimezoneSupported(timeZone: string | undefined): boolean {
    if (!timeZone) return true

    try {
      const format = new Intl.DateTimeFormat('fr-FR', { timeZone: timeZone })
      const resolvedOptions = format.resolvedOptions()
      return resolvedOptions.timeZone === timeZone
    } catch (error) {
      return false
    }
  }
}
