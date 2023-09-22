import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsPositive, Length, Matches, Max } from 'class-validator'
import { IsMongooseId } from '@Common/class-operations/validators/mongoose-id.validator'

export class UpdateVehicleRequest {
  @ApiProperty({ example: 'AB-123-CD', description: "Plaque d'immatriculation", required: true })
  @IsOptional()
  @Matches(/^[A-Z]{2}-\d{3}-[A-Z]{2}|\d{4}-[A-Z]{2}-\d{2}$/, { message: "Le format de la plaque d'immatriculation est invalide. Exemple: AB-123-CD" })
  plate?: string

  @ApiProperty({ example: 125562, description: 'Kilométrage du véhicule', required: true })
  @IsOptional()
  @IsPositive({ message: 'Le kilométrage du véhicule doit être un nombre positif' })
  mileage?: number

  @ApiProperty({ example: '208', description: 'Marque de la voiture', required: true })
  @IsOptional()
  @Length(1, 50, { message: 'Le modèle de la voiture doit être compris entre 1 et 50 caractères' })
  model?: string

  @ApiProperty({ description: 'Marque de la voiture', required: true })
  @IsOptional()
  @IsNotEmpty({ message: "L'id correspondant à la marque de la voiture est requise" })
  @IsMongooseId({ message: "L'id correspondant à la marque de la voiture est invalide" })
  brandId?: string

  @ApiProperty({ example: '2015', description: 'Année de construction de la voiture', required: true })
  @IsOptional()
  @IsPositive({ message: "L'année de construction de la voiture doit être un nombre positif" })
  @IsNotEmpty({ message: "L'année de construction de la voiture est requise" })
  @Max(new Date().getFullYear(), { message: "L'année de construction de la voiture ne peut pas être supérieure à l'année courante" })
  year?: number
}
