import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'
import { ConflictException } from '@nestjs/common'

export class VehicleAlreadyExistException extends ConflictException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response ?? 'Ce véhicule existe déjà', options)
  }
}
