import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'
import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class VehicleNotFoundException extends NotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response ?? 'Véhicule introuvable', options)
  }
}
