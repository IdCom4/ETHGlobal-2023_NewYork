import { IRegisterProfessionalData, ProfessionalUser, User } from '@/schemas/user'
import { UserBuilder } from '@Schemas/user/user.builder'
import { Inject, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { BadRequestException, InternalServerErrorException } from '@nestjs/common/exceptions'
import * as argon from 'argon2'
import { SkillsService } from '@/API/skills/skills.service'
import { LoginResponse } from '@/API/auth/responses/login.dto'
import { PaymentsService } from '@/API/payments/payments.service'
import { RefreshResponse } from '@/API/auth/responses/refresh.dto'
import { IMailAPI } from '@Common/external-service-providers-api/mail/mail.api'
import { TokenType } from '@Common/enums/requests-io'
import { TokenService } from '@Common/services/token.service'
import { UserRepository } from '@/repositories/user.repository'
import { RegisterRequest } from './requests'

@Injectable()
export class AuthService {
  constructor(
    @Inject('MailAPI') private readonly mailAPI: IMailAPI,
    private readonly skillsService: SkillsService,
    private readonly tokenService: TokenService,
    private readonly paymentService: PaymentsService,
    private readonly userRepository: UserRepository
  ) {}

  /* >===== MAIN OPERATIONS ===== */

  /**
   * Register a new user from his basic information.
   *
   * @param {RegisterRequest} registerPayload  containing needed data for registration
   * @throws {BadRequestException} if no user if found
   * @throws {InternalServerErrorException} if data persistence fails
   */
  public async register(registerPayload: RegisterRequest): Promise<void> {
    // check that this email address is not already taken
    if (await this.userRepository.findBy({ _email: registerPayload.email }).getOrNull())
      throw new BadRequestException('Cette adresse email est déjà associée à un compte')

    // if professional data were provided, check their validity
    if (registerPayload.professionalData) {
      // check that all provided skillIds are valid
      const skills = await this.skillsService.getAll()

      for (const skillId of registerPayload.professionalData.skillIds) {
        if (!skills.find((skill) => skill._id.toString() === skillId))
          throw new BadRequestException('Vous avez indiqué des compétences non existantes')
      }
    }

    // hash password
    const hashedPassword = await argon.hash(registerPayload.password)

    // build the user
    const professionalData: IRegisterProfessionalData | undefined = registerPayload.professionalData
      ? {
          skillIds: registerPayload.professionalData.skillIds,
          workAddress: registerPayload.professionalData.workAddress.toStrictAddress(),
        }
      : undefined

    const user = new UserBuilder(registerPayload.name, registerPayload.lastName)
      .setPhone(registerPayload.phone)
      .setEmail(registerPayload.email.toLowerCase())
      .setProfessionalProfileIfProvided(professionalData)
      .setHashedPassword(hashedPassword)
      .build()

    const savedUser = await this.userRepository.create(user)
    if (!savedUser) throw new InternalServerErrorException('Une erreur inconnue est survenue, veuillez contacter le service client')
    await this.paymentService.createAndSaveAllUserCustomerIds(savedUser)

    // creates its email validation token and send the email
    const validationToken = await this.tokenService.createValidationMailToken(savedUser)
    await this.mailAPI.sendValidationMail(savedUser, validationToken)

    // set and save payment informations
    await this.paymentService.createAndSaveAllUserCustomerIds(user)
    if (user.isProfessional())
      await this.paymentService.updateOrCreateAndSavePaymentAccountByToken(user as ProfessionalUser, registerPayload.accountToken)
  }

  /**
   * Resend a confirmation email to a user.
   * This method won't throw any error if the user's email address is already validated or if no user is found.
   * This choice was made to avoid giving information about the existence of an account.
   *
   * @param email
   */
  async resendConfirmationEmail(email: string): Promise<void> {
    const user = await this.userRepository.findBy({ _email: email }).getOrNull()

    if (!user) return

    if (user.isEmailValidated) return

    const validationToken = await this.tokenService.createValidationMailToken(user)
    await this.mailAPI.sendValidationMail(user, validationToken)
  }

  /**
   * Logs in a user and returns needed data to use the routes requiring authentication.
   *
   * @param {User} user
   * @return {LoginResponse} containing needed data to use the routes requiring authentication
   * @throws {UnauthorizedException} if user's email address isn't validated
   */
  public async login(user: User): Promise<LoginResponse> {
    // check if user has confirmed his email address
    if (!user.isEmailValidated) throw new UnauthorizedException('Vous devez confirmer votre email avant de pouvoir vous connecter')

    // creates his tokens
    const accessToken = await this.tokenService.createAccessToken(user)
    const refreshToken = await this.tokenService.createRefreshToken()

    // saves them
    await this.updateTokenForUser(TokenType.REFRESH_TOKEN, user, refreshToken)

    return new LoginResponse(user, accessToken, refreshToken)
  }

  /**
   * Refresh access token using a refresh token associated to a user.
   *
   * @param {string} refreshToken
   * @return {RefreshResponse} containing refreshed access token
   * @throws {BadRequestException} if no user has the given refresh token
   */
  public async refreshAccessToken(refreshToken: string): Promise<RefreshResponse> {
    const user: User = await this.userRepository
      .findBy({ _currentHashedRefreshToken: refreshToken })
      .getOrThrow(new BadRequestException('Le token envoyé ne réfère à aucun utilisateur'))

    return new RefreshResponse(await this.tokenService.createAccessToken(user))
  }

  /**
   * Logs out a user but denying user's refresh token.
   *
   * @param {User} user
   * @return {RefreshResponse} containing refreshed access token
   */
  public async logout(user: User): Promise<void> {
    user.setCurrentHashedRefreshToken(null)
    await this.userRepository.updateAsIs(user)
  }

  /* >==== Email Validation */
  /**
   * Confirm a user from his email.
   *
   * @param {String} email associated to an existing user
   * @throws {BadRequestException}  if no user has the given refresh token
   * or if the user's email address is already validated
   */
  public async confirmEmail(email: string): Promise<void> {
    const user = await this.userRepository
      .findBy({ _email: email })
      .getOrThrow(new BadRequestException('Le token envoyé ne réfère à aucun utilisateur'))

    if (user.isEmailValidated) throw new BadRequestException("L'adresse email a déjà été validée")

    user.validateEmail()

    await this.userRepository.updateAsIs(user)
  }

  /* <==== Email Validation */

  /* >==== PASSWORD CHANGING */
  /**
   * Email an email address if this one is recognized for a user with a token to change his password.
   *
   * @param {String} email associated to an existing user
   */
  public async sendPasswordRecoveryEmail(email: string): Promise<void> {
    const user = await this.userRepository.findBy({ _email: email }).getOrNull()
    if (!user) return

    const passwordRecoveryToken = await this.tokenService.createPasswordRecoveryToken(user)
    await this.mailAPI.sendPasswordRecoveryEmail(user, passwordRecoveryToken)
    await this.updateTokenForUser(TokenType.PASSWORD_RECOVERY, user, passwordRecoveryToken)
  }

  /**
   * Change user's password from a password recovery token.
   *
   * @param {String} token User's password recovery token
   * @param {String} newPassword User's password recovery token
   * @param {String} confirmation Password confirmation
   * @throws {BadRequestException} if token's payload contains the email of no user
   * or if the user doesn't have a password recover token stocked
   */
  public async recoverPassword(token: string, newPassword: string, confirmation: string): Promise<void> {
    const tokenPayload = await this.tokenService.decodeToken(token)

    const user = await this.userRepository.findBy({ _email: tokenPayload.email }).getOrThrow(new BadRequestException('Sent token is invalid'))

    if (user.passwordRecoverToken != token) throw new BadRequestException('Sent token is invalid')

    await this.changePasswordField(user, newPassword, confirmation)
  }

  /**
   * Change user's password.
   *
   * @param {User} loggedUser User
   * @param {String} currentPassword
   * @param {String} newPassword User's password recovery token
   * @param {String} confirmation Password confirmation
   * @throws {UnprocessableEntityException} if passwords clash
   */
  async userChangePassword(loggedUser: User, currentPassword: string, newPassword: string, confirmation: string): Promise<void> {
    // find user by email
    const user: User = await this.userRepository
      .findWithHashedPasswordByEmail(loggedUser.email)
      .getOrThrow("Une erreur inconnue est survenue lors de la récupération des données de l'utilisateur")

    // check if there is a user and their passwords match
    if (!user.hashedPassword || !(await argon.verify(user.hashedPassword, currentPassword))) throw new UnauthorizedException('Mot de passe invalide')

    await this.changePasswordField(loggedUser, newPassword, confirmation)
  }

  /**
   * Send emails to update user's email address.
   * The first email is sent to the current email address to inform the user of the change.
   * The second email is sent to the new email address to confirm the change.
   *
   * @param currentEmail Current email address
   * @param newEmail New email address
   * @param givenPassword User's password
   * @throws {BadRequestException} if the new email address is already associated to a user
   * @throws {UnauthorizedException} if the given password doesn't match the user's one
   * @throws {UnprocessableEntityException} if passwords clash
   * @throws {InternalServerErrorException} if a problem occurs in the repository
   */
  async sendEmailsForUpdatingEmail(currentEmail: string, newEmail: string, givenPassword: string): Promise<void> {
    if (await this.userRepository.findBy({ _email: newEmail }).getOrNull())
      throw new BadRequestException('Cette adresse email est déjà associée à un compte')

    // find user by email
    const user: User = await this.userRepository
      .findWithHashedPasswordByEmail(currentEmail)
      .getOrThrow(new InternalServerErrorException("Une erreur inconnue est survenue lors de la récupération des données de l'utilisateur"))

    // check if there is a user and its password matches
    if (!user.hashedPassword || !(await argon.verify(user.hashedPassword, givenPassword))) throw new UnauthorizedException('Mot de passe invalide')

    const emailChangeToken = await this.tokenService.createEmailChangeToken(user._id.toString(), newEmail)
    await this.updateTokenForUser(TokenType.EMAIL_CHANGE, user, emailChangeToken)
    await this.mailAPI.sendEmailChangeEmails(user, newEmail, emailChangeToken)
  }

  /**
   * Change user's email address from a token.
   *
   * @param token User's email change token
   * @throws {BadRequestException} if token's shape or payload is invalid
   * @throws {BadRequestException} if the token doesn't exist in the database for the specified user
   *
   */
  async changeEmailWithToken(token: TToken): Promise<boolean> {
    const tokenPayload = await this.tokenService.decodeToken(token)

    const user = await this.userRepository
      .findBy({ _id: tokenPayload.userId, _emailChangeToken: token })
      .getOrThrow(new BadRequestException('Sent token is invalid'))

    user.email = tokenPayload.email
    user.setEmailChangeToken(null)
    return await this.userRepository.updateAsIs(user)
  }

  /* <==== PASSWORD CHANGING */

  /* <===== MAIN OPERATIONS ===== */
  /**
   * Used to update a token for a user.
   *
   * @param {TokenType} type
   * @param {User} user to change a token
   * @param {TToken} newToken new token for update
   * @throws {InternalServerErrorException} if a given type isn't handled
   */
  private async updateTokenForUser(type: TokenType, user: User, newToken: TToken): Promise<void> {
    switch (type) {
      case TokenType.REFRESH_TOKEN:
        user.setCurrentHashedRefreshToken(newToken)
        break
      case TokenType.PASSWORD_RECOVERY:
        user.setPasswordRecoverToken(newToken)
        break
      case TokenType.EMAIL_CHANGE:
        user.setEmailChangeToken(newToken)
        break
      default:
        throw new InternalServerErrorException(`TokenType ${type} isn't handled.`)
    }

    await this.userRepository.updateAsIs(user)
  }

  /**
   * Change user's password.
   *
   * @param {User} loggedUser User
   * @param {String} newPassword User's new password
   * @param {String} confirmation Password confirmation
   * @throws {UnprocessableEntityException} if passwords clash
   */
  private async changePasswordField(loggedUser: User, newPassword: string, confirmation: string): Promise<void> {
    if (newPassword !== confirmation) throw new UnprocessableEntityException('Les mots de passe ne correspondent pas')

    loggedUser.setHashedPassword(await argon.hash(newPassword))
    loggedUser.setPasswordRecoverToken(null)

    await this.userRepository.updateAsIs(loggedUser)
  }
}
