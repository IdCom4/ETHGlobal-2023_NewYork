import { SoftDeletableDBDocument } from '@Schemas/db-document.abstract-schema'
import { prop } from '@typegoose/typegoose'
import { IllegalArgumentException } from '@Common/exceptions'
import '@/extensions'
import { VehicleType } from '@Common/enums/schemas/vehicle-brand.schema.enum'

export class VehicleBrand extends SoftDeletableDBDocument {
  @prop({ required: true, unique: true })
  protected _name: string

  @prop({ type: String, required: true })
  protected _vehicleType: VehicleType

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(name: string, vehicleType: VehicleType): VehicleBrand {
    const vehicleBrand = new VehicleBrand()
    vehicleBrand.initialize(name, vehicleType)

    return vehicleBrand
  }

  private initialize(name: string, vehicleType: VehicleType): void {
    VehicleBrand.validateInputs(name, vehicleType)

    this._name = name
    this._vehicleType = vehicleType
  }

  private static validateInputs(name: string, vehicleType: VehicleType): void {
    /* eslint-disable prettier/prettier */
    if (!Object.isDefined(name) || name === '') throw new IllegalArgumentException("Vehicle brand's name cannot be undefined")
    if (!Object.isDefined(vehicleType)) throw new IllegalArgumentException("Vehicle type of the brand cannot be undefined")
    /* eslint-enable prettier/prettier */
  }

  // GETTERS AND SETTERS
  /* eslint-disable prettier/prettier */
  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get vehicleType(): VehicleType {
    return this._vehicleType
  }

  set vehicleType(value: VehicleType) {
    this._vehicleType = value
  }

  /* eslint-disable prettier/prettier */

  public update(name?: string, vehicleType?: VehicleType): void {
    if (name) this.name = name
    if (vehicleType) this.vehicleType = vehicleType
  }
}
