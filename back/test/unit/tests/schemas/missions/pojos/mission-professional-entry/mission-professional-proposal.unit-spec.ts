import { MissionProfessionalProposal } from '@Schemas/mission'
import { StrictAddress } from '@Schemas/common/pojos'
import { MissionProposalStatuses } from '@Common/enums'

describe('Schema - MissionProfessionalProposal', () => {
  it('should instantiate when instantiating with all arguments constructor and nominal values', () => {
    // Given
    const startDate = new Date()
    const pickupAddress = StrictAddress.of('street', 'zipCode', 'city', [1, 1])
    const tvaRate = 20
    const workForces = [{ description: 'description', quantity: 123, unitPriceHT: 456 }]
    const consumables = [{ description: 'description', quantity: 123, unitPriceHT: 456 }]
    const placeAndEquipments = [{ description: 'description', quantity: 123, unitPriceHT: 456 }]
    const quote = { tvaRate, workForces, consumables, placeAndEquipments }

    // When
    const missionQuoteProduct = MissionProfessionalProposal.of(startDate, pickupAddress, quote)

    // Then
    expect(missionQuoteProduct.status).toBe(MissionProposalStatuses.SENT)
    expect(missionQuoteProduct.startDate).toBe(startDate)
    expect(missionQuoteProduct.pickupAddress).toBe(pickupAddress)
    expect(missionQuoteProduct.quote.tvaRate).toEqual(quote.tvaRate)
    expect(missionQuoteProduct.quote.workForces[0].description).toEqual(quote.workForces[0].description)
    expect(missionQuoteProduct.quote.workForces[0].description).toEqual(quote.workForces[0].description)
    expect(missionQuoteProduct.quote.workForces[0].description).toEqual(quote.workForces[0].description)
    expect(missionQuoteProduct.quote.consumables[0].description).toEqual(quote.consumables[0].description)
    expect(missionQuoteProduct.quote.consumables[0].quantity).toEqual(quote.consumables[0].quantity)
    expect(missionQuoteProduct.quote.consumables[0].unitPriceHT).toEqual(quote.consumables[0].unitPriceHT)
    expect(missionQuoteProduct.quote.placeAndEquipments[0].description).toEqual(quote.placeAndEquipments[0].description)
    expect(missionQuoteProduct.quote.placeAndEquipments[0].quantity).toEqual(quote.placeAndEquipments[0].quantity)
    expect(missionQuoteProduct.quote.placeAndEquipments[0].unitPriceHT).toEqual(quote.placeAndEquipments[0].unitPriceHT)
    expect(missionQuoteProduct.quote.sentAt).toBeDefined()
  })
})
