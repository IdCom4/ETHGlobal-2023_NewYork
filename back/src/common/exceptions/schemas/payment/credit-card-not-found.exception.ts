import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'

export class CardNotFountException extends NotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Carte introuvable', options)
  }
}
