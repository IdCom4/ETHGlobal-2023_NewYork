import { DatesUtils } from '@/common/utils'
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isDefined, isDateString } from 'class-validator'

/**
 * Transformation pipe that converts a string to a Date object.
 */
@Injectable()
export class DateValidationPipe implements PipeTransform<string, Promise<Date>> {
  constructor(private format: string = 'dd-MM-yyyy') {}

  transform(value: string | Date): Promise<Date> {
    let dateObject: Date | null = null

    if (isDefined(value)) {
      const valueIsDateObject = typeof value === 'object' && (value as object) instanceof Date
      if (valueIsDateObject) dateObject = value

      const valueIsStringDate = isDateString(value)
      if (typeof value === 'string' && valueIsStringDate) dateObject = DatesUtils.getUTCDateFromStr(value, this.format)
    }

    if (!dateObject) throw new BadRequestException(`The value is not a valid date. (expected format: "${this.format}")`)

    return new Promise((resolve) => resolve(dateObject as Date))
  }
}
