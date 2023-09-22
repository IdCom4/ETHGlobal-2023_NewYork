import { describe, it, expect, beforeEach, beforeAll, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfessionalsEndpoint } from '@/composables/resources/api-endpoints/professionals.endpoint'
import { useSessionStore } from '@/stores/sessionStore'
import { useAlertStore } from '@/stores/alertStore'

import { JohnDoe } from '@/tests/mockups/data/users.mockup'
import { AlertStatuses, NOT_LOGGED_IN_REQUEST_ERROR, NOT_PROFESSIONAL_REQUEST_ERROR } from '@/types/constants'
import { UseFetchWrapperMockBuilder } from '@/tests/mockups/functions/APIs'

beforeAll(() => {
  setActivePinia(createPinia())
})

describe('when calling useProfessionalsEndpoint', () => {
  let sessionStore: ReturnType<typeof useSessionStore>
  let alertStore: ReturnType<typeof useAlertStore>

  beforeEach(() => {
    sessionStore = useSessionStore()
    alertStore = useAlertStore()
  })

  it('should return a NOT_LOGGED_IN_REQUEST_ERROR if calling updateProfile request while not logged in', async () => {
    const { data, error } = await useProfessionalsEndpoint().updateProfile(['fields'], { businessName: '' })

    expect(data).toBeNull()
    expect(error).toBeDefined()
    if (!error) return

    expect(error.status).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.status)
    expect(error.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)

    expect(alertStore.alert).toBeTruthy()
    if (!alertStore.alert) return

    expect(alertStore.alert.status).toEqual(AlertStatuses.ERROR)
    expect(alertStore.alert.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)
  })

  it('should return a NOT_PROFESSIONAL_REQUEST_ERROR if calling updateProfile request while logged in but not as a professional', async () => {
    const JohnDoeClient: IUser = (useUtils().objects.clone(JohnDoe) as unknown) as IUser
    JohnDoeClient.professionalProfile = null

    sessionStore.logIn('token', JohnDoeClient)

    const { data, error } = await useProfessionalsEndpoint().updateProfile(['fields'], { businessName: '' })

    expect(data).toBeNull()
    expect(error).toBeDefined()
    if (!error) return

    expect(error.status).toEqual(NOT_PROFESSIONAL_REQUEST_ERROR.status)
    expect(error.message).toEqual(NOT_PROFESSIONAL_REQUEST_ERROR.message)

    expect(sessionStore.accessToken).toEqual('token')
    expect(sessionStore.user).toEqual(JohnDoeClient)

    expect(alertStore.alert).toBeTruthy()
    if (!alertStore.alert) return

    expect(alertStore.alert.status).toEqual(AlertStatuses.ERROR)
    expect(alertStore.alert.message).toEqual(NOT_PROFESSIONAL_REQUEST_ERROR.message)
  })

  it('should return an error if calling updateProfile request with no fields to update', async () => {
    const expectedErrorMessage = 'Aucune donnée à mettre à jour'
    sessionStore.logIn('token', JohnDoe)

    const { data, error } = await useProfessionalsEndpoint().updateProfile([], {})

    expect(data).toBeNull()
    expect(error).toBeDefined()
    if (!error) return

    expect(error.status).toEqual(400)
    expect(error.message).toEqual(expectedErrorMessage)

    expect(sessionStore.accessToken).toEqual('token')
    expect(sessionStore.user).toEqual(JohnDoe)

    expect(alertStore.alert).toBeTruthy()
    if (!alertStore.alert) return

    expect(alertStore.alert.status).toEqual(AlertStatuses.ERROR)
    expect(alertStore.alert.message).toEqual(expectedErrorMessage)
  })

  it('should work with no errors if testing a good updateProfile request', async () => {
    const expectedSuccessMessage = 'Profil mis à jour'
    const expectedResponse = { statusCode: 200, message: expectedSuccessMessage }
    sessionStore.logIn('token', JohnDoe)

    const mock = new UseFetchWrapperMockBuilder<IRequestResponse>().call_setReturnData(expectedResponse).build()

    const { data, error } = await useProfessionalsEndpoint().updateProfile(['businessName'], {
      businessName: 'MyCoolBusinessName'
    })

    expect(mock.callSpy).toHaveBeenCalled()

    expect(data).toEqual(expectedResponse)
    expect(error).toBeNull()

    expect(sessionStore.accessToken).toEqual('token')
    expect(sessionStore.user).toEqual(JohnDoe)

    expect(alertStore.alert).toBeTruthy()
    if (!alertStore.alert) return

    expect(alertStore.alert.status).toEqual(AlertStatuses.SUCCESS)
    expect(alertStore.alert.message).toEqual(expectedSuccessMessage)
  })

  afterEach(() => {
    sessionStore.$reset()
    alertStore.$reset()
  })
})
