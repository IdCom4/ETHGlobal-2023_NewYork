import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import * as useUsersEndpointExport from '@/composables/resources/api-endpoints/users.endpoint'
import { useSessionStore } from '@/stores/sessionStore'
import { useAlertStore } from '@/stores/alertStore'

import { AlertModes, AlertStatuses, DEFAULT_REQUEST_SUCCESS_MESSAGE, NOT_LOGGED_IN_REQUEST_ERROR, Sexes } from '@/types/constants'
import { JohnDoe } from '@/tests/mockups/data/users.mockup'
import { UseFetchWrapperMockBuilder } from '@/tests/mockups/functions/APIs'

let sessionStore: ReturnType<typeof useSessionStore>
let alertStore: ReturnType<typeof useAlertStore>

beforeAll(() => {
  setActivePinia(createPinia())

  sessionStore = useSessionStore()
  alertStore = useAlertStore()
})

beforeEach(() => {
  sessionStore.$reset()
  alertStore.$reset()
  vi.resetAllMocks()
})

describe('when calling /users endpoints', () => {
  describe('when calling /users endpoints', () => {
    it('should return a user without error nor alert if calling getProfile without alert while logged in', async () => {
      sessionStore.logIn('token', JohnDoe)

      const mock = new UseFetchWrapperMockBuilder().call_setReturnData(JohnDoe).build()

      const { data, error } = await useUsersEndpointExport.useUsersEndpoint().getProfile()

      expect(mock.callSpy).toHaveBeenCalled()

      expect(data).toEqual(JohnDoe)
      expect(error).toBeNull()

      expect(sessionStore.accessToken).toEqual('token')
      expect(sessionStore.user).toEqual(JohnDoe)

      expect(alertStore.alert).toBeNull()
    })

    it('should send an alert and return a user without error if calling getProfile while logged in', async () => {
      sessionStore.logIn('token', JohnDoe)
      const alert: IAlertControl = { mode: AlertModes.ALL }

      const mock = new UseFetchWrapperMockBuilder().call_setReturnData(JohnDoe).build()

      const { data, error } = await useUsersEndpointExport.useUsersEndpoint().getProfile(alert)

      expect(mock.callSpy).toHaveBeenCalled()

      expect(data).toEqual(JohnDoe)
      expect(error).toBeNull()

      expect(sessionStore.accessToken).toEqual('token')
      expect(sessionStore.user).toEqual(JohnDoe)

      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return

      expect(alertStore.alert.status).toEqual(AlertStatuses.SUCCESS)
      expect(alertStore.alert.message).toEqual(DEFAULT_REQUEST_SUCCESS_MESSAGE)
    })

    it('should return an error if calling getProfile while not logged in', async () => {
      sessionStore.logOut()

      const mock = new UseFetchWrapperMockBuilder().build()

      const { data, error } = await useUsersEndpointExport.useUsersEndpoint().getProfile()

      expect(mock.callSpy).toHaveBeenCalledTimes(0)

      expect(data).toBeNull()
      expect(error).toBeDefined()
      if (!error) return

      expect(error.status).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.status)
      expect(error.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)

      expect(sessionStore.accessToken).toBeNull()
      expect(sessionStore.user).toBeNull()

      expect(alertStore.alert).toBeNull()
    })
  })

  describe('when calling the updateProfile method', () => {
    const profileToUpdate = JohnDoe
    const updateProfileRequest: IUpdateProfileRequest = { name: 'Jane', sex: Sexes.WOMAN }
    const expectedProfileResponse = { ...profileToUpdate, ...updateProfileRequest }

    it('should update the profile and return it with alert if i am logged in', async () => {
      sessionStore.logIn('token', JohnDoe)
      const alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Profil mis à jour' }

      const mock = new UseFetchWrapperMockBuilder().call_setReturnData(expectedProfileResponse).build()

      const { data, error } = await useUsersEndpointExport.useUsersEndpoint().updateProfile(updateProfileRequest, alert)

      expect(mock.callSpy).toHaveBeenCalled()

      expect(error).toBeFalsy()
      expect(data).toBeDefined()
      if (!data) return
      expect(data).toEqual(expectedProfileResponse)

      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return
      expect(alertStore.alert.status).toEqual(AlertStatuses.SUCCESS)
      expect(alertStore.alert.message).toEqual(alert.successMsg)
    })

    it('should update the profile and return it without alert if i am logged in', async () => {
      sessionStore.logIn('token', JohnDoe)

      const alert: IAlertControl = { mode: AlertModes.NONE }

      const mock = new UseFetchWrapperMockBuilder().call_setReturnData(expectedProfileResponse).build()

      const { data, error } = await useUsersEndpointExport.useUsersEndpoint().updateProfile(updateProfileRequest, alert)

      expect(mock.callSpy).toHaveBeenCalled()

      expect(error).toBeFalsy()
      expect(data).toBeDefined()
      if (!data) return
      expect(data).toEqual(expectedProfileResponse)

      expect(alertStore.alert).toBeNull()
    })

    it('should return an error with alert if i am not logged in', async () => {
      sessionStore.logOut()

      const alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Profil mis à jour' }

      const mock = new UseFetchWrapperMockBuilder().build()

      const { data, error } = await useUsersEndpointExport.useUsersEndpoint().updateProfile(updateProfileRequest, alert)

      expect(mock.callSpy).toHaveBeenCalledTimes(0)

      expect(data).toBeFalsy()
      expect(error).toBeDefined()
      if (!error) return
      expect(error.status).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.status)
      expect(error.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)

      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return
      expect(alertStore.alert.status).toEqual(AlertStatuses.ERROR)
      expect(alertStore.alert.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)
    })

    it('should return an error with alert if i am not logged in', async () => {
      sessionStore.logOut()

      const alert: IAlertControl = { mode: AlertModes.NONE }

      const mock = new UseFetchWrapperMockBuilder().build()

      const { data, error } = await useUsersEndpointExport.useUsersEndpoint().updateProfile(updateProfileRequest, alert)

      expect(mock.callSpy).toHaveBeenCalledTimes(0)

      expect(data).toBeFalsy()
      expect(error).toBeDefined()
      if (!error) return
      expect(error.status).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.status)
      expect(error.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)

      expect(alertStore.alert).toBeNull()
    })
  })
})
