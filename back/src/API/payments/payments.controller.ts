import { MessageResponse } from '@Common/request-io/responses-dto/message.dto'
import { Controller, Post, Put, Get, UseGuards, Request, Param, Delete, HttpStatus, Body, InternalServerErrorException } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { JwtAuthGuard } from '@/common/auth/guards/jwt/jwt-auth.guard'
import { VmcCompaniesValidationPipe } from '@/common/request-io/query-validation-pipes/vmc-companies.validation-pipes'
import { VmcCompaniesKeyNames } from '@/common/enums/payments'
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { AuthType } from '@Common/enums/auth-type.enum'
import { AccountUpdateRequest } from './requests/account.dto'
import { ProfessionalUser } from '@/schemas/user'
import { ProfessionalJwtAuthGuard } from '@/common/auth/guards/jwt'

@ApiTags('payments')
@Controller('payments/:COMPANY')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @ApiResponse({ status: HttpStatus.CREATED, description: "Création d'une carte de crédit", type: String })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Carte de crédit introuvable' })
  @ApiParam({ name: 'COMPANY', enum: Object.keys(VmcCompaniesKeyNames), description: "Nom de l'entreprise" })
  @AuthApiDecorators(AuthType.JWT)
  @Post('create-credit-card-setup')
  @UseGuards(JwtAuthGuard)
  async createSetup(
    @Param('COMPANY', new VmcCompaniesValidationPipe()) company: VmcCompaniesKeyNames,
    @Request() { user: loggedUser }: RequestWithLoggedUser
  ): Promise<TDebitCardIntentClientSecret> {
    return await this.paymentService.createCardSetup(loggedUser, company)
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de la liste des cartes pour un utilisateur', type: [String], isArray: true })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Aucune carte de crédit introuvable' })
  @ApiParam({ name: 'COMPANY', enum: Object.keys(VmcCompaniesKeyNames), description: "Nom de l'entreprise" })
  @AuthApiDecorators(AuthType.JWT)
  @Get('card-list')
  @UseGuards(JwtAuthGuard)
  async getCardList(
    @Param('COMPANY', new VmcCompaniesValidationPipe()) company: VmcCompaniesKeyNames,
    @Request() { user: loggedUser }: RequestWithLoggedUser
  ): Promise<ICreditCard[]> {
    return await this.paymentService.getCreditCardList(loggedUser, company)
  }

  @AuthApiDecorators(AuthType.JWT)
  @Get('card/:CARD_ID')
  @UseGuards(JwtAuthGuard)
  async getCard(
    @Param('COMPANY', new VmcCompaniesValidationPipe()) company: VmcCompaniesKeyNames,
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('CARD_ID') cardId: string
  ): Promise<ICreditCard> {
    return await this.paymentService.getCard(loggedUser, company, cardId)
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Suppression de la carte de crédit', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Carte de crédit introuvable' })
  @ApiParam({ name: 'COMPANY', enum: Object.keys(VmcCompaniesKeyNames), description: "Nom de l'entreprise" })
  @AuthApiDecorators(AuthType.JWT)
  @Delete('card/:CARD_ID')
  @UseGuards(JwtAuthGuard)
  async deleteCreditCard(
    @Param('COMPANY', new VmcCompaniesValidationPipe()) company: VmcCompaniesKeyNames,
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('CARD_ID') cardId: string
  ): Promise<MessageResponse> {
    if ((await this.paymentService.deleteCreditCard(loggedUser, company, cardId)) === true)
      return new MessageResponse(200, 'Carte supprimée avec succès')
    return new MessageResponse(500, 'Une erreur est survenue')
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de la carte de crédit par défaut', type: String })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Carte de crédit introuvable' })
  @ApiParam({ name: 'COMPANY', enum: Object.keys(VmcCompaniesKeyNames), description: "Nom de l'entreprise" })
  @AuthApiDecorators(AuthType.JWT)
  @Get('default-card')
  @UseGuards(JwtAuthGuard)
  async getDefaultCard(
    @Param('COMPANY', new VmcCompaniesValidationPipe()) company: VmcCompaniesKeyNames,
    @Request() { user: loggedUser }: RequestWithLoggedUser
  ): Promise<ICreditCard | null> {
    return await this.paymentService.getDefaultCreditCard(loggedUser, company)
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Changement de la carte de crédit par défaut', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Carte de crédit introuvable' })
  @ApiParam({ name: 'COMPANY', enum: Object.keys(VmcCompaniesKeyNames), description: "Nom de l'entreprise" })
  @AuthApiDecorators(AuthType.JWT)
  @Put('default-card/:CARD_ID')
  @UseGuards(JwtAuthGuard)
  async setDefaultCreditCard(
    @Param('COMPANY', new VmcCompaniesValidationPipe()) company: VmcCompaniesKeyNames,
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('CARD_ID') cardId: string
  ): Promise<MessageResponse> {
    if ((await this.paymentService.setDefaultCreditCard(loggedUser, company, cardId)) === true)
      return new MessageResponse(200, 'Carte par défaut changée avec succès')

    throw new InternalServerErrorException('Une erreur inconnue est survenue')
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Mise à jour du compte réussi', type: MessageResponse })
  @ApiParam({ name: 'COMPANY', enum: Object.keys(VmcCompaniesKeyNames), description: "Nom de l'entreprise" })
  @AuthApiDecorators(AuthType.JWT)
  @Put('account')
  @UseGuards(ProfessionalJwtAuthGuard)
  async updateAccount(@Request() { user: loggedUser }: RequestWithLoggedUser, @Body() request: AccountUpdateRequest): Promise<MessageResponse> {
    await this.paymentService.updateOrCreateAndSavePaymentAccountByToken(loggedUser as ProfessionalUser, request.accountToken, request.iban)

    return new MessageResponse(200, 'Mise à jour du compte réussi')
  }
}
