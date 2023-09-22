import { MissionClientNotificationPreferences } from '@Schemas/user'

describe('Schema - Mission Client Notification Preferences', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // When
    const missionClientNotificationPreferences = new MissionClientNotificationPreferences()

    // Then
    expect(missionClientNotificationPreferences.newQuoteReceived).toBeTruthy()
    expect(missionClientNotificationPreferences.missionFinished).toBeTruthy()
    expect(missionClientNotificationPreferences.newMissionProposal).toBeTruthy()
    expect(missionClientNotificationPreferences.missionCancelledByProfessional).toBeTruthy()
  })
})
