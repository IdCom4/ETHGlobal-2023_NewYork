import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'
import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class SkillNotFoundException extends NotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Compétence(s) introuvable(s)', options)
  }
}
