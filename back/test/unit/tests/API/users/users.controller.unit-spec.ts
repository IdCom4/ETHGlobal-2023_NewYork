import { UsersController } from '@Api/users/users.controller'
import { UsersService } from '@Api/users/users.service'
import { instance, mock, when } from 'ts-mockito'
import { User } from '@Schemas/user'
import { UpdateUserAccountRequest } from '@/API/users/requests'

describe('Controller - UsersController', () => {
  let usersController: UsersController

  beforeAll(() => {
    const mockedUsersServiceClass = mock(UsersService)
    when(mockedUsersServiceClass.updateUserAccount).thenReturn((user) => new Promise((resolve) => resolve(user)))

    usersController = new UsersController(instance(mockedUsersServiceClass))
  })

  it('should return a success message when updating user profile (PATCH)', async () => {
    // Given
    const email = 'john@doe.fr'
    const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', email, '12345') } as RequestWithLoggedUser
    const request: UpdateUserAccountRequest = {
      name: 'Jacques',
    }

    // When
    const response = await usersController.updateUserAccount(loggedUserWrapper, request)

    // Then
    expect(response).toBeTruthy()
    expect(response.email).toEqual(email)
  })

  it('should return a success message when deleting user profile (POST)', async () => {
    // Given
    const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser

    // When
    const response = await usersController.deleteProfile(loggedUserWrapper)

    // Then
    expect(response).toBeTruthy()
    expect(response.message).toBeTruthy()
    expect(response.statusCode).toBe(200)
  })
})
