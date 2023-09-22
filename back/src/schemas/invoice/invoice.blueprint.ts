import { AbstractBaseInvoice, BookingInvoice, ClientInvoice, MonthlyProfessionalInvoice, VehicleInvoice } from '@Schemas/invoice/invoice.schema'
import mongoose from 'mongoose'
import { InvoiceTypes } from '@Common/enums/schemas/invoice.schema.enum'

export abstract class BaseInvoiceBlueprint extends AbstractBaseInvoice {
  _ownerId: string
  _fileReferenceId: string
  _totalTTC: number
  _totalHT: number
  _tva: number
  _invoiceNumber: number
  createdAt: Date
  updatedAt: Date
  _id: mongoose.Types.ObjectId
  _invoiceType: InvoiceTypes
}

export abstract class ClientInvoiceBlueprint extends ClientInvoice {
  _ownerId: string
  _fileReferenceId: string
  _totalTTC: number
  _totalHT: number
  _tva: number
  _invoiceNumber: number
  createdAt: Date
  updatedAt: Date
  _id: mongoose.Types.ObjectId
  _invoiceType: InvoiceTypes

  _clientId: string
}

export abstract class BookingInvoiceBlueprint extends BookingInvoice {
  _ownerId: string
  _fileReferenceId: string
  _totalTTC: number
  _totalHT: number
  _tva: number
  _invoiceNumber: number
  createdAt: Date
  updatedAt: Date
  _id: mongoose.Types.ObjectId
  _invoiceType: InvoiceTypes

  _bookingId: string
}

export abstract class VehicleInvoiceBlueprint extends VehicleInvoice {
  _ownerId: string
  _fileReferenceId: string
  _totalTTC: number
  _totalHT: number
  _tva: number
  _invoiceNumber: number
  createdAt: Date
  updatedAt: Date
  _id: mongoose.Types.ObjectId
  _invoiceType: InvoiceTypes

  _clientId: string

  _vehicleId: string
  _madeAt: Date
  _madeOnVMC: boolean
  _missionId?: string
  _title: string
  _description: string
  _vehicleMileage: number
}

export abstract class MonthlyProfessionalInvoiceBlueprint extends MonthlyProfessionalInvoice {
  _fileReferenceId: string
  _totalTTC: number
  _totalHT: number
  _tva: number
  _invoiceNumber: number
  createdAt: Date
  updatedAt: Date
  _id: mongoose.Types.ObjectId
  _invoiceType: InvoiceTypes

  _professionalId: string
  _commissions: number
}
