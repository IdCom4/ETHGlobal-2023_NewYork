import { TimestampedDBDocument } from '@Schemas/db-document.abstract-schema'
import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'
import { HostedFileReference } from '@Schemas/hostedFileReference'
import { PricesUtils } from '@Common/utils/prices.utils'
import { LegalRates } from '@Common/enums'
import { InvoiceTypes } from '@Common/enums/schemas/invoice.schema.enum'

@modelOptions({ schemaOptions: { collection: 'invoices' } })
export class AbstractBaseInvoice extends TimestampedDBDocument {
  @prop({ type: String, minlength: 24, maxlength: 24, required: false })
  @Expose({ name: 'fileReferenceId' })
  protected _fileReferenceId?: string

  @prop({ type: Number, required: true })
  @Expose({ name: 'totalTTC' })
  protected _totalTTC: number

  @prop({ type: Number, required: true })
  @Expose({ name: 'totalHT' })
  protected _totalHT: number

  @prop({ type: Number, required: true })
  @Expose({ name: 'tva' })
  protected _tva: number

  @prop({ type: Number, required: true })
  @Expose({ name: 'invoiceNumber' })
  protected _invoiceNumber: number

  @prop({ type: String, required: true })
  @Expose({ name: 'invoiceType' })
  protected _invoiceType: InvoiceTypes

  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  protected abstractBaseInvoiceInitialize(
    invoiceNumber: number,
    invoiceType: InvoiceTypes,
    totalTTC: number,
    totalHT: number,
    tva: number,
    fileReferenceId?: string
  ): void {
    this._invoiceType = invoiceType
    this._fileReferenceId = fileReferenceId
    this._totalTTC = totalTTC
    this._totalHT = totalHT
    this._tva = tva
    this._invoiceNumber = invoiceNumber
  }

  /* eslint-disable prettier/prettier */
  get fileReferenceId(): string | undefined { return this._fileReferenceId }
  get totalTTC(): number { return this._totalTTC }
  get totalHT(): number { return this._totalHT }
  get tva(): number { return this._tva }
  get invoiceType(): InvoiceTypes { return this._invoiceType }
  get invoiceNumber(): number { return this._invoiceNumber }
  /* eslint-enable prettier/prettier */
}

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export abstract class ClientInvoice extends AbstractBaseInvoice {
  @prop({ type: String, minlength: 24, maxlength: 24, required: true })
  @Expose({ name: 'clientId' })
  protected _clientId: string

  protected clientInvoiceInitialize(
    invoiceNumber: number,
    invoiceType: InvoiceTypes,
    totalTTC: number,
    totalHT: number,
    tva: number,
    clientId: string,
    fileReferenceId?: string
  ): void {
    this.abstractBaseInvoiceInitialize(invoiceNumber, invoiceType, totalTTC, totalHT, tva, fileReferenceId)
    this._clientId = clientId
  }

  /* eslint-disable prettier/prettier */
  get clientId(): string { return this._clientId }
  /* eslint-enable prettier/prettier */
}

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class BookingInvoice extends ClientInvoice {
  @prop({ type: String, minlength: 24, maxlength: 24, required: true })
  @Expose({ name: 'bookingId' })
  protected _bookingId: string

  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(
    invoiceNumber: number,
    totalTTC: number,
    totalHT: number,
    tva: number,
    clientId: string,
    bookingId: string,
    fileReferenceId?: string
  ): BookingInvoice {
    const bookingInvoice = new BookingInvoice()

    bookingInvoice.clientInvoiceInitialize(invoiceNumber, InvoiceTypes.BOOKING, totalTTC, totalHT, tva, clientId, fileReferenceId)
    bookingInvoice._bookingId = bookingId

    return bookingInvoice
  }

  /* eslint-disable prettier/prettier */
  get bookingId(): string { return this._bookingId }

  /* eslint-enable prettier/prettier */
}

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true, collection: 'invoices' } })
export class VehicleInvoice extends ClientInvoice {
  @prop({ type: String, minlength: 24, maxlength: 24, required: true })
  @Expose({ name: 'vehicleId' })
  protected _vehicleId: string

  @prop({ type: Date, required: false })
  @Expose({ name: 'madeAt' })
  protected _madeAt: Date

  @prop({ required: true })
  @Expose({ name: 'interventionIds' })
  protected _interventionIds: Array<string>

  @prop({ required: true })
  @Expose({ name: 'otherInterventions' })
  protected _otherInterventions: Array<string> // Interventions that are not in our database. Represented by labels.

  @prop({ type: String, required: false })
  @Expose({ name: 'missionId' })
  protected _missionId?: string

  @prop({ type: Number, required: true })
  @Expose({ name: 'vehicleMileage' })
  protected _vehicleMileage: number

  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(
    invoiceNumber: number,
    totalTTC: number,
    totalHT: number,
    tva: number,
    clientId: string,
    vehicleId: string,
    vehicleMileage: number,
    madeAt: Date,
    fileReferenceId?: string,
    interventionIds?: Array<string>,
    otherInterventions?: Array<string>,
    missionId?: string
  ): VehicleInvoice {
    const vehicleInvoice = new VehicleInvoice()

    vehicleInvoice.clientInvoiceInitialize(invoiceNumber, InvoiceTypes.VEHICLE, totalTTC, totalHT, tva, clientId, fileReferenceId)
    vehicleInvoice._vehicleId = vehicleId
    vehicleInvoice._madeAt = madeAt
    vehicleInvoice._missionId = missionId
    vehicleInvoice._vehicleMileage = vehicleMileage
    vehicleInvoice._interventionIds = interventionIds ?? []
    vehicleInvoice._otherInterventions = otherInterventions ?? []

    return vehicleInvoice
  }

  /* eslint-disable prettier/prettier */
  get vehicleId(): string { return this._vehicleId }
  get madeAt(): Date { return this._madeAt }
  get missionId(): string | undefined { return this._missionId }
  get vehicleMileage(): number { return this._vehicleMileage }
  get interventionIds(): Array<string> { return this._interventionIds }
  get otherInterventions(): Array<string> { return this._otherInterventions }

  @Expose({ name: 'madeOnVMC' })
  public madeOnVMC(): boolean { return !!this._missionId }
  /* eslint-enable prettier/prettier */

  public update(
    interventionIds?: Array<string>,
    otherInterventions?: Array<string>,
    hostedInvoiceReference?: HostedFileReference,
    totalTTC?: number,
    vehicleId?: string,
    madeAt?: Date,
    vehicleMileage?: number
  ): void {
    /* eslint-disable prettier/prettier */
    if (interventionIds) this._interventionIds = interventionIds
    if (otherInterventions) this._otherInterventions = otherInterventions
    if (hostedInvoiceReference) this._fileReferenceId = hostedInvoiceReference._id.toString()
    if (totalTTC) {
      this._totalTTC = totalTTC
      this._totalHT = PricesUtils.getHTFromTTC(this._totalTTC, LegalRates.TVA)
      this._tva = this.totalTTC - this.totalHT
    }
    if (vehicleId) this._vehicleId = vehicleId
    if (madeAt) this._madeAt = madeAt
    if (vehicleMileage) this._vehicleMileage = vehicleMileage
    /* eslint-enable prettier/prettier */
  }
}

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class MonthlyProfessionalInvoice extends AbstractBaseInvoice {
  @prop({ type: String, minlength: 24, maxlength: 24, required: true })
  @Expose({ name: 'professionalId' })
  protected _professionalId: string

  @prop({ type: Number, required: true })
  @Expose({ name: 'commissions' })
  protected _commissions: number

  constructor() {
    super()
  }

  public static of(
    invoiceNumber: number,
    totalTTC: number,
    totalHT: number,
    tva: number,
    fileReferenceId: string,
    professionalId: string,
    commissions: number
  ): MonthlyProfessionalInvoice {
    const monthlyProfessionalInvoice = new MonthlyProfessionalInvoice()

    monthlyProfessionalInvoice.abstractBaseInvoiceInitialize(invoiceNumber, InvoiceTypes.MONTHLY, totalTTC, totalHT, tva, fileReferenceId)
    monthlyProfessionalInvoice._professionalId = professionalId
    monthlyProfessionalInvoice._commissions = commissions

    return monthlyProfessionalInvoice
  }

  /* eslint-disable prettier/prettier */
  get professionalId(): string { return this._professionalId }
  get commissions(): number { return this._commissions }
  /* eslint-enable prettier/prettier */
}
