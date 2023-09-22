import { CenterClientNotificationPreferences } from '@Schemas/user'

describe('Schema - Center Client Notification Preferences', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // When
    const centerClientNotificationPreferences = new CenterClientNotificationPreferences()

    // Then
    expect(centerClientNotificationPreferences.bookingValidated).toBeTruthy()
    expect(centerClientNotificationPreferences.bookingCancelled).toBeTruthy()
  })
})
