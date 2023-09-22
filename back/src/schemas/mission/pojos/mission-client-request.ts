import { PublicFile, PublicFileBlueprint, StrictAddress, StrictAddressBlueprint } from '@/schemas/common/pojos'
import { prop } from '@typegoose/typegoose'
import { Type } from 'class-transformer'

export class MissionClientRequest {
  /* eslint-disable prettier/prettier */
  @prop({ required: true })                             protected _clientId: string
  @prop({ required: true })                             protected _vehicleId: string
  @prop({ required: true })                             protected _issueIds: string[]
  @prop({ required: true })                             protected _description: string
  @prop({ required: true })                             protected _idealStartingMoment: string
  @prop({ required: true }) @Type(() => StrictAddress)  protected _idealPickupAddress: StrictAddress
  @prop({ required: true })                             protected _maxDistance: number
  @prop({ required: true })                             protected _hasSpareParts: boolean
  @prop({ required: true }) @Type(() => PublicFile)     protected _attachments: PublicFile[]
  /* eslint-enable prettier/prettier */

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(
    clientId: string,
    vehicleId: string,
    issueIds: string[],
    description: string,
    idealStartingMoment: string,
    idealPickupAddress: StrictAddress,
    maxDistance: number,
    hasSpareParts: boolean,
    attachments: PublicFile[]
  ): MissionClientRequest {
    const request = new MissionClientRequest()

    request._clientId = clientId
    request._vehicleId = vehicleId
    request._issueIds = issueIds
    request._description = description
    request._idealStartingMoment = idealStartingMoment
    request._idealPickupAddress = idealPickupAddress
    request._maxDistance = maxDistance
    request._hasSpareParts = hasSpareParts
    request._attachments = attachments

    return request
  }

  /* ==== GETTERS & SETTERS ==== */
  /* eslint-disable prettier/prettier */
  public get clientId():              string            { return this._clientId               }
  public get vehicleId():             string            { return this._vehicleId              }
  public get issueIds():              string[]          { return this._issueIds               }
  public get description():           string            { return this._description            }
  public get idealStartingMoment():   string            { return this._idealStartingMoment    }
  public get idealPickupAddress():    StrictAddress     { return this._idealPickupAddress     }
  public get maxDistance():           number            { return this._maxDistance            }
  public get hasSpareParts():         boolean           { return this._hasSpareParts          }
  public get attachments():           PublicFile[]      { return this._attachments            }
  /* eslint-enable prettier/prettier */
}

export abstract class MissionClientRequestBlueprint extends MissionClientRequest {
  public _clientId: string
  public _vehicleId: string
  public _issueIds: string[]
  public _description: string
  public _idealStartingMoment: string
  public _idealPickupAddress: StrictAddressBlueprint
  public _maxDistance: number
  public _hasSpareParts: boolean
  public _attachments: PublicFileBlueprint[]
}
