import { describe, it, expect } from 'vitest'

describe('testing DatesUtils class', () => {
  describe('testing formatStrDate function', () => {
    it('should convert a string date to another format', () => {
      const validDateString = '2020-02-01'
      const validDateStringFormat = 'yyyy-MM-dd'
      const wantedFormat = 'dd/MM/yyyy'

      const newFormattedDate = useUtils().dates.formatStrDate(validDateString, validDateStringFormat, wantedFormat)

      expect(newFormattedDate).toBe('01/02/2020')
    })

    // TODO: add more tests
  })

  // TODO: test all functions
})
