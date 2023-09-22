import { describe, it, expect, vi, beforeAll } from 'vitest'
import { useAPI } from '@/composables/useApi'
import * as authExport from '@/composables/resources/api-endpoints/auth.endpoint'
import { UseUsersEndpointMockBuilder } from '@/tests/mockups/functions/APIs'
import * as professionalsExport from '@/composables/resources/api-endpoints/professionals.endpoint'
import { JohnDoe } from '@/tests/mockups/data/users.mockup'
import { AlertModes } from '@/types/constants'

beforeAll(() => {
  setActivePinia(createPinia())
})

describe('when using useAPI composable', () => {
  it('should let me access auth endpoints', () => {
    const authSpy = vi.spyOn(authExport, 'useAuthEndpoint').mockReturnValue({
      register: async () => new Promise<IRequestResult<IUser>>((resolve) => resolve({ data: null, error: null })),
      login: async () => new Promise<IRequestResult<IUser>>((resolve) => resolve({ data: null, error: null }))
    })

    useAPI().auth
    expect(authSpy).toHaveBeenCalled()
  })
  it('should let me access professionals endpoints', () => {
    const professionalsSpy = vi.spyOn(professionalsExport, 'useProfessionalsEndpoint').mockReturnValue({
      updateProfile: async () => new Promise<IRequestResult<TDynamicObject>>((resolve) => resolve({ data: null, error: null }))
    })

    useAPI().professionals
    expect(professionalsSpy).toHaveBeenCalled()
  })
  it('should let me access users endpoints', async () => {
    const usersMock = new UseUsersEndpointMockBuilder()
      .getProfile_setFunctionToTestParameters((alert?: IAlertControl) => expect(alert).toBeDefined())
      .getProfile_setResponseData(JohnDoe)
      .build()

    const { data, error } = await useAPI().users.getProfile({ mode: AlertModes.ALL })
    expect(data).toEqual(JohnDoe)
    expect(error).toBeFalsy()
    expect(usersMock.usersEndpointSpy).toHaveBeenCalled()
  })
})
