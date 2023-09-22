import { DatesUtils } from '@Common/utils'

describe('Utils - DatesUtils', () => {
  describe('When getting date data from a date', () => {
    it('should return date data', () => {
      // Given
      const date = new Date('July 20, 69 20:17:00 GMT+00:00')

      // When
      const dataFromDate = DatesUtils.getDateData(date)

      // Then
      expect(dataFromDate).toEqual({ day: 20, month: 7, year: 1969, hours: 20, minutes: 17, seconds: 0 })
    })

    it('should return date prettier data', () => {
      // Given
      const date = new Date('July 20, 69 20:17:00 GMT+00:00')

      // When
      const dataFromDate = DatesUtils.getDateData(date, true)

      // Then
      expect(dataFromDate).toEqual({ day: '20', month: '07', year: '1969', hours: '20', minutes: '17', seconds: '00' })
    })

    it('should return NaN data if the date is not valid', () => {
      // Given
      const date = new Date('sd5fq6546sf54')

      // When
      const dataFromDate = DatesUtils.getDateData(date)

      // Then
      expect(dataFromDate).toEqual(null)
    })
  })

  describe('When getting date data from a string', () => {
    it('should return date data', () => {
      // Given
      const date = '20/07/1969 20:17'

      // When
      const dataFromDate = DatesUtils.getStrDateData(date)

      // Then
      expect(dataFromDate).toEqual({ day: '20', month: '07', year: '1969', hours: '20', minutes: '17', seconds: '0' })
    })

    it('should return date data with a different format', () => {
      // Given
      const date = '1969/07/20 20:17:00'

      // When
      const dataFromDate = DatesUtils.getStrDateData(date, 'yyyy/MM/dd HH:mm:ss')

      // Then
      expect(dataFromDate).toEqual({ day: '20', month: '07', year: '1969', hours: '20', minutes: '17', seconds: '00' })
    })

    it('should return null if the date is not valid', () => {
      // Given
      const date = 'sd5fq6546sf54'

      // When
      const dataFromDate = DatesUtils.getStrDateData(date)

      // Then
      expect(dataFromDate).toBeNull()
    })
  })

  describe('When getting UTC date from a string', () => {
    it('should return UTC date', () => {
      // Given
      const date = '20/07/1969 20:17'

      // When
      const dateFromStr = DatesUtils.getUTCDateFromStr(date)

      // Then
      expect(dateFromStr?.getUTCFullYear()).toEqual(1969)
      expect(dateFromStr?.getUTCMonth()).toEqual(6) // UTC, month = [0, 11]
      expect(dateFromStr?.getUTCDate()).toEqual(20)
      expect(dateFromStr?.getUTCHours()).toEqual(20)
      expect(dateFromStr?.getUTCMinutes()).toEqual(17)
      expect(dateFromStr?.getUTCSeconds()).toEqual(0)
    })

    it('should return date data from a different string format', () => {
      // Given
      const date = '1969/07/20 20:17:00'

      // When
      const dateFromStr = DatesUtils.getUTCDateFromStr(date, 'yyyy/MM/dd HH:mm:ss')

      // Then
      expect(dateFromStr?.getUTCFullYear()).toEqual(1969)
      expect(dateFromStr?.getUTCMonth()).toEqual(6) // UTC, month = [0, 11]
      expect(dateFromStr?.getUTCDate()).toEqual(20)
      expect(dateFromStr?.getUTCHours()).toEqual(20)
      expect(dateFromStr?.getUTCMinutes()).toEqual(17)
      expect(dateFromStr?.getUTCSeconds()).toEqual(0)
    })

    it('should return null if the date is not valid', () => {
      // Given
      const date = 'sd5fq6546sf54'

      // When
      const dataFromDate = DatesUtils.getUTCDateFromStr(date)

      // Then
      expect(dataFromDate).toBeNull()
    })
  })

  describe('When getting string from a date', () => {
    it('should return default formatted string', () => {
      // Given
      const date = new Date('July 20, 69 20:17:00 GMT+00:00')

      // When
      const strFromDate = DatesUtils.getStrFromDate(date)

      // Then
      expect(strFromDate).toEqual('20/07/1969 20:17')
    })

    it('should return formatted string with a custom format', () => {
      // Given
      const date = new Date('July 20, 69 20:17:00 GMT+00:00')

      // When
      const strFromDate = DatesUtils.getStrFromDate(date, 'MM/dd HH:mm')

      // Then
      expect(strFromDate).toEqual('07/20 20:17')
    })

    it('should return null if the date is not valid', () => {
      // Given
      const date = new Date('q68z4f6q5f4q')

      // When
      const dataFromDate = DatesUtils.getStrFromDate(date)

      // Then
      expect(dataFromDate).toBeNull()
    })
  })

  describe('When converting the format of a string to another format', () => {
    it('should return formatted string with the asked format', () => {
      // Given
      const date = '1969/07/20 20:17:00'

      // When
      const convertedStrFormat = DatesUtils.convertStrFormat(date, 'yyyy/MM/dd HH:mm:ss', 'MM/dd HH:mm')

      // Then
      expect(convertedStrFormat).toBe('07/20 20:17')
    })

    it('should return null if the date is not valid', () => {
      // Given
      const date = '3a65z41r6z5'

      // When
      const convertedStrFormat = DatesUtils.convertStrFormat(date, 'yyyy/MM/dd HH:mm:ss', 'MM/dd HH:mm')

      // Then
      expect(convertedStrFormat).toBeNull()
    })
  })

  describe('When checking if 2 dates are the same day of the first after the other', () => {
    it('should return true with two dates at the same day', () => {
      // Given
      const firstDate = new Date('July 20, 69 20:00:00 GMT+00:00')
      const secondDate = new Date('July 20, 69 20:17:00 GMT+00:00')

      // When
      const convertedStrFormat = DatesUtils.isDateTheSameDayOrAfter(firstDate, secondDate)

      // Then
      expect(convertedStrFormat).toBeTruthy()
    })

    it('should return true with two consecutive days dates', () => {
      // Given
      const firstDate = new Date('July 21, 69 20:00:00 GMT+00:00')
      const secondDate = new Date('July 20, 69 20:17:00 GMT+00:00')

      // When
      const convertedStrFormat = DatesUtils.isDateTheSameDayOrAfter(firstDate, secondDate)

      // Then
      expect(convertedStrFormat).toBeTruthy()
    })

    it('should return false with two far-off dates', () => {
      // Given
      const firstDate = new Date('July 20, 69 20:17:00 GMT+00:00')
      const secondDate = new Date('July 21, 99 20:00:00 GMT+00:00')

      // When
      const convertedStrFormat = DatesUtils.isDateTheSameDayOrAfter(firstDate, secondDate)

      // Then
      expect(convertedStrFormat).toBeFalsy()
    })
  })

  describe('When checking if 2 dates are the same day of the first before the other', () => {
    it('should return true with two dates at the same day', () => {
      // Given
      const firstDate = new Date('July 19, 69 20:00:00 GMT+00:00')
      const secondDate = new Date('July 20, 69 20:17:00 GMT+00:00')

      // When
      const convertedStrFormat = DatesUtils.isDateTheSameDayOrBefore(firstDate, secondDate)

      // Then
      expect(convertedStrFormat).toBeTruthy()
    })

    it('should return true with two consecutive days dates', () => {
      // Given
      const firstDate = new Date('July 19, 69 20:00:00 GMT+00:00')
      const secondDate = new Date('July 20, 69 20:17:00 GMT+00:00')

      // When
      const convertedStrFormat = DatesUtils.isDateTheSameDayOrBefore(firstDate, secondDate)

      // Then
      expect(convertedStrFormat).toBeTruthy()
    })

    it('should return false with two far-off dates', () => {
      // Given
      const firstDate = new Date('July 19, 99 20:00:00 GMT+00:00')
      const secondDate = new Date('July 20, 69 20:17:00 GMT+00:00')

      // When
      const convertedStrFormat = DatesUtils.isDateTheSameDayOrBefore(firstDate, secondDate)

      // Then
      expect(convertedStrFormat).toBeFalsy()
    })
  })

  describe('When checking if a date is between two dates', () => {
    it('should return false with a date before both dates', () => {
      // Given
      const firstDate = new Date('July 18, 69 20:00:00 GMT+00:00')
      const secondDate = new Date('July 20, 69 20:17:00 GMT+00:00')
      const checkedDate = new Date('July 17, 69 20:17:00 GMT+00:00')

      // When
      const result = DatesUtils.isDateBetween(checkedDate, firstDate, secondDate)

      // Then
      expect(result).toBeFalsy()
    })

    it('should return true with a date between both dates', () => {
      // Given
      const firstDate = new Date('July 18, 69 20:00:00 GMT+00:00')
      const secondDate = new Date('July 20, 69 20:17:00 GMT+00:00')
      const checkedDate = new Date('July 19, 69 20:00:00 GMT+00:00')

      // When
      const result = DatesUtils.isDateBetween(checkedDate, firstDate, secondDate)

      // Then
      expect(result).toBeTruthy()
    })

    it('should return false with a date after both dates', () => {
      // Given
      const firstDate = new Date('July 18, 69 20:00:00 GMT+00:00')
      const secondDate = new Date('July 20, 69 20:17:00 GMT+00:00')
      const checkedDate = new Date('July 21, 69 20:17:00 GMT+00:00')

      // When
      const result = DatesUtils.isDateBetween(checkedDate, firstDate, secondDate)

      // Then
      expect(result).toBeFalsy()
    })
  })

  describe('When checking if two dates are equals', () => {
    it('should return true with two equal dates', () => {
      // Given
      const firstDate = new Date('July 20, 69 20:17:00 GMT+00:00')
      const secondDate = new Date('July 20, 69 20:17:00 GMT+00:00')

      // When
      const result = DatesUtils.areDatesEqual(firstDate, secondDate)

      // Then
      expect(result).toBeTruthy()
    })

    it('should return false with two different dates', () => {
      // Given
      const firstDate = new Date('July 18, 69 20:17:00 GMT+00:00')
      const secondDate = new Date('July 20, 69 20:17:00 GMT+00:00')

      // When
      const result = DatesUtils.areDatesEqual(firstDate, secondDate)

      // Then
      expect(result).toBeFalsy()
    })
  })

  describe('When checking if two date formatted as a string are equals', () => {
    it('should return true with two equal string dates', () => {
      // Given
      const firstDate = '20/07/1969 20:17'
      const secondDate = '20/07/1969 20:17'

      // When
      const result = DatesUtils.areStrDatesEqual(firstDate, secondDate)

      // Then
      expect(result).toBeTruthy()
    })

    it('should return false with two different string dates', () => {
      // Given
      const firstDate = '18/07/1969 20:17'
      const secondDate = '20/07/1969 20:17'

      // When
      const result = DatesUtils.areStrDatesEqual(firstDate, secondDate)

      // Then
      expect(result).toBeFalsy()
    })
  })

  describe('When getting day of the week from JS date conventions to french conventions', () => {
    /**
     * French conventions
     * 0 Lundi
     * 1 Mardi
     * 2 Mercredi
     * 3 Jeudi
     * 4 Vendredi
     * 5 Samedi
     * 6 Dimanche
     *
     * JS conventions
     * 0 Dimanche
     * 1 Lundi
     * 2 Mardi
     * 3 Mercredi
     * 4 Jeudi
     * 5 Vendredi
     * 6 Samedi
     */
    it('should success with a random day index', () => {
      // Given
      const dayIndex = 2

      // When
      const result = DatesUtils.getCalibratedDayOfWeek(dayIndex)

      // Then
      expect(result).toBe(1)
    })

    it('should success with sunday', () => {
      // Given
      const dayIndex = 0

      // When
      const result = DatesUtils.getCalibratedDayOfWeek(dayIndex)

      // Then
      expect(result).toBe(6)
    })

    it('should fail with an invalid index', () => {
      // Given
      const dayIndex = 99

      // When
      const result = DatesUtils.getCalibratedDayOfWeek(dayIndex)

      // Then
      expect(result).toBe(-1)
    })
  })
})
