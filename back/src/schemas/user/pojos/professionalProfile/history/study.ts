import { LenientAddress, LenientAddressBlueprint } from '@/schemas/common/pojos'
import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'
import { FlexibleDateTimeRange } from '@Schemas/common/pojos/date/flexible-date-time-range'

export interface IStudy {
  id: number
  schoolName: string
  schoolAddress?: LenientAddress
  grade: string
  description?: string
  dateRange: FlexibleDateTimeRange
}

export class Study implements IStudy {
  @prop({ type: Number, required: true })
  @Expose({ name: 'id' })
  protected readonly _id!: number

  @prop({ type: String, required: true })
  @Expose({ name: 'schoolName' })
  protected _schoolName!: string

  @prop({ type: LenientAddress, required: true })
  @Type(() => LenientAddress)
  @Expose({ name: 'schoolAddress' })
  protected _schoolAddress?: LenientAddress

  @prop({ type: String, required: true })
  @Expose({ name: 'grade' })
  protected _grade!: string

  @prop({ type: String, required: true })
  @Expose({ name: 'description' })
  protected _description?: string

  @prop({ type: FlexibleDateTimeRange, required: true })
  @Type(() => FlexibleDateTimeRange)
  @Expose({ name: 'dateRange' })
  protected _dateRange!: FlexibleDateTimeRange

  constructor(
    id: number,
    schoolName: string,
    schoolAddress: LenientAddress | undefined,
    grade: string,
    description: string | undefined,
    dateRange: FlexibleDateTimeRange
  ) {
    this._id = id
    this._schoolName = schoolName
    this._schoolAddress = schoolAddress
    this._grade = grade
    this._description = description
    this._dateRange = dateRange
  }

  /* ==== GETTERS & SETTERS ==== */
  /* eslint-disable prettier/prettier */
  public get id():                                               number                       { return this._id                    }
  public get schoolName():                                       string                       { return this._schoolName            }
  public set schoolName(name: string)                                                         { this._schoolName = name            }
  public get schoolAddress():                                    LenientAddress | undefined   { return this._schoolAddress         }
  public set schoolAddress(address: LenientAddress | undefined)                               { this._schoolAddress = address      }
  public get grade():                                            string                       { return this._grade                 }
  public set grade(grade: string)                                                             { this._grade = grade                }
  public get description():                                      string | undefined           { return this._description           }
  public set description(description: string | undefined)                                     { this._description = description    }
  public get dateRange():                                        FlexibleDateTimeRange        { return this._dateRange             }
  public set dateRange(dateRange: FlexibleDateTimeRange)                                      { this._dateRange = dateRange        }

  /* eslint-enable prettier/prettier */

  update(data: Omit<IStudy, 'id'>): void {
    this.schoolName = data.schoolName
    this.schoolAddress = data.schoolAddress
    this.grade = data.grade
    this.description = data.description
    this.dateRange = data.dateRange
  }

  static fromData(data: IStudy): Study {
    return new Study(data.id, data.schoolName, data.schoolAddress, data.grade, data.description, data.dateRange)
  }
}

export abstract class StudyBlueprint extends Study {
  _id: number
  _schoolName: string
  _schoolAddress?: LenientAddressBlueprint
  _grade: string
  _description?: string
  _dateRange: FlexibleDateTimeRange
}
