import { instance, mock, when } from 'ts-mockito'
import { VehicleNotFoundException } from '@Common/exceptions/schemas/vehicles/vehicle-not-found.exception'
import { MessageResponse } from '@Common/request-io/responses-dto'
import { VehicleBrandsController } from '@Api/vehicles/brands/vehicle-brands.controller'
import { VehicleBrandsService } from '@Api/vehicles/brands/vehicle-brands.service'
import { VehicleBrand } from '@Schemas/vehicle/brand/vehicle-brand.schema'
import { CreateVehicleBrandRequest } from '@Api/vehicles/brands/requests/create-vehicle-brand.dto'
import { UpdateVehicleBrandRequest } from '@Api/vehicles/brands/requests/update-vehicle-brand.dto'
import { VehicleBrandNotFoundException } from '@Common/exceptions/schemas/vehicles/brand/vehicle-brand-not-found.exception'
import { VehicleType } from '@Common/enums/schemas/vehicle-brand.schema.enum'
import { VehicleBrandResponse } from '@Api/vehicles/brands/responses/vehicle-brand.dto'

describe('Controller - VehicleBrandsController', () => {
  let vehiclesController: VehicleBrandsController

  beforeAll(() => {
    const mockedVehicleBrandsService = mock(VehicleBrandsService)
    when(mockedVehicleBrandsService.getVehicleBrands).thenReturn(async (): Promise<VehicleBrand[]> => {
      return [VehicleBrand.of('name', VehicleType.CAR), VehicleBrand.of('name', VehicleType.CAR)]
    })
    when(mockedVehicleBrandsService.getVehicleBrandById).thenReturn(async (id): Promise<VehicleBrand> => {
      if (id === 'existingId') return VehicleBrand.of('name', VehicleType.CAR)
      else throw new VehicleNotFoundException()
    })
    when(mockedVehicleBrandsService.updateVehicleBrand).thenReturn(async (id, name, vehicleType): Promise<VehicleBrand> => {
      if (id === 'existingId') {
        const vehicleBrand = VehicleBrand.of('name', VehicleType.CAR)
        vehicleBrand.update(name, vehicleType)
        return vehicleBrand
      } else throw new VehicleNotFoundException()
    })
    when(mockedVehicleBrandsService.createVehicleBrand).thenReturn(async (name, vehicleType): Promise<VehicleBrand> => {
      return Promise.resolve(VehicleBrand.of(name, vehicleType))
    })
    when(mockedVehicleBrandsService.deleteVehicleBrand).thenReturn(async (id): Promise<boolean> => {
      if (id === 'existingId') return true
      else throw new VehicleBrandNotFoundException()
    })

    vehiclesController = new VehicleBrandsController(instance(mockedVehicleBrandsService))
  })

  it('should return all vehicle brands', async () => {
    // When
    const vehicleBrands = await vehiclesController.getVehicleBrands()

    // Then
    expect(vehicleBrands).toHaveLength(2)
  })

  describe('When getting a vehicle brand by id', () => {
    it('should return a vehicle brand with an existing id', async () => {
      // Given
      const vehicleBrandId = 'existingId'

      // When
      const vehicleBrand = await vehiclesController.getVehicleBrandById(vehicleBrandId)

      // Then
      expect(vehicleBrand).toBeDefined()
    })

    it('should throw with non existing id', async () => {
      // Given
      const vehicleBrandId = 'nonExistingId'

      // When
      const vehicleBrand = async (): Promise<VehicleBrandResponse> => await vehiclesController.getVehicleBrandById(vehicleBrandId)

      // Then
      await expect(vehicleBrand).rejects.toThrow(VehicleNotFoundException)
    })
  })

  it('should return the created vehicle when creating a vehicle', async () => {
    // Given
    const request = Object.initClassByReflection(CreateVehicleBrandRequest, {
      name: 'Marque',
      vehicleType: VehicleType.CAR,
    })

    // When
    const vehicle = await vehiclesController.createVehicleBrand(request)

    // Then
    expect(vehicle).toBeDefined()
    expect(vehicle).toBeInstanceOf(VehicleBrandResponse)
  })

  it('should return the updated vehicle when updating a vehicle as a user', async () => {
    // Given
    const vehicleId = 'existingId'
    const request = Object.initClassByReflection(UpdateVehicleBrandRequest, {
      name: 'Marque',
      vehicleType: VehicleType.CAR,
    })

    // When
    const vehicle = await vehiclesController.updateVehicleBrand(vehicleId, request)

    // Then
    expect(vehicle).toBeDefined()
    expect(vehicle).toBeInstanceOf(VehicleBrandResponse)
  })

  describe('When deleting a vehicle', () => {
    it('should return a valid message responses with existing vehicle', async () => {
      // Given
      const vehicleId = 'existingId'

      // When
      const messageResponse = await vehiclesController.deleteVehicleBrand(vehicleId)

      // Then
      expect(messageResponse).toBeDefined()
      expect(messageResponse).toBeInstanceOf(MessageResponse)
    })

    it('should throw with an unknown vehicle', async () => {
      // Given
      const vehicleId = 'a65zsd4fsd65f4'

      // When
      const messageResponse = async (): Promise<MessageResponse> => await vehiclesController.deleteVehicleBrand(vehicleId)

      // Then
      await expect(messageResponse).rejects.toThrow(VehicleBrandNotFoundException)
    })
  })
})
