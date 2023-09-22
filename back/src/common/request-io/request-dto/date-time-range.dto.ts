import { ParseStringDate } from '@/common/class-operations/validators'
import { DateTimeRange } from '@/schemas/common/pojos'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { FlexibleDateTimeRange } from '@Schemas/common/pojos/date/flexible-date-time-range'

export class DateTimeRangeDTO {
  @IsNotEmpty()
  @ParseStringDate('dd/MM/yyyy HH:mm', { message: 'Vous devez donner une date valide' })
  begin!: Date

  @IsNotEmpty()
  @ParseStringDate('dd/MM/yyyy HH:mm', { message: 'Vous devez donner une date valide' })
  end!: Date

  public toDateTimeRange(): DateTimeRange {
    return DateTimeRange.of(this.begin, this.end)
  }
}

export class FlexibleDateTimeRangeDTO {
  @IsNotEmpty()
  @ParseStringDate('dd/MM/yyyy HH:mm', { message: 'Vous devez donner une date valide' })
  begin!: Date

  @IsOptional()
  @IsNotEmpty()
  @ParseStringDate('dd/MM/yyyy HH:mm', { message: 'Vous devez donner une date valide' })
  end?: Date

  public toFlexibleDateTimeRange(): FlexibleDateTimeRange {
    return FlexibleDateTimeRange.of(this.begin, this.end)
  }
}
