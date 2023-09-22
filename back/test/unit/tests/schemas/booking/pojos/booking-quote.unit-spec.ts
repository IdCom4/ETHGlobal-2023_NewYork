import { BookingQuote } from '@Schemas/booking'
import { Formula } from '@Schemas/box'

describe('Schema - Booker', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const formula = Formula.of('formula', 5, 10)
      const reductionPercentage = 20

      // When
      const booker = BookingQuote.of(formula, reductionPercentage)

      // Then
      expect(booker.formula).toBe(formula)
      expect(booker.reductionPercentage).toBe(reductionPercentage)
      expect(booker.totalHT).toBeDefined()
      expect(booker.tva).toBeDefined()
      expect(booker.totalTTC).toBeDefined()
    })

    it('should instantiate with all arguments constructor and nominal values from admin request', () => {
      // Given
      const priceTTC = 100

      // When
      const booker = BookingQuote.ofCustomAdminRequest(priceTTC)

      // Then
      expect(booker.formula).toBe(null)
      expect(booker.reductionPercentage).toBeUndefined()
      expect(booker.totalHT).toBeDefined()
      expect(booker.tva).toBeDefined()
      expect(booker.totalTTC).toBeDefined()
    })
  })
})
