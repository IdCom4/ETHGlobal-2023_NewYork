import { Module } from '@nestjs/common'
import { JwtStrategy } from './jwt.strategy'
import { AdminJwtStrategy } from './admin-jwt.strategy'
import { ProfessionalJwtStrategy } from './professional-jwt.strategy'
import { TokenService } from '@/common/services'
import { JwtValidator } from './jwt.validator'
import { JwtService } from '@nestjs/jwt'
import { UserRepository } from '@/repositories'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '@/schemas/user'

/* const jwtModuleOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<{ secret: string }> => {
    return { secret: <string>configService.get<string>('JWT_SECRET') }
  },
  inject: [ConfigService],
} */

@Module({
  imports: [TypegooseModule.forFeature([User]) /* JwtModulOptions */],
  providers: [JwtStrategy, AdminJwtStrategy, ProfessionalJwtStrategy, TokenService, JwtValidator, JwtService, UserRepository],
  exports: [JwtStrategy, AdminJwtStrategy, ProfessionalJwtStrategy],
})
export class JWTModule {}
