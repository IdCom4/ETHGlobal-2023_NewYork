import { HttpException, HttpExceptionOptions } from '@nestjs/common'

export class TokenExpiredOrInvalidException extends HttpException {
  constructor(message?: string, options?: HttpExceptionOptions) {
    super(message || 'Token expiré ou invalide, veuillez vous reconnecter', 498, options)
  }
}
