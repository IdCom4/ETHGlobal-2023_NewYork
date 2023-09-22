import { VehicleBrandsService } from '@Api/vehicles/brands/vehicle-brands.service'
import { Body, Controller, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { AdminJwtAuthGuard } from '@Common/auth/guards/jwt'
import { CreateVehicleBrandRequest } from '@Api/vehicles/brands/requests/create-vehicle-brand.dto'
import { UpdateVehicleBrandRequest } from '@Api/vehicles/brands/requests/update-vehicle-brand.dto'
import { Delete } from '@nestjs/common/decorators/http'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { MessageResponse } from '@Common/request-io/responses-dto'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { AuthType } from '@/common/enums/auth-type.enum'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { VehicleBrandResponse } from '@Api/vehicles/brands/responses/vehicle-brand.dto'

@ApiTags('vehicle-brands')
@Controller('vehicle-brands')
export class VehicleBrandsController {
  constructor(private readonly vehicleBrandsService: VehicleBrandsService) {}

  /**
   * Récupération des données des marques de véhicules.
   *
   * @return {VehicleBrand[]} Tableau des marques de véhicules.
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération des données des marques de véhicules',
    type: [VehicleBrandResponse],
    isArray: true,
  })
  @AuthApiDecorators(AuthType.JWT)
  @Get('all')
  async getVehicleBrands(): Promise<VehicleBrandResponse[]> {
    return (await this.vehicleBrandsService.getVehicleBrands()).map((brand) => new VehicleBrandResponse(brand))
  }

  /**
   * Récupération des données d'une marque de véhicule.
   *
   * @param {String} brandId ID de la marque de véhicule.
   * @return {VehicleBrand} Données de la marque de véhicule.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des données de la marque de véhicule', type: VehicleBrandResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Marque de véhicule inconnue' })
  @AuthApiDecorators(AuthType.JWT)
  @Get(':BRAND_ID')
  async getVehicleBrandById(@Param('BRAND_ID') brandId: string): Promise<VehicleBrandResponse> {
    return new VehicleBrandResponse(await this.vehicleBrandsService.getVehicleBrandById(brandId))
  }

  /**
   * Création d'une marque de véhicule.
   *
   * @param {CreateVehicleBrandRequest} request Données de la marque de véhicule.
   * @return {VehicleBrand} Données de la marque de véhicule.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Création de la marque de véhicule', type: VehicleBrandResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données invalides' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Une marque du même nom existe déjà' })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(AdminJwtAuthGuard)
  @Post()
  async createVehicleBrand(@Body() request: CreateVehicleBrandRequest): Promise<VehicleBrandResponse> {
    return new VehicleBrandResponse(await this.vehicleBrandsService.createVehicleBrand(request.name, request.vehicleType))
  }

  /**
   * Mise à jour d'une marque de véhicule.
   *
   * @param {String} brandId ID de la marque de véhicule.
   * @param {UpdateVehicleBrandRequest} request Données de la marque de véhicule.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mise à jour de la marque de véhicule', type: VehicleBrandResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données invalides' })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(AdminJwtAuthGuard)
  @Patch(':BRAND_ID')
  async updateVehicleBrand(@Param('BRAND_ID') brandId: string, @Body() request: UpdateVehicleBrandRequest): Promise<VehicleBrandResponse> {
    return new VehicleBrandResponse(await this.vehicleBrandsService.updateVehicleBrand(brandId, request.name, request.vehicleType))
  }

  /**
   * Suppression d'une marque de véhicule.
   *
   * @param {String} brandId ID de la marque de véhicule.
   * @return {MessageResponse} Message de confirmation.
   *
   * @throws {InternalServerErrorException} Erreur inconnue lors de la suppression de la marque.
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Suppression de la marque de véhicule', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Une erreur inconnue est survenue lors de la suppression de la marque' })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(AdminJwtAuthGuard)
  @Delete(':BRAND_ID')
  async deleteVehicleBrand(@Param('BRAND_ID') brandId: string): Promise<MessageResponse> {
    if (await this.vehicleBrandsService.deleteVehicleBrand(brandId)) return new MessageResponse(HttpStatus.OK, 'La marque a bien été supprimée')
    else throw new InternalServerErrorException('Une erreur inconnue est survenue lors de la suppression de la marque')
  }
}
