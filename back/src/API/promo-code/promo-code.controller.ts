import { AdminJwtAuthGuard, JwtAuthGuard } from '@/common/auth/guards/jwt'
import { UserAlreadyUsedPromoCodeException } from '@/common/exceptions/schemas/promo-code/user-already-used-promo-code.exception'
import { MessageResponse } from '@/common/request-io/responses-dto'
import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator'
import { Request } from '@nestjs/common'
import { Delete, Get, Param, Post, Put } from '@nestjs/common/decorators/http'
import { HttpStatus } from '@nestjs/common/enums'
import { PromoCodesService } from './promo-code.service'
import { Body } from '@nestjs/common/decorators/http/route-params.decorator'
import { DateTimeRange } from '@/schemas/common/pojos'
import { CreatePromoCodeRequest } from './requests'
import { AdminPromoCodeResponse, PublicPromoCodeResponse } from './response'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('promoCodes')
@Controller('promoCodes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  /* >==== ADMIN ENDPOINTS ====> */
  /**
   * Retrieves the promo code by id.
   * @param {String} codeId           The promo code id
   * @return {AdminPromoCodeResponse} The promo code
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération du code promotionnel',
    type: AdminPromoCodeResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Code promotionnel introuvable' })
  @Get('getById/:CODE_ID')
  @UseGuards(AdminJwtAuthGuard)
  async getPromoCodeById(@Param('CODE_ID') codeId: string): Promise<AdminPromoCodeResponse> {
    return new AdminPromoCodeResponse(await this.promoCodesService.getPromoCodeById(codeId))
  }

  /**
   * Retrieves the promo code by id.
   * @return {AdminPromoCodeResponse[]} The promo codes shaped for admins
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération de tous les codes promotionnels',
    type: [AdminPromoCodeResponse],
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Code(s) promotionnel(s) introuvable(s)' })
  @Get('all')
  @UseGuards(AdminJwtAuthGuard)
  async getAllPromoCodes(): Promise<AdminPromoCodeResponse[]> {
    return (await this.promoCodesService.getAllPromoCodes()).map((promoCode) => new AdminPromoCodeResponse(promoCode))
  }

  /**
   * Create a new promo code.
   * @param {CreatePromoCodeRequest} req The request containing the data of the new promo code
   * @return {MessageResponse}           The message responses
   */
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Code promotionnel créé avec succès', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données du code promotionnel invalides' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Un code promotionnel avec le même label existe déjà' })
  @Post()
  @UseGuards(AdminJwtAuthGuard)
  async createPromoCode(@Body() req: CreatePromoCodeRequest): Promise<MessageResponse> {
    await this.promoCodesService.createPromoCode(
      req.label,
      req.reductionPercentage,
      req.beneficiaryCommissionPercentage,
      req.beneficiary.toContactInfo(),
      DateTimeRange.of(req.from, req.to)
    )
    return new MessageResponse(HttpStatus.CREATED, 'Code promotionnel créé avec succès')
  }

  /**
   * Cancel a promo code.
   * It is a soft deletion of the promo code.
   * @param {String} codeId    The promo code id
   * @return {MessageResponse} The message responses
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Code promotionnel annulé avec succès', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Code promotionnel introuvable' })
  @Delete('cancel/:CODE_ID')
  @UseGuards(AdminJwtAuthGuard)
  async cancelPromoCode(@Param('CODE_ID') codeId: string): Promise<MessageResponse> {
    await this.promoCodesService.cancelCode(codeId)
    return new MessageResponse(HttpStatus.OK, 'Code promotionnel annulé avec succès')
  }

  /* @Get("toXlsx/:CODE_ID")
  @UseGuards(AdminJwtAuthGuard)
  async getPromoCodeAsXlsx(@Param("CODE_ID") codeId: string): ResponseEntity<ByteArrayResource> {
      const (fileName, report) = this.promoCodesService.generateXlsx(codeId)
      return ResponseEntity
          .ok()
          .header("Content-Disposition", "attachment; filename=$fileName")
          .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
          .body(ByteArrayResource(report))
  } */

  /* >==== PUBLIC ENDPOINTS ====> */
  /**
   * Check if the user has already used the promo code.
   * @param loggedUser         The logged user
   * @param {String} label     The promo code label
   * @return {MessageResponse} The message responses
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Code promotionnel disponible', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Code promotionnel déjà utilisé' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Code promotionnel introuvable' })
  @Put(':LABEL')
  @UseGuards(JwtAuthGuard)
  async checkIfUserAlreadyUsedCode(@Request() { user: loggedUser }: RequestWithLoggedUser, @Param('LABEL') label: string): Promise<MessageResponse> {
    const hasUserAlreadyUsed = await this.promoCodesService.checkIfUserAlreadyUsedCodeAndThrowIfInactive(loggedUser._id.toString(), label)

    if (hasUserAlreadyUsed) throw new UserAlreadyUsedPromoCodeException()

    return new MessageResponse(HttpStatus.OK, 'Code promotionnel disponible')
  }

  /**
   * Retrieves the promo code by label.
   * @param {String} label             The promo code label
   * @return {PublicPromoCodeResponse} The promo code
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération du code promotionnel',
    type: PublicPromoCodeResponse,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Code promotionnel inactif' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Code promotionnel introuvable' })
  @Get(':LABEL')
  async getPromoCodeByLabel(@Param('LABEL') label: string): Promise<PublicPromoCodeResponse> {
    return new PublicPromoCodeResponse(await this.promoCodesService.getPromoCodeByLabel(label))
  }
}
