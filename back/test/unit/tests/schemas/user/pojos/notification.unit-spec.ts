import { Notification } from '@Schemas/user'

describe('Schema - Notification', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const id = 0
      const title = 'Titre'
      const message = 'Message'
      const link = 'lien.com'

      // When
      const notification = new Notification(id, title, message, link)

      // Then
      expect(notification.id).toBe(id)
      expect(notification.title).toBe(title)
      expect(notification.message).toBe(message)
      expect(notification.link).toBe(link)
      expect(notification.createdAt).toBeTruthy()
      expect(notification.seenAt).toBeFalsy()
    })

    it('should instantiate without link and nominal values', () => {
      // Given
      const id = 0
      const title = 'Titre'
      const message = 'Message'

      // When
      const notification = new Notification(id, title, message)

      // Then
      expect(notification.id).toBe(id)
      expect(notification.title).toBe(title)
      expect(notification.message).toBe(message)
      expect(notification.link).toBeFalsy()
      expect(notification.createdAt).toBeTruthy()
      expect(notification.seenAt).toBeFalsy()
    })
  })

  describe('When checking if notification has been seen', () => {
    it.each([[false], [true]])('should returns %s when seenAt value is %s', (expectedValue) => {
      // Given
      const notification = new Notification(0, 'Titre', 'Message')
      if (expectedValue) notification.isSeen()

      // When
      const hasBeenSeen = notification.hasBeenSeen()

      // Then
      expect(hasBeenSeen).toBe(expectedValue)
    })
  })

  it('should return true when checking if notification is seen after being seen', () => {
    // Given
    const notification = new Notification(0, 'Titre', 'Message')

    // When
    notification.isSeen()

    // Then
    expect(notification.hasBeenSeen()).toBe(true)
  })
})
