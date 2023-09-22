import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { PasswordRecoveryRequest, RegisterRequest } from './requests'
import { UserGroups } from '@/common/enums/groups/user.groups'
import { CredentialsAuthGuard } from '@Common/auth/guards/credentials/credentials-auth.guard'
import { RefreshRequest } from '@Api/auth/requests/refresh.dto'
import { JwtAuthGuard } from '@Common/auth/guards/jwt/jwt-auth.guard'
import { LoginResponse } from '@/API/auth/responses/login.dto'
import { RefreshResponse } from '@/API/auth/responses/refresh.dto'
import { MessageResponse } from '@Common/request-io/responses-dto/message.dto'
import { TokenService } from '@Common/services/token.service'
import { PasswordChangeRequest } from '@Api/auth/requests/password-change.dto'
import { Cookies } from '@/common/enums'
import { Req, Res } from '@nestjs/common/decorators'
import { Response } from 'express'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminCredentialsAuthGuard } from '@Common/auth/guards/credentials/admin-credentials-auth.guard'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { AuthType } from '@Common/enums/auth-type.enum'
import { EmailUpdateRequest } from '@Api/auth/requests/email-update.dto'
import { InternalServerErrorException } from '@nestjs/common/exceptions'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly tokenService: TokenService) {}

  /* >===== REGISTER =====> */
  /**
   * Registers a new user.
   * @remarks POST Method
   *
   * @param {RegisterRequest} request The sent request with needed and validated information
   * @returns a success message
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Compte créé avec succès. Un email de validation a été envoyé à l'adresse mail spécifiée",
    type: MessageResponse,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cette adresse email est déjà associée à un compte' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur inconnue est survenue, veuillez contacter le service client',
  })
  @Post('register')
  @HttpCode(201)
  async register(@Body() request: RegisterRequest): Promise<MessageResponse> {
    await this.authService.register(request)
    return new MessageResponse(HttpStatus.CREATED, "Compte créé avec succès. Un email de validation a été envoyé à l'adresse mail spécifiée")
  }

  /**
   * Resend the confirmation email for a user.
   * For security purposes, no error message is sent if the email is not found or if the user is already confirmed.
   *
   * @param email The email of the user to resend the confirmation email to
   * @returns a success message
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Mail envoyé de nouveau. Pas de Message d'erreur par sécurité.", type: MessageResponse })
  @Get('resend-confirmation/:EMAIL')
  async resendConfirmationEmail(@Param('EMAIL') email: string): Promise<MessageResponse> {
    await this.authService.resendConfirmationEmail(email)
    return new MessageResponse(HttpStatus.CREATED, 'Si cette adresse email est associée à un compte, un mail de vérification lui a été envoyé')
  }

  /* >===== LOGIN =====> */
  /**
   * Logins a user and return him his tokens.
   *
   * The use of an AuthGuard between the actual reception of the request and the execution of this endpoint hides away the true expected and required request parameters.
   * @remarks Sent request must respect the shape: `{ email: string, password: string }`
   * @remarks POST Method
   *
   * @param request The resolved user thanks to the guard with the request
   * @param response The responses to set the refreshToken in cookie
   * @returns the user's profile and his 2 tokens
   */
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Vous devez confirmer votre email avant de pouvoir vous connecter',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Connexion réussie.', type: LoginResponse })
  @AuthApiDecorators(AuthType.CREDENTIALS)
  @Post('login')
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST], enableImplicitConversion: true })
  @UseGuards(CredentialsAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Req() request: RequestWithLoggedUser, @Res({ passthrough: true }) response: Response): Promise<LoginResponse> {
    // generate login responses
    const loginData = await this.authService.login(request.user)
    // set refreshToken in cookie
    response.cookie(Cookies.REFRESH_TOKEN, loginData.refreshToken, { expires: new Date(2147483647 * 1000), httpOnly: true, secure: true })

    return loginData
  }

  /* >===== LOGIN ADMIN =====> */
  /**
   * Logs in a user and return him his tokens.
   *
   * The use of an AuthGuard between the actual reception of the request and the execution of this endpoint hides away the true expected and required request parameters.
   * @remarks Sent request must respect the shape: `{ email: string, password: string }`
   * @remarks POST Method
   *
   * @param {RequestWithLoggedUser} request The resolved user thanks to the guard with the request
   * @param {Response} response The responses to set the refreshToken in cookie
   * @returns the user's profile and his 2 tokens
   */
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Vous devez confirmer votre email avant de pouvoir vous connecter',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Vous devez être un administrateur' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Connexion réussie.', type: LoginResponse })
  @AuthApiDecorators(AuthType.CREDENTIALS)
  @Post('admin/login')
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST], enableImplicitConversion: true })
  @UseGuards(AdminCredentialsAuthGuard)
  @HttpCode(HttpStatus.OK)
  async loginAdmin(@Req() request: RequestWithLoggedUser, @Res({ passthrough: true }) response: Response): Promise<LoginResponse> {
    // generate login responses
    const loginData = await this.authService.login(request.user)
    // set refreshToken in cookie
    response.cookie(Cookies.REFRESH_TOKEN, loginData.refreshToken, { expires: new Date(2147483647 * 1000), httpOnly: true, secure: true })

    return loginData
  }

  /* >===== REFRESH ACCESS TOKEN =====> */
  /**
   * @deprecated
   * Expects a valid refresh token and in return creates and return a new access token.
   * @remarks PATCH Method
   *
   * @param {RefreshRequest} requestBody The sent request with needed and validated information
   * @returns a new access token
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Token rafraîchi avec succès.', type: RefreshResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Le token envoyé ne réfère à aucun utilisateur' })
  @ApiBody({ type: RefreshRequest, required: true })
  @Patch('refresh')
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST], enableImplicitConversion: true })
  async refreshAccessToken(@Body() requestBody: RefreshRequest): Promise<RefreshResponse> {
    return await this.authService.refreshAccessToken(requestBody.refreshToken)
  }

  /* >===== LOGOUT =====> */
  /**
   * Logs the user out and so invalidates his refresh token.
   * @remarks PATCH Method
   *
   * @param {RequestWithLoggedUser} request The logged user with the request
   * @returns a success message
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Vous êtes déconnecté', type: MessageResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('logout')
  @UseGuards(JwtAuthGuard)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST], enableImplicitConversion: true })
  async logout(@Req() request: RequestWithLoggedUser): Promise<MessageResponse> {
    await this.authService.logout(request.user)
    return new MessageResponse(HttpStatus.OK, 'Vous êtes déconnecté')
  }

  /* >===== EMAIL VALIDATION =====> */
  /**
   * Validate an email according to the token payload.
   * @remarks GET Method
   *
   * @param {String} token The sent request with needed and validated information
   * @returns a success message
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Email validé', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Le token envoyé est invalide', type: MessageResponse })
  @Get('validate-email/:TOKEN')
  @SerializeOptions({
    groups: [UserGroups.LOGGED_REQUEST],
    enableImplicitConversion: true,
  })
  async validateEmail(@Param('TOKEN') token: string): Promise<MessageResponse> {
    const decodedToken: TTokenPayload = await this.tokenService.decodeToken(token)
    await this.authService.confirmEmail(decodedToken.email)
    return new MessageResponse(HttpStatus.OK, 'Email validé')
  }

  /* >==== PASSWORD CHANGING */
  /**
   * Send an email for password recovery.
   * The returned message will be a success message regardless of the email.
   * The goal is to give a minimum of information on the information present in the database in the eyes of a malicious person.
   * @remarks GET Method
   *
   * @param {String} email The email of an user
   * @returns a success message
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Si l'email correspond à un utilisateur, un mail lui a été envoyé avec les détails de la récupération du mot de passe.",
    type: MessageResponse,
  })
  @Get('password-recovery/:EMAIL')
  async passwordRecoveryEmail(@Param('EMAIL') email: string): Promise<MessageResponse> {
    await this.authService.sendPasswordRecoveryEmail(email)
    return new MessageResponse(
      HttpStatus.OK,
      "Si l'email correspond à un utilisateur, un mail lui a été envoyé avec les détails de la récupération du mot de passe."
    )
  }

  /**
   * Change the password thanks to the given token.
   *
   * For the same reasons as sending mail for password recovery,
   * if the email is not recognized or the account does not have a password recovery token,
   * then the error message will be the same.
   * @remarks PATCH Method
   *
   * @param {PasswordChangeRequest} request The sent request with needed and validated information
   * @param {String} token The token associated to an user
   * @returns a success message
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mot de passe modifié avec succès', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Le token envoyé est invalide' })
  @Patch('password-recovery/:TOKEN')
  async passwordRecovery(@Body() request: PasswordRecoveryRequest, @Param('TOKEN') token: string): Promise<MessageResponse> {
    await this.authService.recoverPassword(token, request.newPassword, request.confirmation)
    return new MessageResponse(HttpStatus.OK, 'Mot de passe modifié avec succès')
  }

  /**
   * Change the password for a logged user.
   * @remarks PATCH Method
   *
   * @param {RequestWithLoggedUser} loggedUser The logged user
   * @param {PasswordChangeRequest} request The sent request with needed and validated information
   * @returns a success message
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mot de passe modifié avec succès', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Les mots de passe ne correspondent pas' })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() { user: loggedUser }: RequestWithLoggedUser, @Body() request: PasswordChangeRequest): Promise<MessageResponse> {
    await this.authService.userChangePassword(loggedUser, request.currentPassword, request.newPassword, request.confirmation)
    return new MessageResponse(HttpStatus.OK, 'Mot de passe modifié avec succès')
  }
  /* <==== PASSWORD CHANGING */

  /* >==== EMAIL CHANGING */
  /**
   * Send emails for email recovery.
   * It will send an information email to the old email and a validation email to the new email.
   * @remarks PATCH Method
   *
   * @param loggedUser The logged user
   * @param request The sent request with needed and validated information
   * @returns a success message
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Un mail de validation a été envoyé à la nouvelle adresse email', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cette adresse email est déjà associée à un compte' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "L'email renseigné n'est pas valide, ce n'est pas celui de l'utilisateur" })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Erreur inconnue, souvent liée au repository' })
  @Patch('update-email')
  @UseGuards(JwtAuthGuard)
  async sendEmailsForUpdatingEmail(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Body() request: EmailUpdateRequest
  ): Promise<MessageResponse> {
    if (loggedUser.email !== request.currentEmail) throw new BadRequestException("L'email actuel renseigné n'est pas valide")

    await this.authService.sendEmailsForUpdatingEmail(loggedUser.email, request.newEmail, request.password)
    return new MessageResponse(HttpStatus.OK, 'Un mail de validation a été envoyé à la nouvelle adresse email')
  }

  /**
   * Change the email thanks to the given token.
   * @remarks PATCH Method
   *
   * @param {String} token The token associated to an user
   * @returns a success message
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Email changé', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Token invalide. Verifier la forme du token et son payload.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Le token renseigné ne correspond pas à celui présent en base de donnée' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Erreur inconnue, souvent liée au repository' })
  // TODO: When changing email address, need to update stripe account
  @Patch('update-email/:TOKEN')
  async changeEmail(@Param('TOKEN') token: string): Promise<MessageResponse> {
    if (await this.authService.changeEmailWithToken(token)) return new MessageResponse(HttpStatus.OK, 'Email modifié avec succès')
    else throw new InternalServerErrorException('Une erreur inconnue est survenue, veuillez contacter le service client')
  }
  /* <==== EMAIL CHANGING */
}
