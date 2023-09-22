import { ParseStringDate } from '@/common/class-operations/validators'
import { BookingTypes, PaymentStatuses } from '@/common/enums'
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, Length, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateBookingAdminRequest {
  /* BOX DATA */
  @ApiProperty({ enum: BookingTypes, example: BookingTypes.PHONE, description: 'Le type de réservation', required: true })
  @IsNotEmpty({ message: 'Le type de réservation est requis' })
  @IsEnum(BookingTypes, { message: `Le type de réservation doit être valide. (valeurs autorisées: ${Object.keys(BookingTypes).join(' | ')})` })
  @Length(2, 50, { message: 'Le type de réservation doit faire entre 2 et 50 caractères' })
  bookingType: BookingTypes

  @ApiProperty({ example: '63500f1e8c898769c67a6a51', description: "L'ID du boxe", required: true })
  @IsNotEmpty({ message: "L'ID du boxe est requis" })
  @Length(2, 50, { message: "L'ID du boxe doit faire entre 2 et 50 caractères" })
  boxId: string

  /* BOOKER DATA */
  @ApiProperty({ example: 'John', description: 'Le nom du client', required: true })
  @IsNotEmpty({ message: 'Le nom du client est requis' })
  @Length(2, 50, { message: 'Le nom du client doit faire entre 2 et 50 caractères' })
  bookerName: string

  @ApiProperty({ example: 'Doe', description: 'Le nom de famille du client', required: true })
  @IsNotEmpty({ message: 'Le nom de famille du client est requis' })
  @Length(2, 50, { message: 'Le nom de famille du client doit faire entre 2 et 50 caractères' })
  bookerLastName: string

  @ApiProperty({ example: 'John Doe', description: 'Le nom de facturation du client', required: false })
  @IsOptional()
  @Length(2, 50, { message: 'Le nom de facturation doit faire entre 2 et 50 caractères' })
  bookerBillingName?: string

  @ApiProperty({ example: '0612345678', description: 'Le numéro de téléphone du client', required: true })
  @IsNotEmpty({ message: 'Le numéro de téléphone du client est requis' })
  @Length(6, 15, { message: 'Le numéro de téléphone du client doit faire entre 2 et 50 caractères' })
  bookerPhone: string

  @ApiProperty({ example: 'john@doe.fr', description: "L'adresse email du client", required: false })
  @IsOptional()
  @IsEmail(undefined, { message: "L'adresse email du client doit être valide" })
  @Length(2, 50, { message: "L'adresse email du client doit faire entre 2 et 50 caractères" })
  bookerEmail?: string

  /* BOOKING DATA */
  @ApiProperty({ example: '19/09/1999 05:30', description: 'Le début de la réservation', required: true })
  @IsNotEmpty({ message: 'Le début de la réservation est requis' })
  @ParseStringDate('dd/MM/yyyy HH:mm', { message: 'Le début de la réservation doit être valide' })
  from: Date

  @ApiProperty({ example: '19/09/1999 06:30', description: 'La fin de la réservation', required: true })
  @IsNotEmpty({ message: 'La fin de la réservation est requis' })
  @ParseStringDate('dd/MM/yyyy HH:mm', { message: 'La fin de la réservation doit être valide' })
  to: Date

  @ApiProperty({ example: 'Changer les plaquettes de frein', description: 'Le but de la réservation', required: false })
  @IsOptional()
  @Length(2, 1000, { message: 'Le but de réservation doit faire entre 2 et 50 caractères' })
  bookingGoal?: string

  @ApiProperty({ example: true, description: 'Si le client a besoin de conseils', required: true })
  @IsOptional()
  @IsBoolean()
  needAdvices = false

  @ApiProperty({ example: '19/09/1999 05:30', description: 'La date de création de la réservation', required: true })
  @IsOptional()
  @Min(0.5, { message: 'Le prix de la réservation doit être égal ou supérieur à 0,5€' })
  priceTTC = 0.5

  /* IF BOOKING IS A SERVICE */
  @ApiProperty({ example: true, description: 'Si la réservation est un service rendu par ValueMyCar', required: true })
  @IsOptional()
  @IsBoolean()
  vmcService = false

  @ApiProperty({ example: '63500f1e8c898769c67a6a51', description: "L'ID de l'agent VMC", required: false })
  @IsOptional()
  @Length(2, 50, { message: "L'ID de l'agent VMC doit faire entre 2 et 50 caractères" })
  vmcWorkerId?: string

  @ApiProperty({ enum: PaymentStatuses, example: PaymentStatuses.PAID, description: 'Le statut du paiement', required: true })
  @IsNotEmpty({ message: 'Le statut du paiement est requis' })
  @Length(2, 50, { message: 'Le statut du paiement doit faire entre 2 et 50 caractères' })
  @IsEnum(PaymentStatuses, { message: `Le statut du paiement doit être valide. (valeurs autorisées: ${Object.keys(PaymentStatuses).join(' | ')})` })
  paymentStatus: PaymentStatuses

  @ApiProperty({
    example: "C'était des plaquettes très sales !",
    description: "Un commentaire optionnel de l'équipe.",
    required: false,
  })
  @IsOptional()
  @Length(2, 1000, { message: "Le commentaire de l'équipe doit faire entre 2 et 1000 caractères" })
  teamComment?: string
}
