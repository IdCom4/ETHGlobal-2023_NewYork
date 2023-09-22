import { Module } from '@nestjs/common'
import { InvoicesService } from '@Api/invoices/invoices.service'
import { InvoicesController } from '@Api/invoices/invoices.controller'
import { ConfigService } from '@nestjs/config'
import { PdfInvoiceFactory } from '@Common/invoices/pdf-invoice.factory'
import { InvoiceRepository } from '@/repositories/invoice.repository'
import { TypegooseModule } from 'nestjs-typegoose'
import { AbstractBaseInvoice, BookingInvoice, MonthlyProfessionalInvoice, VehicleInvoice } from '@Schemas/invoice/invoice.schema'
import { HostedFilesModule } from '@Api/hosted-files/hosted-files.module'
import { VehiclesModule } from '@Api/vehicles/vehicles.module'

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoiceRepository, PdfInvoiceFactory, ConfigService],
  imports: [
    TypegooseModule.forFeature([AbstractBaseInvoice, VehicleInvoice, BookingInvoice, MonthlyProfessionalInvoice]),
    HostedFilesModule,
    VehiclesModule,
  ],
  exports: [InvoicesService, InvoiceRepository],
})
export class InvoicesModule {}
