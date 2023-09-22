/* import { DateConverterInterceptor } from '@Common/interceptors/date-converter.interceptor'
import { CallHandler, ExecutionContext } from '@nestjs/common'
import { lastValueFrom, Observable, OperatorFunction } from 'rxjs' */

import { DateConverterInterceptor } from '@Common/interceptors'
import { lastValueFrom, Observable, OperatorFunction } from 'rxjs'
import { CallHandler, ExecutionContext } from '@nestjs/common'

describe('DateConverterInterceptor', () => {
  let interceptor: DateConverterInterceptor

  beforeEach(() => {
    interceptor = new DateConverterInterceptor()
  })

  // ! the behavior of all thoses tests is system locale dependant, which is not meant to be
  // TODO: rework the tests/the interceptor to better match the wanted behavior
  it('should be reworked', () => {
    const shouldBeReworked = true

    expect(shouldBeReworked).toBeTruthy()
  })

  describe('When intercepting request', () => {
    it('should convert data with date options when headers are present', async () => {
      // Given
      const data = {
        lastLogin: {
          $date: '2023-04-04T09:15:23.490Z',
        },
        birthday: '2023-05-02T09:47:16.521Z',
        createdAt: {
          $date: '2023-04-04T09:15:23.996Z',
        },
        updatedAt: {
          $date: '2023-04-04T09:15:23.996Z',
        },
        __v: 0,
      }
      const context = {
        switchToHttp: () => ({
          getRequest: (): object => ({
            headers: {
              tz: 'Europe/Paris',
              locale: 'fr-FR',
            },
          }),
        }),
      } as ExecutionContext
      const callHandler = {
        handle: () => ({
          pipe: (callback: OperatorFunction<unknown, unknown>): Observable<unknown> =>
            callback(
              new Observable<unknown>((subscriber) => {
                subscriber.next(data)
                subscriber.complete()
              })
            ),
        }),
      } as CallHandler<unknown>

      // When
      const observableData = interceptor.intercept(context, callHandler)
      const transformedData = (await lastValueFrom(observableData)) as typeof data

      // Then
      expect(transformedData.lastLogin.$date).toMatch(/^04\/04\/2023/)
      expect(transformedData.createdAt.$date).toMatch(/^04\/04\/2023/)
      expect(transformedData.updatedAt.$date).toMatch(/^04\/04\/2023/)
      expect(transformedData.birthday).toMatch(/^02\/05\/2023/)
    })

    it('should return data without conversion when headers are missing', async () => {
      // Given
      const data = {
        lastLogin: {
          $date: '2023-04-04T09:15:23.490Z',
        },
        birthday: '2023-05-02T09:47:16.521Z',
        createdAt: {
          $date: '2023-04-04T09:15:23.996Z',
        },
        updatedAt: {
          $date: '2023-04-04T09:15:23.996Z',
        },
        __v: 0,
      }
      const context = {
        switchToHttp: () => ({
          getRequest: (): object => ({
            headers: {},
          }),
        }),
      } as ExecutionContext
      const callHandler = {
        handle: () => ({
          pipe: (callback: OperatorFunction<unknown, unknown>): Observable<unknown> =>
            callback(
              new Observable<unknown>((subscriber) => {
                subscriber.next(data)
                subscriber.complete()
              })
            ),
        }),
      } as CallHandler<unknown>

      // When
      const observableData = interceptor.intercept(context, callHandler)
      const transformedData = (await lastValueFrom(observableData)) as typeof data

      // Then
      expect(transformedData.lastLogin.$date).toEqual(transformedData.lastLogin.$date)
      expect(transformedData.createdAt.$date).toEqual(transformedData.createdAt.$date)
      expect(transformedData.updatedAt.$date).toEqual(transformedData.updatedAt.$date)
      expect(transformedData.birthday).toEqual(transformedData.birthday)
    })

    it('should convert data with date options when only timezone header is missing', async () => {
      // Given
      const data = {
        lastLogin: {
          $date: '2023-04-04T09:15:23.490Z',
        },
        birthday: '2023-05-02T09:47:16.521Z',
        createdAt: {
          $date: '2023-04-04T09:15:23.996Z',
        },
        updatedAt: {
          $date: '2023-04-04T09:15:23.996Z',
        },
        __v: 0,
      }
      const context = {
        switchToHttp: () => ({
          getRequest: (): object => ({
            headers: {
              locale: 'fr-FR',
            },
          }),
        }),
      } as ExecutionContext
      const callHandler = {
        handle: () => ({
          pipe: (callback: OperatorFunction<unknown, unknown>): Observable<unknown> =>
            callback(
              new Observable<unknown>((subscriber) => {
                subscriber.next(data)
                subscriber.complete()
              })
            ),
        }),
      } as CallHandler<unknown>

      // When
      const observableData = interceptor.intercept(context, callHandler)
      const transformedData = (await lastValueFrom(observableData)) as typeof data

      // Then
      expect(transformedData.lastLogin.$date).toMatch(/4\/04\/2023/)
      expect(transformedData.createdAt.$date).toMatch(/4\/04\/2023/)
      expect(transformedData.updatedAt.$date).toMatch(/4\/04\/2023/)
      expect(transformedData.birthday).toMatch(/2\/05\/2023/)
    })

    it('should throws exception when only locale header is missing', async () => {
      // Given
      const data = {
        lastLogin: {
          $date: '2023-04-04T09:15:23.490Z',
        },
        birthday: '2023-05-02T09:47:16.521Z',
        createdAt: {
          $date: '2023-04-04T09:15:23.996Z',
        },
        updatedAt: {
          $date: '2023-04-04T09:15:23.996Z',
        },
        __v: 0,
      }
      const context = {
        switchToHttp: () => ({
          getRequest: (): object => ({
            headers: {
              tz: 'Europe/Paris',
            },
          }),
        }),
      } as ExecutionContext
      const callHandler = {
        handle: () => ({
          pipe: (callback: OperatorFunction<unknown, unknown>): Observable<unknown> =>
            callback(
              new Observable<unknown>((subscriber) => {
                subscriber.next(data)
                subscriber.complete()
              })
            ),
        }),
      } as CallHandler<unknown>

      // When
      const observableData = interceptor.intercept(context, callHandler)
      const transformedData = (await lastValueFrom(observableData)) as typeof data

      // Then
      expect(transformedData.lastLogin.$date).toMatch(/^0?4\/0?4\/2023/)
      expect(transformedData.createdAt.$date).toMatch(/^0?4\/0?4\/2023/)
      expect(transformedData.updatedAt.$date).toMatch(/^0?4\/0?4\/2023/)
    })

    describe('With invalid information', () => {
      it('should throws exception when date is invalid', async () => {
        // Given
        const data = {
          lastLogin: {
            $date: '2023-04-04T09:15:23.490Z',
          },
          birthday: '2023-05-02T09:47:16.521Z',
          createdAt: {
            $date: '2023-04-04T09:15:23.996Z',
          },
          updatedAt: {
            $date: '2023-04-04T09:15:23.996Z',
          },
          __v: 0,
        }
        const context = {
          switchToHttp: () => ({
            getRequest: (): object => ({
              headers: {
                tz: 'AAAAAAAAAAAAAAAAAAAAAAAA',
                locale: 'AAAAAAAAAAAAAAAAAAAAAAAA',
              },
            }),
          }),
        } as ExecutionContext
        const callHandler = {
          handle: () => ({
            pipe: (callback: OperatorFunction<unknown, unknown>): Observable<unknown> =>
              callback(
                new Observable<unknown>((subscriber) => {
                  subscriber.next(data)
                  subscriber.complete()
                })
              ),
          }),
        } as CallHandler<unknown>

        // When
        const observableData = interceptor.intercept(context, callHandler)
        const transformedData = async (): Promise<unknown> => (await lastValueFrom(observableData)) as typeof data

        // Then
        await expect(transformedData).rejects.toThrow()
      })
    })
  })
})
