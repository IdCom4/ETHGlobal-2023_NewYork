import { Module } from '@nestjs/common'
import { SkillsController } from '@Api/skills/skills.controller'
import { SkillsService } from '@Api/skills/skills.service'
import { Skill } from '@/schemas/skill/skill.schema'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '@Schemas/user'
import { ProfessionalRepository } from '@/repositories'
import { SkillRepository } from '@/repositories/skill.repository'

@Module({
  imports: [TypegooseModule.forFeature([Skill, User])],
  exports: [SkillsService, SkillRepository, TypegooseModule.forFeature([Skill])],
  controllers: [SkillsController],
  providers: [SkillsService, ProfessionalRepository, SkillRepository],
})
export class SkillsModule {}
