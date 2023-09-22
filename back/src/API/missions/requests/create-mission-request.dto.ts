import { IsBase64File } from '@/common/class-operations/validators'
import { StrictAddressDTO } from '@/common/request-io/request-dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayMinSize, IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsPositive, Length, ValidateNested } from 'class-validator'

export class CreateMissionRequest {
  @ApiProperty({ example: '63500f1e8c898769c67a6a45', description: 'ID du véhicule concerné par la mission', required: true })
  @IsNotEmpty({ message: "L'id du véhicule est requise" })
  @IsMongoId({ message: "L'id du véhicule a un format invalide" })
  vehicleId: string

  @ApiProperty({ example: '["63500f1e8c898769c67a6a45"]', description: "IDs des problèmes rencontrés par l'automobiliste", required: true })
  @IsNotEmpty({ message: 'La liste des problèmes rencontrés est requise' })
  @ArrayMinSize(1, { message: 'Vous devez préciser au moins 1 problème' })
  @IsMongoId({ message: 'Les issueIds ne doivent inclure que des strings, au format ID', each: true })
  issueIds: string[]

  @ApiProperty({ example: 'Ma voiture ne démarre plus', description: 'La description plus précise de la situation', required: true })
  @IsNotEmpty({ message: 'La description de la situation est requise' })
  @Length(2, 10000, { message: 'La description de la situation doit faire entre 2 et 10 000 caractères' })
  description: string

  @ApiProperty({
    example: 'Les soirs après 18h',
    description: 'Une phrase indiquant les moments les plus arrangeant pour que le spécialiste vienne prendre en charge le véhicule',
    required: true,
  })
  @IsNotEmpty({ message: 'Le moment idéal de récupération du véhicule est requis' })
  @Length(2, 150, { message: 'Le moment idéal de récupération du véhicule doit faire entre 2 et 150 caractères' })
  idealStartingMoment: string

  @ApiProperty({
    example: '{ street: "7 rue Arnaud", city: "Paris", zipCode: "75001", coordinates: [1, 2] }',
    description: 'La localisation idéale de prise en charge du véhicule par le spécialiste',
    required: true,
  })
  @IsNotEmpty({ message: 'Le lieu idéal de récupération du véhicule est requis' })
  @Type(() => StrictAddressDTO)
  @ValidateNested()
  idealPickupAddress: StrictAddressDTO

  @ApiProperty({ example: '20', description: 'La distance maximum prête à être parcouru par le spécialiste', required: true })
  @IsNotEmpty({ message: 'La distance maximum que vous êtes prêt à parcourir est requise' })
  @IsPositive({ message: 'La distance maximum que vous êtes prêt à parcourir doit être supérieur ou égal à 0' })
  maxDistance: number

  @ApiProperty({
    example: 'true',
    description: "Une valeur indiquant si l'automobiliste possède déjà des pièces nécessaires à la réalisation de la mission",
    required: true,
  })
  @IsNotEmpty({ message: 'Vous devez préciser si vous possédez déjà des pièces nécessaires à la mission ou non' })
  @IsBoolean({ message: 'Le fait que vous possédiez ou non des pièces nécessaires à la mission doit être un boolean' })
  hasSpareParts: boolean

  @ApiProperty({
    example: '["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAA"]',
    description: 'Une liste de fichiers au format base64',
    required: false,
  })
  @IsOptional()
  @IsBase64File({ message: 'Les fichiers doivent être au format base64' })
  attachments?: string[]
}
