import { User } from '@Schemas/user'
import { Expose } from 'class-transformer'

export class LoginResponse {
  @Expose()
  readonly user: User

  @Expose()
  readonly accessToken: string

  @Expose()
  readonly refreshToken: string

  constructor(user: User, accessToken: string, refreshToken: string) {
    this.user = user
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }
}
