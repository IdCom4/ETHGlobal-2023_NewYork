import { Controller, Get, HttpStatus, Param, UnprocessableEntityException } from '@nestjs/common'
import { SkillsService } from '@Api/skills/skills.service'
import { Skill } from '@/schemas/skill/skill.schema'
import { isValidObjectId } from 'mongoose'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  /**
   * Get all skills
   * @returns {Skill[]} Found skills
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de toutes les compétences', type: [Skill], isArray: true })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Aucune compétence trouvée' })
  @Get()
  async getAll(): Promise<Skill[]> {
    return this.skillsService.getAll()
  }

  /**
   * @deprecated This route is deprecated because it is not supposed to be used anymore
   * Get all skills of a professional user
   *
   * @param {String} userId The id of the professional user
   * @returns {Skill[]}     Found skills
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Récupération de toutes les compétences d'un utilisateur", type: [Skill], isArray: true })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Aucune compétence trouvée' })
  @Get('by-user-id/:ID')
  async getByUserId(@Param('ID') userId: string): Promise<Skill[]> {
    if (!isValidObjectId(userId)) throw new UnprocessableEntityException("L'id fourni n'est pas valide")
    return this.skillsService.getByUserId(userId)
  }

  /**
   * Get a skill by id
   * @param {String} id The id of the skill
   * @returns {Skill}   Found skill
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Récupération d'une compétence", type: Skill })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Compétence introuvable' })
  @Get(':ID')
  async getById(@Param('ID') id: string): Promise<Skill> {
    if (!isValidObjectId(id)) throw new UnprocessableEntityException("L'id fourni n'est pas valide")
    return this.skillsService.getById(id)
  }
}
