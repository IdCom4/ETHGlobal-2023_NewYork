import { NotificationTypes } from '@Schemas/user'
import { prop } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'

export class MissionProfessionalNotificationPreferences {
  @prop({ type: NotificationTypes, required: true })
  @Expose()
  protected _newMissionReceived!: NotificationTypes

  @prop({ type: NotificationTypes, required: true })
  @Expose()
  protected _newQuoteRequired!: NotificationTypes

  @prop({ type: NotificationTypes, required: true })
  @Expose()
  protected _missionValidatedByClient!: NotificationTypes

  @prop({ type: NotificationTypes, required: true })
  @Expose()
  protected _professionalDeniedByClient!: NotificationTypes

  @prop({ type: NotificationTypes, required: true })
  @Expose()
  protected _missionCancelledByClient!: NotificationTypes

  constructor() {
    this._newMissionReceived = new NotificationTypes()
    this._newQuoteRequired = new NotificationTypes()
    this._missionValidatedByClient = new NotificationTypes()
    this._professionalDeniedByClient = new NotificationTypes()
    this._missionCancelledByClient = new NotificationTypes()
  }

  get newMissionReceived(): NotificationTypes {
    return this._newMissionReceived
  }

  get newQuoteRequired(): NotificationTypes {
    return this._newQuoteRequired
  }

  get missionValidatedByClient(): NotificationTypes {
    return this._missionValidatedByClient
  }

  get professionalDeniedByClient(): NotificationTypes {
    return this._professionalDeniedByClient
  }

  get missionCancelledByClient(): NotificationTypes {
    return this._missionCancelledByClient
  }
}

export abstract class MissionProfessionalNotificationPreferencesBlueprint extends MissionProfessionalNotificationPreferences {
  _newMissionReceived!: NotificationTypes
  _newQuoteRequired!: NotificationTypes
  _missionValidatedByClient!: NotificationTypes
  _professionalDeniedByClient!: NotificationTypes
  _missionCancelledByClient!: NotificationTypes
}
