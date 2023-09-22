import { prop } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'

export class PricesByVehicleType {
  @prop({ type: Number, required: false })
  @Expose({ name: 'priceTTC2Wheels' })
  private readonly _priceTTC2Wheels?: number

  @prop({ type: Number, required: false })
  @Expose({ name: 'priceTTC2Seats' })
  private readonly _priceTTC2Seats?: number

  @prop({ type: Number, required: false })
  @Expose({ name: 'priceTTC5Seats' })
  private readonly _priceTTC5Seats?: number

  @prop({ type: Number, required: false })
  @Expose({ name: 'priceTTC7Seats' })
  private readonly _priceTTC7Seats?: number

  constructor(priceTTC2Wheels?: number, priceTTC2Seats?: number, priceTTC5Seats?: number, priceTTC7Seats?: number) {
    this._priceTTC2Wheels = priceTTC2Wheels
    this._priceTTC2Seats = priceTTC2Seats
    this._priceTTC5Seats = priceTTC5Seats
    this._priceTTC7Seats = priceTTC7Seats
  }

  get priceTTC2Wheels(): number | undefined {
    return this._priceTTC2Wheels
  }

  get priceTTC2Seats(): number | undefined {
    return this._priceTTC2Seats
  }

  get priceTTC5Seats(): number | undefined {
    return this._priceTTC5Seats
  }

  get priceTTC7Seats(): number | undefined {
    return this._priceTTC7Seats
  }
}
