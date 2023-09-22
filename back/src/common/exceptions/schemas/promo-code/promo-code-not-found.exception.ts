import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { HttpException, HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class PromoCodeNotFoundException extends HttpException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Code(s) promotionnel(s) introuvable(s)', HttpStatus.NOT_FOUND, options)
  }
}
