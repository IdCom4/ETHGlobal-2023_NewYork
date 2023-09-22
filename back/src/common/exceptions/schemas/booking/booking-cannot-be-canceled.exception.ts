import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { HttpException, HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class BookingCannotBeCanceledException extends HttpException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Cette réservation ne peut pas être annulée', HttpStatus.FORBIDDEN, options)
  }
}
