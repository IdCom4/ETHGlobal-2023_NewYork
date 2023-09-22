import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import * as mongoose from 'mongoose'

/**
 * Represents a custom validator constraint class that checks if a string is a valid mongoose id.
 * It is used as a validator in class-validator decorators.
 */
@ValidatorConstraint({ async: false })
export class IsMongooseIdConstraint implements ValidatorConstraintInterface {
  validate(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id)
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} est/contient une valeur invalide pour un id`
  }
}

/**
 * Represents a class-validator decorator that checks if a string is a valid mongoose id.
 *
 * @param validationOptions The validation options.
 * See class-validator documentation.
 */
export function IsMongooseId(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMongooseIdConstraint,
    })
  }
}
