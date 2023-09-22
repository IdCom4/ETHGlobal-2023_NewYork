import { vi } from 'vitest'
import * as useFetchWrapperExport from '@/composables/useFetchWrapper'
import { UseFetchWrapperMockType, BuilderMocks } from './types.d'
import { AbstractEndpointsMockBuilder, EndpointConfiguration } from '../types.d'

// eslint-disable-next-line prettier/prettier

/**
 * A class that implements the AbstractEndpointsMockBuilder class and allows to mock, customize and spy the useFetchWrapper in a user friendly manner
 * 
 * @param T the expected data type returned from the request
 * 
 * @example
 * ```
 * // some-test.spec.ts
 * 
 * // 1. create the mock builder
 * const mockBuilder = new UseFetchWrapperMock<IUser>()
 * // 2. setup the return data of the mock
 * mockBuilder.call_setReturnData(someUser)
 * // 3. build the final mock
 * const mock = mockBuilder.build()
 * // 4. if you want you can spy it
 * expect(mock.callSpy).toHaveBeenCalled()
 * ```
 * 
 * @example
 * ```
 * // some-test.spec.ts
 * 
 * // since every builder's method returns the builder itself, you can also do this as one liner
 * const mock = new UseFetchWrapperMock<IUser>().call_setReturnData(someUser).build()
 * // if you want you can spy it
 * expect(mock.callSpy).toHaveBeenCalled()
 * ```
 */
export class UseFetchWrapperMockBuilder<T> extends AbstractEndpointsMockBuilder<BuilderMocks<T>> {

  protected readonly endpoints = {
    // eslint-disable-next-line prettier/prettier
    call: new EndpointConfiguration<T, [url: string, options: IRequestOptions], (url: string, options: IRequestOptions) => void>()
  }

  /**
   * 
   * @returns an {@link BuilderMocks} instance with all the mock/spies built
   */
  build(): BuilderMocks<T> {
    // setup call spy
    const callSpy = this.endpoints.call.buildSpy()

    const useFetchWrapperSpy = vi.spyOn(useFetchWrapperExport, 'useFetchWrapper').mockReturnValue({
      call: callSpy
    }) as UseFetchWrapperMockType<T>

    // and return the full mock
    return {
      callSpy,
      useFetchWrapperSpy,
    }
  }

    /**
   * 
   * @param {(url: string, options: IRequestOptions) => void} callback sets a function to be called when the call function is called. This function must take call's arguments as arguments and can check them
   * @returns a reference to the builder
   */
  call_setFunctionToTestParameters(callback: (url: string, options: IRequestOptions) => void): this {
    this.endpoints.call.setFunctionToTestParameters(callback)
    return this
  }

  /**
   * 
   * @param {Record<string, IRequestResult<T>> | ((url: string, options: IRequestOptions) => IRequestResult<T>)} dynamicResponses sets dynamics reponses based on call received arguments. Can be an object where url is key and response is value, or a function
   * @returns a reference to the builder
   */
  call_setDynamicResponse(dynamicResponses: Record<string, IRequestResult<T>> | ((url: string, options: IRequestOptions) => IRequestResult<T>)): this {
    this.endpoints.call.setFunctionToHandleResponseDynamically(typeof dynamicResponses === 'function' ? dynamicResponses : (url: string) => dynamicResponses[url])
    return this
  }

  /**
   * 
   * @param {IRequestResult<T>} response the default response to send back when call is called 
   * @returns 
   */
  call_setReturn(response: IRequestResult<T>): this {
    this.endpoints.call.setResponse(response)
    return this
  }

  /**
   * 
   * @param {T} data the default response data to send back when call is called 
   * @returns 
   */
  call_setReturnData(data: T): this {
    this.endpoints.call.setResponseData(data)
    return this
  }

  /**
   * 
   * @param {IRequestError} error the default response error to send back when call is called 
   * @returns 
   */
  call_setReturnError(error: IRequestError): this {
    this.endpoints.call.setResponseError(error)
    return this
  }
}
