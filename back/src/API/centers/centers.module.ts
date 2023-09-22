import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
// Module
import { BoxesModule } from '@Api/boxes/boxes.module'
// Controller
import { CentersController } from '@Api/centers/centers.controller'
// Services
import { CentersService } from '@Api/centers/centers.service'
import { TokenService } from '@/common/services'
// Schemas
import { User } from '@/schemas/user'
import { Center } from '@Schemas/center/center.schema'
// Repositories
import { CenterRepository, UserRepository } from '@/repositories'
// Auth
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AdminJwtStrategy, JwtValidator } from '@/common/auth/strategies'

const jwtModuleOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<{ secret: string }> => {
    return { secret: <string>configService.get<string>('JWT_SECRET') }
  },
  inject: [ConfigService],
}

@Module({
  imports: [BoxesModule, TypegooseModule.forFeature([Center, User]), JwtModule.registerAsync(jwtModuleOptions)],
  controllers: [CentersController],
  providers: [CentersService, CenterRepository, ConfigService, AdminJwtStrategy, JwtValidator, TokenService, UserRepository],
  exports: [CentersService, CenterRepository, TypegooseModule.forFeature([Center])],
})
export class CentersModule {}
