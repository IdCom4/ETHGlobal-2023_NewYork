import { TOpeningHours, WeekOpeningHours } from '@Schemas/center'
import { DaysOfWeek } from '@Common/enums'
import { TimeRange } from '@Schemas/common/pojos'

describe('Schema - Opening Hours', () => {
  it('should create an basic opening hours object at initialization', () => {
    // When
    const openingHours = WeekOpeningHours.createEmpty()

    // Then
    expect(openingHours[DaysOfWeek.MONDAY]).toStrictEqual(TimeRange.of('00:00', '00:00'))
    expect(openingHours[DaysOfWeek.TUESDAY]).toStrictEqual(TimeRange.of('00:00', '00:00'))
    expect(openingHours[DaysOfWeek.WEDNESDAY]).toStrictEqual(TimeRange.of('00:00', '00:00'))
    expect(openingHours[DaysOfWeek.THURSDAY]).toStrictEqual(TimeRange.of('00:00', '00:00'))
    expect(openingHours[DaysOfWeek.FRIDAY]).toStrictEqual(TimeRange.of('00:00', '00:00'))
    expect(openingHours[DaysOfWeek.SATURDAY]).toStrictEqual(TimeRange.of('00:00', '00:00'))
    expect(openingHours[DaysOfWeek.SUNDAY]).toStrictEqual(TimeRange.of('00:00', '00:00'))
  })

  it('should update the opening hours', () => {
    // Given
    const openingHours = WeekOpeningHours.createEmpty()
    const newOpeningHours: TOpeningHours = {
      [DaysOfWeek.MONDAY]: TimeRange.of('08:00', '12:00'),
      [DaysOfWeek.TUESDAY]: TimeRange.of('08:00', '12:00'),
    }

    // When
    openingHours.setDaysOfWeekOpeningHours(newOpeningHours)

    // Then
    expect(openingHours[DaysOfWeek.MONDAY]).toStrictEqual(TimeRange.of('08:00', '12:00'))
    expect(openingHours[DaysOfWeek.TUESDAY]).toStrictEqual(TimeRange.of('08:00', '12:00'))
  })
})
