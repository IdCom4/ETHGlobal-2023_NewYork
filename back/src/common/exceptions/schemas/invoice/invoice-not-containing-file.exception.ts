import { HttpExceptionOptions } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'

export class InvoiceNotContainingFileException extends NotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Aucun fichier trouvé pour cette facture', options)
  }
}
