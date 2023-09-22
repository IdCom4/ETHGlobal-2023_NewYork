import { UserGroups } from '@/common/enums'
import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'

export class ContactInfo {
  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'name', groups: [UserGroups.ADMIN_REQUEST] })
  private _name: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'lastName', groups: [UserGroups.ADMIN_REQUEST] })
  private _lastName: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'email', groups: [UserGroups.ADMIN_REQUEST] })
  private _email: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'phone', groups: [UserGroups.ADMIN_REQUEST] })
  private _phone: string

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(name: string, lastName: string, phone: string, email: string): ContactInfo {
    const contactInfo = new ContactInfo()

    contactInfo._name = name
    contactInfo._lastName = lastName
    contactInfo._phone = phone
    contactInfo._email = email

    return contactInfo
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get name():      string  { return this._name     }
  public get lastName():  string  { return this._lastName }
  public get phone():     string  { return this._phone    }
  public get email():     string  { return this._email    }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS & SETTERS ====< */
}
