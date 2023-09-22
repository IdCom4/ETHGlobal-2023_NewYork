import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { HttpException, HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class PromoCodeIsInactiveException extends HttpException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Code promotionnel inactif', HttpStatus.BAD_REQUEST, options)
  }
}
