import { vi, describe, it, expect, beforeEach, beforeAll, afterEach } from 'vitest'
import { useAlertStore } from '@/stores/alertStore'
import { setActivePinia, createPinia } from 'pinia'
import * as useRequestExport from '@/composables/useRequest'
import { UseFetchWrapperMockBuilder } from '@/tests/mockups/functions/APIs'
import { AlertModes, HTTP_METHODS } from '@/types/constants'

const getUseFetchParamTesterFunction = (path: string, baseURL: string, method: string, alert: IAlertControl) => {
  return (url: string, options: IRequestOptions) => {
    expect(url).toEqual(path)
    expect(options.baseURL).toEqual(baseURL)
    expect(options.method).toEqual(method)
    expect(options.alert).toStrictEqual(alert)
  }
}

beforeAll(() => {
  setActivePinia(createPinia())
})

describe('when UseRequest is called', () => {
  let alertStore: ReturnType<typeof useAlertStore>
  const TEST_BASE_API_URL = import.meta.env.VITE_BASE_API_URL as string

  beforeEach(() => {
    alertStore = useAlertStore()
  })

  afterEach(() => {
    vi.resetAllMocks()

    // reseting the store
    alertStore.$reset()
  })

  describe('when send function is called', () => {
    it('should throw if called with no method set in options', async () => {
      const _useRequest = useRequestExport.useRequest()
      const sendSpy = vi.spyOn(_useRequest, 'send')

      try {
        await _useRequest.send('url', {})
      } catch (e) {
        expect(e).toBeDefined()
        expect((e as Error).message).toEqual('An HTTP method must be provided within the options')
      }

      expect(sendSpy).toHaveBeenCalledWith('url', {})
    })

    it('should return an error when the fetch call returns an error', async () => {
      const _path = 'some-url'
      const _method = HTTP_METHODS.GET
      const RESPONSE_ERROR = { status: 404, message: 'Resource not found' }

      // mock & spy useFetch call and assert the params that are sent to it
      const useFetchMock = new UseFetchWrapperMockBuilder<IUser | string>()
        .call_setFunctionToTestParameters(getUseFetchParamTesterFunction(_path, TEST_BASE_API_URL, _method, { mode: AlertModes.ON_ERROR }))
        .call_setReturnError(RESPONSE_ERROR)
        .build()

      // spy it
      const _useRequest = useRequestExport.useRequest()
      const sendSpy = vi.spyOn(_useRequest, 'send')

      // get its return
      const { data, error } = await _useRequest.send(_path, { method: _method })

      // and check value conformity
      expect(useFetchMock.useFetchWrapperSpy).toHaveBeenCalled()

      expect(data).toBeNull()
      expect(error).toBeDefined()
      if (!error) return
      // expect(error.status).toEqual(RESPONSE_ERROR.status)
      expect(error.message).toEqual(RESPONSE_ERROR.message)

      expect(alertStore.alert).toBeTruthy()
      expect(alertStore.alert?.status).toEqual('error')
      expect(alertStore.alert?.message).toEqual(RESPONSE_ERROR.message)

      expect(sendSpy).toHaveBeenCalled()
    })

    describe('when alert is set to control the behavior', () => {
      // TODO: do the same buth when the request returns successfully
      describe('when the request returns an error', () => {
        it('should alert an error message if control mode is set to "all"', async () => {
          const _path = 'URL'
          const _method = HTTP_METHODS.GET
          const _alert: IAlertControl = { mode: 'all', successMsg: 'a success message', errorMsg: 'an error message' }
          const RESPONSE_ERROR = { status: 404, message: 'Resource Not Found' }

          // mock & spy useFetch call and assert the params that are sent to it
          const useFetchMock = new UseFetchWrapperMockBuilder().call_setReturnError(RESPONSE_ERROR).build()

          // spy it
          const _useRequest = useRequestExport.useRequest()
          const sendSpy = vi.spyOn(_useRequest, 'send')

          // get its return
          const { data, error } = await _useRequest.send(_path, { method: _method, alert: _alert })

          // and check value conformity
          expect(useFetchMock.useFetchWrapperSpy).toHaveBeenCalled()
          expect(data).toBeNull()

          expect(error).toBeDefined()
          if (!error) return
          expect(error.status).toEqual(RESPONSE_ERROR.status)
          expect(error.message).toEqual(RESPONSE_ERROR.message)

          expect(alertStore.alert).toBeTruthy()
          expect(alertStore.alert?.status).toEqual('error')
          expect(alertStore.alert?.message).toEqual(_alert.errorMsg)

          expect(sendSpy).toHaveBeenCalled()
        })

        it('should not send an alert if control mode is set to "none"', async () => {
          const _path = 'URL'
          const _method = HTTP_METHODS.GET
          const _alert: IAlertControl = { mode: 'none', successMsg: 'a success message', errorMsg: 'an error message' }

          const RESPONSE_ERROR = { status: 404, message: 'Resource Not Found' }
          // mock & spy useFetch call and assert the params that are sent to it
          const useFetchMock = new UseFetchWrapperMockBuilder().call_setReturnError(RESPONSE_ERROR).build()

          // spy it
          const _useRequest = useRequestExport.useRequest()
          const sendSpy = vi.spyOn(_useRequest, 'send')

          // get its return
          const { data, error } = await _useRequest.send(_path, { method: _method, alert: _alert })

          // and check value conformity
          expect(data).toBeNull()

          expect(error).toBeDefined()
          if (!error) return
          expect(error.status).toEqual(RESPONSE_ERROR.status)
          expect(error.message).toEqual(RESPONSE_ERROR.message)

          expect(useFetchMock.useFetchWrapperSpy).toHaveBeenCalled()
          expect(alertStore.alert).toBeNull()

          expect(sendSpy).toHaveBeenCalled()
        })

        it('should not send an alert if control mode is set to "on-success"', async () => {
          const _path = 'URL'
          const _method = HTTP_METHODS.GET
          const _alert: IAlertControl = { mode: 'on-success', successMsg: 'a success message', errorMsg: 'an error message' }

          const RESPONSE_ERROR = { status: 404, message: 'Resource Not Found' }

          // mock & spy useFetch call and assert the params that are sent to it
          const useFetchMock = new UseFetchWrapperMockBuilder().call_setReturnError(RESPONSE_ERROR).build()

          // spy it
          const _useRequest = useRequestExport.useRequest()
          const sendSpy = vi.spyOn(_useRequest, 'send')

          // get its return
          const { data, error } = await _useRequest.send(_path, { method: _method, alert: _alert })

          // and check value conformity
          expect(data).toBeNull()

          expect(error).toBeDefined()
          if (!error) return
          expect(error.status).toEqual(RESPONSE_ERROR.status)
          expect(error.message).toEqual(RESPONSE_ERROR.message)

          expect(useFetchMock.useFetchWrapperSpy).toHaveBeenCalled()
          expect(alertStore.alert).toBeNull()

          expect(sendSpy).toHaveBeenCalled()
        })

        it('should send an error alert if control mode is set to "on-error"', async () => {
          const _path = 'URL'
          const _method = HTTP_METHODS.GET
          const _alert: IAlertControl = { mode: AlertModes.ON_ERROR, successMsg: 'a success message', errorMsg: 'an error message' }
          const RESPONSE_ERROR = { status: 404, message: 'Resource Not Found' }

          // mock & spy useFetch call and assert the params that are sent to it
          const useFetchMock = new UseFetchWrapperMockBuilder().call_setReturnError(RESPONSE_ERROR).build()

          // spy it
          const _useRequest = useRequestExport.useRequest()
          const sendSpy = vi.spyOn(_useRequest, 'send')

          // get its return
          const response = await _useRequest.send(_path, { method: _method, alert: _alert })
          const { data, error } = response

          // and check value conformity
          expect(useFetchMock.useFetchWrapperSpy).toHaveBeenCalled()
          expect(data).toBeNull()

          expect(error).toBeDefined()
          if (!error) return
          expect(error.status).toEqual(RESPONSE_ERROR.status)
          expect(error.message).toEqual(RESPONSE_ERROR.message)

          expect(alertStore.alert).toBeTruthy()
          expect(alertStore.alert?.status).toEqual('error')
          expect(alertStore.alert?.message).toEqual(_alert.errorMsg)

          expect(sendSpy).toHaveBeenCalled()
        })
      })
    })
  })

  describe('when post function is called', async () => {
    it('should call send function with the right HTTP method no matter what was provided in the options', async () => {
      const _path = 'URL'
      const RESPONSE_DATA = { message: 'request succedeed' }

      // mock & spy useFetch call and assert the params that are sent to it
      new UseFetchWrapperMockBuilder().call_setReturnData(RESPONSE_DATA).build()

      // spy it
      const _useRequest = useRequestExport.useRequest()
      const sendSpy = vi.spyOn(_useRequest, 'send')
      const postSpy = vi.spyOn(_useRequest, 'post')

      // get its return
      await _useRequest.post(_path, { method: HTTP_METHODS.GET, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      expect(postSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalledWith(_path, { method: HTTP_METHODS.POST, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      // get its return
      const body = { someProperty: 'some value' }
      await _useRequest.post(_path, { body, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      expect(postSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalledWith(_path, {
        method: HTTP_METHODS.POST,
        body,
        alert: { mode: AlertModes.ON_ERROR },
        baseURL: TEST_BASE_API_URL
      })
    })
  })

  describe('when get function is called', async () => {
    it('should call send function with the right HTTP method no matter what was provided in the options', async () => {
      const _path = 'URL'
      const RESPONSE_DATA = { message: 'request succedeed' }

      // mock & spy useFetch call and assert the params that are sent to it
      new UseFetchWrapperMockBuilder().call_setReturnData(RESPONSE_DATA).build()

      // spy it
      const _useRequest = useRequestExport.useRequest()
      const sendSpy = vi.spyOn(_useRequest, 'send')
      const getSpy = vi.spyOn(_useRequest, 'get')

      // get its return
      await _useRequest.get(_path, { method: HTTP_METHODS.POST, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      expect(getSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalledWith(_path, { method: HTTP_METHODS.GET, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      // get its return
      await _useRequest.get(_path, { alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      expect(getSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalledWith(_path, { method: HTTP_METHODS.GET, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })
    })
  })

  describe('when put function is called', async () => {
    it('should call send function with the right HTTP method no matter what was provided in the options', async () => {
      const _path = 'URL'
      const RESPONSE_DATA = { message: 'request succedeed' }

      // mock & spy useFetch call and assert the params that are sent to it
      new UseFetchWrapperMockBuilder().call_setReturnData(RESPONSE_DATA).build()

      // spy it
      const _useRequest = useRequestExport.useRequest()
      const sendSpy = vi.spyOn(_useRequest, 'send')
      const putSpy = vi.spyOn(_useRequest, 'put')

      // get its return
      await _useRequest.put(_path, { method: HTTP_METHODS.GET, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      expect(putSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalledWith(_path, { method: HTTP_METHODS.PUT, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      // get its return
      const body = { someProperty: 'some value' }
      await _useRequest.put(_path, { body, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      expect(putSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalledWith(_path, {
        method: HTTP_METHODS.PUT,
        body,
        alert: { mode: AlertModes.ON_ERROR },
        baseURL: TEST_BASE_API_URL
      })
    })
  })

  describe('when patch function is called', async () => {
    it('should call send function with the right HTTP method no matter what was provided in the options', async () => {
      const _path = 'URL'
      const RESPONSE_DATA = { message: 'request succedeed' }

      // mock & spy useFetch call and assert the params that are sent to it
      new UseFetchWrapperMockBuilder().call_setReturnData(RESPONSE_DATA).build()

      // spy it
      const _useRequest = useRequestExport.useRequest()
      const sendSpy = vi.spyOn(_useRequest, 'send')
      const patchSpy = vi.spyOn(_useRequest, 'patch')

      // get its return
      await _useRequest.patch(_path, { method: HTTP_METHODS.GET, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      expect(patchSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalledWith(_path, { method: HTTP_METHODS.PATCH, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      // get its return
      const body = { someProperty: 'some value' }
      await _useRequest.patch(_path, { body, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      expect(patchSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalledWith(_path, {
        method: HTTP_METHODS.PATCH,
        body,
        alert: { mode: AlertModes.ON_ERROR },
        baseURL: TEST_BASE_API_URL
      })
    })
  })

  describe('when delete function is called', async () => {
    it('should call send function with the right HTTP method no matter what was provided in the options', async () => {
      const _path = 'URL'
      const RESPONSE_DATA = { message: 'request succedeed' }

      // mock & spy useFetch call and assert the params that are sent to it
      new UseFetchWrapperMockBuilder().call_setReturnData(RESPONSE_DATA).build()

      // spy it
      const _useRequest = useRequestExport.useRequest()
      const sendSpy = vi.spyOn(_useRequest, 'send')
      const deleteSpy = vi.spyOn(_useRequest, 'delete')

      // get its return
      await _useRequest.delete(_path, { method: HTTP_METHODS.GET, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      expect(deleteSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalledWith(_path, { method: HTTP_METHODS.DELETE, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      // get its return
      const body = { someProperty: 'some value' }
      await _useRequest.delete(_path, { body, alert: { mode: AlertModes.ON_ERROR }, baseURL: TEST_BASE_API_URL })

      expect(deleteSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalledWith(_path, {
        method: HTTP_METHODS.DELETE,
        body,
        alert: { mode: AlertModes.ON_ERROR },
        baseURL: TEST_BASE_API_URL
      })
    })
  })
})
