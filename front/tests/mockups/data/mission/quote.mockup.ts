export const workForces: IMissionQuoteProduct[] = [
  {
    description: 'Workforce 1',
    quantity: 1,
    unitPriceHT: 7
  },
  {
    description: 'Workforce 2',
    quantity: 2,
    unitPriceHT: 15
  },
  {
    description: 'Workforce 3',
    quantity: 3,
    unitPriceHT: 29
  }
]

export const consumables: IMissionQuoteProduct[] = [
  {
    description: 'Item 1',
    quantity: 1,
    unitPriceHT: 1
  },
  {
    description: 'Item 2',
    quantity: 2,
    unitPriceHT: 2
  },
  {
    description: 'Item 3',
    quantity: 3,
    unitPriceHT: 3
  }
]

export const placeAndEquipments: IMissionQuoteProduct[] = [
  {
    description: 'Une tondeuse',
    quantity: 1,
    unitPriceHT: 50
  }
]

export const missionQuotePayload: IMissionQuotePayload = {
  workforces: workForces,
  consumables: consumables
}

export const quote: IMissionQuote = {
  workForces,
  consumables,
  placeAndEquipments,
  totalHT: 0,
  tvaRate: 0,
  totalTTCToClient: 0,
  VMCFees: 0,
  totalTTCToProfessional: 0,
  sentAt: '10/07/2023'
}
