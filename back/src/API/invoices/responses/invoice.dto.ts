import { AbstractBaseInvoice, BookingInvoice, ClientInvoice, MonthlyProfessionalInvoice, VehicleInvoice } from '@Schemas/invoice/invoice.schema'
import { ApiProperty } from '@nestjs/swagger'
import { InvoiceTypes } from '@Common/enums/schemas/invoice.schema.enum'

export abstract class AbstractBaseInvoiceResponse {
  _id: string

  @ApiProperty({ description: 'Montant total de la facture toutes taxes comprises', example: 120, required: true })
  totalTTC: number

  @ApiProperty({ description: 'Montant total de la facture hors taxes', example: 100, required: true })
  totalHT: number

  @ApiProperty({ description: 'Valeur de la TVA', example: 20, required: true })
  tva: number

  @ApiProperty({ description: 'Numéro de la facture', example: 0, required: true })
  invoiceNumber: number

  @ApiProperty({ description: 'Id du fichier lié à la facture.', example: InvoiceTypes.BOOKING, required: false, enum: InvoiceTypes })
  fileReferenceId?: string

  @ApiProperty({ description: 'Type de facture', example: InvoiceTypes.BOOKING, required: true, enum: InvoiceTypes })
  invoiceType: InvoiceTypes

  protected constructor(baseInvoice: AbstractBaseInvoice) {
    this._id = baseInvoice._id.toString()
    this.totalTTC = baseInvoice.totalTTC
    this.fileReferenceId = baseInvoice.fileReferenceId
    this.totalHT = baseInvoice.totalHT
    this.tva = baseInvoice.tva
    this.invoiceNumber = baseInvoice.invoiceNumber
    this.invoiceType = baseInvoice.invoiceType
  }
}

export abstract class ClientInvoiceResponse extends AbstractBaseInvoiceResponse {
  @ApiProperty({ description: 'Identifiant du client lié à la facture', example: '60f4a9d43b8a0c001f4a4f7c', required: true })
  clientId: string

  protected constructor(clientInvoice: ClientInvoice) {
    super(clientInvoice)
    this.clientId = clientInvoice.clientId
  }
}

export class BookingInvoiceResponse extends ClientInvoiceResponse {
  @ApiProperty({ description: 'Identifiant de la réservation', example: '9c6b8f152a8d4e301f7b2e90\n', required: true })
  bookingId: string

  constructor(bookingInvoice: BookingInvoice) {
    super(bookingInvoice)
    this.bookingId = bookingInvoice.bookingId
  }
}

export class VehicleInvoiceResponse extends ClientInvoiceResponse {
  @ApiProperty({ description: 'Id de la voiture liée à la facture', example: '912a5b3f6c9e0d401f8e7d2c', required: true })
  vehicleId: string

  @ApiProperty({ description: 'Date de la facture', example: '2021-07-19T14:00:00.000Z', required: true })
  madeAt: Date

  @ApiProperty({ description: 'Numéro de la facture', example: 0, required: true })
  invoiceNumber: number

  @ApiProperty({
    description: 'Identifiant de la mission lié à la facture. Undefined si extérieur à VMC.',
    example: '60f4a9d43b8a0c001f4a4f7c',
    required: true,
  })
  missionId?: string

  @ApiProperty({ description: 'Identifiant des intervention relatés par la facture.', example: "['912a5b3f6c9e0d401f8e7d2c']", required: true })
  interventionIds: Array<string>

  @ApiProperty({
    description: 'Label des intervention non trouvés en base de donnée.',
    example: "['Installation du Système de Propulsion Turbo-Chocolat sur une Voiture']",
    required: true,
  })
  otherInterventions: Array<string> // Interventions that are not in our database. Represented by labels.

  @ApiProperty({ description: 'Kilométrage du véhicule.', example: 150000, required: true })
  vehicleMileage: number

  constructor(vehicleInvoice: VehicleInvoice) {
    super(vehicleInvoice)
    this.vehicleId = vehicleInvoice.vehicleId
    this.madeAt = vehicleInvoice.madeAt
    this.invoiceNumber = vehicleInvoice.invoiceNumber
    this.missionId = vehicleInvoice.missionId
    this.interventionIds = vehicleInvoice.interventionIds
    this.otherInterventions = vehicleInvoice.otherInterventions
    this.vehicleMileage = vehicleInvoice.vehicleMileage
  }
}

export class MonthlyProfessionalInvoiceResponse extends AbstractBaseInvoiceResponse {
  @ApiProperty({ description: 'Id du professionnel lié à la facture.', example: '912a5b3f6c9e0d401f8e7d2c', required: true })
  professionalId: string
  @ApiProperty({ description: 'Nombre de commissions.', example: 2, required: true })
  commissions: number

  constructor(monthlyProfessionalInvoice: MonthlyProfessionalInvoice) {
    super(monthlyProfessionalInvoice)
    this.professionalId = monthlyProfessionalInvoice.professionalId
    this.commissions = monthlyProfessionalInvoice.commissions
  }
}
