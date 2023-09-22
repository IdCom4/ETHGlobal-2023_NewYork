import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@Schemas/user'
import { Request } from 'express'
import { JwtValidator } from '@Common/auth/strategies/jwt/jwt.validator'

/**
 * Represents the strategy used for JWT validation and authentication in NestJS.
 * It uses a simple strategy consisting of relying on the payload of the token to validate the user.
 *
 * @implements {PassportStrategy}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtValidator: JwtValidator, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(request: Request, accessTokenPayload: TTokenPayload): Promise<User> {
    return await this.jwtValidator.validateUser(request, accessTokenPayload)
  }
}
