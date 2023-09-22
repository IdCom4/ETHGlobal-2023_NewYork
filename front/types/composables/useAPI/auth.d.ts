export {}

declare global {
  interface IAuthResponse {
    accessToken: string
    refreshToken: string
    user: IUser
  }
}
