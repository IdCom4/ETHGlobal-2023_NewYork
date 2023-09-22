import { TokenService } from '@Common/services/token.service'
import { instance, mock, when } from 'ts-mockito'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { User } from '@Schemas/user'

describe('TokenService', () => {
  let tokenService: TokenService

  beforeAll(() => {
    const mockedJwtService: JwtService = mock(JwtService)
    const mockedConfigService: ConfigService = mock(ConfigService)
    when(mockedJwtService.signAsync).thenReturn((payload) => Promise.resolve(JSON.stringify(payload)))
    when(mockedJwtService.verify).thenReturn((token) => JSON.parse(token))
    when(mockedConfigService.get).thenReturn((propertyPath) => {
      switch (propertyPath) {
        case 'ACCESS_TOKEN_EXPIRES_IN':
          return '1d'
        case 'PASSWORD_RECOVERY_TOKEN_EXPIRES_IN':
          return '1d'
      }
    })

    tokenService = new TokenService(instance(mockedJwtService), instance(mockedConfigService))
  })

  it('should success when creating refreshing token', async () => {
    // When
    const token = await tokenService.createRefreshToken()

    // Then
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
  })

  it('should success when creating access token', async () => {
    // Given
    const givenUser = User.of('john', 'doe', '0612345678', 'john@doe.fr', 'Abcde123')

    // When
    const token = await tokenService.createAccessToken(givenUser)

    // Then
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
  })

  it('should success when creating validation mail token', async () => {
    // Given
    const givenUser = User.of('john', 'doe', '0612345678', 'john@doe.fr', 'Abcde123')

    // When
    const token = await tokenService.createValidationMailToken(givenUser)

    // Then
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
  })

  it('should success when creating password recovery token', async () => {
    // Given
    const givenUser = User.of('john', 'doe', '0612345678', 'john@doe.fr', 'Abcde123')

    // When
    const token = await tokenService.createPasswordRecoveryToken(givenUser)

    // Then
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
  })

  describe('When decoding token', () => {
    it('should success with a valid token', async () => {
      // Given
      const token = '{"userId":"646b2a73d2106a4e24c11e39","email":"john@doe.fr", "iat":"1234587"}\n'

      // When
      const decodedToken: TTokenPayload = await tokenService.decodeToken(token)

      // Then
      expect(decodedToken).toBeTruthy()
      expect(decodedToken.email).toBe('john@doe.fr')
    })

    it('should fail with an invalid token payload', async () => {
      // Given
      const token = '{"userId":"646b2a73d2106a4e24c11e39", "iat":"1234587"}\n'

      // When
      const decodingToken = async (): Promise<TTokenPayload> => await tokenService.decodeToken(token)

      // Then
      await expect(decodingToken).rejects.toThrow()
    })

    it('should fail with an invalid token format', async () => {
      // Given
      const token = '{"userId"}\n'

      // When
      const decodingToken = async (): Promise<TTokenPayload> => await tokenService.decodeToken(token)

      // Then
      await expect(decodingToken).rejects.toThrow()
    })
  })

  describe('When checking token expiration', () => {
    it('should be false with an permanent token', () => {
      // Given
      const token: TTokenPayload = { userId: '646b2a73d2106a4e24c11e39', email: 'john@doe.fr', iat: 1234587 }

      // When
      const decodedToken = tokenService.isExpired(token)

      // Then
      expect(decodedToken).toBe(false)
    })

    it('should be true with an expired token', () => {
      // Given
      const token: TTokenPayload = {
        userId: '646b2a73d2106a4e24c11e39',
        email: 'john@doe.fr',
        iat: 1234587,
        exp: 1234588,
      }

      // When
      const decodedToken = tokenService.isExpired(token)

      // Then
      expect(decodedToken).toBe(true)
    })

    it('should be true with an expired token', () => {
      // Given
      const token: TTokenPayload = {
        userId: '646b2a73d2106a4e24c11e39',
        email: 'john@doe.fr',
        iat: 1234587,
        exp: 1234588,
      }

      // When
      const decodedToken = tokenService.isExpired(token)

      // Then
      expect(decodedToken).toBe(true)
    })

    it('should be false with an unexpired token', () => {
      // Given
      const token: TTokenPayload = {
        userId: '646b2a73d2106a4e24c11e39',
        email: 'john@doe.fr',
        iat: 1234587,
        exp: 3833740134036,
      }

      // When
      const decodedToken = tokenService.isExpired(token)

      // Then
      expect(decodedToken).toBe(false)
    })
  })
})
