import { NotificationTypes } from '@Schemas/user'

describe('Schema - Notification Type', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // When
    const notificationTypes = new NotificationTypes()

    // Then
    expect(notificationTypes.email).toBe(true)
    expect(notificationTypes.sms).toBe(true)
  })
})
