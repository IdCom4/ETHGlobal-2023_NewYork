import { SkillRepository } from '@/repositories/skill.repository'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { Skill } from '@/schemas/skill/skill.schema'
import { ProfessionalRepository } from '@/repositories'
import { ProfessionalNotFoundException } from '@Common/exceptions/schemas/user/user-not-found.exception'
import { SkillNotFoundException } from '@Common/exceptions/schemas/skill/skill-not-found.exception'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SkillsService {
  constructor(private readonly skillRepository: SkillRepository, private readonly professionalRepository: ProfessionalRepository) {}

  /**
   * Get all skills
   *
   * @returns {Skill[]} The skills
   */
  public async getAll(): Promise<Skill[]> {
    return await this.skillRepository.findAll().getOr([])
  }

  /**
   * @deprecated This method is deprecated because it is not used anymore
   * Get all skills of a professional user
   *
   * @param {string} professionalUserId The id of the professional user
   * @returns {Skill} The skills of the professional user
   */
  public async getByUserId(professionalUserId: string): Promise<Skill[]> {
    const user = await this.professionalRepository.findProfessionalById(professionalUserId).getOrThrow(new ProfessionalNotFoundException())

    return this.skillRepository
      .findMany({ _id: { $in: user.professionalProfile.skillIds } })
      .getOrThrow(new InternalServerErrorException('Une erreur inconnue est survenue lors de la récupération des services'))
  }

  /**
   * Get a skill by id
   *
   * @param id The id of the skill
   * @returns The skill found
   */
  public async getById(id: string): Promise<Skill> {
    return await this.skillRepository.findById(id).getOrThrow(new SkillNotFoundException())
  }
}
