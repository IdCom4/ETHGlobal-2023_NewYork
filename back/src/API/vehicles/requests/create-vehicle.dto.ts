import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsPositive, Matches, Max } from 'class-validator'
import { IsMongooseId } from '@Common/class-operations/validators/mongoose-id.validator'

export class CreateVehicleRequest {
  @ApiProperty({ example: '208', description: 'Modèle de la voiture', required: true })
  @IsNotEmpty({ message: 'Le modèle de la voiture est requis' })
  model: string

  @ApiProperty({ description: 'Marque de la voiture', required: true })
  @IsNotEmpty({ message: "L'id correspondant à la marque de la voiture est requise" })
  @IsMongooseId({ message: "L'id correspondant à la marque de la voiture est invalide" })
  brandId: string

  @ApiProperty({ example: '2015', description: 'Année de construction de la voiture', required: true })
  @IsPositive({ message: "L'année de construction de la voiture doit être un nombre positif" })
  @IsNotEmpty({ message: "L'année de construction de la voiture est requise" })
  @Max(new Date().getFullYear(), { message: "L'année de construction de la voiture ne peut pas être supérieure à l'année courante" })
  year: number

  @ApiProperty({ example: 'AB-123-CD', description: "Plaque d'immatriculation. Formats requis: AB-123-CD, 1234-AB-56", required: true })
  @Matches(/^[A-Z]{2}-\d{3}-[A-Z]{2}|\d{4}-[A-Z]{2}-\d{2}$/, {
    message: "Le format de la plaque d'immatriculation est invalide. Exemples: AB-123-CD, 1234-AB-56",
  })
  plate: string

  @ApiProperty({ example: 125562, description: 'Kilométrage du véhicule', required: true })
  @IsPositive({ message: 'Le kilométrage du véhicule doit être un nombre positif' })
  mileage: number
}
