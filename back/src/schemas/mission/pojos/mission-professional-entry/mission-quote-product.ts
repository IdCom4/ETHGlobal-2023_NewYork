import { BadRequestException } from '@nestjs/common'
import { prop } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'

export class MissionQuoteProduct {
  /* eslint-disable prettier/prettier */
  @prop({ required: true, _id: false }) @Expose({ name: 'description' }) protected _description: string
  @prop({ required: true, _id: false }) @Expose({ name: 'quantity' })    protected _quantity: number
  @prop({ required: true, _id: false }) @Expose({ name: 'unitPriceHT' }) protected _unitPriceHT: number
  /* eslint-enable prettier/prettier */

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(description: string, quantity: number, unitPriceHT: number): MissionQuoteProduct {
    const product = new MissionQuoteProduct()

    if (quantity < 0) throw new BadRequestException("La quantité d'un élément de devis ne peut pas être négatif")
    if (unitPriceHT < 0) throw new BadRequestException("Le prix HT d'un élément de devis ne peut pas être négatif")

    product._description = description
    product._quantity = quantity
    product._unitPriceHT = unitPriceHT

    return product
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get description(): string    { return this._description     }
  get quantity():    number    { return this._quantity        }
  get unitPriceHT(): number    { return this._unitPriceHT     }
  /* eslint-enable prettier/prettier */

  public getTotalHT(): number {
    return this._unitPriceHT * this._quantity
  }
}

export abstract class MissionQuoteProductBlueprint extends MissionQuoteProduct {
  public _description: string
  public _quantity: number
  public _unitPriceHT: number
}
