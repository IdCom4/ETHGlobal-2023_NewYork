import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'
import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class VehicleBrandNotFoundException extends NotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response ?? 'Marque de véhicule introuvable', options)
  }
}
