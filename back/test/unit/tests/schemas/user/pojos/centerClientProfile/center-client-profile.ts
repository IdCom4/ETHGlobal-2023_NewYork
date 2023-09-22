import { CenterClientProfile } from '@Schemas/user'

describe('Schema - Center Client Profile', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // When
    const centerClientProfile = new CenterClientProfile()

    // Then
    expect(centerClientProfile.cgu).toBe(true)
    expect(centerClientProfile.notificationPreferences).toBeTruthy()
    expect(centerClientProfile.bookingsId).toBeTruthy()
    expect(centerClientProfile.customerId).toBeTruthy()
  })
})
