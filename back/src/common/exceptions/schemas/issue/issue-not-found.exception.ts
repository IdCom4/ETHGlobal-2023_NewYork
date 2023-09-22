import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'
import { HttpExceptionOptions } from '@nestjs/common'

export class IssueNotFoundException extends NotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Problème(s) introuvable(s)', options)
  }
}
