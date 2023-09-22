import { NotificationTypes, NotificationTypesBlueprint } from '@Schemas/user'
import { Expose } from 'class-transformer'
import { prop } from '@typegoose/typegoose'

export class CenterClientNotificationPreferences {
  @prop({ type: Object as unknown as NotificationTypes, required: true })
  @Expose()
  protected _bookingValidated!: NotificationTypes

  @prop({ type: Object as unknown as NotificationTypes, required: true })
  @Expose()
  protected _bookingCancelled!: NotificationTypes

  constructor() {
    this._bookingValidated = new NotificationTypes()
    this._bookingCancelled = new NotificationTypes()
  }

  get bookingValidated(): NotificationTypes {
    return this._bookingValidated
  }

  get bookingCancelled(): NotificationTypes {
    return this._bookingCancelled
  }
}

export abstract class CenterClientNotificationPreferencesBlueprint extends CenterClientNotificationPreferences {
  _bookingValidated!: NotificationTypesBlueprint
  _bookingCancelled!: NotificationTypesBlueprint
}
