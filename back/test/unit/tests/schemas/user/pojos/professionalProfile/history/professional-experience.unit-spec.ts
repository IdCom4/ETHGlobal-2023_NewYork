import { IProfessionalExperience, ProfessionalExperience } from '@Schemas/user'
import { FlexibleDateTimeRange } from '@Schemas/common/pojos/date/flexible-date-time-range'

describe('Schema - Professional Experience', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // Given
    const id = 0
    const enterprise = 'ValueMyCar'
    const role = 'Role'
    const dateRange = FlexibleDateTimeRange.of(new Date(), new Date())

    // When
    const professionalExperience = new ProfessionalExperience(id, enterprise, role, dateRange)

    // Then
    expect(professionalExperience.id).toBe(0)
    expect(professionalExperience.enterprise).toBe(enterprise)
    expect(professionalExperience.role).toBe(role)
    expect(professionalExperience.dateRange).toBe(dateRange)
  })

  it('should update object with given data object', () => {
    // Given
    const professionalExperience = new ProfessionalExperience(0, 'ValueMyCar', 'Role', FlexibleDateTimeRange.of(new Date(), new Date()))
    const newEnterpriseName = 'Autre'
    const newRole = 'AutreRole'
    const newDateRange = FlexibleDateTimeRange.of(new Date(), new Date())

    // When
    professionalExperience.update({
      enterprise: newEnterpriseName,
      role: newRole,
      dateRange: newDateRange,
    })

    // Then
    expect(professionalExperience.enterprise).toBe(newEnterpriseName)
    expect(professionalExperience.role).toBe(newRole)
    expect(professionalExperience.dateRange).toBe(newDateRange)
  })

  it('should instantiate with given data object', () => {
    // Given
    const professionalExperienceData: IProfessionalExperience = {
      id: 0,
      enterprise: 'ValueMyCar',
      role: 'Role',
      dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
    }

    // When
    const professionalExperience = ProfessionalExperience.fromData(professionalExperienceData)

    // Then
    expect(professionalExperience.id).toBe(professionalExperienceData.id)
    expect(professionalExperience.enterprise).toBe(professionalExperienceData.enterprise)
    expect(professionalExperience.role).toBe(professionalExperienceData.role)
    expect(professionalExperience.dateRange).toBe(professionalExperienceData.dateRange)
  })
})
