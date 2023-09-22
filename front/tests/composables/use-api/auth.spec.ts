import { describe, it, expect, beforeEach, beforeAll } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import * as useAuthEndpointExport from '@/composables/resources/api-endpoints/auth.endpoint'
import { useSessionStore } from '@/stores/sessionStore'
import { useAlertStore } from '@/stores/alertStore'

import { JohnDoe } from '@/tests/mockups/data/users.mockup'
import { AlertModes, AlertStatuses, MISSING_DATA_REQUEST_ERROR } from '@/types/constants'
import { UseFetchWrapperMockBuilder } from '@/tests/mockups/functions/APIs'
import { BuilderMocks } from '@/tests/mockups/functions/APIs/useFetchWrapper'

let sessionStore: ReturnType<typeof useSessionStore>
let alertStore: ReturnType<typeof useAlertStore>

const TOKEN = 'token'

beforeAll(() => {
  setActivePinia(createPinia())
  sessionStore = useSessionStore()
  alertStore = useAlertStore()
})

beforeEach(() => {
  sessionStore.$reset()
  alertStore.$reset()
})

describe('when /auth is called', () => {
  describe('when register is called', () => {
    let mock: BuilderMocks<IRequestResponse>
    const successFullMockResponse = { statusCode: 201, message: 'Votre compte a bien été créé' }
    beforeEach(() => {
      mock = new UseFetchWrapperMockBuilder<IRequestResponse>().call_setReturnData(successFullMockResponse).build()
    })

    it('should register the user and log him and return it', async () => {
      const { data, error } = await useAuthEndpointExport.useAuthEndpoint().register('name', 'lastName', 'phone', 'email', 'password', false)

      expect(mock.callSpy).toHaveBeenCalled()

      expect(data).toEqual(successFullMockResponse)
      expect(error).toBeNull()

      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return

      expect(alertStore.alert.status).toEqual(AlertStatuses.SUCCESS)
      expect(alertStore.alert.message).toEqual('Votre compte a bien été créé !')
    })

    it('should register the user and log him and return it without sending an alert', async () => {
      const alert: IAlertControl = { mode: AlertModes.ON_ERROR, errorMsg: 'this error should not happen' }

      const { data, error } = await useAuthEndpointExport
        .useAuthEndpoint()
        .register('name', 'lastName', 'phone', 'email', 'password', false, {}, alert)

      expect(mock.callSpy).toHaveBeenCalled()

      expect(data).toEqual(successFullMockResponse)
      expect(error).toBeNull()

      expect(alertStore.alert).toBeFalsy()
    })

    it('it should return an error and send an alert', async () => {
      const expectedError = MISSING_DATA_REQUEST_ERROR
      // @ts-expect-error the register call is wrong because i didn't sent it all the required parameters
      const { data, error } = await useAuthEndpointExport.useAuthEndpoint().register('name', 'lastName', 'phone')

      expect(data).toBeNull()
      expect(error).toBeDefined()
      if (!error) return

      expect(error.status).toEqual(expectedError.status)
      expect(error.message).toEqual(expectedError.message)

      expect(sessionStore.accessToken).toBeNull()
      expect(sessionStore.user).toBeNull()

      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return

      expect(alertStore.alert.status).toEqual(AlertStatuses.ERROR)
      expect(alertStore.alert.message).toEqual(expectedError.message)
    })
  })

  describe('when login is called', () => {
    let mock: BuilderMocks<IAuthResponse>
    beforeEach(() => {
      mock = new UseFetchWrapperMockBuilder<IAuthResponse>().call_setReturnData({ accessToken: TOKEN, refreshToken: 'Rtoken', user: JohnDoe }).build()
    })

    it('should log in the user and return it without sending an alert', async () => {
      const { data, error } = await useAuthEndpointExport.useAuthEndpoint().login('email', 'password')

      expect(mock.callSpy).toHaveBeenCalled()

      expect(data).toEqual(JohnDoe)
      expect(error).toBeNull()

      expect(sessionStore.accessToken).toEqual(TOKEN)
      expect(sessionStore.user).toEqual(JohnDoe)

      expect(alertStore.alert).toBeNull()
    })

    it('should log in the user and return it without sending an alert', async () => {
      const alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Vous êtes connecté' }

      const { data, error } = await useAuthEndpointExport.useAuthEndpoint().login('email', 'password', alert)

      expect(mock.callSpy).toHaveBeenCalled()

      expect(data).toEqual(JohnDoe)
      expect(error).toBeFalsy()

      expect(sessionStore.accessToken).toEqual(TOKEN)
      expect(sessionStore.user).toEqual(JohnDoe)

      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return

      expect(alertStore.alert.status).toEqual(AlertStatuses.SUCCESS)
      expect(alertStore.alert.message).toEqual(alert.successMsg)
    })

    it('it should return an error and send an alert if called with invalid credentials', async () => {
      sessionStore.logOut()

      const expectedError = MISSING_DATA_REQUEST_ERROR

      const { data, error } = await useAuthEndpointExport.useAuthEndpoint().login('', 'password')

      expect(data).toBeNull()
      expect(error).toBeDefined()
      if (!error) return

      expect(error.status).toEqual(expectedError.status)
      expect(error.message).toEqual(expectedError.message)

      expect(sessionStore.accessToken).toBeNull()
      expect(sessionStore.user).toBeNull()

      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return

      expect(alertStore.alert.status).toEqual(AlertStatuses.ERROR)
      expect(alertStore.alert.message).toEqual(expectedError.message)
    })
  })
})
