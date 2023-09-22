import { PricesByVehicleType } from '@/schemas/center-service/pojos'
import { IllegalArgumentException } from '@Common/exceptions/illegal-argument.exception'
import { ServiceOption } from '@/schemas/center-service/service-option/service-option.schema'

describe('Schema - ServiceOption', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const title = 'Nettoyer les olives'
      const extraPrices = new PricesByVehicleType(1, 2, 3, 4)

      // When
      const centerService = ServiceOption.of(title, extraPrices)

      // Then
      expect(centerService.title).toBe(title)
      expect(centerService.extraPrices).toBe(extraPrices)
    })

    /*
        The purpose of this test is to verify the tests performed when instating the object.
      Indeed, the IDE notices that the variables are undefined and throws a compilation error
      On the other hand, at runtime, it is possible that these values are undefined and no error will be thrown.
      That's why I choose to intentionally ignore typescript errors in order to perform these tests.
    */
    it.each([
      /* eslint-disable prettier/prettier */
      { test_name: 'should fail with undefined title', title: undefined }
      /* eslint-enable prettier/prettier */
    ])('$test_name', ({ title }) => {
      // When
      // @ts-ignore
      const construct = (): ServiceOption => ServiceOption.of(title)

      expect(construct).toThrowError(IllegalArgumentException)
    })

    it('should update instance', () => {
      // Given
      const serviceOption = ServiceOption.of('Titre')
      const newTitle = 'Nettoyer les olives'
      const newExtraPrices = new PricesByVehicleType(1, 2, 3, 4)

      // When
      serviceOption.update(newTitle, newExtraPrices)

      // Then
      expect(serviceOption.title).toBe(newTitle)
      expect(serviceOption.extraPrices).toBe(newExtraPrices)
    })
  })
})
