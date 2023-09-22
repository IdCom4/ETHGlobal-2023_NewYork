import { JwtService } from '@nestjs/jwt'
import { User } from '@Schemas/user'
import { ConfigService } from '@nestjs/config'
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces'
import { BadRequestException, Injectable } from '@nestjs/common'

/**
 * Represents a service responsible for the business logic of token generation and verification.
 */
@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  /**
   * Creates a refresh token.
   * @returns A Promise that resolves to the refresh token.
   */
  public async createRefreshToken(): Promise<TToken> {
    return this.createToken({ random: Math.random() })
  }

  /**
   * Creates an access token for a user.
   * @param {User} user - The user for whom the access token is created.
   * @returns A Promise that resolves to the access token.
   */
  public async createAccessToken(user: User): Promise<TToken> {
    return this.createToken(
      { userId: user._id.toString(), email: user.email },
      { expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'), secret: this.configService.get<string>('JWT_SECRET') }
    )
  }

  /**
   * Creates a validation mail token for a user.
   * @param {User} user - The user for whom the validation mail token is created.
   * @returns A Promise that resolves to the validation mail token.
   */
  public async createValidationMailToken(user: User): Promise<TToken> {
    return this.createToken({ userId: user._id.toString(), email: user.email })
  }

  /**
   * Creates a password recovery token for a user.
   * @param {User} user - The user for whom the password recovery token is created.
   * @returns A Promise that resolves to the password recovery token.
   */
  public async createPasswordRecoveryToken(user: User): Promise<TToken> {
    return this.createToken(
      { userId: user._id.toString(), email: user.email },
      { expiresIn: this.configService.get<string>('PASSWORD_RECOVERY_TOKEN_EXPIRES_IN') }
    )
  }

  /**
   * Creates a password recovery token for a user.
   * @param userId The ID of the user for whom the mail change token is created.
   * @param newEmail The new email of the user.
   * @returns A Promise that resolves to the mail change token.
   */
  public async createEmailChangeToken(userId: string, newEmail: string): Promise<TToken> {
    return this.createToken({ userId: userId, email: newEmail }, { expiresIn: this.configService.get<string>('EMAIL_CHANGE_TOKEN_EXPIRES_IN') })
  }

  /**
   * Decodes a token and retrieves its payload.
   * @param {String} token - The token to decode.
   * @returns A Promise that resolves to the token payload.
   * @throws BadRequestException if the token is invalid.
   */
  public async decodeToken(token: string): Promise<TTokenPayload> {
    const payload = await this.verifyTokenAndGetPayload(token)
    if (!this.isPayloadValid(payload)) throw new BadRequestException('Invalid token')

    return payload
  }

  /**
   * Checks if a token payload has expired.
   * @param {TTokenPayload} tokenPayload - The token payload to check.
   * @returns true if the token payload has expired, false otherwise.
   */
  public isExpired(tokenPayload: TTokenPayload): boolean {
    return !!tokenPayload.exp && tokenPayload.exp < Math.round(Date.now() / 1000)
  }

  /**
   * @private
   * Creates a token using the JwtService from Nest and the payload provided.
   * @param {object} payload         The payload to use to create the token.
   * @param {JwtSignOptions} options The options to use to create the token.
   * @returns A Promise that resolves to the token.
   */
  private async createToken(payload: object, options?: JwtSignOptions): Promise<TToken> {
    return await this.jwtService.signAsync(payload, options)
  }

  /**
   * @private
   * Verifies a token and returns its payload.
   * @param {String} token The token to verify.
   * @returns A Promise that resolves to the token payload.
   */
  private async verifyTokenAndGetPayload(token: string): Promise<TTokenPayload> {
    try {
      return await this.jwtService.verify<TTokenPayload>(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      })
    } catch (error) {
      throw new BadRequestException('Invalid token')
    }
  }

  /**
   * @private
   * Checks if a token payload is valid according to the expected properties determined by the {@link TTokenPayload} type.
   * @param payload The token payload to check.
   * @returns true if the token payload is valid, false otherwise.
   */
  private isPayloadValid(payload): payload is TTokenPayload {
    const expectedProperties: TTokenPayloadProperties[] = ['userId', 'email']

    for (const prop of expectedProperties) if (!(prop in payload)) return false

    return true
  }
}
