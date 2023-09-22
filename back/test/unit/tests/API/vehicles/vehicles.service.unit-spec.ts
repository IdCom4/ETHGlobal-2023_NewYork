import { VehiclesService } from '@Api/vehicles/vehicles.service'
import { capture, instance, mock, when } from 'ts-mockito'
import { VehicleRepository } from '@/repositories/vehicle/vehicle.repository'
import { VehicleBrandsService } from '@Api/vehicles/brands/vehicle-brands.service'
import { Vehicle } from '@Schemas/vehicle/vehicle.schema'
import { InstantiatingDataWrapper } from '@Common/classes'
import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import { VehicleType } from '@Common/enums/schemas/vehicle-brand.schema.enum'
import { User } from '@/schemas/user'
import { UserRepository } from '@/repositories'

const globalUser = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345')

describe('Service - VehiclesService', () => {
  let vehiclesService: VehiclesService
  let mockedUserRepository: UserRepository

  beforeAll(() => {
    const mockedVehicleRepository = mock(VehicleRepository)
    when(mockedVehicleRepository.findById).thenReturn((id) => {
      if (id === 'existingId')
        return InstantiatingDataWrapper.fromData(Promise.resolve(Vehicle.of('ownerId', 'model', 'brand', 2022, 'plate', 15000)))
      else return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<Vehicle>)
    })

    when(mockedVehicleRepository.findActiveById).thenReturn((id) => {
      if (id === 'existingId')
        return InstantiatingDataWrapper.fromData(Promise.resolve(Vehicle.of('ownerId', 'model', 'brand', 2022, 'plate', 15000)))
      else return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<Vehicle>)
    })
    when(mockedVehicleRepository.findBy).thenReturn((query) => {
      if (query._id === 'existingId')
        return InstantiatingDataWrapper.fromData(Promise.resolve(Vehicle.of('ownerId', 'model', 'brand', 2022, 'plate', 15000)))
      if (query._plate === 'existingPlate')
        return InstantiatingDataWrapper.fromData(Promise.resolve(Vehicle.of('ownerId', 'model', 'brand', 2022, 'existingPlate', 15000)))
      else return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<Vehicle>)
    })
    when(mockedVehicleRepository.updateAsIs).thenReturn(() => Promise.resolve(true))
    when(mockedVehicleRepository.findManyActiveBy).thenReturn((query) => {
      if (query._ownerId !== 'existingId') return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<Vehicle[]>)
      return InstantiatingDataWrapper.fromData(
        Promise.resolve([
          Vehicle.of('ownerId', 'model', 'brand', 2022, 'plate', 15000),
          Vehicle.of('ownerId', 'model', 'brand', 2022, 'plate', 15000),
        ])
      )
    })
    when(mockedVehicleRepository.findMany).thenReturn((query) => {
      if (query._ownerId !== 'existingId') return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<Vehicle[]>)
      return InstantiatingDataWrapper.fromData(
        Promise.resolve([
          Vehicle.of('ownerId', 'model', 'brand', 2022, 'plate', 15000),
          Vehicle.of('ownerId', 'model', 'brand', 2022, 'plate', 15000),
        ])
      )
    })
    when(mockedVehicleRepository.create).thenReturn(async (instance: Vehicle) => {
      return instance
    })

    const mockedVehicleBrandsService = mock(VehicleBrandsService)
    when(mockedVehicleBrandsService.getVehicleBrandById).thenReturn((): Promise<VehicleBrand> => {
      return Promise.resolve(VehicleBrand.of('brand', VehicleType.CAR))
    })
    when(mockedVehicleBrandsService.getManyVehicleBrandById).thenReturn((): Promise<VehicleBrand[]> => {
      return Promise.resolve([VehicleBrand.of('brand', VehicleType.CAR)])
    })

    mockedUserRepository = mock(UserRepository)

    vehiclesService = new VehiclesService(instance(mockedVehicleRepository), instance(mockedVehicleBrandsService), instance(mockedUserRepository))
  })

  describe('When getting a vehicle by id', () => {
    describe('With a valid id', () => {
      it('should return the vehicle when asking for active vehicle', async () => {
        // Given
        const existingVehicleId = 'existingId'

        // When
        const vehicle = await vehiclesService.getVehicleById(existingVehicleId)

        // Then
        expect(vehicle).toBeDefined()
        expect(vehicle.vehicle).toBeDefined()
        expect(vehicle.brandName).toBe('brand')
      })

      it('should throw when asking for a softly deleted vehicle', async () => {
        // Given
        const existingVehicleId = 'inactiveVehicleId'

        // When
        const vehicle = async (): Promise<{ vehicle: Vehicle; brandName: string }> => await vehiclesService.getVehicleById(existingVehicleId)

        // Then
        await expect(vehicle).rejects.toThrow()
      })
    })

    it('should throw when asking for a non existing vehicle', async () => {
      // Given
      const existingVehicleId = 'qsd9fgq59f43'

      // When
      const vehicle = async (): Promise<{ vehicle: Vehicle; brandName: string }> => await vehiclesService.getVehicleById(existingVehicleId)

      // Then
      await expect(vehicle).rejects.toThrow()
    })
  })

  describe('When getting all vehicle of an owner', () => {
    it('should return all vehicle of an owner of existing id', async () => {
      // Given
      const existingOwnerId = 'existingId'

      // When
      const vehicles = await vehiclesService.getVehiclesOfOwner(existingOwnerId)

      // Then
      expect(vehicles).toBeDefined()
      expect(vehicles.vehicles.length).toBeGreaterThan(0)
    })

    it('should return empty array when asking for vehicle of a non existing owner', async () => {
      // Given
      const nonExistingOwnerId = 'qsd9fgq59f43'

      // When
      const vehicles = await vehiclesService.getVehiclesOfOwner(nonExistingOwnerId)

      // Then
      expect(vehicles.vehicles.length).toBe(0)
    })
  })

  describe('When creating a vehicle', () => {
    it('should return created vehicle with new plate', async () => {
      // Given
      const user = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345')
      const model = 'string'
      const brand = 'string'
      const year = 2022
      const plate = 'string'
      const mileage = 15000

      // When
      const { vehicle, brandName } = await vehiclesService.createVehicle(user, model, brand, year, plate, mileage)

      // Then
      const [updatedUser] = capture(mockedUserRepository.updateAsIs).last()
      expect(updatedUser).toBeDefined()
      expect(updatedUser.vehiclesId.length).toEqual(1)
      expect(updatedUser.vehiclesId[0]).toEqual(vehicle._id.toString())

      expect(vehicle).toBeDefined()
      expect(brandName).toBeDefined()
    })

    it('should throw created vehicle with existing plate', async () => {
      // Given
      const model = 'string'
      const brand = 'string'
      const year = 2022
      const plate = 'existingPlate'
      const mileage = 15000

      // When
      const createdVehicle = async (): Promise<{ vehicle: Vehicle; brandName: string }> =>
        await vehiclesService.createVehicle(globalUser, model, brand, year, plate, mileage)

      // Then
      await expect(createdVehicle).rejects.toThrow()
    })
  })

  describe('When soft deleting a vehicle', () => {
    it('should return true with existing id', async () => {
      // Given
      const existingVehicleId = 'existingId'

      // When
      const deletedVehicle = await vehiclesService.adminSoftDeleteVehicle(existingVehicleId)

      // Then
      expect(deletedVehicle).toBeTruthy()
    })
    it('should throw with unknown id', async () => {
      // Given
      const existingVehicleId = 'nonExistingId'

      // When
      const deletedVehicle = async (): Promise<boolean> => await vehiclesService.adminSoftDeleteVehicle(existingVehicleId)

      // Then
      await expect(deletedVehicle).rejects.toThrow()
    })
  })
})
