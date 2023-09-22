import { CredentialsStrategy } from '@Common/auth/strategies/credentials/credentials.strategy'
import { instance, mock, when } from 'ts-mockito'
import { CredentialsValidator } from '@Common/auth/strategies/credentials/credentials.validator'
import { User } from '@Schemas/user'
import { UserRepository } from '@/repositories'
import { InstantiatingDataWrapper } from '@Common/classes'

describe('Strategy - CredentialsStrategy', () => {
  let credentialsStrategy: CredentialsStrategy

  beforeAll(() => {
    const mockedUserRepositoryClass = mock(UserRepository)
    when(mockedUserRepositoryClass.findWithHashedPasswordByEmail).thenReturn((email) => {
      // Password is '12345'
      const user = User.of('John', 'Doe', '0612345678', email, '$argon2i$v=19$m=16,t=2,p=1$elNtaTlsT1lxWWhsRkdHdg$D3KTQJyfMliqPE6bryq2jQ')
      user.validateEmail()
      return InstantiatingDataWrapper.fromData(Promise.resolve(user))
    })

    const credentialsValidator = new CredentialsValidator(instance(mockedUserRepositoryClass))
    credentialsStrategy = new CredentialsStrategy(credentialsValidator)
  })

  describe('When validating user', () => {
    it('should success with valid credentials', async () => {
      // Given
      const { email, password } = { email: 'john@doe.fr', password: '12345' }

      // When
      const user = await credentialsStrategy.validate(email, password)

      // Then
      expect(user).toBeTruthy()
      expect(user.email).toBe(email)
      expect(user.hashedPassword).toBeFalsy()
    })

    it('should fail with invalid credentials', async () => {
      // Given
      const { email, password } = { email: 'john@doe.fr', password: 'abcde' }

      // When
      const creatingUser = async (): Promise<User> => await credentialsStrategy.validate(email, password)

      // Then
      await expect(creatingUser()).rejects.toThrow()
    })
  })
})
