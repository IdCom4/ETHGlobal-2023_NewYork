import { User } from '@Schemas/user'
import * as argon from 'argon2'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserRepository } from '@/repositories/user.repository'

/**
 * Represents the validator used for credential validation and authentication in the application.
 * It is mainly used in guards and strategies.
 */
@Injectable()
export class CredentialsValidator {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Validates the credentials of a user.
   * @param email The email of the user.
   * @param password The password of the user.
   * @returns The user if the credentials are valid.
   * @throws {UnauthorizedException} If the credentials are invalid.
   */
  public async validateCredentialsAuth(email: string, password: string): Promise<User> {
    // find user by email
    const user: User = await this.userRepository.findWithHashedPasswordByEmail(email).getOrThrow('Ces identifiants sont incorrects')

    // check if there is a user and its password matches
    if (!user.hashedPassword || !(await argon.verify(user.hashedPassword, password)))
      throw new UnauthorizedException('Adresse email ou mot de passe invalide')

    user.removeHashedPasswordFromInstance()

    return user
  }
}
