export enum InvoiceTypes {
  MONTHLY = 'MONTHLY',
  BOOKING = 'BOOKING',
  VEHICLE = 'VEHICLE'
}

declare global {
  interface IBaseInvoiceData {
    _id: string
    totalTTC: number
    totalHT: number
    tva: number
    invoiceNumber: number
    fileReferenceId?: string
    invoiceType: InvoiceTypes
  }

  interface IClientInvoice extends IBaseInvoiceData {
    clientId: string
  }

  interface IVehicleInvoice extends IClientInvoice {
    vehicleId: string
    madeAt: string // Date (format: 'dd/MM/yyyy HH:mm')
    invoiceNumber: number
    missionId?: string
    interventionIds: Array<string>
    otherInterventions: Array<string> // Interventions that are not in our database. Represented by labels.
    vehicleMileage: number
  }

  interface IPopulatedVehicleInvoice extends IVehicleInvoice {
    interventions: Array<IIntervention>
  }
}
