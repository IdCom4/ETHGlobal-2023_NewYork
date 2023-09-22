import { PaymentStatuses } from '@/common/enums'
import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateBookingAdminRequest {
  @ApiProperty({ example: '63500f1e8c898769c67a6a51', description: "L'ID de la réservation", required: true })
  @IsNotEmpty({ message: "L'ID de la réservation est requis" })
  @Length(2, 50, { message: "L'object de la réservation doit faire entre 2 et 50 caractères" })
  bookingId: string

  @ApiProperty({ enum: PaymentStatuses, example: PaymentStatuses.PAID, description: 'Le statut du paiement', required: true })
  @IsNotEmpty({ message: 'Le statut du paiement est requis' })
  @Length(2, 50, { message: 'Le statut du paiement doit faire entre 2 et 50 caractères' })
  @IsEnum(PaymentStatuses, { message: `Le statut du paiement doit être valide. (valeurs autorisées: ${Object.keys(PaymentStatuses).join(' | ')})` })
  paymentStatus: PaymentStatuses

  @ApiProperty({ example: 'Changer les plaquettes de frein', description: 'Le but de la réservation', required: false })
  @IsOptional()
  @Length(2, 1000, { message: "L'objet de la réservation doit faire entre 2 et 1000 caractères" })
  goal?: string

  @ApiProperty({ description: "Commentaire optionnel de l`'équipe", required: false })
  @IsOptional()
  @Length(2, 1000, { message: "Le commentaire de l'équipe doit faire entre 2 et 1000 caractères" })
  teamComment?: string
}
