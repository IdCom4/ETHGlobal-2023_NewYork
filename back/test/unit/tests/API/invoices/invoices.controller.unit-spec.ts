import { instance, mock, when } from 'ts-mockito'
import { InvoicesService } from '@Api/invoices/invoices.service'
import { InvoicesController } from '@Api/invoices/invoices.controller'
import { BookingInvoice, MonthlyProfessionalInvoice, VehicleInvoice } from '@Schemas/invoice/invoice.schema'
import { InvoiceNotFoundException } from '@Common/exceptions/schemas/invoice/invoice-not-found.exception'
import { PricesUtils } from '@Common/utils/prices.utils'
import { LegalRates } from '@Common/enums'
import { User } from '@Schemas/user'
import { BookingInvoiceResponse, MonthlyProfessionalInvoiceResponse, VehicleInvoiceResponse } from '@Api/invoices/responses/invoice.dto'
import { CreateVehicleInvoiceRequest } from '@Api/invoices/request/create-invoice.dto'
import { UpdateVehicleInvoiceRequest } from '@Api/invoices/request/update-invoice.dto'
import { MessageResponse } from '@Common/request-io/responses-dto'
import { HttpStatus } from '@nestjs/common'

const data = {
  vehicleInvoice: VehicleInvoice.of(
    0,
    120,
    100,
    20,
    'clientId',
    'vehicleId',
    1000,
    new Date(),
    'fileReferenceId',
    ['interventionId'],
    ['otherInterventionId'],
    'missionId'
  ),
  monthlyInvoice: MonthlyProfessionalInvoice.of(0, 120, 100, 20, 'fileReferenceId', 'clientId', 2),
  bookingInvoice: BookingInvoice.of(0, 120, 100, 20, 'clientId', 'bookingId', 'fileReferenceId'),
}

describe('Controller - InvoicesController', () => {
  let invoicesController: InvoicesController

  beforeAll(() => {
    const mockedInvoicesServiceClass = mock(InvoicesService)
    invoicesController = new InvoicesController(instance(mockedInvoicesServiceClass))
    when(mockedInvoicesServiceClass.getVehicleInvoiceById).thenReturn(async (id, requesterId) => {
      if (requesterId === 'unknownRequesterId') throw new InvoiceNotFoundException()
      if (id === 'existingId') return data.vehicleInvoice
      else throw new InvoiceNotFoundException()
    })
    when(mockedInvoicesServiceClass.getMonthlyInvoiceById).thenReturn(async (id, requesterId) => {
      if (requesterId === 'unknownRequesterId') throw new InvoiceNotFoundException()
      if (id === 'existingId') return data.monthlyInvoice
      else throw new InvoiceNotFoundException()
    })
    when(mockedInvoicesServiceClass.getBookingInvoiceById).thenReturn(async (id, requesterId) => {
      if (requesterId === 'unknownRequesterId') throw new InvoiceNotFoundException()
      if (id === 'existingId') return data.bookingInvoice
      else throw new InvoiceNotFoundException()
    })
    when(mockedInvoicesServiceClass.getBase64InvoiceById).thenReturn(async (requesterId, invoiceId) => {
      if (requesterId === 'unknownRequesterId') throw new InvoiceNotFoundException()
      if (invoiceId === 'existingId') return 'file'
      else throw new InvoiceNotFoundException()
    })
    when(mockedInvoicesServiceClass.createVehicleInvoiceFromUser).thenReturn(async (clientId, vehicleInvoiceData) => {
      const totalHT = PricesUtils.getHTFromTTC(vehicleInvoiceData.totalTTC, LegalRates.TVA)
      const tva = vehicleInvoiceData.totalTTC - totalHT
      const invoiceInstance = VehicleInvoice.of(
        0,
        vehicleInvoiceData.totalTTC,
        totalHT,
        tva,
        clientId,
        vehicleInvoiceData.vehicleId,
        vehicleInvoiceData.vehicleMileage,
        vehicleInvoiceData.madeAt,
        'invoiceFileReferenceId',
        vehicleInvoiceData.interventionIds,
        vehicleInvoiceData.otherInterventions
      )

      return {
        invoiceInstance,
        invoiceFile: {
          content: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9GBTDwovU2l6ZSAxNjY+PgpzdGFydHhyZWYKNDkyOQolJUVPRgo=',
          name: 'Facture',
        },
      }
    })
    when(mockedInvoicesServiceClass.updateVehicleInvoice).thenReturn(async (invoiceId) => {
      if (invoiceId != 'existingId') throw new InvoiceNotFoundException()
    })
    when(mockedInvoicesServiceClass.deleteInvoice).thenReturn(async (invoiceId) => {
      if (invoiceId != 'existingId') throw new InvoiceNotFoundException()
    })
  })

  describe('When getting a vehicle invoice by id', () => {
    it('should return the invoice with valid information', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const invoiceId = 'existingId'

      // When
      const invoice = await invoicesController.getVehicleInvoiceById(invoiceId, loggedUserWrapper)

      // Then
      expect(invoice).toBeInstanceOf(VehicleInvoiceResponse)
      expect(invoice.clientId).toEqual(data.vehicleInvoice.clientId)
      expect(invoice.invoiceType).toEqual(data.vehicleInvoice.invoiceType)
    })

    it('should fail if the user id is unknown', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      Reflect.set(loggedUserWrapper.user, '_id', 'unknownRequesterId')
      const invoiceId = 'existingId'

      // When
      const invoice = async (): Promise<VehicleInvoiceResponse> => await invoicesController.getVehicleInvoiceById(invoiceId, loggedUserWrapper)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })

    it('should fail if the invoice in unknown', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const invoiceId = 'unknownInvoiceId'

      // When
      const invoice = async (): Promise<VehicleInvoiceResponse> => await invoicesController.getVehicleInvoiceById(invoiceId, loggedUserWrapper)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })

  describe('When getting a monthly invoice by id', () => {
    it('should return the invoice with valid information', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const invoiceId = 'existingId'

      // When
      const invoice = await invoicesController.getMonthlyInvoiceById(invoiceId, loggedUserWrapper)

      // Then
      expect(invoice).toBeInstanceOf(MonthlyProfessionalInvoiceResponse)
      expect(invoice.totalTTC).toEqual(data.monthlyInvoice.totalTTC)
      expect(invoice.invoiceType).toEqual(data.monthlyInvoice.invoiceType)
    })

    it('should fail if the user id is unknown', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      Reflect.set(loggedUserWrapper.user, '_id', 'unknownRequesterId')
      const invoiceId = 'existingId'

      // When
      const invoice = async (): Promise<MonthlyProfessionalInvoiceResponse> =>
        await invoicesController.getMonthlyInvoiceById(invoiceId, loggedUserWrapper)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })

    it('should fail if the invoice in unknown', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const invoiceId = 'unknownInvoiceId'

      // When
      const invoice = async (): Promise<MonthlyProfessionalInvoiceResponse> =>
        await invoicesController.getMonthlyInvoiceById(invoiceId, loggedUserWrapper)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })

  describe('When getting a booking invoice by id', () => {
    it('should return the invoice with valid information', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const invoiceId = 'existingId'

      // When
      const invoice = await invoicesController.getBookingInvoiceById(invoiceId, loggedUserWrapper)

      // Then
      expect(invoice).toBeInstanceOf(BookingInvoiceResponse)
      expect(invoice.clientId).toEqual(data.bookingInvoice.clientId)
      expect(invoice.invoiceType).toEqual(data.bookingInvoice.invoiceType)
    })

    it('should fail if the user id is unknown', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      Reflect.set(loggedUserWrapper.user, '_id', 'unknownRequesterId')
      const invoiceId = 'existingId'

      // When
      const invoice = async (): Promise<BookingInvoiceResponse> => await invoicesController.getBookingInvoiceById(invoiceId, loggedUserWrapper)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })

    it('should fail if the invoice in unknown', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const invoiceId = 'unknownInvoiceId'

      // When
      const invoice = async (): Promise<BookingInvoiceResponse> => await invoicesController.getBookingInvoiceById(invoiceId, loggedUserWrapper)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })

  describe('When downloading invoice file by id', () => {
    it('should return the invoice with valid information', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const invoiceId = 'existingId'

      // When
      const invoice = await invoicesController.downloadBase64Invoice(invoiceId, loggedUserWrapper)

      // Then
      expect(invoice).toBe('file')
    })

    it('should fail if the user id is unknown', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      Reflect.set(loggedUserWrapper.user, '_id', 'unknownRequesterId')
      const invoiceId = 'existingId'

      // When
      const invoice = async (): Promise<string> => await invoicesController.downloadBase64Invoice(invoiceId, loggedUserWrapper)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })

    it('should fail if the invoice in unknown', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const invoiceId = 'unknownInvoiceId'

      // When
      const invoice = async (): Promise<string> => await invoicesController.downloadBase64Invoice(invoiceId, loggedUserWrapper)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })

  it('should return the invoice when creating a new vehicle invoice', async () => {
    // Given
    const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
    const request = Object.initClassByReflection(CreateVehicleInvoiceRequest, {
      totalTTC: 120,
      vehicleId: 'vehicleId',
      madeAt: new Date(),
      vehicleMileage: 120000,
    })

    // When
    const invoice = await invoicesController.createVehicleInvoiceFromUser(loggedUserWrapper, request)

    // Then
    expect(invoice).toBeInstanceOf(VehicleInvoice)
    expect(invoice.totalTTC).toEqual(request.totalTTC)
    expect(invoice.vehicleId).toEqual(request.vehicleId)
  })

  describe('When updating a vehicle invoice', () => {
    it('should success with valid id', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const request = Object.initClassByReflection(UpdateVehicleInvoiceRequest, {
        totalTTC: 120,
      })
      const invoiceId = 'existingId'

      // When
      const invoice = await invoicesController.updateVehicleInvoice(invoiceId, loggedUserWrapper, request)

      // Then
      expect(invoice).toBeInstanceOf(MessageResponse)
      expect(invoice.statusCode).toEqual(HttpStatus.OK)
    })

    it('should fail with invalid id', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const request = Object.initClassByReflection(UpdateVehicleInvoiceRequest, {
        totalTTC: 120,
      })
      const invoiceId = 'unknownId'

      // When
      const invoice = async (): Promise<MessageResponse> => await invoicesController.updateVehicleInvoice(invoiceId, loggedUserWrapper, request)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })

  describe('When deleting a vehicle invoice', () => {
    it('should success with valid id', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const invoiceId = 'existingId'

      // When
      const invoice = await invoicesController.deleteInvoice(invoiceId, loggedUserWrapper)

      // Then
      expect(invoice).toBeInstanceOf(MessageResponse)
      expect(invoice.statusCode).toEqual(HttpStatus.OK)
    })

    it('should fail with invalid id', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const invoiceId = 'unknownId'

      // When
      const invoice = async (): Promise<MessageResponse> => await invoicesController.deleteInvoice(invoiceId, loggedUserWrapper)

      // Then
      await expect(invoice).rejects.toThrow(InvoiceNotFoundException)
    })
  })
})
