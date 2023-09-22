import { BoxRepository, CenterRepository, UserRepository } from '@/repositories'
import { Box } from '@/schemas/box'
import { Center } from '@/schemas/center'
import { User } from '@/schemas/user'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { BoxesController } from './boxes.controller'
import { BoxesService } from './boxes.service'

@Module({
  imports: [TypegooseModule.forFeature([Box, User, Center])],
  exports: [BoxesService, BoxRepository, TypegooseModule.forFeature([Box, User])],
  providers: [BoxesService, BoxRepository, CenterRepository, ConfigService, UserRepository],
  controllers: [BoxesController],
})
export class BoxesModule {}
