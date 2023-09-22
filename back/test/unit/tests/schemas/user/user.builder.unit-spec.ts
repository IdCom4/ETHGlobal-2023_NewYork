import { StrictAddress } from '@/schemas/common/pojos'
import { UserBuilder } from '@Schemas/user/user.builder'
import { User } from '@Schemas/user'

describe('Builder - UserBuilder', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // Given
    const name = 'John'
    const lastName = 'Doe'

    // When
    const userBuilder = new UserBuilder(name, lastName)

    // Then
    expect(userBuilder.name).toBe(name)
    expect(userBuilder.lastName).toBe(lastName)
    expect(userBuilder.phone).toBeFalsy()
    expect(userBuilder.email).toBeFalsy()
    expect(userBuilder.hashedPassword).toBeFalsy()
    expect(userBuilder.professionalData).toBeFalsy()
  })

  it('should fail when building user with initial arguments', () => {
    // Given
    const userBuilder = new UserBuilder('John', 'Doe')

    // When
    const buildingUser = (): User => userBuilder.build()

    // Then
    expect(buildingUser).toThrowError()
  })

  it('should success when building user with additional informations', () => {
    // Given
    const userBuilder = new UserBuilder('John', 'Doe')
      .setEmail('john@doe.com')
      .setPhone('0612345678')
      .setEmail('john@doe.com')
      .setHashedPassword('51fq6s5dfq6sf')
      .setProfessionalProfileIfProvided({
        skillIds: ['some-skill-id'],
        workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
      })

    // When
    const builtUser = (): User => userBuilder.build()

    // Then
    expect(builtUser).not.toThrowError()
    expect(builtUser()).toBeTruthy()
  })
})
