import { TimeRange } from '@Schemas/common/pojos'

describe('Schema - TimeRange', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const begin = '11:00'
      const end = '12:00'

      // When
      const comment = TimeRange.of(begin, end)

      expect(comment.begin).toBe(begin)
      expect(comment.end).toBe(end)
    })

    it.each([
      { test_name: 'invalid begin', begin: 's52de41dfs', end: '12:00' },
      { test_name: 'invalid begin', begin: '11:00', end: 'qs5df1' },
      { test_name: 'end before beginning', begin: '12:00', end: 'qs5df1' },
    ])('should fail with $test_name', ({ begin, end }) => {
      // When
      const timeRange = (): TimeRange => TimeRange.of(begin, end)

      expect(timeRange).toThrowError()
    })
  })

  describe('When getting duration', () => {
    it('should return the duration in hours and minutes', () => {
      // Given
      const begin = '11:00'
      const end = '12:05'
      const timeRange = TimeRange.of(begin, end)

      // When
      const duration = timeRange.getDuration()

      // Then
      expect(duration.hours).toBe(1)
      expect(duration.minutes).toBe(5)
    })

    it('should return the duration in quart of hours', () => {
      // Given
      const begin = '11:00'
      const end = '12:00'
      const timeRange = TimeRange.of(begin, end)

      // When
      const duration = timeRange.getDurationAsNumberOfQuarterHour()

      // Then
      expect(duration).toBe(4)
    })
  })

  describe('When generating 15 minutes slots', () => {
    it('should success with valid dates', () => {
      // Given
      const begin = '11:00'
      const end = '12:00'
      const timeRange = TimeRange.of(begin, end)

      // When
      const duration = timeRange.generate15MinutesSlots()

      // Then
      expect(duration).toEqual(['11:00', '11:15', '11:30', '11:45'])
    })

    it('should faim with wrong begin date', () => {
      // Given.
      const begin = '11:11'
      const end = '12:00'
      const timeRange = TimeRange.of(begin, end)

      // When
      const gettingSlots = (): string[] => timeRange.generate15MinutesSlots()

      // Then
      expect(gettingSlots).toThrow()
    })
  })
})
