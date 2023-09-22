import { SkillCategories } from '../constants/models/skill'

export {}

declare global {
  type TSkillCategory = SkillCategories.WASHING | SkillCategories.DETAILING | SkillCategories.MECANIC

  interface ISkill {
    _id: string
    label: string
    categories: SkillCategories[]
  }
  interface ISkillCategory {
    id: string
    category: string
    skills: string[]
  }
}
