import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, SerializeOptions, UseGuards } from '@nestjs/common'
import { CentersService, TBoxCategoriesFormulas } from '@Api/centers/centers.service'
import { AdminJwtAuthGuard } from '@Common/auth/guards/jwt'
import { MessageResponse } from '@Common/request-io/responses-dto/message.dto'
import { Center } from '@/schemas/center'
import { CreateCenterRequest, UpdateCenterRequest } from './requests'
import { UserGroups } from '@/common/enums/groups'
import { UpdateCenterFormulasRequest } from './requests/update-center-formulas.dto'
import { TimeRange } from '@/schemas/common/pojos'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { AuthType } from '@Common/enums/auth-type.enum'

@ApiTags('centers')
@Controller('centers')
export class CentersController {
  constructor(private readonly centersService: CentersService) {}

  /* >==== PUBLIC ENDPOINTS ====> */
  /* >>==== GETTERS ====>> */
  /**
   * Retrieves all centers.
   *
   * @returns An array with all centers
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération de toutes les centres',
    type: [Center],
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Une erreur inconnue est survenue lors de la récupération des centres',
  })
  @Get()
  @SerializeOptions({ enableImplicitConversion: true })
  async getAllCenters(): Promise<Center[]> {
    // TODO: remove time shifting later
    const centers = await this.centersService.getAllCenters({ activesOnly: true })
    centers.forEach((center) => this.convertCenterOpeningHoursFromUTCToFrenchTZ(center))
    return centers
  }

  /**
   * Retrieves a center by its id.
   *
   * @param centerId The center id
   * @returns The center
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération du centres', type: Center })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Centres introuvable' })
  @Get(':CENTER_ID')
  async getCenterById(@Param('CENTER_ID') centerId: string): Promise<Center> {
    // TODO: remove time shifting later
    const center = await this.centersService.getCenterById(centerId)
    this.convertCenterOpeningHoursFromUTCToFrenchTZ(center)
    return center
  }

  /**
   * Retrieves formulas of a center by its id.
   *
   * @param centerId The center id
   * @returns A map with all formulas by box category
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Récupération des formules d'un centre" })
  @Get('formulas/:CENTER_ID')
  async getCenterFormulas(@Param('CENTER_ID') centerId: string): Promise<TBoxCategoriesFormulas> {
    return this.centersService.getCenterFormulasByCategories(centerId)
  }

  /* >==== ADMIN ONLY ====> */
  /**
   * Creates a center as an admin.
   *
   * @param request The center creation request
   * @returns The created center
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Création d'un centre", type: Center })
  @AuthApiDecorators(AuthType.JWT)
  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @SerializeOptions({ groups: [UserGroups.ADMIN_REQUEST], enableImplicitConversion: true })
  @HttpCode(HttpStatus.OK)
  async createCenter(@Body() request: CreateCenterRequest): Promise<Center> {
    // TODO: remove time shifting later
    const center = await this.centersService.createCenter(request.name, request.location.toStrictAddress())
    this.convertCenterOpeningHoursFromUTCToFrenchTZ(center)
    return center
  }

  /**
   * Deletes a center by its id as an admin.
   *
   * @param centerId The center id
   * @returns A message response
   */
  @AuthApiDecorators(AuthType.JWT)
  @Delete(':CENTER_ID')
  @UseGuards(AdminJwtAuthGuard)
  @SerializeOptions({ groups: [UserGroups.ADMIN_REQUEST], enableImplicitConversion: true })
  @HttpCode(HttpStatus.OK)
  async deleteCenter(@Param('CENTER_ID') centerId: string): Promise<MessageResponse> {
    await this.centersService.deleteCenter(centerId)
    return new MessageResponse(200, 'Centre supprimé avec succès')
  }

  /**
   * Updates a center by its id as an admin.
   *
   * @param request The center update request
   * @returns The updated center
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Modification des formules d'un centre", type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Centre introuvable' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur inconnue est survenue lors de la modification du service',
  })
  @AuthApiDecorators(AuthType.JWT)
  @Put('formulas')
  @UseGuards(AdminJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateCenterFormulas(@Body() request: UpdateCenterFormulasRequest): Promise<MessageResponse> {
    await this.centersService.updateCenterFormulasByCategory(
      request.centerId,
      request.boxCategory,
      request.formulas.map((formulaDTO) => formulaDTO.toFormula())
    )

    return new MessageResponse(200, 'Formules des boxes mis à jours avec succès')
  }

  /**
   * Updates a center by its id as an admin.
   *
   * @param centerId The center id
   * @param request The center update request
   * @returns The updated center
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Modification d'un centre", type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Centre introuvable' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur inconnue est survenue lors de la mise à jour du centre',
  })
  @AuthApiDecorators(AuthType.JWT)
  @Put(':CENTER_ID')
  @UseGuards(AdminJwtAuthGuard)
  @SerializeOptions({ groups: [UserGroups.ADMIN_REQUEST], enableImplicitConversion: true })
  @HttpCode(HttpStatus.OK)
  async updateCenter(@Param('CENTER_ID') centerId: string, @Body() request: UpdateCenterRequest): Promise<MessageResponse> {
    await this.centersService.updateCenter(centerId, request.name, request.location?.toStrictAddress(), request.openingHours?.toWeekOpeningHours())
    return new MessageResponse(200, 'Centre mis à jour avec succès')
  }

  /**
   * Converts center opening hours from UTC to French timezone.
   * The update will be done in place on the center object.
   *
   * @param center The center to convert
   * @private
   */
  private convertCenterOpeningHoursFromUTCToFrenchTZ(center: Center): void {
    const openingHours = JSON.parse(JSON.stringify(center.openingHours))
    for (const day in center.openingHours) {
      const frenchBegin = this.convertTimeFromUTCToFrenchTZ(center.openingHours[day].begin)
      const frenchEnd = this.convertTimeFromUTCToFrenchTZ(center.openingHours[day].end)

      openingHours[day] = TimeRange.of(frenchBegin, frenchEnd)
    }

    center.update({ openingHours })
  }

  /**
   * Converts a string time from UTC to French timezone.
   *
   * @param time The time to convert
   * @returns The converted time
   * @private
   */
  private convertTimeFromUTCToFrenchTZ(time: string): string {
    const [UTCHours, minutes]: [number, string] = time.split(':').map((value, index) => (index === 0 ? parseInt(value) : value)) as [number, string]

    const frenchHours = UTCHours + 2
    const formatedHours = frenchHours < 10 ? '0' + frenchHours : frenchHours

    return `${formatedHours}:${minutes}`
  }
}
