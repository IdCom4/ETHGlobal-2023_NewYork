import { IsNotEmpty, Length } from 'class-validator'

export class TimeRangeDTO {
  @IsNotEmpty()
  @Length(5, 5, { message: 'Le format des limites de temps est "HH:mm"' })
  begin!: string

  @IsNotEmpty()
  @Length(5, 5, { message: 'Le format des limites de temps est "HH:mm"' })
  end!: string
}
