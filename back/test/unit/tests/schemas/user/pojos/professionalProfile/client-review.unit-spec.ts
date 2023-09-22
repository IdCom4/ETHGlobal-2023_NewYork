import { Review } from '@/schemas/common/pojos'

describe('Schema - Client Review', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      const rating = 0
      const date = new Date()
      const userId = '617d742f88020d6df3c6dc3e'
      const userName = 'JohnDoe'
      const message = "On s'est bien amusé !"

      // When
      const clientReview = new Review(rating, date, userId, userName, message)

      // Then
      expect(clientReview.rating).toBe(rating)
      expect(clientReview.date).toBe(date)
      expect(clientReview.userId).toBe(userId)
      expect(clientReview.userName).toBe(userName)
      expect(clientReview.message).toBe(message)
    })

    it('should instantiate without message and nominal values', () => {
      const rating = 0
      const date = new Date()
      const userId = '617d742f88020d6df3c6dc3e'
      const userName = 'JohnDoe'

      // When
      const clientReview = new Review(rating, date, userId, userName)

      // Then
      expect(clientReview.rating).toBe(rating)
      expect(clientReview.date).toBe(date)
      expect(clientReview.userId).toBe(userId)
      expect(clientReview.userName).toBe(userName)
      expect(clientReview.message).toBeFalsy()
    })
  })
})
