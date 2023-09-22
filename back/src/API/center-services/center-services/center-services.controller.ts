import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common'
import { CenterServicesService } from '@Api/center-services/center-services/center-services.service'
import { CenterService } from '@Schemas/center-service/center-service'
import { CreateCenterServiceRequest } from '@Api/center-services/center-services/requests/create-center-service.dto'
import { UpdateCenterServiceRequest } from '@Api/center-services/center-services/requests/update-center-service.dto'
import { MessageResponse } from '@Common/request-io/responses-dto/message.dto'
import { AdminJwtAuthGuard } from '@Common/auth/guards/jwt'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { AuthType } from '@Common/enums/auth-type.enum'

@ApiTags('center-services')
@Controller('center-services')
export class CenterServicesController {
  constructor(private readonly centerServicesService: CenterServicesService) {}

  // >==== PUBLIC ENDPOINTS
  /**
   * Retrieves all active center services.
   * @remarks GET Method
   *
   * @returns {CenterService[]} Found center services
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération de toutes les services du centre',
    type: [CenterService],
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Une erreur inconnue est survenue lors de la récupération des services',
  })
  @Get()
  public async getAllActiveCenterServices(): Promise<CenterService[]> {
    return this.centerServicesService.getAllCenters({ activeOnly: true })
  }

  /**
   * Retrieves a center service by id.
   * @remarks GET Method
   *
   * @param {string} centerServiceId The center service id
   *
   * @returns {CenterService[]} Found center services
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération du service du centre', type: CenterService })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Service introuvable' })
  @Get('by-id/:ID')
  public async getCenterServiceById(@Param('ID') centerServiceId: string): Promise<CenterService> {
    return this.centerServicesService.getCenterServiceById(centerServiceId)
  }

  // >==== ADMIN ENDPOINTS
  /**
   * Retrieves all center services
   * @remarks GET Method
   *
   * @returns {CenterService[]} Found center services
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération de tous les service du centre',
    type: CenterService,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Une erreur inconnue est survenue lors de la récupération des services',
  })
  @AuthApiDecorators(AuthType.JWT)
  @Get('admin')
  @UseGuards(AdminJwtAuthGuard)
  public async getAllCenterServices(): Promise<CenterService[]> {
    return this.centerServicesService.getAllCenters({ activeOnly: false })
  }

  /**
   * Create a center service
   * @remarks POST Method
   *
   * @param {RequestWithLoggedUser} loggedUser The logged user
   * @param {CreateBoxRequest} request The sent request with needed and validated information
   * @return {CenterService} Created center service
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Création d'un service du centre", type: CenterService })
  @AuthApiDecorators(AuthType.JWT)
  @Post('admin')
  @UseGuards(AdminJwtAuthGuard)
  public async createCenterServices(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Body() request: CreateCenterServiceRequest
  ): Promise<CenterService> {
    return this.centerServicesService.createCenterService(
      loggedUser,
      request.title,
      request.subtitle,
      request.description,
      request.isActive,
      request.picture
    )
  }

  /**
   * Modify a center service
   * @remarks PUT Method
   *
   * @param {RequestWithLoggedUser} loggedUser The logged user
   * @param {string} centerServiceId The center service id to modify, initially sent with the URI
   * @param {CreateBoxRequest} request The sent request with needed and validated information
   * @return {MessageResponse} Response given for the modification
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Modification du service du centre', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Service introuvable' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur inconnue est survenue lors de la modification du service',
  })
  @AuthApiDecorators(AuthType.JWT)
  @Put('admin/:ID')
  @UseGuards(AdminJwtAuthGuard)
  public async updateCenterService(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('ID') centerServiceId: string,
    @Body() request: UpdateCenterServiceRequest
  ): Promise<MessageResponse> {
    const didUpdated = await this.centerServicesService.updateCenterService(
      loggedUser,
      centerServiceId,
      request.title,
      request.subtitle,
      request.description,
      request.isActive,
      request.picture,
      request.numberOfSales,
      request.optionIds,
      request.categories,
      request.prices?.toPricesByVehicleType()
    )

    if (!didUpdated) throw new InternalServerErrorException('Une erreur inconnue est survenue lors de la mise à jour du service')

    return new MessageResponse(HttpStatus.OK, 'Service modifié avec succès')
  }

  /**
   * Deactivate a center service
   * @remarks PATCH Method
   *
   * @param {string} centerServiceId The center service id to deactivate, initially sent with the URI
   * @return {MessageResponse} Response given for the deactivation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Désactivation du service du centre', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Service introuvable' })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('admin/:ID')
  @UseGuards(AdminJwtAuthGuard)
  public async deactivateCenterService(@Param('ID') centerServiceId: string): Promise<MessageResponse> {
    await this.centerServicesService.deactivateCenterService(centerServiceId)
    return new MessageResponse(HttpStatus.OK, 'Service désactivé avec succès')
  }

  /**
   * Delete a center service
   * @remarks DELETE Method
   *
   * @param {string} centerServiceId The center service id to delete, initially sent with the URI
   * @return {MessageResponse} Response given for the deletion
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Suppression du service du centre', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Service introuvable' })
  @AuthApiDecorators(AuthType.JWT)
  @Delete('admin/:ID')
  @UseGuards(AdminJwtAuthGuard)
  public async deleteCenterService(@Param('ID') centerServiceId: string): Promise<MessageResponse> {
    await this.centerServicesService.deleteCenterService(centerServiceId)
    return new MessageResponse(HttpStatus.OK, 'Service supprimé avec succès')
  }
}
