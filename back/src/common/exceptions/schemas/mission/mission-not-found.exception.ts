import { HttpExceptionOptions, NotFoundException } from '@nestjs/common/exceptions'

export class MissionNotFoundException extends NotFoundException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Mission introuvable', options)
  }
}
