import { DateTimeRange } from '@Schemas/common/pojos'

describe('Schema - Date Time Range', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // Given
    const begin = new Date()
    const end = new Date()

    // When
    const comment = DateTimeRange.of(begin, end)

    expect(comment.begin).toBe(begin)
    expect(comment.end).toBe(end)
  })

  it('should return the duration', () => {
    // Given
    const begin = new Date('July 20, 69 20:17:00 GMT+00:00')
    const end = new Date('July 20, 69 22:21:00 GMT+00:00')
    const dateTimeRange = DateTimeRange.of(begin, end)

    // When
    const duration = dateTimeRange.getDuration()

    // Then
    expect(duration.hours).toBe(2)
    expect(duration.minutes).toBe(4)
  })

  describe('When comparing', () => {
    it('should return true if shorter', () => {
      // Given
      const begin = new Date('July 20, 69 20:17:00 GMT+00:00')
      const end = new Date('July 20, 69 22:21:00 GMT+00:00')
      const dateTimeRange = DateTimeRange.of(begin, end)

      const begin2 = new Date('July 20, 69 20:17:00 GMT+00:00')
      const end2 = new Date('July 20, 69 22:23:00 GMT+00:00')
      const dateTimeRange2 = DateTimeRange.of(begin2, end2)

      // When
      const result = dateTimeRange.isShorterThan(dateTimeRange2)

      // Then
      expect(result).toBe(true)
    })

    it('should return false if longer', () => {
      // Given
      const begin = new Date('July 20, 69 20:17:00 GMT+00:00')
      const end = new Date('July 20, 69 22:21:00 GMT+00:00')
      const dateTimeRange = DateTimeRange.of(begin, end)

      const begin2 = new Date('July 20, 69 20:17:00 GMT+00:00')
      const end2 = new Date('July 20, 69 22:20:00 GMT+00:00')
      const dateTimeRange2 = DateTimeRange.of(begin2, end2)

      // When
      const result = dateTimeRange.isShorterThan(dateTimeRange2)

      // Then
      expect(result).toBe(false)
    })
  })

  describe('When checking for overlap', () => {
    it('should return true if overlapping the beginning', () => {
      // Given
      const begin = new Date('July 20, 69 20:17:00 GMT+00:00')
      const end = new Date('July 20, 69 20:21:00 GMT+00:00')
      const dateTimeRange = DateTimeRange.of(begin, end)

      const begin2 = new Date('July 20, 69 20:16:00 GMT+00:00')
      const end2 = new Date('July 20, 69 20:20:00 GMT+00:00')
      const dateTimeRange2 = DateTimeRange.of(begin2, end2)

      // When
      const result = dateTimeRange.overlapsWith(dateTimeRange2)

      // Then
      expect(result).toBe(true)
    })

    it('should return true if overlapping inside', () => {
      // Given
      const begin = new Date('July 20, 69 20:17:00 GMT+00:00')
      const end = new Date('July 20, 69 20:21:00 GMT+00:00')
      const dateTimeRange = DateTimeRange.of(begin, end)

      const begin2 = new Date('July 20, 69 20:18:00 GMT+00:00')
      const end2 = new Date('July 20, 69 20:20:00 GMT+00:00')
      const dateTimeRange2 = DateTimeRange.of(begin2, end2)

      // When
      const result = dateTimeRange.overlapsWith(dateTimeRange2)

      // Then
      expect(result).toBe(true)
    })

    it('should return true if overlapping the end', () => {
      // Given
      const begin = new Date('July 20, 69 20:17:00 GMT+00:00')
      const end = new Date('July 20, 69 20:21:00 GMT+00:00')
      const dateTimeRange = DateTimeRange.of(begin, end)

      const begin2 = new Date('July 20, 69 20:18:00 GMT+00:00')
      const end2 = new Date('July 20, 69 20:22:00 GMT+00:00')
      const dateTimeRange2 = DateTimeRange.of(begin2, end2)

      // When
      const result = dateTimeRange.overlapsWith(dateTimeRange2)

      // Then
      expect(result).toBe(true)
    })

    it('should return true if overlapping the whole range', () => {
      // Given
      const begin = new Date('July 20, 69 20:17:00 GMT+00:00')
      const end = new Date('July 20, 69 20:21:00 GMT+00:00')
      const dateTimeRange = DateTimeRange.of(begin, end)

      const begin2 = new Date('July 20, 69 20:16:00 GMT+00:00')
      const end2 = new Date('July 20, 69 20:23:00 GMT+00:00')
      const dateTimeRange2 = DateTimeRange.of(begin2, end2)

      // When
      const result = dateTimeRange.overlapsWith(dateTimeRange2)

      // Then
      expect(result).toBe(true)
    })

    it('should return false when not overlapping', () => {
      // Given
      const begin = new Date('July 20, 69 20:17:00 GMT+00:00')
      const end = new Date('July 20, 69 20:21:00 GMT+00:00')
      const dateTimeRange = DateTimeRange.of(begin, end)

      const begin2 = new Date('July 20, 69 23:17:00 GMT+00:00')
      const end2 = new Date('July 20, 69 23:21:00 GMT+00:00')
      const dateTimeRange2 = DateTimeRange.of(begin2, end2)

      // When
      const result = dateTimeRange.overlapsWith(dateTimeRange2)

      // Then
      expect(result).toBe(false)
    })
  })

  describe('When checking for inclusion', () => {
    it('should return true if included', () => {
      // Given
      const begin = new Date('July 20, 69 20:17:00 GMT+00:00')
      const end = new Date('July 20, 69 20:21:00 GMT+00:00')
      const dateTimeRange = DateTimeRange.of(begin, end)
      const checkedDate = new Date('July 20, 69 20:20:00 GMT+00:00')

      // When
      const result = dateTimeRange.contains(checkedDate)

      // Then
      expect(result).toBe(true)
    })

    it('should return false if not included', () => {
      // Given
      const begin = new Date('July 20, 69 20:17:00 GMT+00:00')
      const end = new Date('July 20, 69 20:21:00 GMT+00:00')
      const dateTimeRange = DateTimeRange.of(begin, end)
      const checkedDate = new Date('July 20, 69 20:59:00 GMT+00:00')

      // When
      const result = dateTimeRange.contains(checkedDate)

      // Then
      expect(result).toBe(false)
    })
  })

  it('should return slots of 15 minutes in the date time range', () => {
    // Given
    const begin = new Date('July 20, 69 20:00:00 GMT+00:00')
    const end = new Date('July 20, 69 21:00:00 GMT+00:00')
    const dateTimeRange = DateTimeRange.of(begin, end)

    // When
    const result = dateTimeRange.generate15MinutesSlots()

    // Then
    expect(result).toEqual(['20:00', '20:15', '20:30', '20:45'])
  })

  it('should throw with an invalid begin date', () => {
    // Given
    const begin = new Date('July 20, 69 20:12:00 GMT+00:00')
    const end = new Date('July 20, 69 21:00:00 GMT+00:00')
    const dateTimeRange = DateTimeRange.of(begin, end)

    // When
    const result = (): string[] => dateTimeRange.generate15MinutesSlots()

    // Then
    expect(result).toThrow()
  })
})
