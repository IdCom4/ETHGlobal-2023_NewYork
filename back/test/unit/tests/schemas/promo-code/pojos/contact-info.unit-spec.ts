import { ContactInfo } from '@Schemas/promo-code'

describe('Schema - Promo Code', () => {
  it('should instantiate with all arguments constructor and nominal values when instantiating', () => {
    // Given
    const name = 'John'
    const lastName = 'Doe'
    const phone = '0612345678'
    const email = 'john@doe.fr'

    // When
    const contactInfo = ContactInfo.of(name, lastName, phone, email)

    // Then
    expect(contactInfo).toBeTruthy()
    expect(contactInfo.name).toBe(name)
    expect(contactInfo.lastName).toBe(lastName)
    expect(contactInfo.phone).toBe(phone)
    expect(contactInfo.email).toBe(email)
  })
})
