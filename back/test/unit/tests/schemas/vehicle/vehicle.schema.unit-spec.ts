import { IllegalArgumentException } from '@Common/exceptions'
import { Vehicle } from '@Schemas/vehicle/vehicle.schema'
import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import { VehicleType } from '@Common/enums/schemas/vehicle-brand.schema.enum'

describe('Schema - Vehicle', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const ownerId = 'existingId'
      const model = 'Model'
      const brandId = '53qs4d6q84sd584sdf'
      const year = 2022
      const plate = 'AB-123-CD'
      const mileage = 15000

      // When
      const vehicle = Vehicle.of(ownerId, model, brandId, year, plate, mileage)

      // Then
      expect(vehicle.ownerId).toBe(ownerId)
      expect(vehicle.model).toBe(model)
      expect(vehicle.brandId).toBe(brandId)
      expect(vehicle.year).toBe(year)
      expect(vehicle.plate).toBe(plate)
      expect(vehicle.mileage).toBe(mileage)
    })

    /*
        The purpose of this test is to verify the tests performed when instating the object.
      Indeed, the IDE notices that the variables are undefined and throws a compilation error.
      On the other hand, at runtime, it is possible that these values are undefined and no error will be thrown.
      That's why I choose to intentionally ignore typescript errors in order to perform these tests.
    */
    it.each([
      /* eslint-disable prettier/prettier */
      { test_name: 'undefined ownerId', ownerId: undefined, model: 'Model', brandId: '53qs4d6q84sd584sdf',  year: 2022, plate: 'AB-123-CD', mileage: 15000 },
      { test_name: 'undefined model', ownerId: 'existingId', model: undefined, brandId: '53qs4d6q84sd584sdf',  year: 2022, plate: 'AB-123-CD', mileage: 15000 },
      { test_name: 'undefined brandId', ownerId: 'existingId', model: 'Model', brandId: undefined,  year: 2022, plate: 'AB-123-CD', mileage: 15000 },
      { test_name: 'undefined year', ownerId: 'existingId', model: 'Model', brandId: '53qs4d6q84sd584sdf',  year: undefined, plate: 'AB-123-CD', mileage: 15000 },
      { test_name: 'undefined plate', ownerId: 'existingId', model: 'Model', brandId: '53qs4d6q84sd584sdf',  year: 2022, plate: undefined, mileage: 15000 },
      { test_name: 'undefined mileage', ownerId: 'existingId', model: 'Model', brandId: '53qs4d6q84sd584sdf',  year: 2022, plate: 'AB-123-CD', mileage: undefined },
      /* eslint-enable prettier/prettier */
    ])('should fail with $test_name', ({ ownerId, model, brandId, year, plate, mileage }) => {
      // When
      // @ts-ignore
      const construct = (): Vehicle => Vehicle.of(ownerId, model, brandId, year, plate, mileage)

      expect(construct).toThrowError(IllegalArgumentException)
    })
  })

  describe('When adding an invoice', () => {
    it('should success with new invoice', () => {
      // Given
      const vehicle = Vehicle.of('ownerId', 'Model', '53qs4d6q84sd584sdf', 2022, 'AB-123-CD', 15000)
      const newInvoice = 'newInvoice'

      // When
      vehicle.addInvoiceId(newInvoice)

      // Then
      expect(vehicle.invoiceIds).toContain(newInvoice)
    })

    it('should fail with existing invoice', () => {
      // Given
      const vehicle = Vehicle.of('ownerId', 'Model', '53qs4d6q84sd584sdf', 2022, 'AB-123-CD', 15000)
      const newInvoice = 'newInvoice'
      vehicle.addInvoiceId(newInvoice)

      // When
      const addingInvoice = (): void => vehicle.addInvoiceId(newInvoice)

      // Then
      expect(addingInvoice).toThrow(IllegalArgumentException)
    })
  })

  describe('When removing an invoice', () => {
    it('should success with known invoice', () => {
      // Given
      const vehicle = Vehicle.of('ownerId', 'Model', '53qs4d6q84sd584sdf', 2022, 'AB-123-CD', 15000)
      const removedInvoice = 'removedInvoice'
      vehicle.addInvoiceId(removedInvoice)

      // When
      vehicle.removeInvoice(removedInvoice)

      // Then
      expect(vehicle.invoiceIds).not.toContain(removedInvoice)
    })

    it('should fail with unknown invoice', () => {
      // Given
      const vehicle = Vehicle.of('ownerId', 'Model', '53qs4d6q84sd584sdf', 2022, 'AB-123-CD', 15000)
      const removedInvoice = 'removedInvoice'

      // When
      const addingInvoice = (): void => vehicle.removeInvoice(removedInvoice)

      // Then
      expect(addingInvoice).toThrow(IllegalArgumentException)
    })
  })

  it('should update the vehicle', () => {
    // Given
    const vehicle = Vehicle.of('ownerId', 'Model', '53qs4d6q84sd584sdf', 2022, 'AB-123-CD', 15000)
    const newModel = 'newModel'
    const newPlate = 'newPlate'
    const newMileage = 959895

    // When
    vehicle.update(newModel, newPlate, newMileage)

    // Then
    expect(vehicle.model).toBe(newModel)
    expect(vehicle.plate).toBe(newPlate)
    expect(vehicle.mileage).toBe(newMileage)
  })

  it('should change the brandId by his name', () => {
    // Given
    const vehicle = Vehicle.of('ownerId', 'Model', '53qs4d6q84sd584sdf', 2022, 'AB-123-CD', 15000)
    const brand = VehicleBrand.of('Vaulque-svaggeune', VehicleType.CAR)

    // When
    vehicle.defineBrand(brand)

    // Then
    expect(vehicle.brandId).toBe(brand.name)
  })

  it('should softly delete the vehicle by creating a deletion date', () => {
    // Given
    const vehicle = Vehicle.of('ownerId', 'Model', '53qs4d6q84sd584sdf', 2022, 'AB-123-CD', 15000)

    // When
    vehicle.softDelete()

    // Then
    expect(vehicle.deletedAt).toBeDefined()
  })

  describe('When checking if vehicle is softly deleted', () => {
    it('should return true if vehicle is softly deleted', () => {
      // Given
      const vehicle = Vehicle.of('ownerId', 'Model', '53qs4d6q84sd584sdf', 2022, 'AB-123-CD', 15000)
      vehicle.softDelete()

      // When
      const isSoftlyDeleted = vehicle.isSoftDeleted()

      // Then
      expect(isSoftlyDeleted).toBeTruthy()
    })

    it('should return false if vehicle is not softly deleted', () => {
      // Given
      const vehicle = Vehicle.of('ownerId', 'Model', '53qs4d6q84sd584sdf', 2022, 'AB-123-CD', 15000)

      // When
      const isSoftlyDeleted = vehicle.isSoftDeleted()

      // Then
      expect(isSoftlyDeleted).toBeFalsy()
    })
  })
})
