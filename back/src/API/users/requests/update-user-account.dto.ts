import { IsEnum, IsOptional, IsPhoneNumber, Length, ValidateNested } from 'class-validator'
import { IsBase64File } from '@Common/class-operations/validators/base64-file.validator'
import { LenientAddressDTO, StrictAddressDTO } from '@Common/request-io/request-dto/address.dto'
import { Sex } from '@/common/enums/schemas'
import { Type } from 'class-transformer'
import { ParseStringDate } from '@/common/class-operations/validators'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserAccountRequest {
  @ApiProperty({ example: 'John', description: "Prénom de l'utilisateur", required: false })
  @IsOptional()
  @Length(2, 50, { message: 'Le prénom doit faire entre 2 et 50 caractères' })
  name?: string

  @ApiProperty({ example: 'Doe', description: "Nom de famille de l'utilisateur", required: false })
  @IsOptional()
  @Length(2, 50, { message: 'Le nom de famille doit faire entre 2 et 50 caractères' })
  lastName?: string

  @ApiProperty({ example: '0600000000', description: "Numéro de téléphone de l'utilisateur", required: false })
  @IsOptional()
  @IsPhoneNumber('FR', { message: 'Vous devez renseigner un numéro de téléphone valide' })
  phone?: string

  @ApiProperty({ enum: Sex, description: "Sexe de l'utilisateur", required: false })
  @IsOptional()
  @IsEnum(Sex, { message: 'Vous devez indiquer un sexe valide' })
  sex?: Sex

  @ApiProperty({ example: '01/01/2000', description: "Date de naissance de l'utilisateur", required: false })
  @IsOptional()
  @ParseStringDate('dd/MM/yyyy', { message: 'Vous devez donner une date valide' })
  birthday?: Date

  @ApiProperty({ description: "Photo de profil de l'utilisateur", required: false })
  @IsOptional()
  @IsBase64File({ message: 'Vous devez donner un fichier valide' })
  picture?: TBase64File

  @ApiProperty({ type: () => LenientAddressDTO, description: "Adresse de facturation de l'utilisateur", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LenientAddressDTO)
  billingAddress?: LenientAddressDTO

  @ApiProperty({ type: () => StrictAddressDTO, description: "Adresse de l'utilisateur", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => StrictAddressDTO)
  homeAddress?: StrictAddressDTO
}
