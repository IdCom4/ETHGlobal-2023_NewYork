import { HttpExceptionOptions } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'

export class InvoiceNotFoundException extends NotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Facture introuvable(s)', options)
  }
}
