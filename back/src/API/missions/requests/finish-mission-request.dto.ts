import { IsMongoId, IsNotEmpty, IsOptional, Length, Min } from 'class-validator'

export class FinishMissionRequest {
  @IsNotEmpty({ message: 'Vous devez préciser le kilométrage du véhicule à la fin de la mission' })
  @Min(0, { message: 'Le kilométrage du véhicule ne peut pas être inférieur à 0' })
  vehicleMileage: number

  @IsOptional()
  @IsMongoId({ message: 'Les Ids des intervention doivent être au format Id valide', each: true })
  interventionIds: string[] = []

  @IsOptional()
  @Length(2, 150, { message: 'Les intervention renseignées manuellement doivent faire entre 2 et 150 caractères', each: true })
  otherInterventions: string[] = []
}
