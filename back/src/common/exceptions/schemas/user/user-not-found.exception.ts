import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'
import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class UserNotFoundException extends NotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Utilisateur introuvable', options)
  }
}

export class ProfessionalNotFoundException extends UserNotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Spécialiste introuvable', options)
  }
}
