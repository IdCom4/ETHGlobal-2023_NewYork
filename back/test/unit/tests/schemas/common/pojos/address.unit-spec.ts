import { LenientAddress, StrictAddress } from '@Schemas/common/pojos'
import { LenientAddressDTO, StrictAddressDTO } from '@Common/request-io/request-dto/address.dto'
import '@/extensions'

describe('Schema - Address related schemas', () => {
  describe('Schema - Strict Address', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const street = '123 Main Street'
      const city = 'Anytown'
      const zipCode = '12345'
      const coordinates: [number, number] = [48.8566, 2.3522]

      // When
      const strictAddress = StrictAddress.of(street, city, zipCode, coordinates)

      // Then
      expect(strictAddress.street).toBe(street)
      expect(strictAddress.city).toBe(city)
      expect(strictAddress.zipCode).toBe(zipCode)
      expect(strictAddress.coordinates).toBe(coordinates)
    })

    it('should instantiate when getting from request', () => {
      // Given
      const request = Object.initClassByReflection(StrictAddressDTO, {
        city: '123 Main Street',
        street: 'Anytown',
        zipCode: '12345',
        coordinates: [48.8566, 2.3522],
      })

      // When
      const strictAddress = StrictAddress.fromRequest(request)

      // Then
      expect(strictAddress.street).toBe(request.street)
      expect(strictAddress.city).toBe(request.city)
      expect(strictAddress.zipCode).toBe(request.zipCode)
      expect(strictAddress.coordinates).toBe(request.coordinates)
    })
  })

  describe('Schema - Lenient Address', () => {
    describe('When instantiating with all arguments constructor and nominal values', () => {
      it('should instantiate with initial coordinates', () => {
        // Given
        const street = '123 Main Street'
        const city = 'Anytown'
        const zipCode = '12345'
        const coordinates: [number, number] = [48.8566, 2.3522]

        // When
        const lenientAddress = LenientAddress.of(street, city, zipCode, coordinates)

        // Then
        expect(lenientAddress.street).toBe(street)
        expect(lenientAddress.city).toBe(city)
        expect(lenientAddress.zipCode).toBe(zipCode)
        expect(lenientAddress.coordinates).toBe(coordinates)
      })

      it('should instantiate without initial coordinates', () => {
        // Given
        const street = '123 Main Street'
        const city = 'Anytown'
        const zipCode = '12345'

        // When
        const lenientAddress = LenientAddress.of(street, city, zipCode)

        // Then
        expect(lenientAddress.street).toBe(street)
        expect(lenientAddress.city).toBe(city)
        expect(lenientAddress.zipCode).toBe(zipCode)
        expect(lenientAddress.coordinates).toBeUndefined()
      })
    })

    describe('When instantiating when getting from request', () => {
      it('should instantiate with initial coordinates', () => {
        // Given
        const request = Object.initClassByReflection(LenientAddressDTO, {
          city: '123 Main Street',
          street: 'Anytown',
          zipCode: '12345',
          coordinates: [48.8566, 2.3522],
        })

        // When
        const strictAddress = LenientAddress.fromRequest(request)

        // Then
        expect(strictAddress.street).toBe(request.street)
        expect(strictAddress.city).toBe(request.city)
        expect(strictAddress.zipCode).toBe(request.zipCode)
        expect(strictAddress.coordinates).toBe(request.coordinates)
      })

      it('should instantiate without initial coordinates', () => {
        // Given
        const request = Object.initClassByReflection(LenientAddressDTO, { city: '123 Main Street', street: 'Anytown', zipCode: '12345' })

        // When
        const lenientAddress = LenientAddress.fromRequest(request)

        // Then
        expect(lenientAddress.street).toBe(request.street)
        expect(lenientAddress.city).toBe(request.city)
        expect(lenientAddress.zipCode).toBe(request.zipCode)
        expect(lenientAddress.coordinates).toBeUndefined()
      })
    })
  })
})
