import { StrictAddressDTO } from '@/common/request-io/request-dto/address.dto'
import { WeekOpeningHoursDTO } from '@/common/request-io/request-dto/week-opening-hours.dto'
import { Type } from 'class-transformer'
import { IsOptional, Length, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateCenterRequest {
  @ApiProperty({ example: 'Centre de lavage de la rue de la soif', description: 'Nom du centre', required: false })
  @IsOptional()
  @Length(2, 50, { message: 'Le nom du centre doit faire entre 2 et 50 caractères' })
  name?: string

  @ApiProperty({ type: () => StrictAddressDTO, description: 'Adresse du centre', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => StrictAddressDTO)
  location?: StrictAddressDTO

  @ApiProperty({ type: () => WeekOpeningHoursDTO, description: "Horaires d'ouverture du centre", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => WeekOpeningHoursDTO)
  openingHours?: WeekOpeningHoursDTO
}
