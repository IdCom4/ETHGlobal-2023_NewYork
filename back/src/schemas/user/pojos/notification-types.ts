import { prop } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'

export class NotificationTypes {
  @prop({ type: Boolean, required: true })
  @Expose({ name: 'email' })
  protected _email!: boolean

  @prop({ type: Boolean, required: true })
  @Expose({ name: 'sms' })
  protected _sms!: boolean

  constructor() {
    this._email = true
    this._sms = true
  }

  get email(): boolean {
    return this._email
  }

  get sms(): boolean {
    return this._sms
  }

  public switchEmailNotification(): void {
    this._email = !this._email
  }

  public switchSmsNotification(): void {
    this._sms = !this._sms
  }
}

export abstract class NotificationTypesBlueprint extends NotificationTypes {
  _email!: boolean
  _sms!: boolean
}
