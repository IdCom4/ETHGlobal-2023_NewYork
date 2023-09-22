import { SkillCategory } from '@Common/enums/schemas/skill.schema.enum'
import { Skill } from '@/schemas/skill/skill.schema'
import mongoose from 'mongoose'

export class SkillBlueprint extends Skill {
  public _id: mongoose.Types.ObjectId
  public createdAt: Date
  public updatedAt: Date
  public _label: string
  public _categories: SkillCategory[]
}
