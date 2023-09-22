import { NotificationTypes } from '@Schemas/user'
import { Expose } from 'class-transformer'
import { prop } from '@typegoose/typegoose'

export class MissionClientNotificationPreferences {
  @prop({ type: NotificationTypes, required: true })
  @Expose()
  protected _newQuoteReceived!: NotificationTypes

  @prop({ type: NotificationTypes, required: true })
  @Expose()
  protected _missionFinished!: NotificationTypes

  @prop({ type: NotificationTypes, required: true })
  @Expose()
  protected _newMissionProposal!: NotificationTypes

  @prop({ type: NotificationTypes, required: true })
  @Expose()
  protected _missionCancelledByProfessional!: NotificationTypes

  constructor() {
    this._newQuoteReceived = new NotificationTypes()
    this._missionFinished = new NotificationTypes()
    this._newMissionProposal = new NotificationTypes()
    this._missionCancelledByProfessional = new NotificationTypes()
  }

  get newQuoteReceived(): NotificationTypes {
    return this._newQuoteReceived
  }

  get missionFinished(): NotificationTypes {
    return this._missionFinished
  }

  get newMissionProposal(): NotificationTypes {
    return this._newMissionProposal
  }

  get missionCancelledByProfessional(): NotificationTypes {
    return this._missionCancelledByProfessional
  }
}

export abstract class MissionClientNotificationPreferencesBlueprint extends MissionClientNotificationPreferences {
  _newQuoteReceived!: NotificationTypes
  _missionFinished!: NotificationTypes
  _newMissionProposal!: NotificationTypes
  _missionCancelledByProfessional!: NotificationTypes
}
