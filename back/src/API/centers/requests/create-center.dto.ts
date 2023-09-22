import { StrictAddressDTO } from '@/common/request-io/request-dto/address.dto'
import { Type } from 'class-transformer'
import { IsNotEmpty, Length, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCenterRequest {
  @ApiProperty({ example: 'Centre de lavage de la rue de la soif', description: 'Nom du centre', required: true })
  @IsNotEmpty({ message: 'Le nom du centre est requis' })
  @Length(2, 50, { message: 'Le nom du centre doit faire entre 2 et 50 caractères' })
  name: string

  @ApiProperty({ type: () => StrictAddressDTO, description: 'Adresse du centre', required: true })
  @IsNotEmpty({ message: "L'adresse du centre est requise" })
  @ValidateNested()
  @Type(() => StrictAddressDTO)
  location: StrictAddressDTO
}
