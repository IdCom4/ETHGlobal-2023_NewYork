import { Company } from '@Schemas/user'
import { StrictAddress } from '@Schemas/common/pojos'
import { CompanyRequest } from '@/API/professionals/requests/update-professional-profile/pojos.dto'
import { StrictAddressDTO } from '@/common/request-io/request-dto/address.dto'

describe('Schema - Company', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // Given
    const siret = '123 456 789 01234'
    const legalForm = 'LLC'
    const denomination = 'ABC LLC'
    const legalAddress = StrictAddress.of('123 Main Street', 'Anytown', '12345', [48.8566, 2.3522])
    const naf = '7022Z'
    // When
    const company = new Company(siret, legalForm, denomination, legalAddress, naf)

    // Then
    expect(company.siret).toBe(siret)
    expect(company.legalForm).toBe(legalForm)
    expect(company.denomination).toBe(denomination)
    expect(company.legalForm).toBe(legalForm)
    expect(company.naf).toBe(naf)
  })

  it('should instantiate from request', () => {
    // Given
    const siret = '123 456 789 01234'
    const legalForm = 'LLC'
    const denomination = 'ABC LLC'
    const legalAddress = Object.initClassByReflection(StrictAddressDTO, {
      street: '123 Main Street',
      city: 'Anytown',
      zipCode: '12345',
      coordinates: [48.8566, 2.3522],
    })
    const naf = '7022Z'
    const companyRequest: CompanyRequest = {
      siret: siret,
      legalForm: legalForm,
      denomination: denomination,
      legalAddress: legalAddress,
      naf: naf,
    }

    // When
    const company = Company.fromRequest(companyRequest)

    // Then
    expect(company.siret).toBe(siret)
    expect(company.legalForm).toBe(legalForm)
    expect(company.denomination).toBe(denomination)
    expect(company.legalForm).toBe(legalForm)
    expect(company.naf).toBe(naf)
  })
})
