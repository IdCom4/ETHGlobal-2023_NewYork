import { SoftDeletableDBDocument } from '@Schemas/db-document.abstract-schema'
import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { IllegalArgumentException } from '@Common/exceptions'
import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import '@/extensions'

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class Vehicle extends SoftDeletableDBDocument {
  @prop({ type: String, maxlength: 24, required: true })
  protected _ownerId: string

  @prop({ type: String, maxlength: 50, required: true })
  protected _model: string

  @prop({ type: String, maxlength: 50, required: true })
  // When requesting a vehicle, the brand is populated with the brand's name and the key will be exposed as brand.
  protected _brandId: string

  @prop({ type: Number, required: true })
  protected _year: number

  @prop({ type: String, maxlength: 10, required: true })
  protected _plate: string

  @prop({ type: Number, required: true })
  protected _mileage: number

  @prop({ required: true })
  protected _invoiceIds: string[]

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(ownerId: string, model: string, brandId: string, year: number, plate: string, mileage: number): Vehicle {
    const vehicle = new Vehicle()
    vehicle.initialize(ownerId, model, brandId, year, plate, mileage)

    return vehicle
  }

  private initialize(ownerId: string, model: string, brandId: string, year: number, plate: string, mileage: number): void {
    Vehicle.validateInputs(ownerId, model, brandId, year, plate, mileage)

    this._ownerId = ownerId
    this._model = model
    this._brandId = brandId
    this._year = year
    this._plate = plate
    this._mileage = mileage
    this._invoiceIds = []
  }

  private static validateInputs(ownerId: string, model: string, brandId: string, year: number, plate: string, mileage: number): void {
    /* eslint-disable prettier/prettier */
    if (!Object.isDefined(ownerId) || ownerId === '') throw new IllegalArgumentException("Vehicle's owner ID cannot be undefined")
    if (!Object.isDefined(model) || model === '')     throw new IllegalArgumentException("Vehicle's model cannot be undefined")
    if (!Object.isDefined(brandId) || brandId === '')     throw new IllegalArgumentException("Vehicle's brandId cannot be undefined")
    if (!Object.isDefined(year))                      throw new IllegalArgumentException("Vehicle's year cannot be undefined")
    if (!Object.isDefined(plate) || plate === '')     throw new IllegalArgumentException("Vehicle's plate cannot be undefined")
    if (!Object.isDefined(mileage))                   throw new IllegalArgumentException( "Vehicle's mileage cannot be undefined" )
    /* eslint-enable prettier/prettier */
  }

  // GETTERS AND SETTERS
  /* eslint-disable prettier/prettier */
  get ownerId(): string { return this._ownerId }
  get model(): string { return this._model }
  get brandId(): string { return this._brandId }
  get year(): number { return this._year }
  get plate(): string { return this._plate }
  get mileage(): number { return this._mileage }
  get invoiceIds(): string[] { return this._invoiceIds }

  /* eslint-enable prettier/prettier */

  // METHODS
  public addInvoiceId(invoiceId: string): void {
    if (this._invoiceIds.includes(invoiceId))
      throw new IllegalArgumentException('Trying to add already known invoice from vehicle. InvoiceId:' + invoiceId)

    this._invoiceIds.push(invoiceId)
  }

  public removeInvoice(invoiceId: string): void {
    if (!this._invoiceIds.includes(invoiceId))
      throw new IllegalArgumentException('Trying to remove unknown invoice from vehicle. InvoiceId:' + invoiceId)

    this._invoiceIds.removeInPlace((entry) => entry === invoiceId)
  }

  public update(model?: string, plate?: string, mileage?: number, brandId?: string, year?: number): void {
    if (model) this._model = model
    if (plate) this._plate = plate
    if (mileage) this._mileage = mileage
    if (brandId) this._brandId = brandId
    if (year) this._year = year
  }

  public defineBrand(vehicleBrand: VehicleBrand | undefined): Vehicle {
    this._brandId = vehicleBrand ? vehicleBrand.name : 'DELETED'
    return this
  }
}
