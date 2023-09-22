import { vi } from 'vitest'
import * as usersEndpointExport from '@/composables/resources/api-endpoints/users.endpoint'
import { UsersEndpointMockType, BuilderMocks } from './types'
import { AbstractEndpointsMockBuilder, EndpointConfiguration } from '../../types.d'

export class UseUsersEndpointMockBuilder extends AbstractEndpointsMockBuilder<BuilderMocks> {
  protected readonly endpoints = {
    // eslint-disable-next-line prettier/prettier
    getProfile: new EndpointConfiguration<IUser, [alert?: IAlertControl], (alert: IAlertControl) => void>(),
    updateProfile: new EndpointConfiguration<IUser, [request: IUpdateProfileRequest, alert?: IAlertControl], (request: IUpdateProfileRequest, alert: IAlertControl) => void>()
  }

  build(): BuilderMocks {
    // setup getProfile spy
    const getProfileSpy = this.endpoints.getProfile.buildSpy()

    // setup updateProfile spy
    const updateProfileSpy = this.endpoints.updateProfile.buildSpy()

    const usersEndpointSpy = vi
      .spyOn(usersEndpointExport, 'useUsersEndpoint')
      .mockReturnValue({ getProfile: getProfileSpy, updateProfile: updateProfileSpy }) as UsersEndpointMockType

    // and return the full mock
    return {
      getProfileSpy,
      updateProfileSpy,
      usersEndpointSpy
    }
  }

  // setup getProfile
  getProfile_setFunctionToTestParameters(callback: (alert?: IAlertControl) => void): this {
    this.endpoints.getProfile.setFunctionToTestParameters(callback)
    return this
  }

  getProfile_setResponse(response: IRequestResult<IUser>): this {
    this.endpoints.getProfile.setResponse(response)
    return this
  }

  getProfile_setResponseData(data: IUser): this {
    this.endpoints.getProfile.setResponseData(data)
    return this
  }

  getProfile_setResponseError(error: IRequestError): this {
    this.endpoints.getProfile.setResponseError(error)
    return this
  }

  // setup updateProfil
  updateProfile_setFunctionToTestParameters(callback: (request: IUpdateProfileRequest, alert?: IAlertControl) => void): this {
    this.endpoints.updateProfile.setFunctionToTestParameters(callback)
    return this
  }

  updateProfile_setResponse(response: IRequestResult<IUser>): this {
    this.endpoints.updateProfile.setResponse(response)
    return this
  }

  updateProfile_setResponseData(data: IUser): this {
    this.endpoints.updateProfile.setResponseData(data)
    return this
  }

  updateProfile_setResponseError(error: IRequestError): this {
    this.endpoints.updateProfile.setResponseError(error)
    return this
  }
}
