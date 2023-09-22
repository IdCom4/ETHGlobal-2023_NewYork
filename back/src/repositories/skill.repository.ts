import { Skill } from '@/schemas/skill/skill.schema'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { Injectable } from '@nestjs/common'
import { AbstractBaseRepository } from '@/repositories/base/abstract.repository'
import { SkillBlueprint } from '@/schemas/skill/skill.blueprint'

@Injectable()
export class SkillRepository extends AbstractBaseRepository<Skill, SkillBlueprint> {
  constructor(@InjectModel(Skill) model: ReturnModelType<typeof Skill>) {
    super(model, Skill)
  }
}
