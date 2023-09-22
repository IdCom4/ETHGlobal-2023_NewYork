import { IsNotEmpty, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PasswordRecoveryRequest {
  @ApiProperty({ description: 'Nouveau mot de passe', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner un mot de passe valide' })
  @Length(6, 50, { message: 'Le mot de passe doit faire entre 6 et 50 caractères' })
  newPassword: string

  @ApiProperty({ description: 'Confirmation du mot passe', required: true })
  @IsNotEmpty({ message: 'Vous devez confirmer votre mot de passe.' })
  confirmation: string
}

export class PasswordChangeRequest extends PasswordRecoveryRequest {
  @ApiProperty({ description: 'Mot de passe actuel', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner votre mot de passe actuel' })
  currentPassword: string
}
