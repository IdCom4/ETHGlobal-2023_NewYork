import { Body, Controller, HttpStatus, Patch, Request, UseGuards } from '@nestjs/common'
import { UpdateProfessionalProfileRequest } from '@Api/professionals/requests/update-professional-profile/update-professional-profile.dto'
import { ProfessionalsService } from '@Api/professionals/professionals.service'
import { ProfessionalJwtAuthGuard } from '@Common/auth/guards/jwt/professional-jwt.guard'
import { ProfessionalUser } from '@/schemas/user'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { AuthType } from '@Common/enums/auth-type.enum'

@ApiTags('professionals')
@Controller('professionals')
@UseGuards(ProfessionalJwtAuthGuard)
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  /**
   * Update professional profile
   * @param loggedUser                                      The logged user, resolved by the guard
   * @param {UpdateProfessionalProfileRequest} bodyRequest  The sent request with needed and validated information
   * @return {MessageResponse}                              Response given for the modification
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Modification du profil professionnel. Le corps de la réponse correspond aux données de l'utilisateur après mise à jour.",
    type: ProfessionalUser,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Vous devez être un spécialiste pour mettre à jour ces informations',
  })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('update')
  async updateProfile(
    @Request() { user: loggedUser }: RequestWithLoggedUser<ProfessionalUser>,
    @Body() bodyRequest: UpdateProfessionalProfileRequest
  ): Promise<ProfessionalUser> {
    const updatedUser = await this.professionalsService.updateProfile(loggedUser, bodyRequest.fieldsToUpdate, bodyRequest.fields)
    return updatedUser
  }
}
