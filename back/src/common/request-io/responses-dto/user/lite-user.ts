import { PublicFile } from '@/schemas/common/pojos'
import { ProfessionalProfile, ProfessionalUser, User } from '@/schemas/user'
import { Expose, Type } from 'class-transformer'
import { LiteProfessionalProfileResponse } from './pojos/lite-professional-profile'

export class LiteUserResponse {
  /* eslint-disable prettier/prettier */
  @Expose()                         public _id: string
  @Expose()                         public name: string
  @Expose()                         public lastName: string
  @Expose() @Type(() => PublicFile) public picture?: PublicFile
  /* eslint-enable prettier/prettier */

  constructor(user: User) {
    this._id = user._id.toString()
    this.name = user.name
    this.lastName = user.lastName
    this.picture = user.picture
  }
}

export class LiteProfessionalResponse extends LiteUserResponse {
  @Expose() @Type(() => ProfessionalProfile) public professionalProfile: LiteProfessionalProfileResponse

  constructor(professional: ProfessionalUser) {
    super(professional)

    this.professionalProfile = new LiteProfessionalProfileResponse(professional.professionalProfile)
  }
}
