import { IllegalArgumentException } from '@Common/exceptions'
import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import { VehicleType } from '@Common/enums/schemas/vehicle-brand.schema.enum'

describe('Schema - VehicleBrand', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const name = 'Kkkkkkkk'
      const vehicleType = VehicleType.CAR

      // When
      const vehicle = VehicleBrand.of(name, vehicleType)

      // Then
      expect(vehicle.name).toBe(name)
      expect(vehicle.vehicleType).toBe(vehicleType)
    })

    /*
        The purpose of this test is to verify the tests performed when instating the object.
      Indeed, the IDE notices that the variables are undefined and throws a compilation error.
      On the other hand, at runtime, it is possible that these values are undefined and no error will be thrown.
      That's why I choose to intentionally ignore typescript errors in order to perform these tests.
    */
    it.each([
      /* eslint-disable prettier/prettier */
      { test_name: 'undefined ownerId', name: undefined, vehicleType: VehicleType.CAR },
      { test_name: 'undefined model', name: 'Name', vehicleType: undefined },
      /* eslint-enable prettier/prettier */
    ])('should fail with $test_name', ({ name, vehicleType }) => {
      // When
      // @ts-ignore
      const construct = (): VehicleBrand => VehicleBrand.of(name, vehicleType)

      expect(construct).toThrowError(IllegalArgumentException)
    })
  })

  it('should update the vehicle', () => {
    // Given
    const vehicle = VehicleBrand.of('Name', VehicleType.CAR)
    const newName = 'newName'
    const newVehicleType = VehicleType.MOTORCYCLE

    // When
    vehicle.update(newName, newVehicleType)

    // Then
    expect(vehicle.name).toBe(newName)
    expect(vehicle.vehicleType).toBe(newVehicleType)
  })
})
