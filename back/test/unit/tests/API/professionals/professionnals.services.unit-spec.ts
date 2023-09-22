import { ProfessionalsService } from '@Api/professionals/professionals.service'
import { instance, mock, when } from 'ts-mockito'
import { ProfessionalRepository } from '@/repositories'
import { ProfessionalProfileUpdater } from '@Common/data-updaters/professionnal-profile.updater'
import { ProfessionalUser, User } from '@Schemas/user'
import { UpdateProfessionalProfileRequest } from '@Api/professionals/requests/update-professional-profile/update-professional-profile.dto'
import { PublicFile, StrictAddress } from '@Schemas/common/pojos'
import { LocalMapAPI } from '@/common/external-service-providers-api'

describe('Service - ProfessionalsService', () => {
  let professionalsService: ProfessionalsService

  beforeAll(() => {
    const ProfessionalRepositoryClass = mock(ProfessionalRepository)
    when(ProfessionalRepositoryClass.updateAsIs).thenReturn(() => Promise.resolve(true))

    const mockedProfessionalProfileUpdaterClass = mock(ProfessionalProfileUpdater)
    when(mockedProfessionalProfileUpdaterClass.update).thenReturn(async (user, fieldsToUpdate, fields) => {
      if (fieldsToUpdate.includes('averageAvailability') && fields.averageAvailability)
        user.professionalProfile.averageAvailability = fields.averageAvailability
      if (fieldsToUpdate.includes('averageHourlyRate') && fields.averageHourlyRate)
        user.professionalProfile.averageHourlyRate = fields.averageHourlyRate
      if (fieldsToUpdate.includes('businessName') && fields.businessName) user.professionalProfile.businessName = fields.businessName
      if (fieldsToUpdate.includes('businessPicture') && fields.businessPicture)
        user.professionalProfile.businessPicture = new PublicFile(fields.businessPicture, 'dd', 'png')
      if (fieldsToUpdate.includes('businessPresentation') && fields.businessPresentation)
        user.professionalProfile.businessPresentation = fields.businessPresentation
    })

    const mockedMapAPI = mock(LocalMapAPI)

    professionalsService = new ProfessionalsService(
      instance(mockedMapAPI),
      instance(ProfessionalRepositoryClass),
      instance(mockedProfessionalProfileUpdaterClass)
    )
  })

  it('should return a success message when updating professional profile', () => {
    // Given
    const loggedUser = <ProfessionalUser>User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', {
      skillIds: ['some-skill-id'],
      workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
    })
    const request: UpdateProfessionalProfileRequest = {
      fieldsToUpdate: ['businessName'],
      fields: {
        businessName: 'Test',
      },
    }

    // When
    professionalsService.updateProfile(loggedUser, request.fieldsToUpdate, request.fields)

    // Then
    expect(loggedUser).toBeTruthy()
    expect(loggedUser.professionalProfile.businessName).toBe('Test')
  })
})
