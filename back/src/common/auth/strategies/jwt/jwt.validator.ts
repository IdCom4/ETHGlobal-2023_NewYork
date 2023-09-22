import { Cookies, Headers } from '@Common/enums'
import { Request } from 'express'
import { User } from '@Schemas/user'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { TokenService } from '@Common/services/token.service'
import { UserRepository } from '@/repositories/user.repository'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { TokenExpiredOrInvalidException } from '@Common/exceptions/token-expired-or-invalid.exception'

/**
 * `JwtValidator` is a service class responsible for validating JSON Web Tokens (JWTs) within the application.
 *
 * It encapsulates all the logic related to JWTs, including validating access and refresh tokens,
 * and refreshing expired access tokens while the user session is still valid.
 *
 * The `validateUser` method is the main entry point of the class, it accepts an HTTP request and the payload
 * of the access token.
 * It extracts the refresh token from the request's cookies and calls `validateJWTAuth`
 * which carries out the actual validation logic.
 *
 * Usage:
 * This service is typically used in the context of middleware or guards in NestJS, which protect routes by
 * verifying the validity of the JWTs attached to incoming HTTP requests.
 */
@Injectable()
export class JwtValidator {
  constructor(private readonly tokenService: TokenService, private readonly userRepository: UserRepository) {}

  public async validateUser(request: Request, accessTokenPayload: TTokenPayload): Promise<User> {
    const refreshToken: string | undefined = request.cookies[Cookies.REFRESH_TOKEN]

    const validationData = await this.validateJWTAuth(accessTokenPayload, refreshToken)

    if (validationData.newAccessToken) {
      if (!request.res) throw new InternalServerErrorException(`No available response to set [${Headers.ACCESS_TOKEN}] header`)
      request.res.setHeader(Headers.ACCESS_TOKEN, validationData.newAccessToken)
    }

    return validationData.user
  }

  private async validateJWTAuth(accessTokenPayload: TTokenPayload, refreshToken?: string): Promise<{ user: User; newAccessToken?: TToken }> {
    const user = await this.userRepository.findActiveById(accessTokenPayload.userId).getOrThrow(new UnauthorizedException('Veuillez vous connecter'))

    if (!user.currentHashedRefreshToken) throw new TokenExpiredOrInvalidException('Veuillez vous reconnecter')

    // Check if token is expired
    if (this.tokenService.isExpired(accessTokenPayload)) {
      // The exception happens when the user has a valid access JWT but with an invalid refreshToken.
      if (!refreshToken || user.currentHashedRefreshToken !== refreshToken) throw new TokenExpiredOrInvalidException('Veuillez vous reconnecter')

      const newAccessToken = await this.tokenService.createAccessToken(user)
      return { user: user, newAccessToken: newAccessToken }
    }

    return { user: user }
  }
}
