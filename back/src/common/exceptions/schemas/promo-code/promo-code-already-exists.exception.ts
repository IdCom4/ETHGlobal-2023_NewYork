import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'
import { ConflictException } from '@nestjs/common'

export class PromoCodeAlreadyExistsException extends ConflictException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Ce code promotionnel existe déjà', options)
  }
}
