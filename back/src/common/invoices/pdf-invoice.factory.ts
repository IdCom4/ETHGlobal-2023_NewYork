import { InvoiceTemplatePath } from '@Common/enums/invoices/invoice-template-path.enum'
import { BookingInvoiceData, MissionInvoiceVariables } from '@Common/invoices/invoice.pojo'
import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as Handlebars from 'handlebars'
import * as puppeteer from 'puppeteer-core'
import * as chromium from 'chromium'
import { Mission } from '@/schemas/mission'
import { DateOptions, TimezoneConverter } from '../interceptors'
import { Vehicle } from '@/schemas/vehicle'
import { ProfessionalUser, User } from '@/schemas/user'
import { LenientAddress } from '@/schemas/common/pojos'

/**
 * Represents a factory to generate PDF invoices.
 *
 */
@Injectable()
export class PdfInvoiceFactory {
  private readonly _timezoneConverter: TimezoneConverter

  constructor() {
    this._timezoneConverter = new TimezoneConverter(new DateOptions('fr-FR', 'Europe/Paris', { year: 'numeric', month: 'long', day: 'numeric' }))
  }

  async createBookingInvoiceFile(data: BookingInvoiceData): Promise<TBase64File> {
    const dataWithFormattedDates = this.formatObjectDatesToFrench(data)
    return await this.generateInvoice(InvoiceTemplatePath.BOOKING, dataWithFormattedDates)
  }

  async createVehicleInvoiceFile(
    mission: Mission,
    vehicle: Vehicle,
    client: User,
    professional: ProfessionalUser,
    invoiceNumber: number
  ): Promise<TBase64File> {
    // get billing informations
    const clientBillingAddress =
      client.billingAddress || client.homeAddress || LenientAddress.of('Rue non renseignée', 'Ville non renseignée', 'Code non renseigné')
    const proBillingAddress =
      professional.professionalProfile.billingAddress ||
      professional.professionalProfile.workAddress ||
      professional.homeAddress ||
      LenientAddress.of('Rue non renseignée', 'Ville non renseignée', 'Code non renseigné')

    // get quote
    const quote = mission.getChosenProfessionalEntry().proposal.quote

    // cast quote data to html strings
    const HTMLWorkForces = quote.workForces.reduce((prev, current) => {
      const description = `<div class="col1">${current.description}</div>`
      const quantity = `<div class="colR">${current.quantity}</div>`
      const unitPriceHT = `<div class="colR">${current.unitPriceHT}</div>`
      const totalHT = `<div class="colR">${current.getTotalHT()} &euro;</div>`

      return prev + `<div class="row">${description}${quantity}${unitPriceHT}${totalHT}</div>`
    }, '')

    const HTMLConsumables = quote.consumables.reduce((prev, current) => {
      const description = `<div class="col1">${current.description}</div>`
      const quantity = `<div class="colR">${current.quantity}</div>`
      const unitPriceHT = `<div class="colR">${current.unitPriceHT}</div>`
      const totalHT = `<div class="colR">${current.getTotalHT()} &euro;</div>`

      return prev + `<div class="row">${description}${quantity}${unitPriceHT}${totalHT}</div>`
    }, '')

    const HTMLPlaceAndEquipments = quote.placeAndEquipments.reduce((prev, current) => {
      const description = `<div class="col1">${current.description}</div>`
      const quantity = `<div class="colR">${current.quantity}</div>`
      const unitPriceHT = `<div class="colR">${current.unitPriceHT}</div>`
      const totalHT = `<div class="colR">${current.getTotalHT()} &euro;</div>`

      return prev + `<div class="row">${description}${quantity}${unitPriceHT}${totalHT}</div>`
    }, '')

    const payload: MissionInvoiceVariables = {
      invoiceNumber,
      todayDate: this.formatDatesToFrench(new Date()),
      vehicle: `${vehicle.model} | ${vehicle.plate}`,
      professionalName: professional.getFullName(),
      professionalStreet: proBillingAddress.street,
      professionalZipCodeAndCity: `${proBillingAddress.zipCode} ${proBillingAddress.city}`,
      clientName: client.getFullName(),
      clientStreet: clientBillingAddress.street,
      clientZipCodeAndCity: `${clientBillingAddress.zipCode} ${clientBillingAddress.city}`,
      mileage: mission.report?.vehicleMileage || 0,
      placeAndEquipments: HTMLPlaceAndEquipments,
      workForces: HTMLWorkForces,
      consumables: HTMLConsumables,
      tvaMessage: quote.tvaRate ? `TVA ${quote.tvaRate}%` : '« TVA non applicable - article 2938 du CGI »',
      totalHT: quote.totalHT.toFixed(2),
      TVAOnly: (quote.totalTTCToClient - quote.totalHT).toFixed(2),
      totalTTC: quote.totalTTCToClient.toFixed(2),
    }

    return await this.generateInvoice(InvoiceTemplatePath.MISSION, payload)
  }

  private async generateInvoice(invoiceTemplatePath: InvoiceTemplatePath, data: object): Promise<TBase64File> {
    // Populate the template with data
    const templateHtml = fs.readFileSync(invoiceTemplatePath, 'utf8')
    const template = Handlebars.compile(templateHtml)
    const html = template({ ...data, todayDate: new Date() })

    // Launch Puppeteer and navigate to the page
    const browser = await puppeteer.launch({
      executablePath: chromium.path,
      headless: true,
    })
    const page = await browser.newPage()
    await page.setContent(html)

    // Generate PDF and close the browser
    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close()

    // Convert the PDF Buffer to a Base64 string
    // Return the Base64 string
    return 'data:application/pdf;base64,' + pdfBuffer.toString('base64')
  }

  private formatObjectDatesToFrench(data: object): object {
    return this._timezoneConverter.convert(data) as object
  }

  private formatDatesToFrench(data: string | Date): string {
    return this._timezoneConverter.convert(data) as string
  }
}
