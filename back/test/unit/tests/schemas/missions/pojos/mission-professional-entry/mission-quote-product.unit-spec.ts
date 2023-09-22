import { MissionQuoteProduct } from '@Schemas/mission'

describe('Schema - MissionQuoteProduct', () => {
  it('should instantiate when instantiating with all arguments constructor and nominal values', () => {
    // Given
    const description = 'description'
    const quantity = 123
    const unitPriceHT = 456

    // When
    const missionQuoteProduct = MissionQuoteProduct.of(description, quantity, unitPriceHT)

    // Then
    expect(missionQuoteProduct.description).toBe(description)
    expect(missionQuoteProduct.quantity).toBe(quantity)
    expect(missionQuoteProduct.unitPriceHT).toBe(unitPriceHT)
  })
})
