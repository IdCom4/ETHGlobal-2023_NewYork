import { ReviewDTO } from '@/common/request-io/request-dto'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'

export class ValidateMissionRequest {
  @IsOptional()
  @Type(() => ReviewDTO)
  @ValidateNested()
  reviewOfProfessional?: ReviewDTO

  @IsOptional()
  @Type(() => ReviewDTO)
  @ValidateNested()
  reviewOfWebsite?: ReviewDTO
}
