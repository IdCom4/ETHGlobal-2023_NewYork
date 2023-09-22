import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import { BadRequestException } from '@nestjs/common/exceptions'
import { DataWrapper, InstantiatingDataWrapper } from '@Common/classes'

describe('Data Wrappers', () => {
  describe('When wrapping a simple data', () => {
    describe('When trying to get data or throw an error', () => {
      it('should success without options when providing defined data', () => {
        // Given
        const data = Promise.resolve(HostedFileReference.of('gougeule.com', 'shteumeul', 'villager', 'owner', false))
        const dataWrapper = DataWrapper.fromData(data)

        // When
        const recoveredData = dataWrapper.getOrThrow()

        // Then
        expect(recoveredData).toStrictEqual(data)
      })

      describe('When providing undefined data', () => {
        it('should fail with default error', () => {
          // Given
          const data = Promise.resolve(undefined)
          const dataWrapper = DataWrapper.fromData(data)

          // When
          const recoveringData = (): Promise<unknown> => dataWrapper.getOrThrow()

          // Then
          expect(recoveringData).rejects.toThrow()
        })

        it('should fail with custom error', () => {
          // Given
          const data = Promise.resolve(undefined)
          const dataWrapper = DataWrapper.fromData(data)

          // When
          const recoveringDataWithError = (): Promise<unknown> => dataWrapper.getOrThrow(new BadRequestException('Erreur !'))

          // Then
          expect(recoveringDataWithError).rejects.toThrow(BadRequestException)
        })
      })
    })

    describe('When trying to get data or null', () => {
      it('should success with defined data', () => {
        // Given
        const data = Promise.resolve(HostedFileReference.of('gougeule.com', 'shteumeul', 'villager', 'owner', false))
        const dataWrapper = DataWrapper.fromData(data)

        // When
        const recoveredData = dataWrapper.getOrNull()

        // Then
        expect(recoveredData).toStrictEqual(data)
      })

      it('should success with undefined data', () => {
        // Given
        const data = Promise.resolve(undefined)
        const dataWrapper = DataWrapper.fromData(data)

        // When
        const recoveringData = dataWrapper.getOrNull()

        // Then
        expect(recoveringData).resolves.toBeNull()
      })
    })
  })

  describe('When wrapping an data intended to be instantiated', () => {
    describe('When trying to get data or throw an error', () => {
      it('should success with defined data', () => {
        // Given
        const data = Promise.resolve([
          HostedFileReference.of('gougeule.com', 'shteumeul', 'villager', 'owner', false),
          HostedFileReference.of('bingau.com', 'shtomal', 'péon', 'owner2', false),
        ])
        const dataArrayWrapper = InstantiatingDataWrapper.fromData(data)

        // When
        const recoveredData = dataArrayWrapper.getOrThrow()

        // Then
        expect(recoveredData).toStrictEqual(data)
      })

      describe('When providing undefined data', () => {
        it('should fail with default error', () => {
          // Given
          const data = Promise.resolve(null)
          const dataArrayWrapper = InstantiatingDataWrapper.fromData(data as unknown as Promise<object>)

          // When
          const recoveringData = (): Promise<unknown> => dataArrayWrapper.getOrThrow()

          // Then
          expect(recoveringData).rejects.toThrow()
        })

        it('should fail with custom error', () => {
          // Given
          const data = Promise.resolve(null)
          const dataArrayWrapper = InstantiatingDataWrapper.fromData(data as unknown as Promise<object>)

          // When
          const recoveringDataWithError = (): Promise<unknown> => dataArrayWrapper.getOrThrow(new BadRequestException('Erreur !'))

          // Then
          expect(recoveringDataWithError).rejects.toThrow()
        })
      })
    })

    describe('When trying to get data or null', () => {
      it('should success with defined data', () => {
        // Given
        const data = Promise.resolve([
          HostedFileReference.of('gougeule.com', 'shteumeul', 'villager', 'owner', false),
          HostedFileReference.of('bingau.com', 'shtomal', 'péon', 'owner2', false),
        ])
        const dataArrayWrapper = DataWrapper.fromData(data)

        // When
        const recoveredData = dataArrayWrapper.getOrThrow()

        // Then
        expect(recoveredData).toStrictEqual(data)
      })

      it('should success with undefined data', () => {
        // Given
        const data = Promise.resolve(undefined)
        const dataArrayWrapper = DataWrapper.fromData(data)

        // When
        const recoveringData = dataArrayWrapper.getOrNull()

        // Then
        expect(recoveringData).resolves.toBeNull()
      })
    })
  })
})
