export {}

declare global {
  type TCreationVehicleInvoiceData = {
    invoiceFile: string
    totalTTC: number
    vehicleId: string
    vehicleMileage: number
    interventionIds?: Array<string>
    otherInterventions?: Array<string>
    madeAt: Date
  }

  type TUpdateVehicleInvoiceData = {
    invoiceFile?: string
    totalTTC?: number
    vehicleId?: string
    vehicleMileage?: number
    interventionIds?: Array<string>
    otherInterventions?: Array<string>
    madeAt?: Date
  }
}
