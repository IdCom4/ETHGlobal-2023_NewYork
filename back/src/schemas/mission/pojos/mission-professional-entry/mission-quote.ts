import { MissionVMCFees } from '@/common/enums/schemas'
import { PricesUtils } from '@/common/utils/prices.utils'
import { prop } from '@typegoose/typegoose'
import { MissionQuoteProduct, MissionQuoteProductBlueprint } from './mission-quote-product'
import { Expose, Type } from 'class-transformer'
import { BadRequestException } from '@nestjs/common/exceptions'

export class MissionQuote {
  /* eslint-disable prettier/prettier */
  @prop({ required: true, _id: false }) @Expose({ name: 'workForces' })         @Type(() => MissionQuoteProduct)  protected _workForces: MissionQuoteProduct[]
  @prop({ required: true, _id: false }) @Expose({ name: 'consumables' })        @Type(() => MissionQuoteProduct)  protected _consumables: MissionQuoteProduct[]
  @prop({ required: true, _id: false }) @Expose({ name: 'placeAndEquipments' }) @Type(() => MissionQuoteProduct)  protected _placeAndEquipments: MissionQuoteProduct[]
  @prop({ required: true, _id: false }) @Expose({ name: 'totalHT' })                                              protected _totalHT: number
  @prop({ required: true, _id: false }) @Expose({ name: 'tvaRate' })                                              protected _tvaRate: number
  @prop({ required: true, _id: false }) @Expose({ name: 'totalTTCToClient' })                                     protected _totalTTCToClient: number
  @prop({ required: true, _id: false }) @Expose({ name: 'VMCFees' })                                              protected _VMCFees: number
  @prop({ required: true, _id: false }) @Expose({ name: 'totalTTCToProfessional' })                               protected _totalTTCToProfessional: number
  @prop({ required: true, _id: false }) @Expose({ name: 'sentAt' })                                               protected _sentAt: Date
  /* eslint-enable prettier/prettier */

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(
    tvaRate: number,
    workForces: TMissionQuoteProduct[],
    consumables: TMissionQuoteProduct[],
    placeAndEquipments: TMissionQuoteProduct[]
  ): MissionQuote {
    const quote = new MissionQuote()

    if (tvaRate < 0) throw new BadRequestException("Le taux d'assujettissement à la TVA ne peut pas être négatif")

    quote._tvaRate = tvaRate

    quote.update(workForces, consumables, placeAndEquipments)

    return quote
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get workForces():             MissionQuoteProduct[]       { return this._workForces             }
  get consumables():            MissionQuoteProduct[]       { return this._consumables            }
  get placeAndEquipments():     MissionQuoteProduct[]       { return this._placeAndEquipments     }
  get totalHT():                number                      { return this._totalHT                }
  get tvaRate():                number                      { return this._tvaRate                }
  get totalTTCToClient():       number                      { return this._totalTTCToClient       }
  get VMCFees():                number                      { return this._VMCFees                }
  get totalTTCToProfessional(): number                      { return this._totalTTCToProfessional }
  get sentAt():                 Date                        { return this._sentAt                 }
  /* eslint-enable prettier/prettier */

  /* >==== METHODS ====> */

  public update(workForces: TMissionQuoteProduct[], consumables: TMissionQuoteProduct[], placeAndEquipments: TMissionQuoteProduct[]): void {
    this._workForces = workForces.map((entry) => MissionQuoteProduct.of(entry.description, entry.quantity, entry.unitPriceHT))
    this._consumables = consumables.map((entry) => MissionQuoteProduct.of(entry.description, entry.quantity, entry.unitPriceHT))
    this._placeAndEquipments = placeAndEquipments.map((entry) => MissionQuoteProduct.of(entry.description, entry.quantity, entry.unitPriceHT))

    this._totalHT = this.getWorkForcesTotalHT() + this.getConsumableTotalHT() + this.getPlaceAndEquipmentsTotalHT()
    this._totalTTCToClient = PricesUtils.getTTCFromHT(this._totalHT, this._tvaRate)
    this._VMCFees = PricesUtils.getTTCCommissionFromPercentage(this._totalTTCToClient, MissionVMCFees.PERCENTAGE)
    this._totalTTCToProfessional = this._totalTTCToClient - this._VMCFees

    this._sentAt = new Date()
  }

  public getWorkForcesTotalHT(): number {
    return this._workForces.map((workForce) => workForce.unitPriceHT * workForce.quantity).reduce((previous, current) => previous + current, 0)
  }

  public getConsumableTotalHT(): number {
    return this._consumables.map((consumable) => consumable.unitPriceHT * consumable.quantity).reduce((previous, current) => previous + current, 0)
  }

  public getPlaceAndEquipmentsTotalHT(): number {
    return this._placeAndEquipments
      .map((placeOrEquipment) => placeOrEquipment.unitPriceHT * placeOrEquipment.quantity)
      .reduce((previous, current) => previous + current, 0)
  }
}

export abstract class MissionQuoteBlueprint extends MissionQuote {
  public _workForces: MissionQuoteProductBlueprint[]
  public _consumables: MissionQuoteProductBlueprint[]
  public _placeAndEquipments: MissionQuoteProductBlueprint[]
  public _totalHT: number
  public _tvaRate: number
  public _totalTTCToClient: number
  public _VMCFees: number
  public _totalTTCToProfessional: number
  public _sentAt: Date
}

export type TMissionQuoteProduct = { description: string; quantity: number; unitPriceHT: number }
