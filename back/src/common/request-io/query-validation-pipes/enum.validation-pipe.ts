import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isDefined, isEnum } from 'class-validator'

/**
 * Transformation pipe that converts a string to an enum value.
 */
@Injectable()
export class EnumValidationPipe implements PipeTransform<string, Promise<string | undefined>> {
  constructor(private enumEntity: Record<string, string>, private options?: { optional?: boolean }) {}

  transform(value?: string): Promise<string | undefined> {
    // check if value is optional
    if (this.options && this.options.optional && !value) return new Promise((resolve) => resolve(undefined))
    // else check if value is valid
    else if (value && isDefined(value) && isEnum(value, this.enumEntity)) return new Promise((resolve) => resolve(this.enumEntity[value]))
    // else error
    else {
      const errorMessage = `the value ${value} is not valid. See the acceptable values: ${Object.keys(this.enumEntity).map(
        (key) => this.enumEntity[key]
      )}`

      throw new BadRequestException(errorMessage)
    }
  }
}
