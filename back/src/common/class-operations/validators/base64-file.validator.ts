import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'

/**
 * Represents a custom validator constraint class that checks if a file is a base64 string and is under a certain size.
 * It is used as a validator in class-validator decorators.
 */
@ValidatorConstraint({ async: false })
export class IsBase64FileMaxSizeConstraint implements ValidatorConstraintInterface {
  private static readonly BASE64_REGEX = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/

  validate(value: unknown, args: ValidationArguments): boolean {
    const size = args.constraints[0]

    if (Array.isArray(value)) {
      for (const entry of value) {
        if (!this.base64FileCheck(entry)) return false
        if (!this.isFileUnderMaxSize(entry, size)) return false
      }
      return true
    }

    if (typeof value === 'string') {
      return this.base64FileCheck(value) && this.isFileUnderMaxSize(value, size)
    }
    return false
  }

  defaultMessage(): string {
    return `Le fichier reçu est trop lourd`
  }

  private base64FileCheck(value: unknown): boolean {
    return typeof value === 'string' && IsBase64FileMaxSizeConstraint.BASE64_REGEX.test(value)
  }

  private isFileUnderMaxSize(value: string, size: number): boolean {
    const fileContent = value.replace(IsBase64FileMaxSizeConstraint.BASE64_REGEX, '$2')
    return Buffer.byteLength(fileContent, 'base64') <= size
  }
}

/**
 * Represents a class-validator decorator that checks if a file is a base64 string and is under a certain size.
 *
 * @param validationOptions The validation options.
 * See class-validator documentation.
 * @param size The maximum size of the file in bytes.
 * Default to 5MB.
 */
export function IsBase64File(validationOptions?: ValidationOptions, size = 5000000): (object: object, propertyName: string) => void {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsBase64FileMaxSize',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [size],
      validator: IsBase64FileMaxSizeConstraint,
    })
  }
}
