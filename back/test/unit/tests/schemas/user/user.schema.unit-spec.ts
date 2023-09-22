import { User } from '@Schemas/user'
import { IllegalArgumentException } from '@Common/exceptions/illegal-argument.exception'
import { Sex } from '@/common/enums/schemas'
import { StrictAddress } from '@Schemas/common/pojos'

describe('Schema - User', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const name = 'John'
      const lastName = 'Doe'
      const phone = '0612345678'
      const email = 'john@doe.com'
      const hashedPassword = 'hashedPassword' // I don't check the state of the password so there's no point into hashing it

      // When
      const user = User.of(name, lastName, phone, email, hashedPassword)

      // Then
      expect(user.name).toBe(name)
      expect(user.lastName).toBe(lastName)
      expect(user.phone).toBe(phone)
      expect(user.email).toBe(email)
      expect(user.hashedPassword).toBe(hashedPassword)
      expect(user.sex).toBe(Sex.OTHER)
      expect(user.birthday).toBeFalsy()
      expect(user.picture).toBeFalsy()
      expect(user.homeAddress).toBeFalsy()
      expect(user.billingAddress).toBeFalsy()
      expect(user.notifications).toStrictEqual([])
      expect(user.vehiclesId).toStrictEqual([])
      expect(user.centerClientProfile).toBeTruthy()
      expect(user.missionClientProfile).toBeTruthy()
      expect(user.professionalProfile).toBeFalsy()
      expect(user.vmcComments).toStrictEqual([])
      expect(user.isEmailValidated).toBe(false)
      expect(user.lastLogin).toBeTruthy()
      expect(user.deletedAt).toBeFalsy()
      expect(user.isAdmin).toBe(false)
      expect(user.currentHashedRefreshToken).toBeFalsy()
      expect(user.passwordRecoverToken).toBeFalsy()
    })

    /*
        The purpose of this test is to verify the tests performed when instating the object.
      Indeed, the IDE notices that the variables are undefined and throws a compilation error
      On the other hand, at runtime, it is possible that these values are undefined and no error will be thrown.
      That's why I choose to intentionally ignore typescript errors in order to perform these tests.
    */
    it.each([
      /* eslint-disable prettier/prettier */
      { test_name: 'should fail with undefined name', name: undefined, lastName: 'Doe', phone: '0612345678', email: 'john@doe.com', hashedPassword: '12345', isProfessional: false },
      { test_name: 'should fail with undefined lastName', name: 'John', lastName: undefined, phone: '0612345678', email: 'john@doe.com', hashedPassword: '12345', isProfessional: false },
      { test_name: 'should fail with undefined phone', name: 'John', lastName: 'Doe', phone: undefined, email: 'john@doe.com', hashedPassword: '12345', isProfessional: false },
      { test_name: 'should fail with undefined email', name: 'John', lastName: 'Doe', phone: '0612345678', email: undefined, hashedPassword: '12345', isProfessional: false },
      { test_name: 'should fail with undefined hashedPassword', name: 'John', lastName: 'Doe', phone: '0612345678', email: 'john@doe.com', hashedPassword: undefined, isProfessional: false },
      /* eslint-enable prettier/prettier */
    ])('$test_name', ({ name, lastName, phone, email, hashedPassword, isProfessional }) => {
      // When
      // @ts-ignore
      const construct = (): User => User.of(name, lastName, phone, email, hashedPassword, isProfessional)

      expect(construct).toThrowError(IllegalArgumentException)
    })
  })

  it('should add notifications with two new notifications', () => {
    // Given
    const user = User.of('Doe', 'John', '0612345678', 'john@doe.com', 'hashedPassword')

    const notificationTitle = 'Titre'
    const notificationMessage = 'Message'
    const notificationLink = 'quelque-part.com'

    // When
    user.addNotification(notificationTitle, notificationMessage, notificationLink)
    user.addNotification(notificationTitle, notificationMessage, notificationLink)

    // Then
    expect(user.notifications).toHaveLength(2)
    expect(user.notifications[0].id).toBe(0)
    expect(user.notifications[1].id).toBe(1)
  })

  describe('When checking if user is deleted', () => {
    it('should soft delete the account', () => {
      // Given
      const user = User.of('Doe', 'John', '0612345678', 'john@doe.com', 'hashedPassword')

      // When
      user.softDelete()

      // Then
      expect(user.isSoftDeleted()).toEqual(true)
    })
  })

  describe('When checking if user is professional', () => {
    it.each([
      {
        givenValue: {
          skillIds: ['some-skill-id'],
          workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
        },
        expectedValue: true,
      },
      { givenValue: undefined, expectedValue: false },
    ])('should return $expectedValue when professional state is $givenValue', ({ givenValue, expectedValue }) => {
      // Given
      const user = User.of('Doe', 'John', '0612345678', 'john@doe.com', 'hashedPassword', givenValue)
      user.softDelete()

      // When
      const isProfessional = user.isProfessional()

      // Then
      expect(isProfessional).toBe(expectedValue)
    })
  })

  it('should return full name when asking for', () => {
    // Given
    const name = 'Doe'
    const lastName = 'John'
    const user = User.of(name, lastName, '0612345678', 'john@doe.com', 'hashedPassword')

    // When
    const userFullName = user.getFullName()

    // Then
    expect(userFullName).toBe(`${name} ${lastName}`)
  })
})
