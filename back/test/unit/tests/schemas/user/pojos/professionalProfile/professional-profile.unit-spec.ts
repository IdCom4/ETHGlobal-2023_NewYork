import { Company, ProfessionalProfile } from '@Schemas/user'
import { Review, StrictAddress } from '@Schemas/common/pojos'

describe('Schema - Professional Profile', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // Given
    const businessName = 'ABC LLC'
    const skillIds = []
    const workAddress = StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0])

    // When
    const professionalProfile = ProfessionalProfile.of(businessName, skillIds, workAddress)

    // Then
    expect(professionalProfile.businessName).toBe(businessName)
    expect(professionalProfile.businessPicture).toBeFalsy()
    expect(professionalProfile.businessPresentation).toBeFalsy()
    expect(professionalProfile.notificationPreferences).toBeTruthy()
    expect(professionalProfile.company).toBeFalsy()
    expect(professionalProfile.workAddress).toEqual(workAddress)
    expect(professionalProfile.billingAddress).toBeFalsy()
    expect(professionalProfile.averageHourlyRate).toBeFalsy()
    expect(professionalProfile.averageAvailability).toBeFalsy()
    expect(professionalProfile.maxTravelDistance).toBeFalsy()
    expect(professionalProfile.skillIds).toEqual(skillIds)
    expect(professionalProfile.history).toBeTruthy()
    expect(professionalProfile.curriculum).toBeFalsy()
    expect(professionalProfile.insurance).toBeFalsy()
    expect(professionalProfile.missionsId).toStrictEqual([])
    expect(professionalProfile.nbrFinishedMissions).toBe(0)
    expect(professionalProfile.clientReviews).toStrictEqual([])
    expect(professionalProfile.isFavoriteOf).toStrictEqual([])
    expect(professionalProfile.professionalPaymentData).toBeTruthy()
    expect(professionalProfile.completionScore).toBe(0)
    expect(professionalProfile.bonusScore).toBe(0)
    expect(professionalProfile.vmcCertified).toBe(false)
    expect(professionalProfile.ecologicalCharter).toBe(true)
    expect(professionalProfile.shadowBanned).toBe(false)
  })

  describe('When checking if professional has a company', () => {
    const companyForTest: Company = new Company('a', 'b', 'c', StrictAddress.of('a', 'b', 'c', [1, 1]), 'e')

    it.each`
      displayValue | givenCompany      | expectedValue
      ${undefined} | ${undefined}      | ${false}
      ${'defined'} | ${companyForTest} | ${true}
    `('should return $expectedValue with $displayValue company', ({ givenCompany, expectedValue }) => {
      const skillIds = []
      const workAddress = StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0])

      const professionalProfile = ProfessionalProfile.of('ABC LLC', skillIds, workAddress)
      professionalProfile.company = givenCompany

      // When
      const hasCompany = professionalProfile.hasCompany()

      expect(hasCompany).toBe(expectedValue)
    })
  })

  it('should return average rating from client reviews', () => {
    // Given

    const skillIds = []
    const workAddress = StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0])

    const professionalProfile = ProfessionalProfile.of('ABC LLC', skillIds, workAddress)
    professionalProfile.clientReviews.push(new Review(0, new Date(), '123', 'JohnDoe'))
    professionalProfile.clientReviews.push(new Review(2.5, new Date(), '123', 'JohnDoe'))
    professionalProfile.clientReviews.push(new Review(5, new Date(), '123', 'JohnDoe'))

    // When
    const averageRating = professionalProfile.getAverageUserRatings()

    // Then
    expect(averageRating).toBe(2.5)
  })

  it('should increment finished missions', () => {
    // Given
    const skillIds = []
    const workAddress = StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0])

    const professionalProfile = ProfessionalProfile.of('ABC LLC', skillIds, workAddress)

    // When
    professionalProfile.incrementFinishedMissions()

    // Then
    expect(professionalProfile.nbrFinishedMissions).toBe(1)
  })
})
