import { TimestampedDBDocument } from '@Schemas/db-document.abstract-schema'
import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'
import { IllegalArgumentException } from '@Common/exceptions'

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class Issue extends TimestampedDBDocument {
  @prop({ type: String, maxlength: 50, required: true })
  @Expose({ name: 'label' })
  protected _label: string

  @prop({ required: true, default: [] })
  @Expose({ name: 'skillIds' })
  protected _skillIds: string[]

  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(label: string, skills?: string[]): Issue {
    const issue = new Issue()
    issue.initialize(label, skills)

    return issue
  }

  protected initialize(label: string, skills?: string[]): void {
    Issue.validateLabel(label)
    this._label = label
    this._skillIds = skills ?? []
  }

  private static validateLabel(label: string): void {
    /* eslint-disable prettier/prettier */
    if (!label) throw new IllegalArgumentException('Label cannot be empty')
    /* eslint-enable prettier/prettier */
  }

  /* eslint-disable prettier/prettier */
  get label(): string { return this._label }
  get skillIds(): string[] { return this._skillIds }
  /* eslint-enable prettier/prettier */

  public update(label?: string, skills?: string[]): void {
    if (label) this._label = label
    if (skills) this._skillIds = skills
  }
}
