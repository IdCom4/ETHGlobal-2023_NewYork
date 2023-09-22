import { BadRequestException } from '@nestjs/common/exceptions'
import { prop } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'

export class MissionReport {
  /* eslint-disable prettier/prettier */
  @prop({ required: true, _id: false }) @Expose({ name: 'vehicleMileage' })     protected _vehicleMileage: number
  @prop({ required: true, _id: false }) @Expose({ name: 'interventionIds' })    protected _interventionIds: string[]
  @prop({ required: true, _id: false }) @Expose({ name: 'otherInterventions' }) protected _otherInterventions: string[]
  /* eslint-enable prettier/prettier */

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(vehicleMileage: number, interventionIds: string[], otherInterventions: string[]): MissionReport {
    const report = new MissionReport()

    if (!interventionIds.length && !otherInterventions.length)
      throw new BadRequestException('Vous devez renseigner au moins une intervention parmis la liste proposée ou marquée manuellement')

    report._vehicleMileage = vehicleMileage
    report._interventionIds = interventionIds
    report._otherInterventions = otherInterventions

    return report
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get vehicleMileage():       number       { return this._vehicleMileage          }
  get interventionIds():      string[]     { return this._interventionIds         }
  get otherInterventions():   string[]     { return this._otherInterventions      }
  /* eslint-enable prettier/prettier */
}

export abstract class MissionReportBlueprint extends MissionReport {
  public _vehicleMileage: number
  public _interventionIds: string[]
  public _otherInterventions: string[]
}
