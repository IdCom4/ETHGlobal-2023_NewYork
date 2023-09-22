import { MissionClientProfile } from '@Schemas/user'

describe('Schema - Mission Client Profile', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // When
    const missionClientProfile = MissionClientProfile.of()

    // Then
    expect(missionClientProfile.cgu).toBe(true)
    expect(missionClientProfile.notificationPreferences).toBeTruthy()
    expect(missionClientProfile.missionsId).toStrictEqual([])
    expect(missionClientProfile.favoriteProfessionalsId).toStrictEqual([])
    expect(missionClientProfile.customerId).toBeFalsy()
  })
})
