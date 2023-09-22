import { VmcCompaniesKeyNames } from '@/common/enums/payments'
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isDefined } from 'class-validator'

/**
 * Transformation pipe that converts a string to a value of the {@link VmcCompaniesKeyNames} enum.
 */
@Injectable()
export class VmcCompaniesValidationPipe implements PipeTransform<string, Promise<VmcCompaniesKeyNames>> {
  transform(value: string): Promise<VmcCompaniesKeyNames> {
    if (isDefined(value) && Object.keys(VmcCompaniesKeyNames).includes(value.toUpperCase()))
      return new Promise((resolve) => resolve(VmcCompaniesKeyNames[value.toUpperCase()]))
    else throw new BadRequestException(`the value ${value} is not valid. See the acceptable values: ${Object.keys(VmcCompaniesKeyNames).join(' | ')}`)
  }
}
