import { BoxCategories } from '@/common/enums/schemas'
import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, Length, ValidateNested } from 'class-validator'
import { FormulaDTO } from './pojos/formula.dto'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateCenterFormulasRequest {
  @ApiProperty({ example: '60f6b5c0e0a3f3a8e8a6e4d0', description: 'ID du centre', required: true })
  @IsNotEmpty({ message: "L'ID du centre est requis" })
  @Length(20, 30, { message: "L'ID du centre doit faire entre 2 et 30 caractères " })
  centerId: string

  @ApiProperty({ enum: BoxCategories, description: 'Catégorie de boxe', required: true })
  @IsNotEmpty({ message: 'La catégorie de boxe est requise' })
  @Length(2, 50, { message: 'La catégorie de boxe doit faire entre 2 et 30 caractères ' })
  @IsEnum(BoxCategories, { message: 'Vous devez indiquer une catégorie valide' })
  boxCategory: BoxCategories

  @ApiProperty({ type: () => [FormulaDTO], description: 'Formules proposées par le centre', required: true, isArray: true })
  @IsNotEmpty({ message: 'Les formules sont requise' })
  @ValidateNested({ each: true })
  @Type(() => FormulaDTO)
  formulas: FormulaDTO[]
}
