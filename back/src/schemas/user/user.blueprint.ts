import { CommentBlueprint, LenientAddressBlueprint, PublicFileBlueprint, StrictAddressBlueprint } from '@Schemas/common/pojos'
import { CenterClientProfileBlueprint, MissionClientProfileBlueprint, NotificationBlueprint, ProfessionalProfileBlueprint } from './pojos'
import { Sex } from '@Common/enums'
import { User } from '@Schemas/user/user.schema'

/**
 * [User](./user.schema.ts)
 *
 * Blueprints are used to ensure that the property names are well written when used within mongo's queries.
 * Those models must be kept up to date with their schema counterpart
 */
export abstract class UserBlueprint extends User {
  _name: string
  _lastName: string
  _phone: string
  _email: string
  _hashedPassword: string | undefined
  _sex: Sex
  _birthday: Date | undefined
  _picture: PublicFileBlueprint | undefined
  _homeAddress: StrictAddressBlueprint | undefined
  _billingAddress: LenientAddressBlueprint | undefined
  _notifications: NotificationBlueprint[]
  _vehiclesId: string[]
  _centerClientProfile: CenterClientProfileBlueprint
  _missionClientProfile: MissionClientProfileBlueprint
  _professionalProfile: ProfessionalProfileBlueprint | undefined
  _vmcComments: CommentBlueprint[]
  _isEmailValidated: boolean
  _lastLogin: Date
  _deletedAt: Date | undefined
  _isAdmin: boolean
  _currentHashedRefreshToken: string | null | undefined
  _passwordRecoverToken: string | null | undefined
  _emailChangeToken?: string | null
  createdAt: Date
  updatedAt: Date
}
