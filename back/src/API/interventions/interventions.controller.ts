import { Controller, Get, HttpStatus, Param, UnprocessableEntityException } from '@nestjs/common'
import { InterventionsService } from './interventions.service'
import { Intervention } from '@/schemas/intervention'
import { isValidObjectId } from 'mongoose'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('interventions')
@Controller('interventions')
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  /**
   * Get all intervention
   *
   * @returns {Intervention[]} Found intervention
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de toutes les intervention', type: [Intervention], isArray: true })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Aucune intervention trouvée' })
  @Get()
  async getAll(): Promise<Intervention[]> {
    return this.interventionsService.getAll()
  }

  /**
   * Get an intervention by id
   *
   * @param {String} id The id of the intervention
   * @returns {Intervention}   Found intervention
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Récupération d'une intervention", type: Intervention })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Compétence introuvable' })
  @Get(':ID')
  async getById(@Param('ID') id: string): Promise<Intervention> {
    if (!isValidObjectId(id)) throw new UnprocessableEntityException("L'id fourni n'est pas valide")
    return this.interventionsService.getById(id)
  }
}
