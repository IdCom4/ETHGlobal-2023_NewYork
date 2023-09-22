import { ExtractJwt } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { instance, mock, when } from 'ts-mockito'
import { JwtValidator } from '@Common/auth/strategies/jwt/jwt.validator'
import { User } from '@Schemas/user'
import { Cookies } from '@Common/enums'
import { Request } from 'express'
import { UnauthorizedException } from '@nestjs/common'
import { AdminJwtStrategy } from '@Common/auth/strategies'

describe('Strategy - AdminJwtStrategy', () => {
  let adminJwtStrategy: AdminJwtStrategy

  beforeAll(() => {
    jest.spyOn(ExtractJwt, 'fromAuthHeaderAsBearerToken').mockReturnValue(() => '')

    const mockedConfigService: ConfigService = mock(ConfigService)
    when(mockedConfigService.get).thenReturn((propertyPath) => {
      switch (propertyPath) {
        case 'JWT_SECRET':
          return 'Q52SSD4F6Q5S4FQS6F4'
      }
    })

    const mockedJwtValidator = mock(JwtValidator)
    when(mockedJwtValidator.validateUser).thenReturn((request, accessTokenPayload) => {
      if (!!accessTokenPayload.exp && accessTokenPayload.exp < Math.round(Date.now() / 1000))
        throw new UnauthorizedException('Veuillez vous reconnecter')
      if (accessTokenPayload.userId === '60b1f71f2242a509d8a7f5c4')
        return Promise.resolve(User.of('Doe', 'John', '0612345678', accessTokenPayload.email, 'hashedPassword', undefined))
      if (accessTokenPayload.userId === '9999f71f2242a509d8a79999') {
        const user = User.of('Doe', 'John', '0612345678', accessTokenPayload.email, 'hashedPassword', undefined)
        user.setAdminStatus(true)
        return Promise.resolve(user)
      }

      throw new UnauthorizedException('Veuillez vous reconnecter')
    })

    adminJwtStrategy = new AdminJwtStrategy(instance(mockedJwtValidator), instance(mockedConfigService))
  })

  describe('When validating user', () => {
    it('should success with valid informations', async () => {
      // Given
      const request = {
        cookies: { [Cookies.REFRESH_TOKEN]: '1234' },
      } as unknown as Request & { res: { headers: object } }
      const tokenPayload: TTokenPayload = {
        userId: '9999f71f2242a509d8a79999',
        email: 'john@doe.fr',
        iat: Date.now() / 1000 - 5000,
        exp: Date.now() / 1000 + 100,
      }

      // When
      const validatedUser = await adminJwtStrategy.validate(request, tokenPayload)

      // Then
      expect(validatedUser).toBeTruthy()
    })

    it('should success with expired access token and valid user', async () => {
      // Given
      const request = {
        cookies: { [Cookies.REFRESH_TOKEN]: '1234' },
      } as unknown as Request & { res: { headers: object } }
      const tokenPayload: TTokenPayload = {
        userId: '9999f71f2242a509d8a79999',
        email: 'john@doe.fr',
        iat: Date.now() / 1000 - 5000,
        exp: Date.now() / 1000 + 100,
      }

      // When
      const validatedUser = await adminJwtStrategy.validate(request, tokenPayload)

      // Then
      expect(validatedUser).toBeTruthy()
    })

    it('should fail with a not admin user', async () => {
      // Given
      const request = {
        cookies: { [Cookies.REFRESH_TOKEN]: '1234' },
      } as unknown as Request & { res: { headers: object } }
      const tokenPayload: TTokenPayload = {
        userId: '60b1f71f2242a509d8a7f5c4',
        email: 'john@doe.fr',
        iat: Date.now() / 1000 - 5000,
        exp: Date.now() / 1000 + 100,
      }

      // When
      const validatedUser = async (): Promise<User> => await adminJwtStrategy.validate(request, tokenPayload)

      // Then
      await expect(validatedUser).rejects.toThrow()
    })

    it('should fail with unknown user id', async () => {
      // Given
      const request = {
        cookies: { [Cookies.REFRESH_TOKEN]: '1234' },
      } as unknown as Request & { res: { headers: object } }
      const tokenPayload: TTokenPayload = {
        userId: '59q5971f2243a509d8a7f5c4',
        email: 'john@doe.fr',
        iat: Date.now() / 1000 - 5000,
        exp: Date.now() / 1000 + 100,
      }

      // When
      const validatingUser = async (): Promise<User> => await adminJwtStrategy.validate(request, tokenPayload)

      // Then
      await expect(validatingUser).rejects.toThrow()
    })
  })
})
