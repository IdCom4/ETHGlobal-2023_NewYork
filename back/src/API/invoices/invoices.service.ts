import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InvoiceRepository } from '@/repositories/invoice.repository'
import { AbstractBaseInvoice, BookingInvoice, MonthlyProfessionalInvoice, VehicleInvoice } from '@Schemas/invoice/invoice.schema'
import { InvoiceNotFoundException } from '@Common/exceptions/schemas/invoice/invoice-not-found.exception'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { LegalRates } from '@Common/enums'
import { PricesUtils } from '@Common/utils/prices.utils'
import { HostedFileReference } from '@Schemas/hostedFileReference'
import { InvoiceNotContainingFileException } from '@Common/exceptions/schemas/invoice/invoice-not-containing-file.exception'
import { Mission } from '@/schemas/mission'
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception'
import { PdfInvoiceFactory } from '@/common/invoices/pdf-invoice.factory'
import { Vehicle } from '@/schemas/vehicle'
import { ProfessionalUser, User } from '@/schemas/user'
import { InvoiceTypes } from '@/common/enums/schemas/invoice.schema.enum'
import { VehicleRepository } from '@/repositories'
import { VehicleNotFoundException } from '@/common/exceptions/schemas'
import { VehicleInvoiceBlueprint } from '@/schemas/invoice/invoice.blueprint'

@Injectable()
export class InvoicesService {
  constructor(
    private readonly pdfInvoiceFactory: PdfInvoiceFactory,
    private readonly vehicleRepository: VehicleRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly hostedFileService: HostedFilesService
  ) {}

  /**
   * Retrieves a booking invoice by its id.
   * The asked requesterId is used to check if the invoice belongs to the requester.
   *
   * @param invoiceId The invoice id
   * @param requesterId The requester id
   * @returns The booking invoice
   */
  public async getBookingInvoiceById(invoiceId: string, requesterId: string): Promise<BookingInvoice> {
    return await this.invoiceRepository.findBookingInvoice(invoiceId, requesterId).getOrThrow(new InvoiceNotFoundException())
  }

  /**
   * Retrieves a vehicle invoice by its id.
   * The asked requesterId is used to check if the invoice belongs to the requester.
   *
   * @param invoiceId The invoice id
   * @param requesterId The requester id
   */
  public async getVehicleInvoiceById(invoiceId: string, requesterId: string): Promise<VehicleInvoice> {
    return await this.invoiceRepository.findVehicleInvoice(invoiceId, requesterId).getOrThrow(new InvoiceNotFoundException())
  }

  /**
   * Retrieves all vehicle's invoice by its id.
   * The asked requesterId is used to check if the invoice belongs to the requester.
   *
   * @param vehicleId The vehicle id
   * @param requesterId The requester id
   */
  public async getVehicleInvoicesByVehicleId(vehicleId: string, requesterId: string): Promise<VehicleInvoice[]> {
    const vehicle = await this.vehicleRepository.findById(vehicleId).getOrThrow(new VehicleNotFoundException())

    const query: TStrictDocumentMongoFilterQuery<VehicleInvoiceBlueprint> = {
      _invoiceType: InvoiceTypes.VEHICLE,
      _vehicleId: vehicleId,
    }

    // if requester is current vehicle owner, it can access all vehicle invoices
    if (vehicle.ownerId === requesterId) return await this.invoiceRepository.findManyChildren(query, { targetClass: VehicleInvoice }).getOr([])
    // but if not, he can only access the invoices he received when he was the owner
    else {
      query._clientId = requesterId
      return await this.invoiceRepository.findManyChildren(query, { targetClass: VehicleInvoice }).getOr([])
    }
  }

  /**
   * Retrieves a monthly invoice by its id.
   * The asked requesterId is used to check if the invoice belongs to the requester.
   *
   * @param invoiceId The invoice id
   * @param requesterId The requester id
   */
  public async getMonthlyInvoiceById(invoiceId: string, requesterId: string): Promise<MonthlyProfessionalInvoice> {
    return await this.invoiceRepository.findMonthlyInvoice(invoiceId, requesterId).getOrThrow(new InvoiceNotFoundException())
  }

  /**
   * Download the invoice file in base64 by its id.
   *
   * @param requesterId The requester id
   * @param invoiceId The invoice id
   */
  public async getBase64InvoiceById(requesterId: string, invoiceId: string): Promise<string> {
    // InstantiatingDataWrapper#getOrThrow returns a promise of a promise
    // For us, it's the same as a promise of a value, but not for the IDE.
    // So I need to await it to work with the correct types.
    const invoice = await this.invoiceRepository.findById(invoiceId).getOrThrow(new InvoiceNotFoundException())

    if (!invoice.fileReferenceId) throw new InvoiceNotContainingFileException()

    const file = await this.hostedFileService.getHostedFileById(requesterId, invoice.fileReferenceId)

    if (!file) throw new InternalServerErrorException('File not found')

    return file
  }

  /**
   * Creates a new vehicle invoice from user's inputs.
   *
   * @param clientId The client id
   * @param vehicleInvoiceData The vehicle invoice data
   */
  public async createVehicleInvoiceFromUser(
    clientId: string,
    vehicleInvoiceData: TCreationVehicleInvoiceData
  ): Promise<TInvoiceCreatedPayload<VehicleInvoice>> {
    const invoiceHostedReference = await this.uploadInvoiceFile(vehicleInvoiceData.invoiceFile, clientId, InvoiceTypes.VEHICLE)

    const totalHT = PricesUtils.getHTFromTTC(vehicleInvoiceData.totalTTC, LegalRates.TVA)
    const tva = vehicleInvoiceData.totalTTC - totalHT
    const invoiceNumber = await this.invoiceRepository.getNextInvoiceNumber()
    const newVehicleInvoice = VehicleInvoice.of(
      invoiceNumber,
      vehicleInvoiceData.totalTTC,
      totalHT,
      tva,
      clientId,
      vehicleInvoiceData.vehicleId,
      vehicleInvoiceData.vehicleMileage,
      vehicleInvoiceData.madeAt,
      invoiceHostedReference?._id.toString(),
      vehicleInvoiceData.interventionIds,
      vehicleInvoiceData.otherInterventions
    )

    const invoiceInstance = (await this.invoiceRepository.create(newVehicleInvoice)) as VehicleInvoice

    return { invoiceInstance, invoiceFile: { content: vehicleInvoiceData.invoiceFile, name: invoiceHostedReference.fileName } }
  }

  /**
   * Creates a new vehicle invoice from a mission.
   *
   * @param mission The mission the invoice is for
   * @param vehicle The vehicle the mission was for
   * @param client The client that created the mission
   * @param professional The professional that completed the mission
   */
  public async createVehicleInvoiceFromMission(
    mission: Mission,
    vehicle: Vehicle,
    client: User,
    professional: ProfessionalUser
  ): Promise<TInvoiceCreatedPayload<VehicleInvoice>> {
    if (!mission.report) throw new BadRequestException("La mission n'a pas encore de résumé des opérations effectuées")

    const invoiceNumber = await this.invoiceRepository.getNextInvoiceNumber()

    const invoiceFile = await this.pdfInvoiceFactory.createVehicleInvoiceFile(mission, vehicle, client, professional, invoiceNumber)
    const invoiceHostedReference = await this.uploadInvoiceFile(invoiceFile, mission.clientRequest.clientId, InvoiceTypes.VEHICLE)

    const quote = mission.getChosenProfessionalEntry().proposal.quote

    const totalHT = quote.totalHT
    const tva = quote.totalTTCToClient - quote.totalHT
    const newVehicleInvoice = VehicleInvoice.of(
      invoiceNumber,
      quote.totalTTCToClient,
      totalHT,
      tva,
      mission.clientRequest.clientId,
      mission.clientRequest.vehicleId,
      mission.report.vehicleMileage,
      new Date(),
      invoiceHostedReference._id.toString(),
      mission.report.interventionIds,
      mission.report.otherInterventions
    )

    const invoiceInstance = (await this.invoiceRepository.create(newVehicleInvoice)) as VehicleInvoice

    return { invoiceInstance, invoiceFile: { content: invoiceFile, name: invoiceHostedReference.fileName } }
  }

  /**
   * Update a vehicle invoice.
   * Only the defined {@link TUpdateVehicleInvoiceData} fields will be updated.
   *
   * @param invoiceId The invoice id
   * @param updatingUserId The updating user id
   * @param vehicleInvoiceData The vehicle invoice data
   */
  public async updateVehicleInvoice(invoiceId: string, updatingUserId: string, vehicleInvoiceData: TUpdateVehicleInvoiceData): Promise<void> {
    const vehicleInvoiceResp = await this.invoiceRepository.findVehicleInvoice(invoiceId, updatingUserId).getOrThrow(new InvoiceNotFoundException())
    const vehicleInvoice = await vehicleInvoiceResp

    let newInvoiceHostedReference
    if (vehicleInvoiceData.invoiceFile) {
      const oldReferenceId = vehicleInvoice.fileReferenceId
      if (oldReferenceId)
        newInvoiceHostedReference = await this.hostedFileService.replaceFile(
          oldReferenceId,
          { content: vehicleInvoiceData.invoiceFile },
          updatingUserId,
          true
        )
      else newInvoiceHostedReference = await this.uploadInvoiceFile(vehicleInvoiceData.invoiceFile, updatingUserId, InvoiceTypes.VEHICLE)
    }

    vehicleInvoice.update(
      vehicleInvoiceData.interventionIds,
      vehicleInvoiceData.otherInterventions,
      newInvoiceHostedReference,
      vehicleInvoiceData.totalTTC,
      vehicleInvoiceData.vehicleId,
      vehicleInvoiceData.madeAt,
      vehicleInvoiceData.vehicleMileage
    )

    await this.invoiceRepository.updateAsIs(vehicleInvoice)
  }

  /**
   * Deletes a vehicle invoice.
   * Only invoice created by users can be deleted.
   * Invoices created by ValueMyCar cannot be deleted.
   *
   * @param invoiceId The invoice id
   * @param requesterId The requester id
   * @throws UnauthorizedException If the invoice is not created by the requester
   * @throws InvoiceNotFoundException If the invoice is not found
   */
  async deleteInvoice(invoiceId: string, requesterId: string): Promise<void> {
    const invoice = await this.invoiceRepository.findVehicleInvoice(invoiceId, requesterId).getOrThrow(new InvoiceNotFoundException())

    if (invoice.madeOnVMC()) throw new UnauthorizedException('Vous ne pouvez supprimer une facture provenant de ValueMyCar')

    if (invoice.fileReferenceId) await this.hostedFileService.delete(invoice.fileReferenceId)
    await this.invoiceRepository.delete(invoice._id)
  }

  /**
   * Uploads the invoice file to the hosted files service.
   * The file is uploaded with the clientId as the owner to prevent
   * other clients from accessing it.
   *
   * @param file The file to upload
   * @param clientId The client id
   * @private
   */
  private async uploadInvoiceFile(file: string, clientId: string, invoiceType: InvoiceTypes): Promise<HostedFileReference> {
    try {
      return await this.hostedFileService.upload({ content: file, name: `${invoiceType}-invoice` }, clientId, true)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException("Une erreur est survenue lors de l'upload de la facture")
    }
  }
}

export type TInvoiceCreatedPayload<T extends AbstractBaseInvoice> = { invoiceInstance: T; invoiceFile: TFile }
