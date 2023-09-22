import { IsMongooseId } from '@Common/class-operations/validators/mongoose-id.validator'
import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator'
import { IsBase64File, ParseStringDate } from '@Common/class-operations/validators'
import { ApiProperty } from '@nestjs/swagger'

export class CreateVehicleInvoiceRequest {
  @ApiProperty({ description: 'Identifiant des intervention relatés par la facture.', example: "['912a5b3f6c9e0d401f8e7d2c']", required: false })
  @IsOptional()
  @IsMongooseId({ message: 'Les ids des intervention sont invalides', each: true })
  interventionIds?: Array<string>

  @ApiProperty({
    description: 'Liste des interventions non trouvées en base de donnée.',
    example: 'Installation du Système de Propulsion Turbo-Chocolat sur une Voiture',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: "L'intervention ne peut être vide", each: true })
  otherInterventions?: Array<string> // Interventions that are not in our database. Represented by labels.

  @ApiProperty({
    description: 'Fichier de la facture',
    example: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9GBTDwovU2l6ZSAxNjY+PgpzdGFydHhyZWYKNDkyOQolJUVPRgo=',
    required: true,
  })
  @IsBase64File({ message: 'Le fichier de facture est invalide' })
  invoiceFile: string

  @ApiProperty({ description: 'Montant total de la facture toutes taxes comprises', example: 120, required: true })
  @IsPositive({ message: 'Le montant total TTC doit être positif' })
  totalTTC: number

  @ApiProperty({ description: 'Id de la voiture liée à la facture', example: '912a5b3f6c9e0d401f8e7d2c', required: true })
  @IsMongooseId({ message: "L'id du véhicule est invalide" })
  vehicleId: string

  @ApiProperty({ description: 'Date de création de la facture', example: '11/05/2020 00:00', required: true })
  @ParseStringDate('dd/MM/yyyy HH:mm', { message: 'La date de facturation est invalide' })
  @IsOptional()
  madeAt: Date

  @ApiProperty({ description: 'Kilométrage du véhicule', example: 98000, required: true })
  @IsPositive({ message: 'Le kilométrage doit être positif' })
  vehicleMileage: number
}
