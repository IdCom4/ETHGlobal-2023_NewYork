import { HttpExceptionOptions } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'

export class CenterServiceNotFoundException extends NotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Service(s) introuvable(s)', options)
  }
}
