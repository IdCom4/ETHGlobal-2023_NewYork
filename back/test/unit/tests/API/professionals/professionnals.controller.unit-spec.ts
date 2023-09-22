import { ProfessionalsController } from '@Api/professionals/professionals.controller'
import { instance, mock, when } from 'ts-mockito'
import { ProfessionalsService } from '@Api/professionals/professionals.service'
import { ProfessionalUser, User } from '@Schemas/user'
import { UpdateProfessionalProfileRequest } from '@Api/professionals/requests/update-professional-profile/update-professional-profile.dto'
import { StrictAddress } from '@Schemas/common/pojos'

describe('Controller - ProfessionalsController', () => {
  let professionalsController: ProfessionalsController
  const userToUpdate = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', {
    skillIds: ['some-skill-id'],
    workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
  }) as ProfessionalUser

  beforeAll(() => {
    const mockedProfessionalsService = mock(ProfessionalsService)
    when(mockedProfessionalsService.updateProfile).thenReturn((user) => new Promise((resolve) => resolve(user)))

    professionalsController = new ProfessionalsController(instance(mockedProfessionalsService))
  })

  it('should return the updated professional user (PATCH)', async () => {
    // Given
    const loggedUserWrapper = {
      user: <ProfessionalUser>userToUpdate,
    } as RequestWithLoggedUser<ProfessionalUser>

    const request: UpdateProfessionalProfileRequest = {
      fields: { businessName: 'NiouNayme' },
      fieldsToUpdate: ['businessName'],
    }

    // When
    const response = await professionalsController.updateProfile(loggedUserWrapper, request)

    // Then
    expect(response).toBeTruthy()
    expect(response.email).toEqual(userToUpdate.email)
  })
})
