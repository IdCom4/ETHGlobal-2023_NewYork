import { UsersService } from '@Api/users/users.service'
import { instance, mock, when } from 'ts-mockito'
import { UserRepository } from '@/repositories'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { User } from '@Schemas/user'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import { UpdateUserAccountRequest } from '@/API/users/requests'
import { Sex } from '@/common/enums/schemas'
import { LenientAddressDTO, StrictAddressDTO } from '@/common/request-io/request-dto'
import { InstantiatingDataWrapper } from '@Common/classes'

describe('Service - UsersService', () => {
  let usersService: UsersService

  beforeAll(() => {
    const mockedUserRepositoryClass = mock(UserRepository)
    const mockedHostedFilesServiceClass = mock(HostedFilesService)
    when(mockedUserRepositoryClass.updateAsIs).thenReturn(() => Promise.resolve(true))
    when(mockedUserRepositoryClass.findById).thenReturn((userId) => {
      if (userId === '12345') {
        const user = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '1234', undefined)
        user.softDelete()
        return InstantiatingDataWrapper.fromData(Promise.resolve(user))
      }
      return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<User>)
    })
    when(mockedUserRepositoryClass.findMany).thenReturn((query) => {
      if (query._isAdmin) {
        const onlyUserAdmin: User = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)
        onlyUserAdmin.setAdminStatus(true)
        return InstantiatingDataWrapper.fromData(Promise.resolve([onlyUserAdmin]))
      }
      return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<User[]>)
    })
    when(mockedHostedFilesServiceClass.replaceFile).thenReturn(async (oldFileReferenceId, newFile, uploaderId, isPrivate) =>
      HostedFileReference.of('google.com', newFile.name || 'name', 'png', uploaderId, isPrivate)
    )

    usersService = new UsersService(instance(mockedUserRepositoryClass), instance(mockedHostedFilesServiceClass))
  })

  describe('When getting user by Id', () => {
    describe('With a valid id', () => {
      it('should return a user when asking for not active only', async () => {
        // Given
        const userId = '12345'

        // When
        const user: User = await usersService.getUserById(userId, { activesOnly: false })

        // Then
        expect(user).toBeTruthy()
      })

      it('should throw when asking for active only with an inactive user', async () => {
        // Given
        const userId = '12345'

        // When
        const gettingUser = async (): Promise<User> => await usersService.getUserById(userId, { activesOnly: true })

        // Then
        await expect(gettingUser).rejects.toThrow()
      })
    })

    it('should throw when asking for a user with an invalid id', async () => {
      const userId = '987654321654987'

      // When
      const gettingUser = async (): Promise<User> => await usersService.getUserById(userId, { activesOnly: false })

      // Then
      await expect(gettingUser).rejects.toThrow()
    })
  })

  it('should return a success message when updating user profile', async () => {
    // Given
    const user = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345')
    const request: UpdateUserAccountRequest = Object.initClassByReflection<UpdateUserAccountRequest>(UpdateUserAccountRequest, {
      name: 'Idriss',
      lastName: 'Cornuau',
      picture: 'data:image/png;base64,iVBORw0KG',
      sex: Sex.OTHER,
      phone: '0791546235',
      billingAddress: Object.initClassByReflection(LenientAddressDTO, {
        city: 'Anytown',
        street: '123 Main Street',
        zipCode: '12345',
      }),
      homeAddress: Object.initClassByReflection(StrictAddressDTO, {
        city: 'Anytown',
        street: '123 Main Street',
        zipCode: '12345',
        coordinates: [1, 2] as [number, number],
      }),
      birthday: new Date(654654231),
    })

    // When
    const updatedUser = await usersService.updateUserAccount(user, request)

    // Then
    expect(updatedUser).toBeTruthy()
    expect(updatedUser.name).toBe(request.name)
    expect(updatedUser.lastName).toBe(request.lastName)
    expect(updatedUser.picture).toBeTruthy()
    expect(updatedUser.sex).toBe(request.sex)
    expect(updatedUser.phone).toBe(request.phone)
    expect(updatedUser.billingAddress?.city).toEqual(request.billingAddress?.city)
    expect(updatedUser.billingAddress?.street).toEqual(request.billingAddress?.street)
    expect(updatedUser.billingAddress?.zipCode).toEqual(request.billingAddress?.zipCode)
    expect(updatedUser.homeAddress?.city).toEqual(request.homeAddress?.city)
    expect(updatedUser.homeAddress?.street).toEqual(request.homeAddress?.street)
    expect(updatedUser.homeAddress?.zipCode).toEqual(request.homeAddress?.zipCode)
    expect(updatedUser.birthday).toBe(request.birthday)
  })

  it('should return a success message when deleting user profile', async () => {
    // Given
    const user = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345')

    // When
    await usersService.disableAccount(user)

    // Then
    expect(user).toBeTruthy()
    expect(user.deletedAt).toBeTruthy()
  })

  it('should return all admin users when asking for', async () => {
    // When
    const users = await usersService.getAllAdminUsers()

    // Then
    expect(users).toBeTruthy()
    expect(users.length).toBe(1)
  })
})
