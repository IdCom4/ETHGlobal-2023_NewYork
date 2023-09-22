import { FormulaDTO } from '@/API/centers/requests/pojos/formula.dto'
import { ParseStringDate } from '@/common/class-operations/validators'
import { BoxCategories } from '@/common/enums'
import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, Length, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateBookingUserRequest {
  @ApiProperty({ example: '63500f1e8c898769c67a6a51', description: "L'ID de la carte de paiement", required: false })
  @IsOptional()
  creditCardId?: string

  @ApiProperty({ example: '63500f1e8c898769c67a6a51', description: "L'ID du centre", required: true })
  @IsNotEmpty({ message: "L'ID du centre est requis" })
  @Length(2, 50, { message: "L'ID du centre doit faire entre 2 et 50 caractères" })
  centerId: string

  @ApiProperty({ example: '63500f1e8c898769c67a6a51', description: "L'ID de la boxe", required: true })
  @IsNotEmpty({ message: 'La catégorie de boxe souhaitée est requise' })
  @IsEnum(BoxCategories, { message: `La catégorie de boxe doit être valide. (valeurs autorisées: ${Object.keys(BoxCategories).join(' | ')})` })
  @Length(2, 50, { message: 'La catégorie doit faire entre 2 et 50 caractères' })
  boxCategory: BoxCategories

  @ApiProperty({ example: '12/12/2021', description: 'Le jour souhaité', required: true })
  @IsNotEmpty({ message: 'Le jour souhaité est requis' })
  @ParseStringDate('dd/MM/yyyy', { message: 'Le jour souhaité doit être une date valide' })
  startingDay: Date

  @ApiProperty({ example: '12:00', description: "L'heure de début souhaitée", required: true })
  @IsNotEmpty({ message: "L'heure souhaitée est requise" })
  @Length(5, 5, { message: "L'heure souhaitée doit être au format: HH:mm" })
  beginHour: string // "HH:mm" format

  @ApiProperty({ type: () => FormulaDTO, description: 'La formule souhaitée', required: true })
  @IsNotEmpty({ message: 'La formule souhaitée est requise' })
  @ValidateNested()
  @Type(() => FormulaDTO)
  formula: FormulaDTO

  @ApiProperty({ example: 'CODE2023', description: 'Le code promotionnel optionnel', required: false })
  @IsOptional()
  @Length(2, 50, { message: 'Le code promotionnel doit faire entre 2 et 50 caractères' })
  promoCodeLabel?: string
}
