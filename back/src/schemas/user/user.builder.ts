import { IRegisterProfessionalData, User } from '@Schemas/user/user.schema'

export class UserBuilder {
  private readonly _name: string
  private readonly _lastName: string
  private _phone: string
  private _email: string
  private _hashedPassword: string
  private _professionalData?: IRegisterProfessionalData

  constructor(name: string, lastName: string) {
    this._name = name
    this._lastName = lastName
  }

  public build(): User {
    return User.of(this._name, this._lastName, this._phone, this._email, this._hashedPassword, this._professionalData)
  }

  public setPhone(newPhone: string): this {
    this._phone = newPhone
    return this
  }

  public setEmail(newEmail: string): this {
    this._email = newEmail
    return this
  }

  public setHashedPassword(newPassword: string): this {
    this._hashedPassword = newPassword
    return this
  }

  public setProfessionalProfileIfProvided(professionalData?: IRegisterProfessionalData): this {
    this._professionalData = professionalData
    return this
  }

  get name(): string {
    return this._name
  }

  get lastName(): string {
    return this._lastName
  }

  get phone(): string {
    return this._phone
  }

  get email(): string {
    return this._email
  }

  get hashedPassword(): string {
    return this._hashedPassword
  }

  get professionalData(): IRegisterProfessionalData | undefined {
    return this._professionalData
  }
}
