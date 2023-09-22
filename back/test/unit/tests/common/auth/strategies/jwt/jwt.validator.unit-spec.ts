import { instance, mock, when } from 'ts-mockito'
import { UserRepository } from '@/repositories'
import { User } from '@Schemas/user'
import { JwtValidator } from '@Common/auth/strategies/jwt/jwt.validator'
import { TokenService } from '@Common/services/token.service'
import { Request, Response } from 'express'
import { Cookies, Headers } from '@Common/enums'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { TokenExpiredOrInvalidException } from '@/common/exceptions/token-expired-or-invalid.exception'
import { InstantiatingDataWrapper } from '@Common/classes'

describe('Validator - JwtValidator', () => {
  let jwtValidator: JwtValidator

  beforeAll(() => {
    const mockedUserRepositoryClass = mock(UserRepository)
    when(mockedUserRepositoryClass.findActiveById).thenReturn((userId) => {
      // Password is '12345'
      const user = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '$argon2i$v=19$m=16,t=2,p=1$elNtaTlsT1lxWWhsRkdHdg$D3KTQJyfMliqPE6bryq2jQ')
      user.validateEmail()

      // Si l'Id spécifié est 60b1f71f2242a509d8a7f5c4, alors je le considère connecté. Sinon, non.
      user.setCurrentHashedRefreshToken(userId === '60b1f71f2242a509d8a7f5c4' ? '1234' : null)

      return InstantiatingDataWrapper.fromData(Promise.resolve(user))
    })

    const mockedTokenServiceClass = mock(TokenService)
    when(mockedTokenServiceClass.isExpired).thenReturn((tokenPayload) => !!tokenPayload.exp && tokenPayload.exp < Math.round(Date.now() / 1000))
    when(mockedTokenServiceClass.createAccessToken).thenReturn(async (user) =>
      JSON.stringify({
        userId: user._id.toString(),
        email: user.email,
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 300,
      })
    )

    jwtValidator = new JwtValidator(instance(mockedTokenServiceClass), instance(mockedUserRepositoryClass))
  })

  describe('When validating user connection', () => {
    it('should success with valid token payload', async () => {
      // Given
      const request = {
        cookies: { [Cookies.REFRESH_TOKEN]: '1234' },
        res: { setHeader: jest.fn() } as unknown as Response,
      } as unknown as Request
      const tokenPayload: TTokenPayload = {
        userId: '60b1f71f2242a509d8a7f5c4',
        email: 'john@doe.fr',
        iat: Date.now() / 1000 - 100,
      }

      // When
      const validatedUser = await jwtValidator.validateUser(request, tokenPayload)

      // Then
      expect(validatedUser).toBeTruthy()
    })

    describe('When providing expired access token', () => {
      it('should success with a valid refresh token', async () => {
        // Given
        const request = {
          cookies: { [Cookies.REFRESH_TOKEN]: '1234' },
          res: {
            headers: {},
            setHeader(name: string, value: number | string | ReadonlyArray<string>) {
              this.headers[name] = value
            },
          },
        } as unknown as Request & { res: { headers: object } }

        const tokenPayload: TTokenPayload = {
          userId: '60b1f71f2242a509d8a7f5c4',
          email: 'john@doe.fr',
          iat: Date.now() / 1000 - 5000,
          exp: Date.now() / 1000 - 10,
        }

        // When
        const validatedUser = await jwtValidator.validateUser(request, tokenPayload)

        // Then
        expect(validatedUser).toBeTruthy()
        expect(request.res['headers'][Headers.ACCESS_TOKEN]).toBeTruthy()
      })

      it('With a invalid refresh token', async () => {
        // Given
        const request = {
          cookies: { [Cookies.REFRESH_TOKEN]: '123456' },
          res: {
            headers: {},
            setHeader(name: string, value: number | string | ReadonlyArray<string>) {
              this.headers[name] = value
            },
          },
        } as unknown as Request & { res: { headers: object } }

        const tokenPayload: TTokenPayload = {
          userId: '60b1f71f2242a509d8a7f5c4',
          email: 'john@doe.fr',
          iat: Date.now() / 1000 - 5000,
          exp: Date.now() / 1000 - 100,
        }

        // When
        const validatedUser = async (): Promise<User> => await jwtValidator.validateUser(request, tokenPayload)

        // Then
        await expect(validatedUser).rejects.toThrow(TokenExpiredOrInvalidException)
      })

      it('should fail without refresh token', async () => {
        // Given
        const request = {
          cookies: { [Cookies.REFRESH_TOKEN]: '123456' },
          res: {
            headers: {},
            setHeader(name: string, value: number | string | ReadonlyArray<string>) {
              this.headers[name] = value
            },
          },
        } as unknown as Request & { res: { headers: object } }

        const tokenPayload: TTokenPayload = {
          userId: '60acec9a9c5f1a4b1727a7f2',
          email: 'john@doe.fr',
          iat: Date.now() / 1000 - 5000,
          exp: Date.now() / 1000 - 100,
        }

        // When
        const validatedUser = async (): Promise<User> => await jwtValidator.validateUser(request, tokenPayload)

        // Then
        await expect(validatedUser).rejects.toThrow(TokenExpiredOrInvalidException)
      })
    })

    it('should rejects without handling responses', async () => {
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
      const validatedUser = async (): Promise<User> => await jwtValidator.validateUser(request, tokenPayload)

      // Then
      await expect(validatedUser).rejects.toThrow(InternalServerErrorException)
    })
  })
})
