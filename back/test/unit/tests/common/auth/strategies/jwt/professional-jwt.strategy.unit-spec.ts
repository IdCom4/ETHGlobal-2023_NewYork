import { ExtractJwt } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { instance, mock, when } from 'ts-mockito'
import { JwtValidator } from '@Common/auth/strategies/jwt/jwt.validator'
import { ProfessionalUser, User } from '@Schemas/user'
import { Cookies } from '@Common/enums'
import { Request } from 'express'
import { ProfessionalJwtStrategy } from '@Common/auth/strategies/jwt/professional-jwt.strategy'
import { ForbiddenException } from '@nestjs/common'
import { StrictAddress } from '@Schemas/common/pojos'

describe('Strategy - ProfessionalJwtStrategy', () => {
  let professionalJwtStrategy: ProfessionalJwtStrategy

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
    when(mockedJwtValidator.validateUser).thenReturn((request, accessTokenPayload) =>
      Promise.resolve(
        accessTokenPayload.email === 'john.pro@doe.fr'
          ? User.of('Doe', 'John', '0612345678', accessTokenPayload.email, 'hashedPassword', {
              skillIds: ['some-skill-id'],
              workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
            })
          : User.of('Doe', 'John', '0612345678', accessTokenPayload.email, 'hashedPassword')
      )
    )

    professionalJwtStrategy = new ProfessionalJwtStrategy(instance(mockedJwtValidator), instance(mockedConfigService))
  })

  describe('When validating a professional user', () => {
    it('should success with a professional user', async () => {
      // Given
      const request = {
        cookies: { [Cookies.REFRESH_TOKEN]: '1234' },
      } as unknown as Request & { res: { headers: object } }
      const tokenPayload: TTokenPayload = {
        userId: '60b1f71f2242a509d8a7f5c4',
        email: 'john.pro@doe.fr',
        iat: Date.now() / 1000 - 5000,
        exp: Date.now() / 1000 - 100,
      }

      // When
      const validatedUser = await professionalJwtStrategy.validate(request, tokenPayload)

      // Then
      expect(validatedUser).toBeTruthy()
    })

    it('should fail with a not professional user', async () => {
      // Given
      const request = {
        cookies: { [Cookies.REFRESH_TOKEN]: '1234' },
      } as unknown as Request & { res: { headers: object } }
      const tokenPayload: TTokenPayload = {
        userId: '60b1f71f2242a509d8a7f5c4',
        email: 'john@doe.fr',
        iat: Date.now() / 1000 - 5000,
        exp: Date.now() / 1000 - 100,
      }

      // When
      const validatingUser = async (): Promise<ProfessionalUser> => await professionalJwtStrategy.validate(request, tokenPayload)

      // Then
      await expect(validatingUser).rejects.toThrow(ForbiddenException)
    })
  })
})
