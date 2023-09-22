import { DatesUtils } from '@/common/utils'
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

/**
 * Represents a custom validator constraint class that checks if a string is a date in a given format.
 * It is used as a validator in class-validator decorators.
 */
@ValidatorConstraint({ async: false })
export class IsSpecificDateFormatConstraint implements ValidatorConstraintInterface {
  public validate(value: string, args: ValidationArguments): boolean {
    if (!value || typeof value !== 'string') return false

    const format = args.constraints[0]
    const date = DatesUtils.getUTCDateFromStr(value, format)

    if (!date || date instanceof Date === false || isNaN(date.getTime())) return false

    args.object[args.property] = date
    return true
  }
}

/**
 * Represents a class-validator decorator that checks if a string is a date in a given format.
 *
 * @param format The date format.
 * @param validationOptions The validation options.
 */
export function ParseStringDate(format = 'dd/MM/yyyy HH:mm', validationOptions?: ValidationOptions): (object: object, propertyName: string) => void {
  return function (object: object, propertyName: string) {
    // register validator decorator to class-validator
    registerDecorator({
      name: 'ParseStringDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [format],
      validator: IsSpecificDateFormatConstraint,
    })
  }
}
