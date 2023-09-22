import { ArrayMaxSize, IsNotEmpty, ValidateNested } from 'class-validator'
import { Fields } from '@/API/professionals/requests/update-professional-profile/pojos.dto'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProfessionalProfileRequest {
  @ApiProperty({ example: ['firstName', 'lastName', 'phoneNumber'], description: 'Champs à mettre à jour', required: true })
  @IsNotEmpty()
  @ArrayMaxSize(50)
  fieldsToUpdate!: (keyof Fields)[]

  @ApiProperty({ type: () => Fields, description: 'Valeur des champs à mettre à jour', required: true })
  @IsNotEmpty()
  @Type(() => Fields)
  @ValidateNested()
  fields!: Fields
}
