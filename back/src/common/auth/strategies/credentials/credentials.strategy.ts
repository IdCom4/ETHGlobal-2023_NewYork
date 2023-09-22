import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { User } from '@Schemas/user'
import { CredentialsValidator } from '@Common/auth/strategies/credentials/credentials.validator'

/**
 * Represents the strategy used for credential validation and authentication in NestJS.
 * It uses a simple strategy consisting of relying on credentials (email, password) to validate the user.
 *
 * @implements {PassportStrategy}
 */
@Injectable()
export class CredentialsStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly credentialsValidator: CredentialsValidator) {
    super({ usernameField: 'email', passwordField: 'password' })
  }

  async validate(email: string, password: string): Promise<User> {
    return this.credentialsValidator.validateCredentialsAuth(email, password)
  }
}
