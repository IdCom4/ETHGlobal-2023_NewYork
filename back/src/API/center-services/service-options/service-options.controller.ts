import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ServiceOptionsService } from '@Api/center-services/service-options/service-options.service'
import { ServiceOption } from '@/schemas/center-service/service-option/service-option.schema'
import { CreateServiceOptionRequest } from '@Api/center-services/service-options/requests/create-service-option.dto'
import { UpdateServiceOptionRequest } from '@Api/center-services/service-options/requests/update-service-option.dto'
import { MessageResponse } from '@Common/request-io/responses-dto/message.dto'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { AdminJwtAuthGuard } from '@Common/auth/guards/jwt'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { AuthType } from '@Common/enums/auth-type.enum'

@ApiTags('service-options')
@Controller('service-options')
export class ServiceOptionsController {
  constructor(private readonly serviceOptionsService: ServiceOptionsService) {}

  // >==== PUBLIC ENDPOINTS
  /**
   * Retrieves all active service options.
   * @remarks GET Method
   *
   * @returns {ServiceOption[]} Found service options
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération de toutes les options de service du centre',
    type: [ServiceOption],
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Une erreur inconnue est survenue lors de la récupération des options de service',
  })
  @Get()
  public async getAllServiceOptions(): Promise<ServiceOption[]> {
    return await this.serviceOptionsService.getAllServiceOptions()
  }

  /**
   * Retrieves a service option by id.
   * @remarks GET Method
   *
   * @param {string} serviceOptionId The center service id
   *
   * @returns {ServiceOption} Service option found
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Récupération de l'option de service du centre", type: ServiceOption })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Option de service introuvable' })
  @Get(':ID')
  public async getServiceOptionsById(@Param('ID') serviceOptionId: string): Promise<ServiceOption> {
    return await this.serviceOptionsService.getServiceOptionById(serviceOptionId)
  }

  // >==== ADMIN ENDPOINTS
  /**
   * Create a service option
   * @remarks POST Method
   *
   * @param {CreateServiceOptionRequest} request The sent request with needed and validated information
   * @return {CenterService} Service option created
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Création d'un option de service du centre", type: ServiceOption })
  @AuthApiDecorators(AuthType.JWT)
  @Post('admin')
  @UseGuards(AdminJwtAuthGuard)
  public async createServiceOption(@Body() request: CreateServiceOptionRequest): Promise<ServiceOption> {
    return await this.serviceOptionsService.createServiceOption(request.title, request.extraPrices?.toPricesByVehicleType())
  }

  /**
   * Modify a service option
   * @remarks PUT Method
   *
   * @param {string} serviceOptionId The service option id to modify, initially sent with the URI
   * @param {CreateBoxRequest} request The sent request with needed and validated information
   * @return {MessageResponse} Response given for the modification
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Modification de l'option de service du centre", type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Option de service introuvable' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Une erreur inconnue est survenue lors de la modification de l'option de service",
  })
  @AuthApiDecorators(AuthType.JWT)
  @Put('admin/:ID')
  @UseGuards(AdminJwtAuthGuard)
  public async updateServiceOption(@Param('ID') serviceOptionId: string, @Body() request: UpdateServiceOptionRequest): Promise<MessageResponse> {
    if (await this.serviceOptionsService.updateServiceOption(serviceOptionId, request.title, request.extraPrices.toPricesByVehicleType()))
      return new MessageResponse(HttpStatus.OK, 'Service modifié avec succès')
    else throw new InternalServerErrorException('Une erreur est survenue lors de la modification du service option')
  }

  /**
   * Delete a service option
   * @remarks DELETE Method
   *
   * @param {string} serviceOptionId The service option id to delete, initially sent with the URI
   * @return {MessageResponse} Response given for the deletion
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Suppression de l'option de service du centre", type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Option de service introuvable' })
  @AuthApiDecorators(AuthType.JWT)
  @Delete('admin/:ID')
  @UseGuards(AdminJwtAuthGuard)
  public async deleteServiceOption(@Param('ID') serviceOptionId: string): Promise<MessageResponse> {
    if (await this.serviceOptionsService.deleteServiceOption(serviceOptionId))
      return new MessageResponse(HttpStatus.OK, 'Service supprimé avec succès')
    else throw new InternalServerErrorException('Une erreur est survenue lors de la suppression du service option')
  }
}

// TODO : Peut-être voir pour modifier le status code de la requête avec un message error
// Exemple: Si on met un HttpStatus.INTERNAL..., on a quand même une réponse 200 dans le header
