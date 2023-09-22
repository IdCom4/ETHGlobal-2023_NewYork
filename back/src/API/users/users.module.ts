import { Module } from '@nestjs/common'
import { UsersController } from '@Api/users/users.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '@Schemas/user'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UsersService } from '@Api/users/users.service'
import { UserRepository } from '@/repositories/user.repository'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { HostedFilesModule } from '@Api/hosted-files/hosted-files.module'
import { AWSS3API } from '@Common/external-service-providers-api/file-host/file-host.api'
import { HostedFileReferenceRepository } from '@/repositories/hosted-file-reference.repository'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'

const jwtModuleOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<{ secret: string | undefined }> => {
    return { secret: configService.get<string>('JWT_SECRET') }
  },
  inject: [ConfigService],
}

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    TypegooseModule.forFeature([HostedFileReference]),
    JwtModule.registerAsync(jwtModuleOptions),
    HostedFilesModule,
  ],
  exports: [UsersService, UserRepository],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    HostedFilesService,
    HostedFileReferenceRepository,
    ConfigService,
    { provide: 'FileHostAPI', useClass: AWSS3API },
  ],
})
export class UsersModule {}
