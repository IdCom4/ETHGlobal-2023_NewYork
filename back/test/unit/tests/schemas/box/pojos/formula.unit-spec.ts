import { Formula } from '@Schemas/box'

describe('Schema - Formula', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // Given
    const label = 'Formule'
    const nbrQuarterHour = 3
    const price = 15

    // When
    const formula = Formula.of(label, nbrQuarterHour, price)

    // Then
    expect(formula).toBeTruthy()
    expect(formula.label).toBe(label)
    expect(formula.nbrQuarterHour).toBe(nbrQuarterHour)
    expect(formula.price).toBe(price)
  })

  it('should return duration with hours and minutes', () => {
    // Given
    const label = 'Formule'
    const nbrQuarterHour = 6
    const price = 15
    const formula = Formula.of(label, nbrQuarterHour, price)

    // When
    const duration = formula.getDurationAsHoursAndMinutes()

    // Then
    expect(duration).toBeTruthy()
    expect(duration.hours).toBe(1)
    expect(duration.minutes).toBe(30)
  })
})
