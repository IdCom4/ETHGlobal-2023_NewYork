
import { Mock, SpyInstance } from 'vitest'

// eslint-disable-next-line prettier/prettier
export type GetProfileMockType = Mock<[alert?: IAlertControl], Promise<IRequestResult<IUser>>>
export type UpdateProfileMockType = Mock<[request: IUpdateProfileRequest, alert?: IAlertControl], Promise<IRequestResult<IUser>>>

export type UsersEndpointMockType = SpyInstance<[], {
  getProfile: GetProfileMockType,
  updateProfile: UpdateProfileMockType
}>

export type BuilderMocks = {
  getProfileSpy: GetProfileMockType,
  updateProfileSpy: UpdateProfileMockType,
  usersEndpointSpy: UsersEndpointMockType
}
