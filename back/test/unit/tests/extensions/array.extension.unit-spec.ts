import '@/extensions'

enum TestEnum {
  VALUE1,
  VALUE2,
  VALUE3,
}

describe('Type Extension - Array', () => {
  describe('When getting minimal value', () => {
    it.each([
      { name: 'should success with nominal values', givenValue: [2, 1, 3, 5, 4], expectedValue: 1 },
      { name: 'should return null with empty array', givenValue: [], expectedValue: null },
    ])('$name', ({ givenValue, expectedValue }) => {
      // When
      const min = givenValue.min()

      // Then
      expect(min).toBe(expectedValue)
    })

    it('should fail with NaN values', () => {
      // Given
      const array = [{ id: 15 }, { id: 12 }]

      // When
      const min = (): { id: number } | null => array.min()

      // Then
      expect(min).toThrowError()
    })
  })

  describe('When getting maximal value', () => {
    it.each([
      { name: 'should success with nominal values', givenValue: [2, 1, 3, 5, 4], expectedValue: 5 },
      { name: 'should return null with empty array', givenValue: [], expectedValue: null },
    ])('$name', ({ givenValue, expectedValue }) => {
      // When
      const min = givenValue.max()

      // Then
      expect(min).toBe(expectedValue)
    })

    it('should fail with NaN values', () => {
      // Given
      const array = [{ id: 15 }, { id: 12 }]

      // When
      const min = (): { id: number } | null => array.max()

      // Then
      expect(min).toThrowError()
    })
  })

  it('should remove an entry when removing', () => {
    // Given
    const array = [{ id: 15 }, { id: 12 }]

    // When
    const arrayWithoutRemovedValue = array.remove((value) => value.id == 12)

    // Then
    expect(arrayWithoutRemovedValue).toStrictEqual([{ id: 12 }])
  })

  describe('When removing in place', () => {
    it.each([
      {
        name: 'should return removed items with nominal values',
        givenValue: [2, 1, 3, 5, 4],
        expectedRemovedItems: [3],
        expectedChangedValue: [2, 1, 5, 4],
      },
      {
        name: 'should return empty array with no removed items missing deleted object',
        givenValue: [2, 1, 5, 4],
        expectedRemovedItems: [],
        expectedChangedValue: [2, 1, 5, 4],
      },
    ])('$name', ({ givenValue, expectedRemovedItems, expectedChangedValue }) => {
      // When
      const removedItems = givenValue.removeInPlace((value) => value === 3)

      // Then
      expect(removedItems).toStrictEqual(expectedRemovedItems)
      expect(givenValue).toStrictEqual(expectedChangedValue)
    })
  })

  it('should success when copying array', () => {
    // Given
    const array = [{ id: 15 }, { id: 12 }]

    // When
    const copy = array.copy()

    // Then
    expect(copy).toStrictEqual(array)
  })

  describe('When finding an entry out of an enum', () => {
    it('should return null when not finding an entry out of an enum', () => {
      // Given
      const array = [TestEnum.VALUE1, TestEnum.VALUE2, TestEnum.VALUE3]

      // When
      const entry = array.findNotInEnum(TestEnum)

      // Then
      expect(entry).toBeNull()
    })

    it('should return the entry when finding an entry out of an enum', () => {
      // Given
      const array = [TestEnum.VALUE1, TestEnum.VALUE2, TestEnum.VALUE3, 4]

      // When
      const entry = array.findNotInEnum(TestEnum)

      // Then
      expect(entry).toBe(4)
    })
  })
})
