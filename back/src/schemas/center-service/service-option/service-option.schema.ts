import { PricesByVehicleType } from '@/schemas/center-service/pojos'
import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'
import { IllegalArgumentException } from '@Common/exceptions/illegal-argument.exception'
import { TimestampedDBDocument } from '@Schemas/db-document.abstract-schema'
export interface IServiceOption {
  title: string
  extraPrices: PricesByVehicleType
}

export class ServiceOption extends TimestampedDBDocument {
  @prop({ type: String, required: true })
  @Expose({ name: 'title' })
  protected _title!: string

  @prop({ type: PricesByVehicleType, required: true, _id: false })
  @Type(() => PricesByVehicleType)
  @Expose({ name: 'extraPrices' })
  protected _extraPrices!: PricesByVehicleType

  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(title: string, extraPrices?: PricesByVehicleType): ServiceOption {
    const serviceOption = new ServiceOption()
    serviceOption.initialize(title, extraPrices)

    return serviceOption
  }

  protected initialize(title: string, extraPrices?: PricesByVehicleType): void {
    ServiceOption.validateInputs(title)

    this._title = title
    this._extraPrices = extraPrices ?? new PricesByVehicleType()
  }

  private static validateInputs(title: string): void {
    /* eslint-disable prettier/prettier */
    if (!title) throw new IllegalArgumentException('CenterService\'s title cannot be undefined')
    /* eslint-enable prettier/prettier */
  }

  /* >==== GETTERS && SETTERS */
  /* eslint-disable prettier/prettier */
  public get title(): string { return this._title }
  public get extraPrices(): PricesByVehicleType { return this._extraPrices }
  /* eslint-enable prettier/prettier */

  public update(title?: string, pricesByVehicleType?: PricesByVehicleType): void {
    if (title) this._title = title
    if (pricesByVehicleType) this._extraPrices = pricesByVehicleType
  }
}
