import { DaysOfWeek } from '@/common/enums/time'
import { TWeekOpeningHours, WeekOpeningHours } from '@/schemas/center'
import { TimeRange } from '@/schemas/common/pojos'
import { IsNotEmptyObject } from 'class-validator'
import { TimeRangeDTO } from './time-range.dto'

export class WeekOpeningHoursDTO {
  /* eslint-disable prettier/prettier */
  @IsNotEmptyObject({}, { message: `Les horaires d'ouverture du ${DaysOfWeek.MONDAY} doivent être indiqués` })
  [DaysOfWeek.MONDAY    ]:  TimeRangeDTO


  @IsNotEmptyObject({}, { message: `Les horaires d'ouverture du ${DaysOfWeek.TUESDAY} doivent être indiqués` })
  [DaysOfWeek.TUESDAY   ]:  TimeRangeDTO


  @IsNotEmptyObject({}, { message: `Les horaires d'ouverture du ${DaysOfWeek.WEDNESDAY} doivent être indiqués` })
  [DaysOfWeek.WEDNESDAY ]:  TimeRangeDTO


  @IsNotEmptyObject({}, { message: `Les horaires d'ouverture du ${DaysOfWeek.THURSDAY} doivent être indiqués` })
  [DaysOfWeek.THURSDAY  ]:  TimeRangeDTO


  @IsNotEmptyObject({}, { message: `Les horaires d'ouverture du ${DaysOfWeek.FRIDAY} doivent être indiqués` })
  [DaysOfWeek.FRIDAY    ]:  TimeRangeDTO


  @IsNotEmptyObject({}, { message: `Les horaires d'ouverture du ${DaysOfWeek.SATURDAY} doivent être indiqués` })
  [DaysOfWeek.SATURDAY  ]:  TimeRangeDTO


  @IsNotEmptyObject({}, { message: `Les horaires d'ouverture du ${DaysOfWeek.SUNDAY} doivent être indiqués` })
  [DaysOfWeek.SUNDAY    ]:  TimeRangeDTO
  /* eslint-enable prettier/prettier */

  public toWeekOpeningHours(): WeekOpeningHours {
    const openingHours = WeekOpeningHours.createEmpty()

    /* eslint-disable prettier/prettier */
    // TODO: remove french time conversion later
    const data: TWeekOpeningHours = {
      [DaysOfWeek.MONDAY    ]:  TimeRange.of(this.convertTimeFromFrenchTZToUTC(this.MONDAY.begin), this.convertTimeFromFrenchTZToUTC(this.MONDAY.end)),
      [DaysOfWeek.TUESDAY   ]:  TimeRange.of(this.convertTimeFromFrenchTZToUTC(this.TUESDAY.begin), this.convertTimeFromFrenchTZToUTC(this.TUESDAY.end)),
      [DaysOfWeek.WEDNESDAY ]:  TimeRange.of(this.convertTimeFromFrenchTZToUTC(this.WEDNESDAY.begin), this.convertTimeFromFrenchTZToUTC(this.WEDNESDAY.end)),
      [DaysOfWeek.THURSDAY  ]:  TimeRange.of(this.convertTimeFromFrenchTZToUTC(this.THURSDAY.begin), this.convertTimeFromFrenchTZToUTC(this.THURSDAY.end)),
      [DaysOfWeek.FRIDAY    ]:  TimeRange.of(this.convertTimeFromFrenchTZToUTC(this.FRIDAY.begin), this.convertTimeFromFrenchTZToUTC(this.FRIDAY.end)),
      [DaysOfWeek.SATURDAY  ]:  TimeRange.of(this.convertTimeFromFrenchTZToUTC(this.SATURDAY.begin), this.convertTimeFromFrenchTZToUTC(this.SATURDAY.end)),
      [DaysOfWeek.SUNDAY    ]:  TimeRange.of(this.convertTimeFromFrenchTZToUTC(this.SUNDAY.begin), this.convertTimeFromFrenchTZToUTC(this.SUNDAY.end))
    }
    /* eslint-enable prettier/prettier */

    openingHours.setDaysOfWeekOpeningHours(data)

    return openingHours
  }

  private convertTimeFromFrenchTZToUTC(time: string): string {
    const [frenchHours, minutes]: [number, string] = time.split(':').map((value, index) => (index === 0 ? parseInt(value) : value)) as [
      number,
      string
    ]

    const utcHours = frenchHours - 2 > 0 ? frenchHours - 2 : 0
    const formattedHours = utcHours < 10 ? '0' + utcHours : utcHours

    return `${formattedHours}:${minutes}`
  }
}
