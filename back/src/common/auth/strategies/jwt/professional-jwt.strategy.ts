import { Request } from 'express'
import { ProfessionalUser } from '@Schemas/user'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { JwtValidator } from '@Common/auth/strategies/jwt/jwt.validator'
import { Passports } from '@Common/enums'
import { ConfigService } from '@nestjs/config'

/**
 * Represents the strategy used for JWT validation and authentication in NestJS for professional users.
 * It is based on the same principle as the JwtStrategy, but it also checks if the user is a professional.
 *
 * @implements {PassportStrategy}
 */
@Injectable()
export class ProfessionalJwtStrategy extends PassportStrategy(Strategy, Passports.JWT_PROFESSIONAL) {
  constructor(private readonly jwtValidator: JwtValidator, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(request: Request, accessTokenPayload: TTokenPayload): Promise<ProfessionalUser> {
    const validatedUser = await this.jwtValidator.validateUser(request, accessTokenPayload)

    if (!validatedUser.isProfessional()) throw new ForbiddenException('Vous devez être un professionnel')

    return validatedUser as ProfessionalUser
  }
}
