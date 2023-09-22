import { Expose } from 'class-transformer'

export class RefreshResponse {
  @Expose()
  readonly accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}
