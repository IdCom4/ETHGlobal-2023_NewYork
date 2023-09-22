import { ServiceOptionsController } from '@Api/center-services/service-options/service-options.controller'
import { instance, mock, when } from 'ts-mockito'
import { ServiceOptionsService } from '@Api/center-services/service-options/service-options.service'
import { ServiceOption } from '@Schemas/center-service'
import { ServiceOptionNotFoundException } from '@Common/exceptions/schemas/center-service'
import { CreateServiceOptionRequest } from '@Api/center-services/service-options/requests/create-service-option.dto'
import { PricesByVehicleTypeDTO } from '@Common/request-io/request-dto/prices-by-vehicle-type.dto'
import { UpdateServiceOptionRequest } from '@Api/center-services/service-options/requests/update-service-option.dto'
import { MessageResponse } from '@Common/request-io/responses-dto'

describe('Controller - ServiceOptionsController', () => {
  let serviceOptionsController: ServiceOptionsController

  beforeAll(() => {
    const mockedServiceOptionsService = mock(ServiceOptionsService)

    serviceOptionsController = new ServiceOptionsController(instance(mockedServiceOptionsService))
    when(mockedServiceOptionsService.getAllServiceOptions).thenReturn(async (): Promise<ServiceOption[]> => {
      return [ServiceOption.of('Titre'), ServiceOption.of('Titre'), ServiceOption.of('Titre')]
    })
    when(mockedServiceOptionsService.getServiceOptionById).thenReturn(async (serviceOptionId) => {
      if (serviceOptionId === 'existingServiceOptionId') return ServiceOption.of('Titre')
      else throw new ServiceOptionNotFoundException()
    })
    when(mockedServiceOptionsService.createServiceOption).thenReturn(async (title, extraPrices) => ServiceOption.of(title, extraPrices))
    when(mockedServiceOptionsService.updateServiceOption).thenReturn(async (serviceOptionId) => {
      return serviceOptionId === 'existingServiceOptionId'
    })
    when(mockedServiceOptionsService.deleteServiceOption).thenReturn(async (serviceOptionId) => {
      return serviceOptionId === 'existingServiceOptionId'
    })
  })

  it('should return all service options', async () => {
    // When
    const collectedServiceOptions = await serviceOptionsController.getAllServiceOptions()

    // Then
    expect(collectedServiceOptions.length).toBe(3)
  })

  describe('When getting service option by id', () => {
    it('should success with valid id', async () => {
      // Given
      const serviceOptionId = 'existingServiceOptionId'

      // When
      const collectedServiceOption = await serviceOptionsController.getServiceOptionsById(serviceOptionId)

      // Then
      expect(collectedServiceOption).toBeTruthy()
    })

    it('should fail with invalid id', async () => {
      // Given
      const serviceOptionId = 'qs63541df'

      // When
      const collectedServiceOption = async (): Promise<ServiceOption> => await serviceOptionsController.getServiceOptionsById(serviceOptionId)

      // Then
      await expect(collectedServiceOption).rejects.toThrow(ServiceOptionNotFoundException)
    })
  })

  it('should return created service option', async () => {
    // Given
    const request: CreateServiceOptionRequest = Object.initClassByReflection(CreateServiceOptionRequest, {
      title: 'Titre',
      extraPrices: Object.initClassByReflection(PricesByVehicleTypeDTO, {
        priceTTC2Seats: 1,
      }),
    })

    // When
    const createdServiceOption = await serviceOptionsController.createServiceOption(request)

    // Then
    expect(createdServiceOption.title).toBe(request.title)
    expect(createdServiceOption.extraPrices.priceTTC2Seats).toBe(request.extraPrices?.priceTTC2Seats)
    expect(createdServiceOption.extraPrices.priceTTC2Wheels).toBeFalsy()
  })

  describe('When updating a service option', () => {
    it('should success with valid id', async () => {
      // Given
      const serviceOptionId = 'existingServiceOptionId'
      const request: UpdateServiceOptionRequest = Object.initClassByReflection(UpdateServiceOptionRequest, {
        title: 'Titeule',
        extraPrices: Object.initClassByReflection(PricesByVehicleTypeDTO, {
          priceTTC2Seats: 1,
        }),
      })

      // When
      const response = await serviceOptionsController.updateServiceOption(serviceOptionId, request)

      // Then
      expect(response.statusCode).toBe(200)
    })

    it('should fail with valid id', async () => {
      // Given
      const serviceOptionId = 'qs6df416qs4fg1d'
      const request: UpdateServiceOptionRequest = Object.initClassByReflection(UpdateServiceOptionRequest, {
        title: 'Titeule',
        extraPrices: Object.initClassByReflection(PricesByVehicleTypeDTO, {
          priceTTC2Seats: 1,
        }),
      })

      // When
      const updatingServiceOption = async (): Promise<MessageResponse> => await serviceOptionsController.updateServiceOption(serviceOptionId, request)

      // Then
      await expect(updatingServiceOption).rejects.toThrow()
    })
  })

  describe('When deleting a service option', () => {
    it('should success with valid id', async () => {
      // Given
      const serviceOptionId = 'existingServiceOptionId'

      // When
      const response = await serviceOptionsController.deleteServiceOption(serviceOptionId)

      // Then
      expect(response.statusCode).toBe(200)
    })

    it('should fail with valid id', async () => {
      // Given
      const serviceOptionId = 'qsdfg2sqd5f416s5qf4'

      // When
      const updatingServiceOption = async (): Promise<MessageResponse> => await serviceOptionsController.deleteServiceOption(serviceOptionId)

      // Then
      await expect(updatingServiceOption).rejects.toThrow()
    })
  })
})
