import { AdminJwtAuthGuard } from '@/common/auth/guards/jwt'
import { UserGroups } from '@/common/enums/groups'
import { MessageResponse } from '@/common/request-io/responses-dto/message.dto'
import { Box } from '@/schemas/box'
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common/decorators'
import { HttpStatus } from '@nestjs/common/enums'
import { ParseBoolPipe } from '@nestjs/common/pipes'
import { SerializeOptions } from '@nestjs/common/serializer/decorators'
import { BoxesService } from './boxes.service'
import { CreateBoxRequest, UpdateBoxRequest } from './requests'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { AuthType } from '@Common/enums/auth-type.enum'

@ApiTags('boxes')
@Controller('boxes')
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  /* >==== PUBLIC ENDPOINTS ====> */

  /**
   * Retrieves all active boxes.
   * @remarks GET Method
   *
   * @return {Box[]} Array of all active boxes
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de toutes les boxes', type: [Box], isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Aucune box trouvée' })
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getAllBoxes(): Promise<Box[]> {
    return await this.boxesService.getAllBoxes({ activesOnly: true })
  }

  /**
   * Retrieves box by id.
   * @remarks GET Method
   *
   * @param {string} boxId The box id
   * @return {Box} Found box
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de la box', type: Box })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Box introuvable' })
  @Get(':BOX_ID')
  @HttpCode(HttpStatus.OK)
  async getBoxById(@Param('BOX_ID') boxId: string): Promise<Box> {
    return this.boxesService.getBoxById(boxId)
  }

  /**
   * Retrieves all boxes for a specific center.
   * @remarks GET Method
   *
   * @param {string} centerId The center id
   * @param {boolean} bookableOnly indicates if you want to get only bookable boxes
   * @return {Box[]} Found boxes
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de toutes les boxes du centre', type: [Box], isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Centre non trouvée' })
  @Get('by-center/:CENTER_ID')
  @HttpCode(HttpStatus.OK)
  async getAllBoxesByCenterId(@Param('CENTER_ID') centerId: string, @Query('bookable-only', ParseBoolPipe) bookableOnly: boolean): Promise<Box[]> {
    const boxes = await this.boxesService.getBoxesByCenterId(centerId)

    return bookableOnly ? boxes.filter((box) => box.isBookable()) : boxes
  }

  /* >==== ADMIN ONLY ====> */
  /**
   * Create a box.
   * @remarks POST Method
   *
   * @param {CreateBoxRequest} request The sent request with needed and validated information
   * @return {Box} the new box
   */
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Boxe créé avec succès', type: Box })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Centre introuvable' })
  @AuthApiDecorators(AuthType.JWT)
  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @SerializeOptions({ groups: [UserGroups.ADMIN_REQUEST], enableImplicitConversion: true })
  @HttpCode(HttpStatus.CREATED)
  async createBox(@Body() request: CreateBoxRequest): Promise<Box> {
    return await this.boxesService.createBox(request.name, request.description, request.centerId, request.category, request.isAvailable)
  }

  // TODO: convert to PATCH when new admin is on the way
  /**
   * Update box data.
   * @remarks PUT Method
   *
   * @param {string} boxId The box id
   * @param {UpdateBoxRequest} request The sent request with needed and validated information
   * @return {Box[]} Found boxes
   * @throws {InternalServerErrorException} if update failed
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Boxe mis à jour avec succès', type: Box })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Box introuvable' })
  @AuthApiDecorators(AuthType.JWT)
  @Put(':BOX_ID')
  @UseGuards(AdminJwtAuthGuard)
  @SerializeOptions({ groups: [UserGroups.ADMIN_REQUEST], enableImplicitConversion: true })
  @HttpCode(HttpStatus.OK)
  async updateBox(@Param('BOX_ID') boxId: string, @Body() request: UpdateBoxRequest): Promise<MessageResponse> {
    const updated = await this.boxesService.updateBox(boxId, request.name, request.description, request.category, request.isAvailable)

    if (!updated) throw new InternalServerErrorException('Une erreur inatendue est survenue lors de la mise à jour du box')

    return new MessageResponse(HttpStatus.OK, 'Boxe mis à jour')
  }

  /**
   * Delete a box.
   * @remarks DELETE Method
   *
   * @param {string} boxId The box id
   * @return {Box[]} Found boxes
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Boxe supprimé avec succès', type: Box })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Box introuvable' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Une erreur inconnue est survenue lors de la suppression du box' })
  @AuthApiDecorators(AuthType.JWT)
  @Delete(':BOX_ID')
  @UseGuards(AdminJwtAuthGuard)
  @SerializeOptions({ groups: [UserGroups.ADMIN_REQUEST], enableImplicitConversion: true })
  @HttpCode(HttpStatus.OK)
  async deleteBox(@Param('BOX_ID') boxId: string): Promise<MessageResponse> {
    await this.boxesService.deleteBoxById(boxId)

    return new MessageResponse(HttpStatus.OK, 'Boxe supprimé avec succès')
  }
}
