import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { HttpException, HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class BoxNotAvailableException extends HttpException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Aucun boxe disponible ne répond à votre requête', HttpStatus.BAD_REQUEST, options)
  }
}
