import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common'

export class IllegalArgumentException extends HttpException {
  constructor(response: string, options?: HttpExceptionOptions) {
    super(response, HttpStatus.BAD_REQUEST, options)
  }
}
