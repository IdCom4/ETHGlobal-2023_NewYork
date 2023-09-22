import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '@Schemas/user'
import { SendGridMailAPI } from '@Common/external-service-providers-api/mail/mail.api'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CredentialsStrategy } from '@Common/auth/strategies/credentials/credentials.strategy'
import { JwtStrategy } from '@Common/auth/strategies/jwt/jwt.strategy'
import { SendGridMailFactory } from '@Common/external-service-providers-api/mail/mail.factory'
import { TokenService } from '@Common/services/token.service'
import { UsersService } from '@Api/users/users.service'
import { UserRepository } from '@/repositories/user.repository'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { AWSS3API } from '@Common/external-service-providers-api/file-host/file-host.api'
import { HostedFilesModule } from '@Api/hosted-files/hosted-files.module'
import { HostedFileReferenceRepository } from '@/repositories/hosted-file-reference.repository'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import { CredentialsValidator } from '@Common/auth/strategies/credentials/credentials.validator'
import { JwtValidator } from '@Common/auth/strategies/jwt/jwt.validator'
import { PaymentsModule } from '@/API/payments/payments.module'
import { SkillsModule } from '../skills/skills.module'
import { AdminCredentialsStrategy } from '@/common/auth/strategies/credentials/admin-credentials.strategy'

const jwtModuleOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<{ secret: string | undefined }> => {
    return { secret: configService.get<string>('JWT_SECRET') }
  },
  inject: [ConfigService],
}

const mailFactoryProvider = {
  provide: 'MailFactory',
  useFactory: (configService: ConfigService): SendGridMailFactory => {
    return new SendGridMailFactory(configService)
  },
  inject: [ConfigService],
}

const tokenFactoryProvider = {
  provide: TokenService,
  useFactory: (jwtService: JwtService, configService: ConfigService): TokenService => {
    return new TokenService(jwtService, configService)
  },
  inject: [JwtService, ConfigService],
}

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    TypegooseModule.forFeature([HostedFileReference]),
    JwtModule.registerAsync(jwtModuleOptions),
    HostedFilesModule,
    PaymentsModule,
    SkillsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    UsersService,
    HostedFilesService,
    HostedFileReferenceRepository,
    CredentialsStrategy,
    AdminCredentialsStrategy,
    CredentialsValidator,
    JwtValidator,
    JwtStrategy,
    mailFactoryProvider,
    tokenFactoryProvider,
    { provide: 'FileHostAPI', useClass: AWSS3API },
    { provide: 'MailAPI', useClass: SendGridMailAPI },
  ],
})
export class AuthModule {}
