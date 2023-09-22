import { Formula } from '@/schemas/box'
import { LegalRates } from '@/common/enums'
import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'
import { PricesUtils } from '@/common/utils/prices.utils'

export class BookingQuote {
  @prop({ type: Formula, required: false, _id: false })
  @Type(() => Formula)
  @Expose({ name: 'formula' })
  private _formula: Formula | null

  @prop({ type: Number, required: false })
  @Type(() => Number)
  @Expose({ name: 'reductionPercentage' })
  private _reductionPercentage?: number

  @prop({ type: Number, required: true })
  @Type(() => Number)
  @Expose({ name: 'totalHT' })
  private _totalHT: number

  @prop({ type: Number, required: false })
  @Type(() => Number)
  @Expose({ name: 'tva' })
  private _tva: number

  @prop({ type: Number, required: true })
  @Type(() => Number)
  @Expose({ name: 'totalTTC' })
  private _totalTTC: number

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(formula: Formula, reductionPercentage?: number): BookingQuote {
    const bookingQuote = new BookingQuote()

    bookingQuote._formula = formula

    bookingQuote._reductionPercentage = reductionPercentage || 0

    bookingQuote._totalTTC = PricesUtils.getTTCWithReduction(bookingQuote._formula.price, bookingQuote._reductionPercentage)
    bookingQuote._totalHT = PricesUtils.getHTFromTTC(bookingQuote._totalTTC, LegalRates.TVA)
    bookingQuote._tva = PricesUtils.getTVAFromHT(bookingQuote._totalHT, LegalRates.TVA)

    return bookingQuote
  }

  public static ofCustomAdminRequest(priceTTC: number): BookingQuote {
    const bookingQuote = new BookingQuote()

    bookingQuote._formula = null

    bookingQuote._totalTTC = priceTTC
    bookingQuote._totalHT = PricesUtils.getHTFromTTC(bookingQuote._totalTTC, LegalRates.TVA)
    bookingQuote._tva = PricesUtils.getTVAFromHT(bookingQuote._totalHT, LegalRates.TVA)

    return bookingQuote
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get formula():             Formula | null  { return this._formula              }
  public get reductionPercentage(): number | undefined          { return this._reductionPercentage  }
  public get totalHT():             number          { return this._totalHT              }
  public get tva():                 number          { return this._tva                  }
  public get totalTTC():            number          { return this._totalTTC             }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */
}
