import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { User } from '@Schemas/user'
import { CredentialsValidator } from '@Common/auth/strategies/credentials/credentials.validator'
import { Passports } from '@Common/enums'

/**
 * Represents the strategy used for credential validation and authentication in NestJS for admin users.
 * It is based on the same principle as the CredentialsStrategy, but it also checks if the user is an admin.
 *
 * @implements {PassportStrategy}
 */
@Injectable()
export class AdminCredentialsStrategy extends PassportStrategy(Strategy, Passports.CREDENTIALS_ADMIN) {
  constructor(private readonly credentialsValidator: CredentialsValidator) {
    super({ usernameField: 'email', passwordField: 'password' })
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.credentialsValidator.validateCredentialsAuth(email, password)

    if (!user.isAdmin) throw new ForbiddenException('Vous devez être administrateur')

    return user
  }
}
