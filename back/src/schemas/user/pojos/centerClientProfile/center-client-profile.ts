import { CenterClientNotificationPreferences, CenterClientNotificationPreferencesBlueprint } from './center-client-notification-preferences' // TODO in a long time : Check why we can't shorten this import
import { Expose } from 'class-transformer'
import { UserGroups } from '@/common/enums/groups/user.groups'
import { prop } from '@typegoose/typegoose'

export class CenterClientProfile {
  @prop({ type: Boolean, required: true })
  @Expose({ name: 'cgu' })
  protected _cgu!: boolean

  @prop({ type: Object as unknown as CenterClientNotificationPreferences, required: true })
  @Expose({ name: 'notificationPreferences' })
  protected _notificationPreferences!: CenterClientNotificationPreferences

  @prop({ required: true })
  @Expose({ name: 'bookingsId' })
  protected _bookingsId!: Array<string>

  @prop({ type: String, required: false, _id: false })
  @Expose({ name: 'customerId', groups: [UserGroups.LOGGED_REQUEST] })
  protected _customerId?: string

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(): CenterClientProfile {
    const profile = new CenterClientProfile()

    profile._cgu = true
    profile._notificationPreferences = new CenterClientNotificationPreferences()
    profile._bookingsId = []

    return profile
  }

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get cgu():                        boolean                               { return this._cgu                     }
  public get notificationPreferences():    CenterClientNotificationPreferences   { return this._notificationPreferences }
  public get bookingsId():                 string[]                              { return this._bookingsId              }
  public get customerId():                 string | undefined                    { return this._customerId              }
  /* eslint-enable prettier/prettier */

  public setCustomerId(customerId: string): void {
    this._customerId = customerId
  }
}

export abstract class CenterClientProfileBlueprint extends CenterClientProfile {
  _cgu!: boolean
  _notificationPreferences!: CenterClientNotificationPreferencesBlueprint
  _bookingsId!: Array<string>
  _customerId?: string
}
