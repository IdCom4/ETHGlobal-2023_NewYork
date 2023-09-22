import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'
import { ConflictException } from '@nestjs/common'

export class VehicleBrandAlreadyExistException extends ConflictException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response ?? 'Cette marque de véhicule existe déjà', options)
  }
}
