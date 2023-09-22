import { BoxCategories } from '@/common/enums/schemas'
import { IsEnum, IsOptional, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateBoxRequest {
  @ApiProperty({ example: 'Boxe', description: 'Nom du boxe', required: false })
  @IsOptional()
  @Length(2, 50, { message: 'Le nom du boxe doit faire entre 2 et 50 caractères' })
  name?: string

  @ApiProperty({ example: 'Un boxe de test', description: 'Description du boxe', required: false })
  @IsOptional()
  @Length(10, 500, { message: 'La description du boxe doit faire entre 10 et 500 caractères' })
  description?: string

  @ApiProperty({ enum: BoxCategories, example: BoxCategories.DETAILINGBOX, description: 'Catégorie du boxe', required: false })
  @IsOptional()
  @Length(2, 50, { message: 'La catégorie du boxe doit faire entre 2 et 50 caractères' })
  @IsEnum(BoxCategories, { message: 'Vous devez indiquer une catégorie valide' })
  category?: BoxCategories

  @ApiProperty({ example: true, description: 'Défini si le box est disponible', default: true, required: false })
  @IsOptional()
  isAvailable?: boolean = true
}
