import { AuthService } from '@Api/auth/auth.service'
import { instance, mock, when } from 'ts-mockito'
import { IMailAPI } from '@Common/external-service-providers-api'
import { TokenService } from '@Common/services/token.service'
import { UserRepository } from '@/repositories'
import { PasswordRecoveryRequest, RegisterRequest } from '@Api/auth/requests'
import { User } from '@Schemas/user'
import { BadRequestException } from '@nestjs/common/exceptions'
import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { PasswordChangeRequest } from '@Api/auth/requests'
import { LoginResponse, RefreshResponse } from '@/API/auth/responses'
import { PaymentsService } from '@/API/payments/payments.service'
import { SkillsService } from '@Api/skills/skills.service'
import { Skill } from '@/schemas/skill/skill.schema'
import { SkillCategory } from '@Common/enums/schemas/skill.schema.enum'
import * as mongoose from 'mongoose'
import { StrictAddress } from '@/schemas/common/pojos'
import { InstantiatingDataWrapper } from '@Common/classes'
import { SkillBlueprint } from '@/schemas/skill/skill.blueprint'

describe('Service - AuthService', () => {
  let authService: AuthService

  beforeAll(() => {
    const professionalData = {
      skillIds: ['some-skill-id'],
      workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
    }

    const mockedMailAPIClass = mock<IMailAPI>()
    const mockedSkillsService = mock(SkillsService)
    const mockedTokenServiceClass = mock(TokenService)
    const mockedPaymentServiceClass = mock(PaymentsService)
    const mockedUserRepository = mock(UserRepository)

    when(mockedTokenServiceClass.createRefreshToken).thenReturn(async () => JSON.stringify({ random: Math.random() }))
    when(mockedTokenServiceClass.createAccessToken).thenReturn(async (user) =>
      JSON.stringify({
        userId: user._id.toString(),
        email: user.email,
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 300,
      })
    )
    when(mockedTokenServiceClass.decodeToken).thenReturn((token) => JSON.parse(token))
    when(mockedTokenServiceClass.createValidationMailToken).thenReturn(async (user) =>
      JSON.stringify({
        userId: user._id.toString(),
        email: user.email,
      })
    )

    when(mockedUserRepository.findBy).thenReturn((query) => {
      if (
        query._id === 'existingId' &&
        query._emailChangeToken === JSON.stringify({ email: 'john.new@doe.com', userId: 'existingId', iat: 1516239022 })
      )
        return InstantiatingDataWrapper.fromData(
          Promise.resolve(
            User.of(
              'john',
              'doe',
              '0612345678',
              'john@doe.com',
              '$argon2i$v=19$m=16,t=2,p=1$elNtaTlsT1lxWWhsRkdHdg$D3KTQJyfMliqPE6bryq2jQ', // "12345"
              professionalData
            )
          )
        )

      if (query._email === 'john.exists@doe.com')
        return InstantiatingDataWrapper.fromData(Promise.resolve(User.of('john', 'doe', '0612345678', 'john@doe.com', '12345', professionalData)))
      if (query._email === 'john.exists.validated@doe.com') {
        const user = User.of('john', 'doe', '0612345678', 'john.exists.validated@doe.com', '12345', professionalData)
        user.validateEmail()
        user.setPasswordRecoverToken(JSON.stringify({ email: 'john.exists.validated@doe.com' }))

        return InstantiatingDataWrapper.fromData(Promise.resolve(user))
      }

      if (query._currentHashedRefreshToken === '54321')
        return InstantiatingDataWrapper.fromData(Promise.resolve(User.of('john', 'doe', '0612345678', 'john@doe.com', '12345', professionalData)))

      return InstantiatingDataWrapper.fromData<Promise<User>, User>(Promise.resolve(null) as unknown as Promise<User>)
    })
    when(mockedUserRepository.create).thenReturn(async (instance) => instance)
    when(mockedUserRepository.updateAsIs).thenReturn(() => Promise.resolve(true))
    when(mockedUserRepository.findWithHashedPasswordByEmail).thenReturn((email) => {
      if (email === 'john.exists.validated@doe.com') {
        const user = User.of(
          'john',
          'doe',
          '0612345678',
          'john.exists.validated@doe.com',
          '$argon2i$v=19$m=16,t=2,p=1$elNtaTlsT1lxWWhsRkdHdg$D3KTQJyfMliqPE6bryq2jQ', // "12345"
          professionalData
        )
        user.validateEmail()
        user.setPasswordRecoverToken(JSON.stringify({ email: 'john.exists.validated@doe.com' }))

        return InstantiatingDataWrapper.fromData(Promise.resolve(user))
      }

      return InstantiatingDataWrapper.fromData<Promise<User>, User>(Promise.resolve(null) as unknown as Promise<User>)
    })
    when(mockedSkillsService.getAll).thenReturn(async () => [
      Object.initClassByReflection<Skill, SkillBlueprint>(Skill, {
        _id: new mongoose.Types.ObjectId('5f9d4a3d9d3e2f1f1c9d4401'),
        label: 'string',
        categories: [SkillCategory.MECHANICAL],
      }),
    ])

    authService = new AuthService(
      instance(mockedMailAPIClass),
      instance(mockedSkillsService),
      instance(mockedTokenServiceClass),
      instance(mockedPaymentServiceClass),
      instance(mockedUserRepository)
    )
  })

  describe('When registering user', () => {
    it('should success with a not registered user', async () => {
      // Given
      const request: RegisterRequest = {
        email: 'john@doe.com',
        name: 'John',
        lastName: 'Doe',
        password: '12345',
        phone: '0612345678',
        accountToken: 'some-account-token',
      }

      // When
      const registeringUser = async (): Promise<void> => await authService.register(request)

      // Then
      await expect(registeringUser()).resolves.not.toThrow()
    })

    it('should fail with a registered user', async () => {
      // Given
      const request: RegisterRequest = {
        email: 'john.exists@doe.com',
        name: 'John',
        lastName: 'Doe',
        password: '12345',
        phone: '0612345678',
        accountToken: 'some-account-token',
      }

      // When
      const registeringUser = async (): Promise<void> => await authService.register(request)

      // Then
      await expect(registeringUser()).rejects.toThrow(BadRequestException)
    })
  })

  describe('When logging user', () => {
    it('should success with a validated user', async () => {
      // Given
      const loggedUser = User.of('John', 'Doe', '0612345678', 'john@doe.com', '12345', {
        skillIds: ['some-skill-id'],
        workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
      })
      loggedUser.validateEmail()

      // When
      const response = await authService.login(loggedUser)

      // Then
      expect(response).toBeTruthy()
      expect(response.user).toBeTruthy()
      expect(response.accessToken).toBeTruthy()
      expect(response.refreshToken).toBeTruthy()
    })

    it('should throw an exception with a not validated user', async () => {
      // Given
      const loggedUser = User.of('John', 'Doe', '0612345678', 'john@doe.com', '12345', {
        skillIds: ['some-skill-id'],
        workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
      })

      // When
      const loggingUser = async (): Promise<LoginResponse> => await authService.login(loggedUser)

      // Then
      await expect(loggingUser).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('When refreshing access token', () => {
    it('should return the refreshed access token with a found refresh token', async () => {
      // Given
      const refreshToken = '54321'

      // When
      const response = await authService.refreshAccessToken(refreshToken)

      // Then
      expect(response.accessToken).toBeTruthy()
    })

    it('should throw an exception with a not found refresh token', async () => {
      // Given
      const refreshToken = '999999'

      // When
      const refreshingAccessToken = async (): Promise<RefreshResponse> => await authService.refreshAccessToken(refreshToken)

      // Then
      await expect(refreshingAccessToken).rejects.toThrow(BadRequestException)
    })
  })

  it('should success when logging out a user', async () => {
    // Given
    const loggedUser = User.of('John', 'Doe', '0612345678', 'john@doe.com', '12345', {
      skillIds: ['some-skill-id'],
      workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
    })
    loggedUser.setCurrentHashedRefreshToken('123154454')

    // When
    const logoutUser = async (): Promise<void> => await authService.logout(loggedUser)

    // Then
    await expect(logoutUser()).resolves.not.toThrow()
  })

  describe('When confirming an email of a user', () => {
    it('should success with a not validated user', async () => {
      // Given
      const email = 'john.exists@doe.com'

      // When
      const validateUserEmail = async (): Promise<void> => await authService.confirmEmail(email)

      // Then
      await expect(validateUserEmail()).resolves.not.toThrow()
    })

    it('should throw error with an already validated user', async () => {
      // Given
      const email = 'john.exists.validated@doe.com'

      // When
      const validateUserEmail = async (): Promise<void> => await authService.confirmEmail(email)

      // Then
      await expect(validateUserEmail()).rejects.toThrow(BadRequestException)
    })
  })

  describe('When requesting password recovery email', () => {
    /*
     If we want to send a password recovery email,
     we do not return any specific responses regardless of the calculations performed.
     This prevents a malicious person from recovering the email addresses registered on the site.
     */

    it('should success with a valid user', async () => {
      // Given
      const email = 'john.exists@doe.com'

      // When
      const sendPasswordRecoveryMail = async (): Promise<void> => await authService.sendPasswordRecoveryEmail(email)

      // Then
      await expect(sendPasswordRecoveryMail()).resolves.not.toThrow()
    })

    it('should success with an unknown user', async () => {
      // Given
      const email = 'john@doe.com'

      // When
      const sendPasswordRecoveryMail = async (): Promise<void> => await authService.sendPasswordRecoveryEmail(email)

      // Then
      await expect(sendPasswordRecoveryMail()).resolves.not.toThrow()
    })
  })

  describe('When receiving a password recovery changing password', () => {
    describe('With a valid token', () => {
      it('should success with matching passwords', async () => {
        // Given
        const token = JSON.stringify({ email: 'john.exists.validated@doe.com' })
        const request: PasswordRecoveryRequest = { confirmation: 'newPass', newPassword: 'newPass' }

        // When
        const recoverPassword = async (): Promise<void> => await authService.recoverPassword(token, request.newPassword, request.confirmation)

        // Then
        await expect(recoverPassword()).resolves.not.toThrow()
      })

      it('should fail with clashing passwords', async () => {
        // Given
        const token = JSON.stringify({ email: 'john.exists.validated@doe.com' })
        const request: PasswordRecoveryRequest = { confirmation: 'anotherPass', newPassword: 'newPass' }

        // When
        const recoverPassword = async (): Promise<void> => await authService.recoverPassword(token, request.newPassword, request.confirmation)

        // Then
        await expect(recoverPassword()).rejects.toThrow()
      })
    })

    it('should fail with an unknown user', async () => {
      // Given
      const token = JSON.stringify({ email: 'john.exists@doe.com' })
      const request: PasswordRecoveryRequest = { confirmation: 'newPass', newPassword: 'newPass' }

      // When
      const recoverPassword = async (): Promise<void> => await authService.recoverPassword(token, request.newPassword, request.confirmation)

      // Then
      await expect(recoverPassword()).rejects.toThrow(BadRequestException)
    })
  })

  describe('When receiving a change password request', () => {
    it('should fail with clashing passwords', async () => {
      // Given
      const loggedUser = User.of('John', 'Doe', '0612345678', 'john.exists.validated@doe.com', '12345')
      const request: PasswordChangeRequest = { currentPassword: '111', confirmation: '123456', newPassword: '654321' }

      // When
      const changingPassword = async (): Promise<void> =>
        await authService.userChangePassword(loggedUser, request.currentPassword, request.newPassword, request.confirmation)

      // Then
      await expect(changingPassword()).rejects.toThrow(UnauthorizedException)
    })

    it('should success with matching passwords', async () => {
      // Given
      const loggedUser = User.of('John', 'Doe', '0612345678', 'john.exists.validated@doe.com', '12345')
      const request: PasswordChangeRequest = { currentPassword: '12345', confirmation: '123456', newPassword: '123456' }

      // When
      const changingPassword = async (): Promise<void> =>
        await authService.userChangePassword(loggedUser, request.currentPassword, request.newPassword, request.confirmation)

      // Then
      await expect(changingPassword()).resolves.not.toThrow()
    })

    it('should fail with clashing passwords', async () => {
      // Given
      const loggedUser = User.of('John', 'Doe', '0612345678', 'john.exists.validated@doe.com', '12345')
      const request: PasswordChangeRequest = { currentPassword: '12345', confirmation: '123456', newPassword: '654321' }

      // When
      const changingPassword = async (): Promise<void> =>
        await authService.userChangePassword(loggedUser, request.currentPassword, request.newPassword, request.confirmation)

      // Then
      await expect(changingPassword()).rejects.toThrow(UnprocessableEntityException)
    })
  })

  describe('When sending emails for email change', () => {
    it('should success with a valid user', async () => {
      // Given
      const currentEmail = 'john.exists.validated@doe.com'
      const newEmail = 'otherEmail'
      const givenPassword = '12345'

      // When
      const sendEmailChangeMail = async (): Promise<void> => await authService.sendEmailsForUpdatingEmail(currentEmail, newEmail, givenPassword)
      await sendEmailChangeMail()
      await expect(sendEmailChangeMail()).resolves.not.toThrow()
    })

    it('should fail with clashing password', async () => {
      // Given
      const currentEmail = 'john.exists.validated@doe.com'
      const newEmail = 'otherEmail'
      const givenPassword = '54321'

      // When
      const sendEmailChangeMail = async (): Promise<void> => await authService.sendEmailsForUpdatingEmail(currentEmail, newEmail, givenPassword)
      await expect(sendEmailChangeMail()).rejects.toThrow()
    })

    it('should fail with already known email', async () => {
      // Given
      const currentEmail = 'john.exists.validated@doe.com'
      const newEmail = 'john.exists@doe.com'
      const givenPassword = '12345'

      // When
      const sendEmailChangeMail = async (): Promise<void> => await authService.sendEmailsForUpdatingEmail(currentEmail, newEmail, givenPassword)
      await expect(sendEmailChangeMail()).rejects.toThrow()
    })
  })

  describe('When changing email based on a token', () => {
    it('should success with a valid token', async () => {
      // Given
      const token = JSON.stringify({ email: 'john.new@doe.com', userId: 'existingId', iat: 1516239022 })

      // When
      const result = await authService.changeEmailWithToken(token)

      // Then
      expect(result).toBe(true)
    })

    it('should fail with an invalid userId', async () => {
      // Given
      const token = JSON.stringify({ email: 'john.new@doe.com', userId: 'ligbhsdfgb', iat: 1516239022 })

      // When
      const changingEmail = async (): Promise<boolean> => await authService.changeEmailWithToken(token)

      // Then
      await expect(changingEmail).rejects.toThrow()
    })

    it('should fail with an invalid email', async () => {
      // Given
      const token = JSON.stringify({ email: 'john.sdsdsdsd@doe.com', userId: 'existingId', iat: 1516239022 })

      // When
      const changingEmail = async (): Promise<boolean> => await authService.changeEmailWithToken(token)

      // Then
      await expect(changingEmail).rejects.toThrow()
    })
  })
})
