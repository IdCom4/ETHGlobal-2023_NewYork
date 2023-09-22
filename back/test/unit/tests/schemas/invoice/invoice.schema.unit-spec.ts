import { BookingInvoice, MonthlyProfessionalInvoice, VehicleInvoice } from '@Schemas/invoice/invoice.schema'
import { HostedFileReference } from '@Schemas/hostedFileReference'

describe('Schema - Invoice', () => {
  describe('VehicleInvoice', () => {
    describe('When instantiating', () => {
      it('should instantiate with all arguments constructor and nominal values', () => {
        // Given
        const invoiceNumber = 0
        const totalTTC = 120
        const totalHT = 100
        const tva = 20
        const clientId = 'clientId'
        const vehicleId = 'vehicleId'
        const vehicleMileage = 120000
        const madeAt = new Date()
        const fileReferenceId = 'id'
        const interventionIds = ['unId']
        const otherInterventions = ["Ajout d'un pot d'échappement confetti"]
        const missionId = 'autreId'

        // When
        const vehicleInvoice = VehicleInvoice.of(
          invoiceNumber,
          totalTTC,
          totalHT,
          tva,
          clientId,
          vehicleId,
          vehicleMileage,
          madeAt,
          fileReferenceId,
          interventionIds,
          otherInterventions,
          missionId
        )

        // Then
        expect(vehicleInvoice.invoiceNumber).toBe(invoiceNumber)
        expect(vehicleInvoice.totalTTC).toBe(totalTTC)
        expect(vehicleInvoice.totalHT).toBe(totalHT)
        expect(vehicleInvoice.tva).toBe(tva)
        expect(vehicleInvoice.clientId).toBe(clientId)
        expect(vehicleInvoice.vehicleId).toBe(vehicleId)
        expect(vehicleInvoice.vehicleMileage).toBe(vehicleMileage)
        expect(vehicleInvoice.madeAt).toBe(madeAt)
        expect(vehicleInvoice.fileReferenceId).toBe(fileReferenceId)
        expect(vehicleInvoice.interventionIds).toBe(interventionIds)
        expect(vehicleInvoice.otherInterventions).toBe(otherInterventions)
        expect(vehicleInvoice.missionId).toBe(missionId)
      })
    })

    it('should update invoice', async () => {
      // Given
      const invoice = VehicleInvoice.of(0, 0, 0, 0, 'clientId', 'vehicleId', 0, new Date(), 'id', [], [], 'missionId')
      const newInterventionIds = ['64654']
      const newOtherInterventions = ['Téléportation']
      const newHostedInvoiceReference = HostedFileReference.of('id', 'name', 'url', '987', false)
      const newTotalTTC = 950
      const newVehicleId = '987987'
      const newMadeAt = new Date()
      const newVehicleMileage = 99999

      // When
      invoice.update(newInterventionIds, newOtherInterventions, newHostedInvoiceReference, newTotalTTC, newVehicleId, newMadeAt, newVehicleMileage)

      // Then
      expect(invoice.interventionIds).toBe(newInterventionIds)
      expect(invoice.otherInterventions).toBe(newOtherInterventions)
      expect(invoice.fileReferenceId).toBe(newHostedInvoiceReference._id.toString())
      expect(invoice.totalTTC).toBe(newTotalTTC)
      expect(invoice.vehicleId).toBe(newVehicleId)
      expect(invoice.madeAt).toBe(newMadeAt)
      expect(invoice.vehicleMileage).toBe(newVehicleMileage)
    })
  })

  describe('BookingInvoice', () => {
    describe('When instantiating', () => {
      it('should instantiate with all arguments constructor and nominal values', () => {
        // Given
        const invoiceNumber = 0
        const totalTTC = 120
        const totalHT = 100
        const tva = 20
        const clientId = 'clientId'
        const bookingId = 'bookingId'
        const fileReferenceId = 'id'

        // When
        const vehicleInvoice = BookingInvoice.of(invoiceNumber, totalTTC, totalHT, tva, clientId, bookingId, fileReferenceId)

        // Then
        expect(vehicleInvoice.invoiceNumber).toBe(invoiceNumber)
        expect(vehicleInvoice.totalTTC).toBe(totalTTC)
        expect(vehicleInvoice.totalHT).toBe(totalHT)
        expect(vehicleInvoice.tva).toBe(tva)
        expect(vehicleInvoice.clientId).toBe(clientId)
        expect(vehicleInvoice.bookingId).toBe(bookingId)
        expect(vehicleInvoice.fileReferenceId).toBe(fileReferenceId)
      })
    })
  })

  describe('MonthlyProfessionalInvoice', () => {
    describe('When instantiating', () => {
      it('should instantiate with all arguments constructor and nominal values', () => {
        // Given
        const invoiceNumber = 0
        const totalTTC = 120
        const totalHT = 100
        const tva = 20
        const fileReferenceId = 'id'
        const professionalId = '98654'
        const commissions = 2

        // When
        const vehicleInvoice = MonthlyProfessionalInvoice.of(invoiceNumber, totalTTC, totalHT, tva, fileReferenceId, professionalId, commissions)

        // Then
        expect(vehicleInvoice.invoiceNumber).toBe(invoiceNumber)
        expect(vehicleInvoice.totalTTC).toBe(totalTTC)
        expect(vehicleInvoice.totalHT).toBe(totalHT)
        expect(vehicleInvoice.tva).toBe(tva)
        expect(vehicleInvoice.fileReferenceId).toBe(fileReferenceId)
        expect(vehicleInvoice.professionalId).toBe(professionalId)
        expect(vehicleInvoice.commissions).toBe(commissions)
      })
    })
  })
})
