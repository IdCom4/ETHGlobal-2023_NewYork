import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { HttpException, HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class UserAlreadyUsedPromoCodeException extends HttpException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Code promotionnel déjà utilisé', HttpStatus.UNAUTHORIZED, options)
  }
}
