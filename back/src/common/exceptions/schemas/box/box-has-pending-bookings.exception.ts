import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { HttpException, HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class BoxHasPendingBookingsException extends HttpException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Impossible de supprimer ce box, il a des réservations en cours de validité', HttpStatus.BAD_REQUEST, options)
  }
}
