import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { TimestampedDBDocument } from '@Schemas/db-document.abstract-schema'
import { PublicFile } from '@Schemas/common/pojos'
import { BoxCategories } from '@Common/enums/schemas/box.schema.enum'
import { PricesByVehicleType } from '@/schemas/center-service/pojos'
import { Exclude, Expose, Type } from 'class-transformer'
import { IllegalArgumentException } from '@Common/exceptions/illegal-argument.exception'
import '@/extensions'

export interface ICenterServiceUpdate {
  title: string
  subtitle: string
  description: string
  isActive: boolean
  picture: PublicFile
  numberOfSales?: number
  optionIds?: string[]
  categories?: BoxCategories[]
  prices?: PricesByVehicleType
}

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class CenterService extends TimestampedDBDocument {
  @prop({ type: String, required: true })
  @Expose({ name: 'title' })
  protected _title!: string

  @prop({ type: String, required: true })
  @Expose({ name: 'subtitle' })
  protected _subtitle!: string

  @prop({ required: true, default: [] })
  @Expose({ name: 'optionIds' })
  protected _optionIds!: string[]

  @prop({ type: PricesByVehicleType, required: true, _id: false })
  @Type(() => PricesByVehicleType)
  @Expose({ name: 'prices' })
  protected _prices!: PricesByVehicleType

  @prop({ required: true })
  @Expose({ name: 'categories' })
  protected _categories!: BoxCategories[]

  @prop({ type: String, required: true })
  @Expose({ name: 'description' })
  protected _description!: string

  @prop({ type: Number, required: true, default: 0 })
  @Expose({ name: 'numberOfSales' })
  protected _numberOfSales!: number

  @prop({ type: Boolean, required: true })
  @Expose({ name: 'isActive' })
  protected _isActive!: boolean

  @prop({ type: PublicFile, required: true })
  @Expose({ name: 'picture' })
  protected _picture!: PublicFile

  @prop({ type: Date, required: false })
  @Exclude()
  protected _deletedAt?: Date

  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(
    title: string,
    subtitle: string,
    description: string,
    isActive: boolean,
    picture: PublicFile,
    numberOfSales?: number,
    optionIds?: string[],
    categories?: BoxCategories[],
    prices?: PricesByVehicleType
  ): CenterService {
    const centerService = new CenterService()
    centerService.initialize(title, subtitle, description, isActive, picture, numberOfSales, optionIds, categories, prices)

    return centerService
  }

  protected initialize(
    title: string,
    subtitle: string,
    description: string,
    isActive: boolean,
    picture: PublicFile,
    numberOfSales?: number,
    optionIds?: string[],
    categories?: BoxCategories[],
    prices?: PricesByVehicleType
  ): void {
    CenterService.validateInputs(title, subtitle, description, isActive, picture, numberOfSales, categories)

    this._title = title
    this._subtitle = subtitle
    this._description = description
    this._isActive = isActive
    this._picture = picture
    this._numberOfSales = numberOfSales ?? 0
    this._optionIds = optionIds ?? []
    this._categories = categories ?? []
    this._prices = prices ?? new PricesByVehicleType()
  }

  private static validateInputs(
    title: string,
    subtitle: string,
    description: string,
    isActive: boolean,
    picture: PublicFile,
    numberOfSales?: number,
    categories?: BoxCategories[]
  ): void {
    /* eslint-disable prettier/prettier */
    if (!title) throw new IllegalArgumentException('CenterService\'s title cannot be undefined or empty')
    if (!subtitle) throw new IllegalArgumentException('CenterService\'s subtitle cannot be undefined or empty')
    if (!description) throw new IllegalArgumentException('CenterService\'s description cannot be undefined or empty')
    if (!Object.isDefined(isActive)) throw new IllegalArgumentException('CenterService\'s active state cannot be undefined or empty')
    if (!picture) throw new IllegalArgumentException('CenterService\'s picture cannot be undefined or empty')
    if (numberOfSales && numberOfSales < 0) throw new IllegalArgumentException('CenterService\'s number of sales cannot be negative')
    const unknownCategory = categories?.findNotInEnum(BoxCategories)
    if (unknownCategory) throw new IllegalArgumentException(`Category ${unknownCategory} isn't handled`)
    /* eslint-enable prettier/prettier */
  }

  /* >==== GETTERS && SETTERS */

  /* eslint-disable prettier/prettier */
  public get title(): string { return this._title }
  public get subtitle(): string { return this._subtitle }
  public get optionIds(): string[] { return this._optionIds }
  public get prices(): PricesByVehicleType { return this._prices }
  public get categories(): BoxCategories[] { return this._categories }
  public get description(): string { return this._description }
  public get numberOfSales(): number { return this._numberOfSales }
  public get isActive(): boolean { return this._isActive }
  public get picture(): PublicFile { return this._picture }
  public get deletedAt(): Date | undefined { return this._deletedAt }
  /* eslint-enable prettier/prettier */

  public update(data: Partial<ICenterServiceUpdate>): void {
    if (data.title) this._title = data.title
    if (data.subtitle) this._subtitle = data.subtitle
    if (data.optionIds) this._optionIds = data.optionIds
    if (data.prices) this._prices = data.prices
    if (data.categories) this._categories = data.categories
    if (data.description) this._description = data.description
    if (data.numberOfSales) this._numberOfSales = data.numberOfSales
    if (data.isActive) this._isActive = data.isActive
    if (data.picture) this._picture = data.picture
  }

  public deactivate(): void {
    this._isActive = false
  }

  public softDelete(): void {
    this._deletedAt = new Date()
  }

  public isSoftDeleted(): boolean {
    return !!this._deletedAt
  }
}
