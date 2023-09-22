import { MissionQuote } from '@Schemas/mission'

describe('Schema - MissionQuote', () => {
  it('should instantiate when instantiating with all arguments constructor and nominal values', () => {
    // Given
    const tvaRate = 20
    const workForces = [{ description: 'description', quantity: 123, unitPriceHT: 456 }]
    const consumables = [{ description: 'description', quantity: 123, unitPriceHT: 456 }]
    const placeAndEquipments = [{ description: 'description', quantity: 123, unitPriceHT: 456 }]

    // When
    const missionQuote = MissionQuote.of(tvaRate, workForces, consumables, placeAndEquipments)

    // Then
    expect(missionQuote.workForces).toHaveLength(1)
    expect(missionQuote.workForces[0].description).toBe('description')
    expect(missionQuote.consumables).toHaveLength(1)
    expect(missionQuote.consumables[0].quantity).toBe(123)
    expect(missionQuote.placeAndEquipments).toHaveLength(1)
    expect(missionQuote.placeAndEquipments[0].unitPriceHT).toBe(456)
    expect(missionQuote.totalHT).toBeDefined()
    expect(missionQuote.tvaRate).toBe(tvaRate)
    expect(missionQuote.totalTTCToClient).toBeDefined()
    expect(missionQuote.VMCFees).toBeDefined()
    expect(missionQuote.totalTTCToProfessional).toBeDefined()
    expect(missionQuote.sentAt).toBeDefined()
  })
})
