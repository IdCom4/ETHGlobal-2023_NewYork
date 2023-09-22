import { Injectable } from '@nestjs/common'
import { AbstractPolymorphRepository } from '@/repositories/base/abstract.repository'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { AbstractBaseInvoice, BookingInvoice, MonthlyProfessionalInvoice, VehicleInvoice } from '@Schemas/invoice/invoice.schema'
import {
  BaseInvoiceBlueprint,
  BookingInvoiceBlueprint,
  MonthlyProfessionalInvoiceBlueprint,
  VehicleInvoiceBlueprint,
} from '@Schemas/invoice/invoice.blueprint'
import { InstantiatingDataWrapper } from '@Common/classes'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import mongoose from 'mongoose'
import { InvoiceTypes } from '@Common/enums/schemas/invoice.schema.enum'

@Injectable()
export class InvoiceRepository extends AbstractPolymorphRepository<AbstractBaseInvoice, BaseInvoiceBlueprint> {
  private readonly vehicleInvoiceModel: ReturnModelType<typeof VehicleInvoice>
  private readonly bookingInvoiceModel: ReturnModelType<typeof BookingInvoice>
  private readonly monthlyInvoiceModel: ReturnModelType<typeof MonthlyProfessionalInvoice>

  constructor(
    @InjectModel(AbstractBaseInvoice) model: ReturnModelType<typeof AbstractBaseInvoice>,
    @InjectModel(VehicleInvoice) vehicleInvoiceModel: ReturnModelType<typeof VehicleInvoice>,
    @InjectModel(BookingInvoice) bookingInvoiceModel: ReturnModelType<typeof BookingInvoice>,
    @InjectModel(MonthlyProfessionalInvoice) monthlyInvoiceModel: ReturnModelType<typeof MonthlyProfessionalInvoice>
  ) {
    super(model, AbstractBaseInvoice)
    this.vehicleInvoiceModel = vehicleInvoiceModel
    this.bookingInvoiceModel = bookingInvoiceModel
    this.monthlyInvoiceModel = monthlyInvoiceModel
  }

  public findVehicleInvoice(
    id: string | mongoose.Types.ObjectId,
    clientId: string
  ): InstantiatingDataWrapper<Promise<VehicleInvoice>, VehicleInvoice, TClassConstructor<VehicleInvoice>, VehicleInvoiceBlueprint> {
    return this.findChildBy<VehicleInvoice, VehicleInvoiceBlueprint>(
      { _id: id, _clientId: clientId, _invoiceType: InvoiceTypes.VEHICLE },
      { targetClass: VehicleInvoice }
    )
  }

  public findMonthlyInvoice(
    id: string | mongoose.Types.ObjectId,
    professionalId: string
  ): InstantiatingDataWrapper<
    Promise<MonthlyProfessionalInvoice>,
    MonthlyProfessionalInvoice,
    TClassConstructor<MonthlyProfessionalInvoice>,
    MonthlyProfessionalInvoiceBlueprint
  > {
    return this.findChildBy<MonthlyProfessionalInvoice, MonthlyProfessionalInvoiceBlueprint>(
      { _id: id, _professionalId: professionalId, _invoiceType: InvoiceTypes.MONTHLY },
      { targetClass: MonthlyProfessionalInvoice }
    )
  }

  public findBookingInvoice(
    id: string | mongoose.Types.ObjectId,
    clientId: string
  ): InstantiatingDataWrapper<Promise<BookingInvoice>, BookingInvoice, TClassConstructor<BookingInvoice>, BookingInvoiceBlueprint> {
    return this.findChildBy<BookingInvoice, BookingInvoiceBlueprint>(
      { _id: id, _clientId: clientId, _invoiceType: InvoiceTypes.BOOKING },
      { targetClass: BookingInvoice }
    )
  }

  public async create(instance: AbstractBaseInvoice): Promise<AbstractBaseInvoice> {
    if (instance instanceof VehicleInvoice) {
      const savedDocument = await new this.vehicleInvoiceModel(instance).save()
      return await this.findVehicleInvoice(savedDocument._id, instance.clientId).getOrThrow(new InternalServerErrorException())
    }
    if (instance instanceof BookingInvoice) {
      const savedDocument = await new this.bookingInvoiceModel(instance).save()
      return await this.findBookingInvoice(savedDocument._id, instance.clientId).getOrThrow(new InternalServerErrorException())
    }
    if (instance instanceof MonthlyProfessionalInvoice) {
      const savedDocument = await new this.monthlyInvoiceModel(instance).save()
      return await this.findMonthlyInvoice(savedDocument._id, instance.professionalId).getOrThrow(new InternalServerErrorException())
    }

    throw new InternalServerErrorException('Creating an unknown invoice type:' + instance.invoiceType)
  }

  public async update(query: TMongoQuery<BaseInvoiceBlueprint>): Promise<boolean> {
    let modelToUse
    switch (query.filter._invoiceType) {
      case InvoiceTypes.VEHICLE:
        modelToUse = this.vehicleInvoiceModel
        break
      case InvoiceTypes.BOOKING:
        modelToUse = this.bookingInvoiceModel
        break
      case InvoiceTypes.MONTHLY:
        modelToUse = this.monthlyInvoiceModel
        break
      default:
        throw new InternalServerErrorException('Updating an unknown invoice type:' + query.filter._invoiceType)
    }

    const updateResult: TMongoUpdateResult = (await modelToUse
      .updateOne(query.filter, query.update, query.options)
      .lean()
      .exec()) as unknown as TMongoUpdateResult

    return !!updateResult.modifiedCount
  }

  public async updateAsIs(instance: AbstractBaseInvoice): Promise<boolean> {
    let modelToUse
    switch (instance.invoiceType) {
      case InvoiceTypes.VEHICLE:
        modelToUse = this.vehicleInvoiceModel
        break
      case InvoiceTypes.BOOKING:
        modelToUse = this.bookingInvoiceModel
        break
      case InvoiceTypes.MONTHLY:
        modelToUse = this.monthlyInvoiceModel
        break
      default:
        throw new InternalServerErrorException('Updating an unknown invoice type:' + instance.invoiceType)
    }

    const updateResult: TMongoUpdateResult = (await modelToUse
      .updateOne({ _id: instance._id }, instance)
      .lean()
      .exec()) as unknown as TMongoUpdateResult

    return !!updateResult.modifiedCount
  }

  public async getNextInvoiceNumber(): Promise<number> {
    return await this.model.countDocuments({}).exec()
  }
}
