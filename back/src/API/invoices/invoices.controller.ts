import { Body, Controller, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { InvoicesService } from '@Api/invoices/invoices.service'
import { Req } from '@nestjs/common/decorators'
import { BookingInvoiceResponse, MonthlyProfessionalInvoiceResponse, VehicleInvoiceResponse } from '@Api/invoices/responses/invoice.dto'
import { VehicleInvoice } from '@Schemas/invoice/invoice.schema'
import { CreateVehicleInvoiceRequest } from '@Api/invoices/request/create-invoice.dto'
import { UpdateVehicleInvoiceRequest } from '@Api/invoices/request/update-invoice.dto'
import { MessageResponse } from '@Common/request-io/responses-dto'
import { Delete } from '@nestjs/common/decorators/http'
import { JwtAuthGuard } from '@Common/auth/guards/jwt'

@ApiTags('Invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  /**
   * Get vehicle invoice by id and user's id.
   *
   * @param invoiceId Invoice's id
   * @param user Logged user (provided by the JwtAuthGuard)3
   * @returns Vehicle invoice
   */
  @ApiResponse({ status: HttpStatus.OK, type: VehicleInvoiceResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Facture introuvable.' })
  @Get('vehicle/:ID')
  async getVehicleInvoiceById(@Param('ID') invoiceId: string, @Req() { user }: RequestWithLoggedUser): Promise<VehicleInvoiceResponse> {
    const vehicleInvoice = await this.invoicesService.getVehicleInvoiceById(invoiceId, user._id.toString())
    return new VehicleInvoiceResponse(vehicleInvoice)
  }

  /**
   * Get vehicle invoices by id and user's id.
   *
   * @param vehicleId vehicle's id
   * @param user Logged user (provided by the JwtAuthGuard)3
   * @returns Vehicle invoices
   */
  @ApiResponse({ status: HttpStatus.OK, type: VehicleInvoiceResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Factures introuvable.' })
  @Get('by-vehicle/:ID')
  async getAllVehicleInvoicesByVehicleId(@Param('ID') vehicleId: string, @Req() { user }: RequestWithLoggedUser): Promise<VehicleInvoiceResponse[]> {
    const vehicleInvoices = await this.invoicesService.getVehicleInvoicesByVehicleId(vehicleId, user._id.toString())

    return vehicleInvoices.map((invoice) => new VehicleInvoiceResponse(invoice))
  }

  /**
   * Get monthly invoice by id and user's id.
   *
   * @param invoiceId Invoice's id
   * @param user Logged user (provided by the JwtAuthGuard)
   * @returns Monthly invoice
   */
  @ApiResponse({ status: HttpStatus.OK, type: MonthlyProfessionalInvoiceResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Facture introuvable.' })
  @Get('monthly/:ID')
  async getMonthlyInvoiceById(@Param('ID') invoiceId: string, @Req() { user }: RequestWithLoggedUser): Promise<MonthlyProfessionalInvoiceResponse> {
    const vehicleInvoice = await this.invoicesService.getMonthlyInvoiceById(invoiceId, user._id.toString())
    return new MonthlyProfessionalInvoiceResponse(vehicleInvoice)
  }

  /**
   * Get booking invoice by id and user's id.
   *
   * @param invoiceId Invoice's id
   * @param user Logged user (provided by the JwtAuthGuard)
   * @returns Booking invoice
   */
  @ApiResponse({ status: HttpStatus.OK, type: BookingInvoiceResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Facture introuvable.' })
  @Get('booking/:ID')
  async getBookingInvoiceById(@Param('ID') invoiceId: string, @Req() { user }: RequestWithLoggedUser): Promise<BookingInvoiceResponse> {
    const vehicleInvoice = await this.invoicesService.getBookingInvoiceById(invoiceId, user._id.toString())
    return new BookingInvoiceResponse(vehicleInvoice)
  }

  /**
   * Get base64 invoice by id and user's id.
   *
   * @param invoiceId Invoice's id
   * @param user Logged user (provided by the JwtAuthGuard)
   * @returns Base64 invoice
   */
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Aucune facture trouvée.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Aucun fichier lié à la facture.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'File not found in the file host.' })
  @Get('download/:ID')
  async downloadBase64Invoice(@Param('ID') invoiceId: string, @Req() { user }: RequestWithLoggedUser): Promise<string> {
    return await this.invoicesService.getBase64InvoiceById(user._id.toString(), invoiceId)
  }

  /**
   * Create a new vehicle invoice.
   *
   * @param user Logged user (provided by the JwtAuthGuard)
   * @param request Create vehicle invoice request
   * @returns Created vehicle invoice
   */
  @ApiResponse({ status: HttpStatus.OK, type: VehicleInvoice, description: 'Facture créée' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Erreur inconnue. Souvent lié au repository.' })
  @Post('vehicle')
  async createVehicleInvoiceFromUser(@Req() { user }: RequestWithLoggedUser, @Body() request: CreateVehicleInvoiceRequest): Promise<VehicleInvoice> {
    const { invoiceInstance } = await this.invoicesService.createVehicleInvoiceFromUser(user._id.toString(), request)

    return invoiceInstance
  }

  /**
   * Update a vehicle invoice.
   *
   * @param invoiceId Invoice's id
   * @param user Logged user (provided by the JwtAuthGuard)
   * @param request Update vehicle invoice request
   * @returns Message response (200)
   */
  @ApiResponse({ status: HttpStatus.OK, type: MessageResponse, description: 'Facture mise à jour' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Erreur inconnue. Souvent lié au repository.' })
  @Patch('vehicle/:ID')
  async updateVehicleInvoice(
    @Param('ID') invoiceId: string,
    @Req() { user }: RequestWithLoggedUser,
    @Body() request: UpdateVehicleInvoiceRequest
  ): Promise<MessageResponse> {
    await this.invoicesService.updateVehicleInvoice(invoiceId, user._id.toString(), request)
    return new MessageResponse(200, 'La facture a bien été mise à jour')
  }

  /**
   * Delete a vehicle invoice.
   *
   * @param invoiceId Invoice's id
   * @param user Logged user (provided by the JwtAuthGuard)
   * @returns Message response (200)
   */
  @ApiResponse({ status: HttpStatus.OK, type: MessageResponse, description: 'Facture supprimée' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Facture introuvable.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Erreur inconnue. Souvent lié au repository.' })
  @Delete(':ID')
  async deleteInvoice(@Param('ID') invoiceId: string, @Req() { user }: RequestWithLoggedUser): Promise<MessageResponse> {
    await this.invoicesService.deleteInvoice(invoiceId, user._id.toString())
    return new MessageResponse(200, 'La facture a été supprimée')
  }
}
