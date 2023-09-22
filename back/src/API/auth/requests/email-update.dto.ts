import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'

export class EmailUpdateRequest {
  @ApiProperty({ description: "Adresse mail actuel de l'utilisateur", example: 'john@doe.fr', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner votre adresse mail' })
  @Length(1, 100, { message: "L'adresse email actuel ne peut dépasser 100 caractères" })
  currentEmail: string

  @ApiProperty({ description: "Nouvelle adresse mail de l'utilisateur", example: 'doe@john.fr', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner votre nouvelle adresse mail' })
  @Length(7, 100, { message: 'La nouvelle adresse email doit faire entre 7 et 100 caractères' })
  @IsEmail(undefined, { message: 'Vous devez renseigner une nouvelle adresse email valide' })
  newEmail: string

  @ApiProperty({ description: 'Mot de passe actuel', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner votre mot de passe actuel' })
  @Length(1, 100, { message: 'Le mot de passe ne peut dépasser 100 caractères' })
  password: string
}
