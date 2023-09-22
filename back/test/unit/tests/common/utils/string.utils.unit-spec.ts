import { StringUtils } from '@Common/utils/string.utils'

describe('Utils - StringUtils', () => {
  describe('When escaping regex expression', () => {
    it('should return escaped regex', () => {
      // Given
      const regex = 'Ceci est un test ?! :) ^$"'
      // When
      const dataFromDate = StringUtils.escapeRegExp(regex)

      // Then
      expect(dataFromDate).toEqual('Ceci est un test \\?! :\\) \\^\\$"')
    })
  })
})
