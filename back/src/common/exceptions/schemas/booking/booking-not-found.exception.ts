import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { HttpException, HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class BookingNotFoundException extends HttpException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Réservation(s) introuvable(s)', HttpStatus.NOT_FOUND, options)
  }
}
