/* eslint-disable @typescript-eslint/ban-types */
import { Mock } from 'vitest'
import { AbstactBuilder } from '@/types/architecture/builder'

export interface IEndpointConfiguration<T, TArgs extends unknown[], FunctionPrototype extends Function = (...TArgs) => void | IRequestResult<T>> {
  handleDynamicResponse: FunctionPrototype
  functionToTestParameters: FunctionPrototype
  response: IRequestResult<T>

  setFunctionToTestParameters: (fn: FunctionPrototype) => this

  setResponse: (response: IRequestResult<T>) => this
  setResponseData: (data: T) => this
  setResponseError: (error: IRequestError) => this

  buildSpy: () => Mock<TArgs, Promise<IRequestResult<T>>>
}

/**
 * This class is used to mock accuratly an endpoint function
 *
 * @param T the return type of the endpoint function
 * @param TArgs an array representing the arguments of the endpoint function
 * @param Func the prototype of the endpoint function, so that we can ensure that the callback function that will test the parameters does indeed expect the right ones (optional)
 *
 * @example
 * ```
 * // some-endpoint.ts
 * login: async (email: string, password: string): Promise<IRequestResult<IUser>> => { code implementation }
 *
 * // some-mock-builder.ts
 * endpoints = {
 *  login: new EndpointConfiguration<IUser, [email: string, password: string], (email: string, password: string) => void>()
 * }
 * ```
 */
// eslint-disable-next-line prettier/prettier
export class EndpointConfiguration<T, TArgs extends unknown[], FunctionPrototype extends Function = (...TArgs) => void | IRequestResult<T>> implements IEndpointConfiguration<T, TArgs, FunctionPrototype> {
  private handleDynamicResponse: FunctionPrototype | null
  private functionToTestParameters: FunctionPrototype | null
  private response: IRequestResult<T> = { data: null, error: null }

  /**
   * @param fn the callback function that will return a different output based on inputs (optional)
   */
  setFunctionToHandleResponseDynamically(fn: FunctionPrototype): this {
    this.handleDynamicResponse = fn
    return this
  }

  /**
   * @param fn the callback function that will test the parameters the mocked endpoint was called with (optional)
   */
  setFunctionToTestParameters(fn: FunctionPrototype): this {
    this.functionToTestParameters = fn
    return this
  }

  /**
   * @param response full response that the mocked endpoint must return.  (default: { data: null, error: null })
   */
  setResponse(response: IRequestResult<T>): this {
    this.response = response
    return this
  }

  /**
   * @param data data that the mocked endpoint must return.  (default: null)
   */
  setResponseData(data: T): this {
    this.response.data = data
    return this
  }

  /**
   * @param error error that the mocked endpoint must return. (default: null)
   */
  setResponseError(error: IRequestError): this {
    this.response.error = error
    return this
  }

  /**
   * The final method that builds up the mocked endpoint
   *
   * @returns the mocked endpoint
   */
  buildSpy(): Mock<TArgs, Promise<IRequestResult<T>>> {
    return vi.fn().mockImplementation(
      async (...args) =>
        new Promise<IRequestResult<T>>((resolve) => {
          // testing parameters if there is a provided function to do so
          if (this.functionToTestParameters) this.functionToTestParameters(...args)

          if (this.handleDynamicResponse) resolve(this.handleDynamicResponse(...args) || this.response)
          resolve(this.response)
        })
    )
  }
}

/**
 * an abstract class that all EndpointMockBuilder classes must implement, to ensure ease of use
 *
 * @param T the final return type that the mocker's build function will return
 */
export abstract class AbstractEndpointsMockBuilder<T> implements AbstactBuilder<T> {
  protected abstract readonly endpoints: Record<string, EndpointConfiguration>

  abstract build(): T
}
