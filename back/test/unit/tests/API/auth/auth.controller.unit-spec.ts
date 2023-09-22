import { AuthController } from '@Api/auth/auth.controller'
import { TokenService } from '@Common/services/token.service'
import { instance, mock, when } from 'ts-mockito'
import { AuthService } from '@Api/auth/auth.service'
import { PasswordRecoveryRequest, RegisterRequest } from '@Api/auth/requests'
import { User } from '@Schemas/user'
import { LoginResponse } from '@/API/auth/responses/login.dto'
import { RefreshResponse } from '@/API/auth/responses/refresh.dto'
import { RefreshRequest } from '@Api/auth/requests/refresh.dto'
import { PasswordChangeRequest } from '@Api/auth/requests/password-change.dto'
import { UnprocessableEntityException } from '@nestjs/common'
import { MessageResponse } from '@/common/request-io/responses-dto'
import { Response } from 'express'
import fn = jest.fn
import { EmailUpdateRequest } from '@Api/auth/requests/email-update.dto'

describe('Controller - AuthController', () => {
  let authController: AuthController

  beforeAll(() => {
    const mockedAuthServiceClass = mock(AuthService)
    when(mockedAuthServiceClass.login).thenReturn((user) => Promise.resolve(new LoginResponse(user, '132456', '654321')))
    when(mockedAuthServiceClass.refreshAccessToken).thenReturn((refreshToken) => Promise.resolve(new RefreshResponse(refreshToken)))
    when(mockedAuthServiceClass.userChangePassword).thenReturn(async (loggedUser, currentPassword, newPassword, confirmation) => {
      if (currentPassword != '1234') throw new UnprocessableEntityException('Mot de passe invalide')
      if (newPassword != confirmation) throw new UnprocessableEntityException('Les mots de passe ne correspondent pas')
    })
    when(mockedAuthServiceClass.recoverPassword).thenReturn(async (loggedUser, newPassword, confirmation) => {
      if (newPassword != confirmation) throw new UnprocessableEntityException('Les mots de passe ne correspondent pas')
    })

    const mockedTokenServiceClass = mock(TokenService)
    when(mockedTokenServiceClass.isExpired).thenReturn((tokenPayload) => !!tokenPayload.exp && tokenPayload.exp < Math.round(Date.now() / 1000))
    when(mockedTokenServiceClass.decodeToken).thenReturn((token) => JSON.parse(token))
    when(mockedTokenServiceClass.createRefreshToken).thenReturn(async () => JSON.stringify({ random: Math.random() }))
    when(mockedTokenServiceClass.createAccessToken).thenReturn(async (user) =>
      JSON.stringify({
        userId: user._id.toString(),
        email: user.email,
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 300,
      })
    )

    authController = new AuthController(instance(mockedAuthServiceClass), instance(mockedTokenServiceClass))
  })

  it('should return a success message when registering an user (POST)', async () => {
    // Given
    const request: RegisterRequest = {
      email: 'john@doe.fr',
      lastName: 'Doe',
      name: 'John',
      password: '12345',
      phone: '0612345678',
      professionalData: undefined,
      accountToken: 'some-account-token',
    }

    // When
    const response = await authController.register(request)

    // Then
    expect(response).toBeTruthy()
    expect(response.message).toBeTruthy()
    expect(response.statusCode).toBe(201)
  })

  it('should return logged user data and tokens when logging an user (POST)', async () => {
    // Given
    const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
    const responseObj = { cookie: fn() } as unknown as Response

    // When
    const response = await authController.login(loggedUserWrapper, responseObj)

    // Then
    expect(response).toBeTruthy()
    expect(response.user).toBeTruthy()
    expect(response.accessToken).toBeTruthy()
    expect(response.refreshToken).toBeTruthy()
  })

  it('should return logged user data and tokens when logging an admin', async () => {
    // Given
    const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined) } as RequestWithLoggedUser
    loggedUserWrapper.user.setAdminStatus(true)
    const responseObj = { cookie: fn() } as unknown as Response

    // When
    const response = await authController.loginAdmin(loggedUserWrapper, responseObj)

    // Then
    expect(response).toBeTruthy()
    expect(response.user).toBeTruthy()
    expect(response.accessToken).toBeTruthy()
    expect(response.refreshToken).toBeTruthy()
  })

  it('should return a refreshed access token with valid refresh token (PATCH)', async () => {
    // Given
    const request: RefreshRequest = {
      refreshToken: 'q35s1df3q5s41f',
    }

    // When
    const response = await authController.refreshAccessToken(request)

    // Then
    expect(response).toBeTruthy()
    expect(response.accessToken).toBeTruthy()
  })

  it('should return a success message when logging out an user (PATCH)', async () => {
    // Given
    const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser

    // When
    const response = await authController.logout(loggedUserWrapper)

    // Then
    expect(response).toBeTruthy()
    expect(response.message).toBeTruthy()
    expect(response.statusCode).toBe(200)
  })

  it("should return a success message when validating user's email (GET)", async () => {
    // Given
    const userToken = JSON.stringify({
      userId: '60b1f71f2242a509d8a7f5c4',
      email: 'john@doe.fr',
      iat: Date.now() / 1000,
      exp: Date.now() / 1000 + 300,
    })

    // When
    const response = await authController.validateEmail(userToken)

    // Then
    expect(response).toBeTruthy()
    expect(response.message).toBeTruthy()
    expect(response.statusCode).toBe(200)
  })

  it('should return a success message when requesting recovery password email (GET)', async () => {
    // Given
    const userEmail = 'john@doe.fr'

    // When
    const response = await authController.passwordRecoveryEmail(userEmail)

    // Then
    expect(response).toBeTruthy()
    expect(response.message).toBeTruthy()
    expect(response.statusCode).toBe(200)
  })

  describe('When sending password recovery changing password request (PATCH)', () => {
    it('should send a success message with matching passwords', async () => {
      // Given
      const userEmail = 'john@doe.fr'
      const request: PasswordRecoveryRequest = { confirmation: '123456', newPassword: '123456' }

      // When
      const response = await authController.passwordRecovery(request, userEmail)

      // Then
      expect(response).toBeTruthy()
      expect(response.message).toBeTruthy()
      expect(response.statusCode).toBe(200)
    })

    it('should send a fail message with clashing passwords', async () => {
      // Given
      const userEmail = 'john@doe.fr'
      const request: PasswordRecoveryRequest = { confirmation: '123456', newPassword: '654321' }

      // When
      const recoverPassword = async (): Promise<MessageResponse> => await authController.passwordRecovery(request, userEmail)

      // Then
      await expect(recoverPassword()).rejects.toThrow(UnprocessableEntityException)
    })
  })

  describe('When sending password changing password request (PATCH)', () => {
    it('should send a fail message with wrong current password', async () => {
      // Given
      const userWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const request: PasswordChangeRequest = { currentPassword: '987654', confirmation: '123456', newPassword: '654321' }

      // When
      const changingPassword = async (): Promise<MessageResponse> => await authController.changePassword(userWrapper, request)

      // Then
      await expect(changingPassword()).rejects.toThrow(UnprocessableEntityException)
    })

    it('should send a success message with matching passwords', async () => {
      // Given
      const userWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const request: PasswordChangeRequest = { currentPassword: '1234', confirmation: '123456', newPassword: '123456' }

      // When
      const response = await authController.changePassword(userWrapper, request)

      // Then
      expect(response).toBeTruthy()
      expect(response.message).toBeTruthy()
      expect(response.statusCode).toBe(200)
    })

    it('should send a fail message with clashing passwords', async () => {
      // Given
      const userWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const request: PasswordChangeRequest = { currentPassword: '1234', confirmation: '123456', newPassword: '654321' }

      // When
      const changingPassword = async (): Promise<MessageResponse> => await authController.changePassword(userWrapper, request)

      // Then
      await expect(changingPassword()).rejects.toThrow(UnprocessableEntityException)
    })
  })

  describe('When sending mail change request', () => {
    it('should send a success message with matching emails', async () => {
      // Given
      const userWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser

      const request: EmailUpdateRequest = {
        password: 'random',
        newEmail: 'random',
        currentEmail: 'john@doe.fr',
      }

      // When
      const response = await authController.sendEmailsForUpdatingEmail(userWrapper, request)

      // Then
      expect(response).toBeTruthy()
      expect(response.message).toBeTruthy()
      expect(response.statusCode).toBe(200)
    })

    it('should send a fail message with clashing emails', async () => {
      // Given
      const userWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser

      const request: EmailUpdateRequest = {
        password: 'random',
        newEmail: 'random',
        currentEmail: 'azddfqsfqzfsqf@doe.fr',
      }

      // When
      const response = async (): Promise<MessageResponse> => await authController.sendEmailsForUpdatingEmail(userWrapper, request)

      // Then
      await expect(response).rejects.toThrow()
    })
  })
})
