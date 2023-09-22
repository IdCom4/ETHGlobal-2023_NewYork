import { BoxCategories } from '@/common/enums/schemas'
import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateBoxRequest {
  @ApiProperty({ example: 'Boxe', description: 'Nom du boxe', required: true })
  @IsNotEmpty({ message: 'Le nom du boxe est requis' })
  @Length(2, 50, { message: 'Le nom du boxe doit faire entre 2 et 50 caractères' })
  name: string

  @ApiProperty({ example: 'Un boxe de test', description: 'Description du boxe', required: true })
  @IsNotEmpty({ message: 'La description du boxe est requise' })
  @Length(10, 500, { message: 'La description du boxe doit faire entre 10 et 500 caractères' })
  description: string

  @ApiProperty({ example: '63500f1e8c898769c67a6a51', description: 'ID du centre auquel appartient le boxe', required: true })
  @IsNotEmpty({ message: "L'ID du centre auquel appartient le boxe est requis" })
  @Length(24, 24, { message: "L'ID du centre auquel appartient le boxe doit faire entre 2 et 50 caractères" })
  centerId: string

  @ApiProperty({ enum: BoxCategories, example: BoxCategories.DETAILINGBOX, description: 'Catégorie du boxe', required: true })
  @IsNotEmpty({ message: 'La catégorie du boxe est requise' })
  @IsEnum(BoxCategories, { message: 'Vous devez indiquer une catégorie valide' })
  category: BoxCategories

  @ApiProperty({ example: true, description: 'Défini si le box est disponible', default: true, required: true })
  @IsOptional()
  isAvailable = true
}
