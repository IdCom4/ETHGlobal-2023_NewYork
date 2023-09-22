import { IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ParseStringDate } from '@/common/class-operations/validators'

export class AccountUpdateRequest {
  @ApiProperty({ description: "L'IBAN du professionnel afin qu'il puisse recevoir des virements", required: false })
  @IsOptional()
  iban?: string

  @ApiProperty({ example: '01/01/2000', description: "Date de naissance de l'utilisateur", required: false })
  @IsOptional()
  @ParseStringDate('dd/MM/yyyy', { message: 'Vous devez donner une date valide' })
  birthday?: Date

  @ApiProperty({ description: "Le account token créé par stripe afin d'enregistrer le nouvel utilisateur auprès de stripe", required: false })
  @IsOptional()
  accountToken?: string

  @ApiProperty({ description: "Une image représentant le coté recto d'un document d'identité valide", required: false })
  @IsOptional()
  identityDocumentRecto?: TBase64File

  @ApiProperty({ description: "Une image représentant le coté verso d'un document d'identité valide", required: false })
  @IsOptional()
  identityDocumentVerso?: TBase64File
}
