import { MissionClientNotificationPreferences, MissionClientNotificationPreferencesBlueprint } from './mission-client-notification-preferences' // TODO in a long time: Check why we can't shorten this import
import { Expose } from 'class-transformer'
import { prop } from '@typegoose/typegoose'
import { UserGroups } from '@/common/enums'

export class MissionClientProfile {
  @prop({ required: true })
  @Expose({ name: 'cgu' })
  protected _cgu!: boolean

  @prop({ type: Object as unknown as MissionClientNotificationPreferences, required: true })
  @Expose({ name: 'notificationPreferences' })
  protected _notificationPreferences!: MissionClientNotificationPreferences

  @prop({ required: true })
  @Expose({ name: 'missionsId' })
  protected _missionsId!: Array<string>

  @prop({ required: true })
  @Expose({ name: 'favoriteProfessionalsId' })
  protected _favoriteProfessionalsId!: Array<string>

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

  public static of(): MissionClientProfile {
    const profile = new MissionClientProfile()

    profile._cgu = true
    profile._notificationPreferences = new MissionClientNotificationPreferences()
    profile._missionsId = []
    profile._favoriteProfessionalsId = []

    return profile
  }

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get cgu():                     boolean                               { return this._cgu                      }
  public get notificationPreferences(): MissionClientNotificationPreferences  { return this._notificationPreferences  }
  public get missionsId():              string[]                              { return this._missionsId               }
  public get favoriteProfessionalsId(): string[]                              { return this._favoriteProfessionalsId  }
  public get customerId():              string | undefined                    { return this._customerId               }
  /* eslint-enable prettier/prettier */

  public setCustomerId(customerId: string): void {
    this._customerId = customerId
  }
}

export abstract class MissionClientProfileBlueprint extends MissionClientProfile {
  _cgu!: boolean
  _notificationPreferences!: MissionClientNotificationPreferencesBlueprint
  _missionsId!: Array<string>
  _favoriteProfessionalsId!: Array<string>
  _customerId?: string
}
