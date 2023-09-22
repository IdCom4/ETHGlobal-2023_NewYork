import { HttpExceptionOptions } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'

export class ServiceOptionNotFoundException extends NotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Option(s) de service introuvable(s)', options)
  }
}
