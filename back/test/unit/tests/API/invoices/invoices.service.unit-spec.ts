import { InvoicesService } from '@Api/invoices/invoices.service'
import { instance, mock, when } from 'ts-mockito'
import { InvoiceRepository } from '@/repositories/invoice.repository'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { InvoiceNotFoundException } from '@Common/exceptions/schemas/invoice/invoice-not-found.exception'
import { BookingInvoice, MonthlyProfessionalInvoice, VehicleInvoice } from '@Schemas/invoice/invoice.schema'
import { InstantiatingDataWrapper } from '@Common/classes'
import { PdfInvoiceFactory } from '@/common/invoices/pdf-invoice.factory'
import { HostedFileReference } from '@/schemas/hostedFileReference'
import { VehicleRepository } from '@/repositories'

describe('Service - InvoicesService', () => {
  let invoicesService: InvoicesService

  beforeAll(() => {
    const mockedPdfFactory = mock(PdfInvoiceFactory)
    const mockedInvoiceRepository = mock(InvoiceRepository)
    const mockedVehicleRepository = mock(VehicleRepository)
    const mockedHostedFileService = mock(HostedFilesService)

    when(mockedPdfFactory.createVehicleInvoiceFile).thenReturn(
      () =>
        new Promise((resolve) =>
          resolve('data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9GBTDwovU2l6ZSAxNjY+PgpzdGFydHhyZWYKNDkyOQolJUVPRgo=')
        )
    )

    when(mockedInvoiceRepository.findBookingInvoice).thenReturn((id, clientId) => {
      if (id !== 'existingId' || clientId !== 'existingId') throw new InvoiceNotFoundException()
      return InstantiatingDataWrapper.fromData(Promise.resolve(BookingInvoice.of(0, 120, 100, 20, 'clientId', 'bookingId', 'fileId')))
    })
    when(mockedInvoiceRepository.findVehicleInvoice).thenReturn((id, clientId) => {
      if (id !== 'existingId' || clientId !== 'existingId') throw new InvoiceNotFoundException()
      return InstantiatingDataWrapper.fromData(Promise.resolve(VehicleInvoice.of(0, 120, 100, 20, 'clientId', 'bookingId', 150, new Date())))
    })
    when(mockedInvoiceRepository.findMonthlyInvoice).thenReturn((id, clientId) => {
      if (id !== 'existingId' || clientId !== 'existingId') throw new InvoiceNotFoundException()
      return InstantiatingDataWrapper.fromData(Promise.resolve(MonthlyProfessionalInvoice.of(0, 120, 100, 20, 'clientId', 'bookingId', 2)))
    })
    when(mockedInvoiceRepository.findById).thenReturn((id) => {
      if (id !== 'existingId') throw new InvoiceNotFoundException()
      return InstantiatingDataWrapper.fromData(
        Promise.resolve(VehicleInvoice.of(0, 120, 100, 20, 'clientId', 'bookingId', 150, new Date(), 'fileReferenceId'))
      )
    })
    when(mockedInvoiceRepository.create).thenReturn(async (instance) => {
      return instance
    })

    when(mockedHostedFileService.getHostedFileById).thenReturn(async (id) => {
      if (id !== 'existingId') throw new InvoiceNotFoundException()
      return 'data:application/pdf;base64,file'
    })

    when(mockedHostedFileService.upload).thenReturn(async (file: TFile, uploaderId: string, isPrivate: boolean) => {
      return HostedFileReference.of(
        'some-file-url',
        file.name ? `${file.name}.timestamp.file` : 'timestamp.file',
        'document/file',
        uploaderId,
        isPrivate
      )
    })

    invoicesService = new InvoicesService(
      instance(mockedPdfFactory),
      instance(mockedVehicleRepository),
      instance(mockedInvoiceRepository),
      instance(mockedHostedFileService)
    )
  })

  describe('When getting a vehicle invoice by id', () => {
    it('should return the invoice with valid information', async () => {
      // Given
      const loggedUserId = 'existingId'
      const invoiceId = 'existingId'

      // When
      const invoice = await invoicesService.getVehicleInvoiceById(invoiceId, loggedUserId)

      // Then
      expect(invoice).toBeInstanceOf(VehicleInvoice)
    })

    it('should fail if the user id is unknown', async () => {
      // Given
      const loggedUserId = 'unknownId'
      const invoiceId = 'existingId'

      // When
      const invoice = async (): Promise<VehicleInvoice> => await invoicesService.getVehicleInvoiceById(invoiceId, loggedUserId)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })

    it('should fail if the invoice in unknown', async () => {
      // Given
      const loggedUserId = 'existingId'
      const invoiceId = 'unknownInvoiceId'

      // When
      const invoice = async (): Promise<VehicleInvoice> => await invoicesService.getVehicleInvoiceById(invoiceId, loggedUserId)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })

  describe('When getting a monthly invoice by id', () => {
    it('should return the invoice with valid information', async () => {
      // Given
      const loggedUserId = 'existingId'
      const invoiceId = 'existingId'

      // When
      const invoice = await invoicesService.getMonthlyInvoiceById(invoiceId, loggedUserId)

      // Then
      expect(invoice).toBeInstanceOf(MonthlyProfessionalInvoice)
    })

    it('should fail if the user id is unknown', async () => {
      // Given
      const loggedUserId = 'unknownId'
      const invoiceId = 'existingId'

      // When
      const invoice = async (): Promise<MonthlyProfessionalInvoice> => await invoicesService.getMonthlyInvoiceById(invoiceId, loggedUserId)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })

    it('should fail if the invoice in unknown', async () => {
      // Given
      const loggedUserId = 'existingId'
      const invoiceId = 'unknownInvoiceId'

      // When
      const invoice = async (): Promise<MonthlyProfessionalInvoice> => await invoicesService.getMonthlyInvoiceById(invoiceId, loggedUserId)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })

  describe('When getting a booking invoice by id', () => {
    it('should return the invoice with valid information', async () => {
      // Given
      const loggedUserId = 'existingId'
      const invoiceId = 'existingId'

      // When
      const invoice = await invoicesService.getBookingInvoiceById(invoiceId, loggedUserId)

      // Then
      expect(invoice).toBeInstanceOf(BookingInvoice)
    })

    it('should fail if the user id is unknown', async () => {
      // Given
      const loggedUserId = 'unknownId'
      const invoiceId = 'existingId'

      // When
      const invoice = async (): Promise<BookingInvoice> => await invoicesService.getBookingInvoiceById(invoiceId, loggedUserId)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })

    it('should fail if the invoice in unknown', async () => {
      // Given
      const loggedUserId = 'existingId'
      const invoiceId = 'unknownInvoiceId'

      // When
      const invoice = async (): Promise<BookingInvoice> => await invoicesService.getBookingInvoiceById(invoiceId, loggedUserId)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })

  describe('When downloading invoice file by id', () => {
    it('should return the invoice with valid information', async () => {
      // Given
      const loggedUserId = 'existingId'
      const invoiceId = 'existingId'

      // When
      const invoice = await invoicesService.getBase64InvoiceById(loggedUserId, invoiceId)

      // Then
      expect(invoice.startsWith('data:application/pdf;base64,')).toBe(true)
    })

    it('should fail if the user id is unknown', async () => {
      // Given
      const loggedUserId = 'unknownId'
      const invoiceId = 'existingId'

      // When
      const invoice = async (): Promise<string> => await invoicesService.getBase64InvoiceById(loggedUserId, invoiceId)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })

    it('should fail if the invoice in unknown', async () => {
      // Given
      const loggedUserId = 'existingId'
      const invoiceId = 'unknownInvoiceId'

      // When
      const invoice = async (): Promise<string> => await invoicesService.getBase64InvoiceById(loggedUserId, invoiceId)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })

  it('should return the invoice when creating a new vehicle invoice', async () => {
    // Given
    const loggedUserId = 'existingId'
    const data: TCreationVehicleInvoiceData = {
      totalTTC: 120,
      vehicleId: 'vehicleId',
      madeAt: new Date(),
      vehicleMileage: 120000,
      invoiceFile: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9GBTDwovU2l6ZSAxNjY+PgpzdGFydHhyZWYKNDkyOQolJUVPRgo=',
    }

    // When
    const { invoiceInstance } = await invoicesService.createVehicleInvoiceFromUser(loggedUserId, data)

    // Then
    expect(invoiceInstance).toBeInstanceOf(VehicleInvoice)
    expect(invoiceInstance.totalTTC).toEqual(data.totalTTC)
    expect(invoiceInstance.vehicleId).toEqual(data.vehicleId)
  })

  describe('When updating a vehicle invoice', () => {
    it('should success with valid id', async () => {
      // Given
      const loggedUserId = 'existingId'
      const data: TUpdateVehicleInvoiceData = { totalTTC: 120 }
      const invoiceId = 'existingId'

      // When
      const invoice = async (): Promise<void> => await invoicesService.updateVehicleInvoice(invoiceId, loggedUserId, data)

      // Then
      await expect(invoice()).resolves.not.toThrow()
    })

    it('should fail with invalid id', async () => {
      // Given
      const loggedUserId = 'existingId'
      const data = { totalTTC: 120 }
      const invoiceId = 'unknownId'

      // When
      const invoice = async (): Promise<void> => await invoicesService.updateVehicleInvoice(invoiceId, loggedUserId, data)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })

  describe('When deleting a vehicle invoice', () => {
    it('should success with valid id', async () => {
      // Given
      const loggedUserId = 'existingId'
      const invoiceId = 'existingId'

      // When
      const invoice = async (): Promise<void> => await invoicesService.deleteInvoice(invoiceId, loggedUserId)

      // Then
      await expect(invoice()).resolves.not.toThrow()
    })

    it('should fail with invalid id', async () => {
      // Given
      const loggedUserId = 'existingId'
      const invoiceId = 'unknownId'

      // When
      const invoice = async (): Promise<void> => await invoicesService.deleteInvoice(invoiceId, loggedUserId)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })
})
