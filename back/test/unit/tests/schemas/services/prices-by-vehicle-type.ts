import { PricesByVehicleType } from '@Schemas/center-service'

describe('Schema - PricesByVehicleType', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const priceTTC2Wheels = 1
      const priceTTC2Seats = 2
      const priceTTC5Seats = 3
      const priceTTC7Seats = 4

      // When
      const pricesByVehicleType = new PricesByVehicleType(priceTTC2Wheels, priceTTC2Seats, priceTTC5Seats, priceTTC7Seats)

      expect(pricesByVehicleType.priceTTC2Wheels).toBe(priceTTC2Wheels)
      expect(pricesByVehicleType.priceTTC2Seats).toBe(priceTTC2Seats)
      expect(pricesByVehicleType.priceTTC5Seats).toBe(priceTTC5Seats)
      expect(pricesByVehicleType.priceTTC7Seats).toBe(priceTTC7Seats)
    })
  })
})
