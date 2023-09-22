import { TimestampedDBDocument } from '@Schemas/db-document.abstract-schema'
import { SkillCategory } from '@Common/enums/schemas/skill.schema.enum'
import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'
import { IllegalArgumentException } from '@Common/exceptions'
import '@/extensions'

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class Skill extends TimestampedDBDocument {
  @prop({ type: String, maxlength: 50, required: true })
  @Expose({ name: 'label' })
  protected _label: string

  @prop({ required: true, default: [] })
  @Expose({ name: 'categories' })
  protected _categories: SkillCategory[]

  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(label: string, categories?: SkillCategory[]): Skill {
    const skill = new Skill()
    skill.initialize(label, categories)

    return skill
  }

  protected initialize(label: string, categories?: SkillCategory[]): void {
    Skill.validateInputs(label, categories)
    this._label = label
    this._categories = categories ?? []
  }

  private static validateInputs(label: string, categories?: SkillCategory[]): void {
    /* eslint-disable prettier/prettier */
    if (!label) throw new IllegalArgumentException('Label cannot be empty')
    if (label.length > 50) throw new IllegalArgumentException('Label cannot be longer than 50 characters')

    const unknownCategory = categories?.findNotInEnum(SkillCategory)
    if (unknownCategory) throw new IllegalArgumentException(`Category ${unknownCategory} isn't handled`)
    /* eslint-enable prettier/prettier */
  }

  /* eslint-disable prettier/prettier */
  get label(): string { return this._label }
  get categories(): SkillCategory[] { return this._categories }
  /* eslint-enable prettier/prettier */
}
