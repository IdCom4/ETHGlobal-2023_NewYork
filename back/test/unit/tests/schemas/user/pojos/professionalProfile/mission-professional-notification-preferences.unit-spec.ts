import { MissionProfessionalNotificationPreferences } from '@Schemas/user'

describe('Schema - Mission Professional Notification Preferences', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // When
    const missionClientNotificationPreferences = new MissionProfessionalNotificationPreferences()

    // Then
    expect(missionClientNotificationPreferences.newMissionReceived).toBeTruthy()
    expect(missionClientNotificationPreferences.newQuoteRequired).toBeTruthy()
    expect(missionClientNotificationPreferences.missionValidatedByClient).toBeTruthy()
    expect(missionClientNotificationPreferences.professionalDeniedByClient).toBeTruthy()
    expect(missionClientNotificationPreferences.missionCancelledByClient).toBeTruthy()
  })
})
