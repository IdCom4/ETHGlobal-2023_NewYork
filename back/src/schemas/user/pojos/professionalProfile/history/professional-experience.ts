import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'
import { FlexibleDateTimeRange, FlexibleDateTimeRangeBlueprint } from '@Schemas/common/pojos/date/flexible-date-time-range'

export interface IProfessionalExperience {
  id: number
  enterprise: string
  role: string
  dateRange: FlexibleDateTimeRange
}

export class ProfessionalExperience {
  @prop({ type: Number, required: true })
  @Expose({ name: 'id' })
  protected readonly _id!: number

  @prop({ type: String, required: true })
  @Expose({ name: 'enterprise' })
  protected _enterprise!: string

  @prop({ type: String, required: true })
  @Expose({ name: 'role' })
  protected _role!: string

  @prop({ type: FlexibleDateTimeRange, required: true })
  @Type(() => FlexibleDateTimeRange)
  @Expose({ name: 'dateRange' })
  protected _dateRange!: FlexibleDateTimeRange

  constructor(id: number, enterprise: string, role: string, dateRange: FlexibleDateTimeRange) {
    this._id = id
    this._enterprise = enterprise
    this._role = role
    this._dateRange = dateRange
  }

  /* ==== GETTERS & SETTERS ==== */
  /* eslint-disable prettier/prettier */
  public get id():                                 number           { return this._id }
  public get enterprise():                         string           { return this._enterprise }
  public set enterprise(name: string)                               { this._enterprise = name }
  public get role():                               string           { return this._role }
  public set role(address: string)                                  { this._role = address }
  public get dateRange():                  FlexibleDateTimeRange    { return this._dateRange }
  public set dateRange(dateRange: FlexibleDateTimeRange)            { this._dateRange = dateRange }

  /* eslint-enable prettier/prettier */

  update(data: Omit<IProfessionalExperience, 'id'>): void {
    this.enterprise = data.enterprise
    this.role = data.role
    this.dateRange = data.dateRange
  }

  static fromData(data: IProfessionalExperience): ProfessionalExperience {
    return new ProfessionalExperience(data.id, data.enterprise, data.role, data.dateRange)
  }
}

export abstract class ProfessionalExperienceBlueprint extends ProfessionalExperience {
  protected readonly _id!: number
  protected _enterprise!: string
  protected _role!: string
  protected _dateRange!: FlexibleDateTimeRangeBlueprint
}
