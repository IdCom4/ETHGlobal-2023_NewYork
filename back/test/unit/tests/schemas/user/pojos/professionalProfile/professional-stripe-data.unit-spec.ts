import { ProfessionalPaymentData } from '@Schemas/user'

describe('Schema - Mission Client Profile', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // When
    const professionalPaymentData = new ProfessionalPaymentData()

    // Then
    expect(professionalPaymentData.iban).toBeFalsy()
    expect(professionalPaymentData.documentationType).toBeFalsy()
    expect(professionalPaymentData.additionalDocumentation).toBeFalsy()
    expect(professionalPaymentData.pastDue).toStrictEqual([])
    expect(professionalPaymentData.status).toBeTruthy()
  })
})
