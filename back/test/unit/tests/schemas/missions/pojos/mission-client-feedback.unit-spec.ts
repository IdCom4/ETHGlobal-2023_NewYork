import { MissionClientFeedback } from '@Schemas/mission'
import { Review } from '@Schemas/common/pojos'

describe('Schema - MissionClientFeedback', () => {
  it('should instantiate when instantiating with all arguments constructor and nominal values', () => {
    // Given
    const reviewOfProfessional = new Review(1, new Date(), 'userId', 'userName', 'message')
    const reviewOfWebsite = new Review(5, new Date(), 'userId', 'userName', 'message')

    // When
    const missionClientFeedback = MissionClientFeedback.of(reviewOfProfessional, reviewOfWebsite)

    // Then
    expect(missionClientFeedback.reviewOfProfessional).toBe(reviewOfProfessional)
    expect(missionClientFeedback.reviewOfWebsite).toBe(reviewOfWebsite)
  })
})
