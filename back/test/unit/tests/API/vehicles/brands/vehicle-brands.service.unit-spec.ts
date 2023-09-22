import { instance, mock, when } from 'ts-mockito'
import { VehicleBrandsService } from '@Api/vehicles/brands/vehicle-brands.service'
import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import { VehicleBrandRepository } from '@/repositories/vehicle/vehicle-brand.repository'
import { VehicleType } from '@Common/enums/schemas/vehicle-brand.schema.enum'
import { InstantiatingDataWrapper } from '@Common/classes'

describe('Service - VehicleBrandsService', () => {
  let vehicleBrandsService: VehicleBrandsService

  beforeAll(() => {
    const mockedVehicleBrandRepository = mock(VehicleBrandRepository)
    when(mockedVehicleBrandRepository.findById).thenReturn((id) => {
      if (id === 'existingId') return InstantiatingDataWrapper.fromData(Promise.resolve(VehicleBrand.of('name', VehicleType.CAR)))
      else return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<VehicleBrand>)
    })
    when(mockedVehicleBrandRepository.findAll).thenReturn(() => {
      return InstantiatingDataWrapper.fromData(Promise.resolve([VehicleBrand.of('name', VehicleType.CAR), VehicleBrand.of('name', VehicleType.CAR)]))
    })
    when(mockedVehicleBrandRepository.findBy).thenReturn((query) => {
      if (query._id === 'existingId') return InstantiatingDataWrapper.fromData(Promise.resolve(VehicleBrand.of('name', VehicleType.CAR)))
      if (query._name === 'existingName') return InstantiatingDataWrapper.fromData(Promise.resolve(VehicleBrand.of('existingName', VehicleType.CAR)))
      else return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<VehicleBrand>)
    })
    when(mockedVehicleBrandRepository.updateAsIs).thenReturn(() => Promise.resolve(true))
    when(mockedVehicleBrandRepository.findMany).thenReturn((query) => {
      if (query._ownerId !== 'existingId') return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<VehicleBrand[]>)
      return InstantiatingDataWrapper.fromData(Promise.resolve([VehicleBrand.of('name', VehicleType.CAR), VehicleBrand.of('name', VehicleType.CAR)]))
    })
    when(mockedVehicleBrandRepository.create).thenReturn(async (vehicleBrand): Promise<VehicleBrand> => {
      return vehicleBrand
    })
    when(mockedVehicleBrandRepository.delete).thenReturn(async (): Promise<boolean> => {
      return true
    })

    vehicleBrandsService = new VehicleBrandsService(instance(mockedVehicleBrandRepository))
  })

  describe('When getting a vehicle brand by id', () => {
    it('should return the vehicle brand with existing id', async () => {
      // Given
      const existingVehicleId = 'existingId'

      // When
      const vehicleBrand = await vehicleBrandsService.getVehicleBrandById(existingVehicleId)

      // Then
      expect(vehicleBrand).toBeDefined()
      expect(vehicleBrand).toBeInstanceOf(VehicleBrand)
    })

    it('should return a new Brand named DELETED', async () => {
      // Given
      const existingVehicleId = 'qsd9fgq59f43'

      // When
      const vehicleBrand = await vehicleBrandsService.getVehicleBrandById(existingVehicleId)

      // Then
      expect(vehicleBrand).toBeDefined()
      expect(vehicleBrand.name).toBe('DELETED')
    })
  })

  it('should return all vehicle brands', async () => {
    // When
    const vehicles = await vehicleBrandsService.getVehicleBrands()

    // Then
    expect(vehicles.length).toBe(2)
  })

  describe('When creating a vehicle', () => {
    it('should return created vehicle with new name', async () => {
      // Given
      const name = 'Marque'
      const vehicleType = VehicleType.CAR

      // When
      const createdVehicle = await vehicleBrandsService.createVehicleBrand(name, vehicleType)

      // Then
      expect(createdVehicle).toBeDefined()
      expect(createdVehicle).toBeInstanceOf(VehicleBrand)
    })

    it('should throw created vehicle with existing name', async () => {
      // Given
      const name = 'existingName'
      const vehicleType = VehicleType.CAR

      // When
      const createdVehicle = async (): Promise<VehicleBrand> => await vehicleBrandsService.createVehicleBrand(name, vehicleType)

      // Then
      await expect(createdVehicle).rejects.toThrow()
    })
  })

  describe('When soft deleting a vehicle', () => {
    it('should return true with existing id', async () => {
      // Given
      const existingVehicleId = 'existingId'

      // When
      const deletedVehicle = await vehicleBrandsService.deleteVehicleBrand(existingVehicleId)

      // Then
      expect(deletedVehicle).toBeTruthy()
    })

    it('should throw with unknown id', async () => {
      // Given
      const existingVehicleId = 'nonExistingId'

      // When
      const deletedVehicle = async (): Promise<boolean> => await vehicleBrandsService.deleteVehicleBrand(existingVehicleId)

      // Then
      await expect(deletedVehicle).rejects.toThrow()
    })
  })
})
