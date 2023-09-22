import { AdminComment, LenientAddress, PublicFile, StrictAddress } from '@/schemas/common/pojos'
import { CenterClientProfile, MissionClientProfile, Notification, ProfessionalProfile } from './pojos'
import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { Exclude, Expose, Type } from 'class-transformer'
import { SoftDeletableDBDocument } from '@/schemas/db-document.abstract-schema'
import { UserGroups } from '@/common/enums/groups/user.groups'
import { IllegalArgumentException } from '@Common/exceptions/illegal-argument.exception'
import { Sex } from '@/common/enums/schemas'
import { Vehicle } from '../vehicle/vehicle.schema'

export interface IRegisterProfessionalData {
  skillIds: string[]
  workAddress: StrictAddress
}

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class User extends SoftDeletableDBDocument {
  @prop({ type: String, maxlength: 50, required: true })
  @Expose({ name: 'name' })
  protected _name!: string

  @prop({ type: String, maxlength: 50, required: true })
  @Expose({ name: 'lastName' })
  protected _lastName!: string

  @prop({ type: String, maxlength: 15, required: true })
  @Expose({ name: 'phone', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _phone!: string

  @prop({ type: String, maxlength: 50, required: true, unique: true })
  @Expose({ name: 'email', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _email!: string

  @prop({ type: String, maxlength: 500, required: true })
  @Exclude({ toPlainOnly: true })
  protected _hashedPassword?: string

  @prop({ type: String, maxlength: 1, required: true })
  @Expose({ name: 'sex' })
  protected _sex!: Sex

  @prop({ type: Date })
  @Expose({ name: 'birthday', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _birthday?: Date

  @prop({ type: PublicFile, _id: false })
  @Type(() => PublicFile)
  @Expose({ name: 'picture' })
  protected _picture?: PublicFile

  @prop({ type: StrictAddress, _id: false })
  @Type(() => StrictAddress)
  @Expose({ name: 'homeAddress', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _homeAddress?: StrictAddress

  @prop({ type: LenientAddress, _id: false })
  @Type(() => LenientAddress)
  @Expose({ name: 'billingAddress', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _billingAddress?: LenientAddress

  @prop({ required: true })
  @Expose({ name: 'notifications', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _notifications!: Array<Notification>

  @prop({ required: true })
  @Expose({ name: 'vehiclesId', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _vehiclesId!: Array<string>

  @prop({ type: CenterClientProfile, _id: false, required: true })
  @Type(() => CenterClientProfile)
  @Expose({ name: 'centerClientProfile', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _centerClientProfile!: CenterClientProfile

  @prop({ type: MissionClientProfile, _id: false, required: true })
  @Type(() => MissionClientProfile)
  @Expose({ name: 'missionClientProfile', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _missionClientProfile!: MissionClientProfile

  @prop({ type: ProfessionalProfile, _id: false })
  @Type(() => ProfessionalProfile)
  @Expose({ name: 'professionalProfile' })
  protected _professionalProfile?: ProfessionalProfile

  @prop({ type: Array<AdminComment>, required: true })
  @Expose({ groups: [UserGroups.ADMIN_REQUEST] })
  protected _vmcComments!: Array<AdminComment>

  @prop({ type: Boolean, default: false })
  @Expose({ groups: [UserGroups.ADMIN_REQUEST] })
  protected _isEmailValidated!: boolean

  @prop({ type: Date, required: true })
  @Expose({ groups: [UserGroups.ADMIN_REQUEST] })
  protected _lastLogin!: Date

  @prop({ type: Boolean, required: true })
  @Expose({ groups: [UserGroups.ADMIN_REQUEST] })
  protected _isAdmin!: boolean

  @prop({ type: String, required: false, default: null })
  @Exclude()
  protected _currentHashedRefreshToken?: string | null

  @prop({ type: String, required: false, default: null })
  @Exclude()
  protected _passwordRecoverToken?: string | null

  @prop({ type: String, required: false, default: null })
  @Exclude()
  protected _emailChangeToken?: string | null

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(
    name: string,
    lastName: string,
    phone: string,
    email: string,
    hashedPassword: string,
    professionalData?: IRegisterProfessionalData
  ): User {
    const user = new User()
    user.initialize(name, lastName, phone, email, hashedPassword, professionalData)

    return user
  }

  protected initialize(
    name: string,
    lastName: string,
    phone: string,
    email: string,
    hashedPassword: string,
    professionalData?: IRegisterProfessionalData
  ): void {
    User.validateInputs(name, lastName, phone, email, hashedPassword, professionalData)

    this._name = name
    this._lastName = lastName
    this._phone = phone
    this._email = email
    this._hashedPassword = hashedPassword
    this._sex = Sex.OTHER

    this._professionalProfile = professionalData
      ? ProfessionalProfile.of(`${this.name} ${this.lastName}`, professionalData.skillIds, professionalData.workAddress)
      : undefined
    this._centerClientProfile = CenterClientProfile.of()
    this._missionClientProfile = MissionClientProfile.of()

    this._notifications = []
    this._vehiclesId = []
    this._vmcComments = []

    this._isEmailValidated = false
    this._lastLogin = new Date()
    this._isAdmin = false
  }

  private static validateInputs(
    name: string,
    lastName: string,
    phone: string,
    email: string,
    hashedPassword: string,
    professionalData?: IRegisterProfessionalData
  ): void {
    /* eslint-disable prettier/prettier */
    if (!name)                                                  throw new IllegalArgumentException("User's name cannot be undefined")
    if (!lastName)                                              throw new IllegalArgumentException("User's last name cannot be undefined")
    if (!phone)                                                 throw new IllegalArgumentException("User's phone cannot be undefined")
    if (!email)                                                 throw new IllegalArgumentException("User's email cannot be undefined")
    if (!hashedPassword)                                        throw new IllegalArgumentException("User's hashed password cannot be undefined")
    if (professionalData && !professionalData.skillIds.length)  throw new IllegalArgumentException("User's professional profile must contain at least one skill")
    /* eslint-enable prettier/prettier */
  }
  /* <==== INIT ====< */

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get name()                                                     : string                          { return this._name                       }
  public set name(name: string)                                                                           { this._name = name                       }

  public get lastName()                                                 : string                          { return this._lastName                   }
  public set lastName(lastName: string)                                                                   { this._lastName = lastName               }

  public get phone()                                                    : string                          { return this._phone                      }
  public set phone(phone: string)                                                                         { this._phone = phone                     }

  public get email()                                                    : string                          { return this._email                      }
  public set email(email: string)                                                                         { this._email = email                     }

  public get hashedPassword()                                           : string | undefined              { return this._hashedPassword             }

  public get sex()                                                      : Sex                             { return this._sex                        }
  public set sex(sex: Sex)                                                                                { this._sex = sex                         }

  public get birthday()                                                 : Date | undefined                { return this._birthday                   }
  public set birthday(birthday: Date | undefined)                                                         { this._birthday = birthday               }

  public get picture()                                                  : PublicFile | undefined          { return this._picture                    }
  public set picture(picture: PublicFile | undefined)                                                     { this._picture = picture                 }

  public get homeAddress()                                              : StrictAddress | undefined       { return this._homeAddress                }
  public set homeAddress(homeAddress: StrictAddress | undefined)                                          { this._homeAddress = homeAddress         }

  public get billingAddress()                                           : LenientAddress | undefined      { return this._billingAddress             }
  public set billingAddress(billingAddress: LenientAddress | undefined)                                   { this._billingAddress = billingAddress   }

  public get notifications()                                            : Notification[]                  { return this._notifications              }
  public set notifications(notifications: Notification[] )                                                { this._notifications = notifications     }

  public get vehiclesId()                                               : string[]                        { return this._vehiclesId                 }
  public set vehiclesId(vehiclesId: string[])                                                             { this._vehiclesId = vehiclesId           }

  public get centerClientProfile()                                      : CenterClientProfile             { return this._centerClientProfile        }

  public get missionClientProfile()                                     : MissionClientProfile            { return this._missionClientProfile       }

  public get professionalProfile()                                      : ProfessionalProfile | undefined { return this._professionalProfile        }

  public get vmcComments()                                              : AdminComment[]                       { return this._vmcComments                }

  public get isEmailValidated()                                         : boolean                         { return this._isEmailValidated           }

  public get lastLogin()                                                : Date                            { return this._lastLogin                  }
  public set lastLogin(lastLogin: Date)                                                                   { this._lastLogin = lastLogin             }

  public get isAdmin()                                                  : boolean                         { return this._isAdmin                    }

  public get currentHashedRefreshToken()                                : string | null | undefined       { return this._currentHashedRefreshToken  }

  public get passwordRecoverToken()                                     : string | null | undefined       { return this._passwordRecoverToken       }
  public get emailChangeToken()                                         : string | null | undefined       { return this._emailChangeToken           }
  /* eslint-enable prettier/prettier */

  /* >==== MAIN METHODS ====> */
  public getFullName(): string {
    return `${this.name} ${this.lastName}`
  }

  public addNotification(title: string, message: string, link?: string): void {
    const currentMaxNotifId = this.notifications.map((notif) => notif.id).max()
    const nextAvailableNotifId = currentMaxNotifId !== null ? currentMaxNotifId + 1 : 0

    this.notifications.push(new Notification(nextAvailableNotifId, title, message, link))
  }

  /**
   * Add a vehicule to the user's list
   * @param vehicle the vehicle to add
   * @returns the updated user's vehicle amount
   */
  public addVehicle(vehicle: Vehicle): number {
    this._vehiclesId.push(vehicle._id.toString())
    return this._vehiclesId.length
  }

  public isProfessional(): boolean {
    return !!this.professionalProfile
  }

  public removeHashedPasswordFromInstance(): void {
    delete this._hashedPassword
  }

  /* >==== ACCOUNT MANAGEMENT ====> */
  /* eslint-disable prettier/prettier */
  setCurrentHashedRefreshToken(refreshToken: string | null)   : void { this._currentHashedRefreshToken = refreshToken     }
  setPasswordRecoverToken(passwordRecoverToken: string | null): void { this._passwordRecoverToken = passwordRecoverToken  }
  setEmailChangeToken(emailChangeToken: string | null)        : void { this._emailChangeToken = emailChangeToken          }
  setHashedPassword(hashedPassword: string)                   : void { this._hashedPassword = hashedPassword              }
  setAdminStatus(isAdmin: boolean)                            : void { this._isAdmin = isAdmin                            }
  validateEmail()                                             : void { this._isEmailValidated = true                      }
  /* eslint-enable prettier/prettier */
}

export class ProfessionalUser extends User {
  @prop({ type: ProfessionalProfile, _id: false })
  @Type(() => ProfessionalProfile)
  @Expose()
  protected _professionalProfile!: ProfessionalProfile

  protected constructor() {
    super()
  }

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get professionalProfile(): ProfessionalProfile { return this._professionalProfile }
  /* eslint-enable prettier/prettier */
  /* <==== GETTERS && SETTERS ====< */
}
