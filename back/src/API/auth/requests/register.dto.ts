import { Type } from 'class-transformer'
import { IsEmail, IsPhoneNumber, IsNotEmpty, Length, IsOptional, ValidateNested, IsNotEmptyObject, Matches } from 'class-validator'
import { RegisterProfessionalData } from './pojos'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterRequest {
  @ApiProperty({ example: 'John', description: 'Prénom', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner votre prénom' })
  @Length(2, 50, { message: 'Le prénom doit faire entre 2 et 50 caractères' })
  name: string

  @ApiProperty({ example: 'Doe', description: 'Nom de famille', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner votre nom de famille' })
  @Length(2, 50, { message: 'Le nom de famille doit faire entre 2 et 50 caractères' })
  lastName: string

  @ApiProperty({ example: '0600000000', description: 'Numéro de téléphone', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner une numéro de téléphone' })
  @IsPhoneNumber('FR', { message: 'Vous devez renseigner un numéro de téléphone valide' })
  phone: string

  @ApiProperty({ example: 'john@doe.fr', description: 'Adresse email', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner une adresse email' })
  @Length(7, 100, { message: "L'adresse email doit faire entre 7 et 100 caractères" })
  @IsEmail(undefined, { message: 'Vous devez renseigner une adresse email valide' })
  email: string

  @ApiProperty({ example: 'password', description: 'Mot de passe', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner un mot de passe valide' })
  @Length(6, 50, { message: 'Le mot de passe doit faire entre 6 et 50 caractères' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/, {
    message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
  })
  password: string

  @ApiProperty({ description: "Défini si l'utilisateur est un professionnel ou non avec les données initiales", required: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => RegisterProfessionalData)
  @IsNotEmptyObject({}, { message: "L'adresse de travail doit être renseignée" })
  professionalData?: RegisterProfessionalData

  @ApiProperty({ description: "Le account token créé par stripe afin d'enregistrer le nouvel utilisateur auprès de stripe", required: true })
  @IsNotEmpty({ message: 'Le token de compte stripe est requis' })
  accountToken: string
}
