import { Mock, SpyInstance } from 'vitest'

// eslint-disable-next-line prettier/prettier
export type CallMockType<T> = Mock<[url: string, options: IRequestOptions], Promise<IRequestResult<T>>>

export type UseFetchWrapperMockType<T> = SpyInstance<[], { call: CallMockType<T> }>

export type BuilderMocks<T> = { callSpy: CallMockType<T>, useFetchWrapperSpy: UseFetchWrapperMockType<T> }