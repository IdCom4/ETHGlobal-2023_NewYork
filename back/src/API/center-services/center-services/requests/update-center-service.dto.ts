import { BoxCategories } from '@Common/enums/schemas/box.schema.enum'
import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsPositive, Length, ValidateNested } from 'class-validator'
import { PricesByVehicleTypeDTO } from '@Common/request-io/request-dto/prices-by-vehicle-type.dto'
import { IsBase64File } from '@Common/class-operations/validators/base64-file.validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateCenterServiceRequest {
  @ApiProperty({ example: 'Boxe', description: 'Nom du boxe', required: true })
  @IsNotEmpty({ message: 'Le nom du service est requis' })
  @Length(2, 50, { message: 'Le titre doit faire entre 2 et 50 caractères' })
  title!: string

  @ApiProperty({ example: 'Un boxe de test', description: 'Sous titre du boxe', required: true })
  @IsNotEmpty({ message: 'Le sous titre du service est requis' })
  @Length(2, 50, { message: 'Le sous-titre doit faire entre 2 et 50 caractères' })
  subtitle!: string

  @ApiProperty({ type: [String], description: 'Liste des ids des options du service', required: true })
  @IsDefined({ message: 'La liste des options ne peut être indéfinie' })
  optionIds!: string[]

  @ApiProperty({ enum: BoxCategories, example: BoxCategories.DETAILINGBOX, description: 'Catégorie du service', required: true })
  @IsEnum(BoxCategories, { each: true })
  categories!: BoxCategories[]

  @ApiProperty({ example: 'Un service de test', description: 'Description du service', required: true })
  @IsNotEmpty({ message: 'La description du service est requise' })
  @Length(2, 500, { message: 'La description doit faire entre 2 et 500 caractères' })
  description!: string

  @ApiProperty({ example: 10, description: 'Nombre de ventes du service', required: true })
  @IsPositive({ message: 'Le nombre de ventes ne peut être négatif' })
  numberOfSales!: number

  @ApiProperty({ description: 'Défini si le service est actif', required: true })
  @IsDefined({ message: 'Vous devez spécifier si le service est actif' })
  isActive!: boolean

  @ApiProperty({ description: 'Image du service sous format base 64', required: false })
  @IsOptional()
  @IsBase64File({ message: "Le format de l'image envoyé est incorrect" })
  picture?: TBase64File

  @ApiProperty({ type: () => PricesByVehicleTypeDTO, description: 'Prix du service par type de véhicule', required: true })
  @IsDefined({ message: 'Les prix doivent être définis' })
  @ValidateNested()
  @Type(() => PricesByVehicleTypeDTO)
  prices!: PricesByVehicleTypeDTO
}
