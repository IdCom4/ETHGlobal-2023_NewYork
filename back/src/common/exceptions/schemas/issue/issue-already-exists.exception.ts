import { ConflictException, HttpExceptionOptions } from '@nestjs/common'

export class IssueAlreadyExistsException extends ConflictException {
  constructor(response?: string, options?: HttpExceptionOptions) {
    super(response || 'Ce problème existe déjà', options)
  }
}
