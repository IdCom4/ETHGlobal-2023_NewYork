import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class LoginRequest {
  @ApiProperty({ description: "Adresse mail de l'utilisateur", example: 'john@doe.fr', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner votre adresse mail' })
  @Length(1, 100, { message: "L'adresse email ne peut dépasser 100 caractères" })
  email: string

  @ApiProperty({ description: "Mot de passe de l'utilisateur", example: 'Mot2Passe', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner votre mot de passe' })
  @Length(1, 100, { message: 'Le mot de passe ne peut dépasser 100 caractères' })
  password: string
}
