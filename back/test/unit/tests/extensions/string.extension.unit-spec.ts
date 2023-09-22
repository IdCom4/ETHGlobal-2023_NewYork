import '@/extensions'

describe('Type Extension - Array', () => {
  describe('When capitalizing string', () => {
    it.each([
      { name: 'should success with nominal value', givenValue: 'valueMyCar', expectedValue: 'ValueMyCar' },
      { name: 'should do nothing with empty value', givenValue: '', expectedValue: '' },
    ])('$name', ({ givenValue, expectedValue }) => {
      // When
      const capitalizedString = givenValue.capitalize()

      // Then
      expect(capitalizedString).toStrictEqual(expectedValue)
    })
  })
})
