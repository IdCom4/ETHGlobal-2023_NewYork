import { instance, mock, when } from 'ts-mockito'
import { CredentialsValidator } from '@Common/auth/strategies/credentials/credentials.validator'
import { User } from '@Schemas/user'
import { UserRepository } from '@/repositories'
import { AdminCredentialsStrategy } from '@Common/auth/strategies/credentials/admin-credentials.strategy'
import { ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { InstantiatingDataWrapper } from '@Common/classes'

describe('Strategy - Admin CredentialsStrategy', () => {
  let adminCredentialsStrategy: AdminCredentialsStrategy

  beforeAll(() => {
    const mockedUserRepositoryClass = mock(UserRepository)
    when(mockedUserRepositoryClass.findWithHashedPasswordByEmail).thenReturn((email) => {
      // Password is '12345'
      const user = User.of('John', 'Doe', '0612345678', email, '$argon2i$v=19$m=16,t=2,p=1$elNtaTlsT1lxWWhsRkdHdg$D3KTQJyfMliqPE6bryq2jQ', undefined)
      user.validateEmail()
      if (email === 'john.admin@doe.fr') user.setAdminStatus(true)

      return InstantiatingDataWrapper.fromData(Promise.resolve(user))
    })

    const credentialsValidator = new CredentialsValidator(instance(mockedUserRepositoryClass))
    adminCredentialsStrategy = new AdminCredentialsStrategy(credentialsValidator)
  })

  describe('When validating an admin user', () => {
    describe('When user is an admin', () => {
      it('should success with valid credentials', async () => {
        // Given
        const { email, password } = { email: 'john.admin@doe.fr', password: '12345' }

        // When
        const user = await adminCredentialsStrategy.validate(email, password)

        // Then
        expect(user).toBeTruthy()
        expect(user.email).toBe(email)
        expect(user.hashedPassword).toBeFalsy()
      })

      it('should fail with invalid credentials', async () => {
        // Given
        const { email, password } = { email: 'john.admin@doe.fr', password: 'abcde' }

        // When
        const creatingUser = async (): Promise<User> => await adminCredentialsStrategy.validate(email, password)

        // Then
        await expect(creatingUser()).rejects.toThrow(UnauthorizedException)
      })
    })

    describe("When user isn't an admin", () => {
      it('should fail with valid credentials', async () => {
        // Given
        const { email, password } = { email: 'john@doe.fr', password: '12345' }

        // When
        const user = async (): Promise<User> => await adminCredentialsStrategy.validate(email, password)

        // Then
        await expect(user).rejects.toThrow(ForbiddenException)
      })

      it('should fail with invalid credentials', async () => {
        // Given
        const { email, password } = { email: 'john@doe.fr', password: '12345' }

        // When
        const user = async (): Promise<User> => await adminCredentialsStrategy.validate(email, password)

        // Then
        await expect(user).rejects.toThrow(ForbiddenException)
      })
    })
  })
})
