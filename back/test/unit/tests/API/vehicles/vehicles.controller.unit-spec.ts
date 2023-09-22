import { VehiclesController } from '@Api/vehicles/vehicles.controller'
import { instance, mock, when } from 'ts-mockito'
import { VehiclesService } from '@Api/vehicles/vehicles.service'
import { Vehicle } from '@Schemas/vehicle/vehicle.schema'
import { VehicleNotFoundException } from '@Common/exceptions/schemas/vehicles/vehicle-not-found.exception'
import { User } from '@Schemas/user'
import { CreateVehicleRequest } from '@Api/vehicles/requests/create-vehicle.dto'
import { UpdateVehicleRequest } from '@Api/vehicles/requests/update-vehicle.dto'
import { MessageResponse } from '@Common/request-io/responses-dto'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { AdminVehicleResponse, GuestVehicleResponse } from '@Api/vehicles/responses/vehicle.dto'

describe('Controller - VehiclesController', () => {
  let vehiclesController: VehiclesController

  beforeAll(() => {
    const mockedVehicleService = mock(VehiclesService)

    when(mockedVehicleService.getVehiclesOfOwner).thenReturn(async (ownerId): Promise<{ vehicles: Vehicle[]; brandNames: Map<string, string> }> => {
      if (ownerId !== 'existingId') return { vehicles: [], brandNames: new Map() }
      return { vehicles: [Vehicle.of(ownerId, 'Model', 'Plate', 2022, 'Brand', 15000)], brandNames: new Map([['id', 'Brand']]) }
    })
    when(mockedVehicleService.getVehicleById).thenReturn(async (vehicleId): Promise<{ vehicle: Vehicle; brandName: string }> => {
      if (vehicleId === 'existingId') {
        return { vehicle: Vehicle.of('ownerId', 'Model', 'Plate', 2022, 'Brand', 15000), brandName: 'Brand' }
      } else throw new VehicleNotFoundException()
    })
    when(mockedVehicleService.userSoftDeleteVehicle).thenReturn(async (_, vehicleId): Promise<boolean> => {
      return vehicleId === 'existingId'
    })
    when(mockedVehicleService.adminSoftDeleteVehicle).thenReturn(async (vehicleId): Promise<boolean> => {
      return vehicleId === 'existingId'
    })
    when(mockedVehicleService.createVehicle).thenReturn(
      async (user, model, brand, year, plate, mileage): Promise<{ vehicle: Vehicle; brandName: string }> => {
        return { vehicle: Vehicle.of(user._id.toString(), model, brand, year, plate, mileage), brandName: 'Brand' }
      }
    )
    when(mockedVehicleService.userUpdateVehicle).thenReturn(
      async (updatingUserId, vehicleId, plate, mileage, model): Promise<{ vehicle: Vehicle; brandName: string }> => {
        return { vehicle: Vehicle.of(updatingUserId, model ?? 'model', <string>plate, 2022, 'Brand', <number>mileage), brandName: 'Brand' }
      }
    )
    when(mockedVehicleService.adminUpdateVehicle).thenReturn(
      async (vehicleId, plate, mileage, model): Promise<{ vehicle: Vehicle; brandName: string }> => {
        return { vehicle: Vehicle.of('ownerId', model ?? 'model', plate as string, 2022, 'Brand', <number>mileage), brandName: 'Brand' }
      }
    )

    vehiclesController = new VehiclesController(instance(mockedVehicleService))
  })

  it('should return all vehicles of the logged user', async () => {
    // Given
    const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
    Reflect.set(loggedUserWrapper.user, '_id', 'existingId')

    // When
    const vehicles = await vehiclesController.getSelfVehicles(loggedUserWrapper)

    // Then
    expect(vehicles).toHaveLength(1)
  })

  describe('When getting vehicle of an owner', () => {
    it('should return existing vehicle with an existing owner', async () => {
      // Given
      const ownerId = 'existingId'

      // When
      const vehicles = await vehiclesController.getVehiclesOfAnOwner(ownerId)

      // Then
      expect(vehicles).toHaveLength(1)
    })

    it('should return empty array with non existing owner', async () => {
      // Given
      const ownerId = 'existingId'

      // When
      const vehicles = await vehiclesController.getVehiclesOfAnOwner(ownerId)

      // Then
      expect(vehicles).toHaveLength(1)
    })
  })

  describe('When getting a vehicle by id', () => {
    it('should return existing vehicle with an existing id', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const vehicleId = 'existingId'

      // When
      const vehicle = await vehiclesController.getVehicleById(loggedUserWrapper, vehicleId)

      // Then
      expect(vehicle).toBeDefined()
    })

    it('should throw with non existing id', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const vehicleId = 'nonExistingId'

      // When
      const vehicle = async (): Promise<GuestVehicleResponse> => await vehiclesController.getVehicleById(loggedUserWrapper, vehicleId)

      // Then
      await expect(vehicle).rejects.toThrow(VehicleNotFoundException)
    })
  })

  describe('When getting a vehicle by id as an admin', () => {
    it('should return existing vehicle with an existing id', async () => {
      // Given
      const vehicleId = 'existingId'

      // When
      const vehicle = await vehiclesController.adminGetVehicleById(vehicleId)

      // Then
      expect(vehicle).toBeDefined()
    })

    it('should throw with non existing id', async () => {
      // Given
      const vehicleId = 'nonExistingId'

      // When
      const vehicle = async (): Promise<AdminVehicleResponse> => await vehiclesController.adminGetVehicleById(vehicleId)

      // Then
      await expect(vehicle).rejects.toThrow(VehicleNotFoundException)
    })
  })

  it('should return the created vehicle when creating a vehicle', async () => {
    // Given
    const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
    const request = Object.initClassByReflection(CreateVehicleRequest, {
      model: 'Model',
      brandId: '654sdf6qs4ef654sdf6qs4ef',
      year: 2022,
      plate: 'Plate',
      mileage: 15000,
    })

    // When
    const vehicle = await vehiclesController.createVehicle(loggedUserWrapper, request)

    // Then
    expect(vehicle).toBeDefined()
    expect(vehicle).toBeInstanceOf(GuestVehicleResponse)
  })

  it('should return the updated vehicle when updating a vehicle as a user', async () => {
    // Given
    const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
    const vehicleId = 'existingId'
    const request = Object.initClassByReflection(UpdateVehicleRequest, {
      plate: 'Plate',
      mileage: 15000,
    })

    // When
    const vehicle = await vehiclesController.userUpdateVehicle(loggedUserWrapper, vehicleId, request)

    // Then
    expect(vehicle).toBeDefined()
  })

  it('should return the updated vehicle when updating a vehicle as an admin', async () => {
    // Given
    const vehicleId = 'existingId'
    const request = Object.initClassByReflection(UpdateVehicleRequest, {
      plate: 'Plate',
      model: 'Model',
      mileage: 15000,
    })

    // When
    const vehicle = await vehiclesController.adminUpdateVehicle(vehicleId, request)

    // Then
    expect(vehicle).toBeDefined()
  })

  describe('When softly deleting a vehicle as a user', () => {
    it('should return a valid message responses with existing vehicle', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const vehicleId = 'existingId'

      // When
      const messageResponse = await vehiclesController.userSoftDeleteVehicle(loggedUserWrapper, vehicleId)

      // Then
      expect(messageResponse).toBeDefined()
      expect(messageResponse).toBeInstanceOf(MessageResponse)
    })

    it('should throw with an unknown vehicle', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const vehicleId = 'a65zsd4fsd65f4'

      // When
      const messageResponse = async (): Promise<MessageResponse> => await vehiclesController.userSoftDeleteVehicle(loggedUserWrapper, vehicleId)

      // Then
      await expect(messageResponse).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('When softly deleting a vehicle as an admin', () => {
    it('should return a valid message responses with existing vehicle', async () => {
      // Given
      const vehicleId = 'existingId'

      // When
      const messageResponse = await vehiclesController.adminSoftDeleteVehicle(vehicleId)

      // Then
      expect(messageResponse).toBeDefined()
      expect(messageResponse).toBeInstanceOf(MessageResponse)
    })

    it('should throw with an unknown vehicle', async () => {
      // Given
      const vehicleId = 'a65zsd4fsd65f4'

      // When
      const messageResponse = async (): Promise<MessageResponse> => await vehiclesController.adminSoftDeleteVehicle(vehicleId)

      // Then
      await expect(messageResponse).rejects.toThrow(InternalServerErrorException)
    })
  })
})
