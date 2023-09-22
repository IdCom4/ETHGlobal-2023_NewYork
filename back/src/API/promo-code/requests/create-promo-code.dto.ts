import { ParseStringDate } from '@/common/class-operations/validators'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsPositive, Max, ValidateNested } from 'class-validator'
import { ContactInfoDTO } from './pojos'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePromoCodeRequest {
  @ApiProperty({ example: 'PROMO-2023', description: 'Code promotionnel', required: true })
  @IsNotEmpty({ message: 'Le label du code promotionnel est requis' })
  label: string

  @ApiProperty({ type: () => ContactInfoDTO, description: 'Bénéficiaire du code promotionnel', required: true })
  @IsNotEmpty({ message: 'Les coordonnées du bénéficiaire du code promotionnel sont requises' })
  @ValidateNested()
  @Type(() => ContactInfoDTO)
  beneficiary: ContactInfoDTO

  @ApiProperty({ example: '01/01/2021 00:00', description: 'Début de période de validité du code promotionnel', required: true })
  @IsNotEmpty({ message: 'Le début de période de validité du code promotionnel est requise' })
  @ParseStringDate('dd/MM/yyyy HH:mm', { message: 'Les début et fin de période de validité doivent être une date' })
  from: Date

  @ApiProperty({ example: '01/01/2021 00:00', description: 'Fin de période de validité du code promotionnel', required: true })
  @IsNotEmpty({ message: 'La fin de période validité du code promotionnel est requise' })
  @ParseStringDate('dd/MM/yyyy HH:mm', { message: 'Les début et fin de période de validité doivent être une date' })
  to: Date

  @ApiProperty({ example: 10, description: 'Pourcentage de réduction du code promotionnel', required: true })
  @IsNotEmpty({ message: 'Le pourcentage de réduction du code promotionnel est requis' })
  @IsPositive({ message: 'Le pourcentage de réduction doit être un nombre positif' })
  @Max(100, { message: 'Le pourcentage de réduction ne peut pas excéder 100%' })
  reductionPercentage: number

  @ApiProperty({ example: 10, description: 'Commission du bénéficiaire du code promotionnel', required: true })
  @IsNotEmpty({ message: 'La commission du bénéficiaire du code promotionnel est requis' })
  @IsPositive({ message: 'La commission du bénéficiaire doit être un nombre positif' })
  @Max(100, { message: 'La commission du bénéficiaire ne peut pas excéder 100%' })
  beneficiaryCommissionPercentage: number
}
