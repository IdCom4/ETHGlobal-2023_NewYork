import '@/extensions'

describe('Type Extension - Object', () => {
  describe('When checking if object is undefined', () => {
    it.each([
      { name: 'should return true with defined value', givenValue: 'valueMyCar', expectedValue: true },
      { name: 'should return false with undefined value', givenValue: undefined, expectedValue: false },
      { name: 'should return false with null value', givenValue: null, expectedValue: false },
    ])('$name', ({ givenValue, expectedValue }) => {
      // When
      const isDefined = Object.isDefined(givenValue)

      // Then
      expect(isDefined).toStrictEqual(expectedValue)
    })
  })
})
