import { TimestampedDBDocument } from '@Schemas/db-document.abstract-schema'
import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'
import { IllegalArgumentException } from '@Common/exceptions'

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class Intervention extends TimestampedDBDocument {
  @prop({ type: String, maxlength: 50, required: true })
  @Expose({ name: 'label' })
  protected _label: string

  @prop({ required: true })
  @Expose({ name: 'category' })
  protected _category: string

  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(label: string, category: string): Intervention {
    const intervention = new Intervention()
    intervention.initialize(label, category)

    return intervention
  }

  protected initialize(label: string, category: string): void {
    Intervention.validateLabel(label)
    this._label = label
    this._category = category
  }

  private static validateLabel(label: string): void {
    /* eslint-disable prettier/prettier */
    if (!label) throw new IllegalArgumentException('Label cannot be empty')
    /* eslint-enable prettier/prettier */
  }

  /* eslint-disable prettier/prettier */
  get label():    string { return this._label     }
  get skillIds(): string { return this._category  }
  /* eslint-enable prettier/prettier */

  public update(label?: string, category?: string): void {
    if (label) this._label = label
    if (category) this._category = category
  }
}
