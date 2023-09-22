import { VehiclesService } from '@Api/vehicles/vehicles.service'
import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Request, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminJwtAuthGuard, JwtAuthGuard } from '@Common/auth/guards/jwt'
import { CreateVehicleRequest } from '@Api/vehicles/requests/create-vehicle.dto'
import { Delete } from '@nestjs/common/decorators/http'
import { UpdateVehicleRequest } from '@Api/vehicles/requests/update-vehicle.dto'
import { MessageResponse } from '@Common/request-io/responses-dto'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { AuthType } from '@Common/enums/auth-type.enum'
import { AdminVehicleResponse, OwnerVehicleResponse } from '@Api/vehicles/responses/vehicle.dto'

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  /**
   * Récupération des données des véhicules de l'utilisateur connecté
   *
   * @param {RequestWithLoggedUser.user} loggedUser Utilisateur connecté, correspond au propriétaire des véhicules.
   * @return {Vehicle[]} Tableau des véhicules du propriétaire.
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération des données des véhicules de la personne connectée.',
    type: Array<OwnerVehicleResponse>,
    isArray: true,
  })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getSelfVehicles(@Request() { user: loggedUser }: RequestWithLoggedUser): Promise<OwnerVehicleResponse[]> {
    const fetchedData = await this.vehicleService.getVehiclesOfOwner(loggedUser._id.toString())

    const response: OwnerVehicleResponse[] = []
    fetchedData.vehicles.forEach((vehicle) => {
      response.push(new OwnerVehicleResponse(vehicle, fetchedData.brandNames.get(vehicle.brandId) as string))
    })

    return response
  }

  /**
   * Récupération des données des véhicules du propriétaire.
   *
   * @param {String} ownerId ID du propriétaire des véhicules.
   * @return {Vehicle[]} Tableau des véhicules du propriétaire.
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération des données des véhicules du propriétaire.\n Retourne un tableau vide si le propriétaire est inconnu.',
    type: Array<AdminVehicleResponse>,
    isArray: true,
  })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(AdminJwtAuthGuard)
  @Get('owner/:OWNER_ID')
  async getVehiclesOfAnOwner(@Param('OWNER_ID') ownerId: string): Promise<AdminVehicleResponse[]> {
    const fetchedData = await this.vehicleService.getVehiclesOfOwner(ownerId)

    const response: AdminVehicleResponse[] = []
    fetchedData.vehicles.forEach((vehicle) => {
      response.push(new AdminVehicleResponse(vehicle, fetchedData.brandNames.get(vehicle.brandId) as string))
    })

    return response
  }

  /**
   * Récupération des données d'un véhicule.
   *
   * @param loggedUser Utilisateur connecté, utilisé pour vérifier que le véhicule appartient bien à l'utilisateur.
   * @param {String} vehicleId ID du véhicule.
   * @return {Vehicle} Données du véhicule.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des données du véhicule', type: OwnerVehicleResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Véhicule inconnu ou soft deleted' })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(JwtAuthGuard)
  @Get(':VEHICLE_ID')
  async getVehicleById(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('VEHICLE_ID') vehicleId: string
  ): Promise<OwnerVehicleResponse> {
    const fetchedData = await this.vehicleService.getVehicleById(vehicleId, loggedUser._id.toString())

    return new OwnerVehicleResponse(fetchedData.vehicle, fetchedData.brandName)
  }

  /**
   * Création d'un véhicule.
   *
   * @param {RequestWithLoggedUser} loggedUser Utilisateur connecté, correspond au propriétaire du véhicule.
   * @param {CreateVehicleRequest} request Données du véhicule à créer.
   * @return {Vehicle} Données du véhicule créé.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Création du véhicule', type: OwnerVehicleResponse })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Un véhicule avec cette place d'immatriculation existe déjà",
  })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createVehicle(@Request() { user: loggedUser }: RequestWithLoggedUser, @Body() request: CreateVehicleRequest): Promise<OwnerVehicleResponse> {
    const fetchedData = await this.vehicleService.createVehicle(
      loggedUser,
      request.model,
      request.brandId,
      request.year,
      request.plate,
      request.mileage
    )

    return new OwnerVehicleResponse(fetchedData.vehicle, fetchedData.brandName)
  }

  /**
   * Mise à jour d'un véhicule.
   *
   * @param {RequestWithLoggedUser} loggedUser Utilisateur connecté, permet de vérifier que le véhicule appartient bien à l'utilisateur.
   * @param {String} vehicleId ID du véhicule à mettre à jour.
   * @param {UpdateVehicleRequest} request Données du véhicule à mettre à jour.
   * @return {Vehicle} Données du véhicule mis à jour.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mise à jour du véhicule', type: OwnerVehicleResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Véhicule inconnu ou soft deleted' })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(JwtAuthGuard)
  @Patch(':VEHICLE_ID')
  async userUpdateVehicle(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('VEHICLE_ID') vehicleId: string,
    @Body() request: UpdateVehicleRequest
  ): Promise<OwnerVehicleResponse> {
    const fetchedData = await this.vehicleService.userUpdateVehicle(
      loggedUser._id.toString(),
      vehicleId,
      request.plate,
      request.mileage,
      request.model,
      request.brandId,
      request.year
    )

    return new OwnerVehicleResponse(fetchedData.vehicle, fetchedData.brandName)
  }

  /**
   * Récupération des données d'un véhicule par un administrateur.
   * Contrairement à la route GET /:VEHICLE_ID, cette route ne vérifie pas que le véhicule appartient à l'utilisateur.
   *
   * @param {String} vehicleId ID du véhicule.
   * @return {Vehicle} Données du véhicule.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des données du véhicule', type: AdminVehicleResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Véhicule inconnu ou soft deleted' })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(AdminJwtAuthGuard)
  @Get(':VEHICLE_ID')
  async adminGetVehicleById(@Param('VEHICLE_ID') vehicleId: string): Promise<AdminVehicleResponse> {
    const fetchedData = await this.vehicleService.getVehicleById(vehicleId)

    return new AdminVehicleResponse(fetchedData.vehicle, fetchedData.brandName)
  }

  /**
   * Mise à jour d'un véhicule par un admin
   * Contrairement à la méthode {@link updateVehicle}, cette méthode ne vérifie pas que le véhicule appartient bien à l'utilisateur
   *
   * @param {String} vehicleId ID du véhicule à mettre à jour.
   * @param {UpdateVehicleRequest} request Données du véhicule à mettre à jour.
   * @return {Vehicle} Données du véhicule mis à jour.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mise à jour du véhicule', type: AdminVehicleResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Véhicule inconnu ou soft deleted' })
  @UseGuards(AdminJwtAuthGuard)
  @Patch('admin/:VEHICLE_ID')
  async adminUpdateVehicle(@Param('VEHICLE_ID') vehicleId: string, @Body() request: UpdateVehicleRequest): Promise<AdminVehicleResponse> {
    const fetchedData = await this.vehicleService.adminUpdateVehicle(
      vehicleId,
      request.plate,
      request.mileage,
      request.model,
      request.brandId,
      request.year
    )

    return new AdminVehicleResponse(fetchedData.vehicle, fetchedData.brandName)
  }

  /**
   * Suppression d'un véhicule.
   * Il s'agit d'un soft delete, le véhicule est toujours présent en base de données, mais n'est plus accessible.
   *
   * @param {RequestWithLoggedUser.user} loggedUser Utilisateur connecté, permet de vérifier que le véhicule appartient bien à l'utilisateur.
   * @param {String} vehicleId ID du véhicule à supprimer.
   * @return {MessageResponse} Message de confirmation de suppression.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Suppression du véhicule', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Véhicule inconnu ou soft deleted' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur est survenue lors de la suppression du véhicule',
  })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(JwtAuthGuard)
  @Delete('/:VEHICLE_ID')
  async userSoftDeleteVehicle(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('VEHICLE_ID') vehicleId: string
  ): Promise<MessageResponse> {
    if (await this.vehicleService.userSoftDeleteVehicle(loggedUser._id.toString(), vehicleId))
      return new MessageResponse(HttpStatus.OK, 'Véhicule supprimé avec succès')
    else throw new InternalServerErrorException('Une erreur est survenue lors de la suppression du véhicule')
  }

  /**
   * Suppression d'un véhicule par un administrateur.
   * Cette route ne vérifie pas le propriétaire du véhicule.
   * Il s'agit d'un soft delete, le véhicule est toujours présent en base de données, mais n'est plus accessible.
   *
   * @param {String} vehicleId ID du véhicule à supprimer.
   * @return {MessageResponse} Message de confirmation de suppression.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Suppression du véhicule', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Véhicule inconnu ou soft deleted' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur est survenue lors de la suppression du véhicule',
  })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(AdminJwtAuthGuard)
  @Delete('admin/:VEHICLE_ID')
  async adminSoftDeleteVehicle(@Param('VEHICLE_ID') vehicleId: string): Promise<MessageResponse> {
    if (await this.vehicleService.adminSoftDeleteVehicle(vehicleId)) return new MessageResponse(HttpStatus.OK, 'Véhicule supprimé avec succès')
    else throw new InternalServerErrorException('Une erreur est survenue lors de la suppression du véhicule')
  }
}
