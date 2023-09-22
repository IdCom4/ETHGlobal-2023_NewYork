import { BoxCategories } from '@Common/enums/schemas/box.schema.enum'
import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsPositive, Length, ValidateNested } from 'class-validator'
import { PricesByVehicleTypeDTO } from '@Common/request-io/request-dto/prices-by-vehicle-type.dto'
import { IsBase64File } from '@Common/class-operations/validators/base64-file.validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCenterServiceRequest {
  @ApiProperty({ example: 'Nettoyer les sièges', description: 'Titre du service', required: true })
  @IsNotEmpty({ message: 'Le nom du service est requis' })
  @Length(2, 50, { message: 'Le titre doit faire entre 2 et 50 caractères' })
  title!: string

  @ApiProperty({ example: "On va proprement nettoyer les sièges tout en s'amusant !", description: 'Sous-titre du service', required: true })
  @IsNotEmpty({ message: 'Le sous titre du service est requis' })
  @Length(2, 50, { message: 'Le sous-titre doit faire entre 2 et 50 caractères' })
  subtitle!: string

  @ApiProperty({ example: 'Un service de test', description: 'Description du service', required: true })
  @IsNotEmpty({ message: 'La description du service est requise' })
  @Length(2, 500, { message: 'La description doit faire entre 2 et 500 caractères' })
  description!: string

  @ApiProperty({ enum: BoxCategories, example: BoxCategories.DETAILINGBOX, description: 'Catégorie du service', required: true })
  @IsDefined({ message: 'Vous devez spécifier sur le service est actif' })
  isActive!: boolean

  @ApiProperty({ description: 'Image du service sous format base 64', required: true })
  @IsBase64File()
  picture!: TBase64File

  @ApiProperty({ type: () => PricesByVehicleTypeDTO, description: 'Prix du service par type de véhicule', required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PricesByVehicleTypeDTO)
  prices?: PricesByVehicleTypeDTO

  @ApiProperty({ type: [String], description: 'Liste des ids des options du service', required: false })
  @IsOptional()
  optionIds?: string[]

  @ApiProperty({ enum: BoxCategories, example: BoxCategories.DETAILINGBOX, description: 'Catégorie du service', required: false })
  @IsOptional()
  @IsEnum(BoxCategories, { each: true })
  categories?: BoxCategories[]

  @ApiProperty({ example: 10, description: 'Nombre de ventes du service', required: false })
  @IsOptional()
  @IsPositive({ message: 'Le nombre de ventes doit être un chiffre positif' })
  numberOfSales?: number
}
