import { instance, mock, when } from 'ts-mockito'
import { CenterServicesController } from '@Api/center-services/center-services/center-services.controller'
import { CenterServicesService } from '@Api/center-services/center-services/center-services.service'
import { CenterService } from '@Schemas/center-service'
import { PublicFile } from '@Schemas/common/pojos'
import { CenterServiceNotFoundException } from '@Common/exceptions/schemas/center-service'
import '@/extensions'
import { User } from '@Schemas/user'
import { CreateCenterServiceRequest } from '@Api/center-services/center-services/requests/create-center-service.dto'
import { UpdateCenterServiceRequest } from '@Api/center-services/center-services/requests/update-center-service.dto'
import { HttpStatus } from '@nestjs/common'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { MessageResponse } from '@Common/request-io/responses-dto'

describe('Controller - CenterServicesController', () => {
  let centerServicesController: CenterServicesController

  beforeAll(() => {
    const mockedCenterServicesService = mock(CenterServicesService)
    when(mockedCenterServicesService.getAllCenters).thenReturn(async (options) => {
      return options.activeOnly
        ? [CenterService.of('Titre', 'Sous-titre', 'Description', true, new PublicFile('qsd5f4', 'url', 'png'))]
        : [
            CenterService.of('Titre', 'Sous-titre', 'Description', true, new PublicFile('qsd5f4', 'url', 'png')),
            CenterService.of('Titre', 'Sous-titre', 'Description', false, new PublicFile('qsd5f4', 'url', 'png')),
            CenterService.of('Titre', 'Sous-titre', 'Description', false, new PublicFile('qsd5f4', 'url', 'png')),
          ]
    })
    when(mockedCenterServicesService.getCenterServiceById).thenReturn(async (centerServiceId) => {
      if (centerServiceId === 'existingCenterServiceId')
        return CenterService.of('Titre', 'Sous-titre', 'Description', true, new PublicFile('qsd5f4', 'url', 'png'))
      else throw new CenterServiceNotFoundException()
    })
    when(mockedCenterServicesService.createCenterService).thenReturn(
      async (uploader, title, subtitle, description, isActive, picture, numberOfSales, optionIds, categories, prices) =>
        CenterService.of(
          title,
          subtitle,
          description,
          isActive,
          new PublicFile('6wsf4', 'google.com', 'png'),
          numberOfSales,
          optionIds,
          categories,
          prices
        )
    )
    when(mockedCenterServicesService.updateCenterService).thenReturn(async (uploader, centerServiceId) => {
      return centerServiceId === 'existingCenterServiceId'
    })
    when(mockedCenterServicesService.deleteCenterService).thenReturn(async (centerServiceId) => {
      if (centerServiceId !== 'existingCenterServiceId') throw new CenterServiceNotFoundException()
    })
    when(mockedCenterServicesService.deactivateCenterService).thenReturn(async (centerServiceId) => {
      if (centerServiceId !== 'existingCenterServiceId') throw new CenterServiceNotFoundException()
    })

    centerServicesController = new CenterServicesController(instance(mockedCenterServicesService))
  })

  it('should return all active center services', async () => {
    // When
    const collectedCenterServices = await centerServicesController.getAllActiveCenterServices()

    // Then
    expect(collectedCenterServices.length).toBe(1)
  })

  describe('When getting a center service from an Id', () => {
    it('should return a center service with a valid id', async () => {
      // Given
      const centerServiceId = 'existingCenterServiceId'

      // When
      const collectedCenterService = await centerServicesController.getCenterServiceById(centerServiceId)

      // Then
      expect(collectedCenterService).toBeTruthy()
    })

    it('should fail with unknown id', async () => {
      // Given
      const centerServiceId = '65s4dg6q84fg6ssd4ff'

      // When
      const gettingCenterService = async (): Promise<CenterService> => await centerServicesController.getCenterServiceById(centerServiceId)

      // Then
      await expect(gettingCenterService).rejects.toThrow(CenterServiceNotFoundException)
    })
  })

  it('should return all center services', async () => {
    // When
    const collectedCenterServices = await centerServicesController.getAllCenterServices()

    // Then
    expect(collectedCenterServices.length).toBe(3)
  })

  it('should return created center service', async () => {
    // Given
    const user = User.of('Doe', 'John', '0612345678', 'john@doe.com', 'hashedPassword')
    const request: CreateCenterServiceRequest = Object.initClassByReflection(CreateCenterServiceRequest, {
      title: 'Titre',
      subtitle: 'Sous-titre',
      description: 'Description',
      isActive: true,
      picture: 'data:image/png;base64,AQ=="',
    })

    // When
    const createdCenterService = await centerServicesController.createCenterServices({ user } as RequestWithLoggedUser, request)

    // Then
    expect(createdCenterService).toBeTruthy()
    expect(createdCenterService.title).toBe(request.title)
    expect(createdCenterService.subtitle).toBe(request.subtitle)
    expect(createdCenterService.description).toBe(request.description)
    expect(createdCenterService.isActive).toBe(request.isActive)
    expect(createdCenterService.picture).toBeTruthy()
  })

  describe('When updating selected center service', () => {
    it('should success with valid Id', async () => {
      // Given
      const user = User.of('Doe', 'John', '0612345678', 'john@doe.com', 'hashedPassword')
      const centerServiceId = 'existingCenterServiceId'
      const request: UpdateCenterServiceRequest = Object.initClassByReflection<UpdateCenterServiceRequest>(UpdateCenterServiceRequest, {
        title: 'Titre',
        subtitle: 'Sous-titre',
        description: 'Description',
        isActive: true,
      })

      const response = await centerServicesController.updateCenterService({ user } as RequestWithLoggedUser, centerServiceId, request)

      expect(response).toBeTruthy()
      expect(response.statusCode).toBe(HttpStatus.OK)
    })

    it('should fail with invalid Id', async () => {
      // Given
      const user = User.of('Doe', 'John', '0612345678', 'john@doe.com', 'hashedPassword')
      const centerServiceId = 'eqr6de3gs9dg3fg54sd5dfg4q6fg4q6f4qs68fg4q68d4fg6qsd84fg6qs84g'
      const request: UpdateCenterServiceRequest = Object.initClassByReflection<UpdateCenterServiceRequest>(UpdateCenterServiceRequest, {
        title: 'Titre',
        subtitle: 'Sous-titre',
        description: 'Description',
        isActive: true,
      })

      const updatingRessource = async (): Promise<MessageResponse> =>
        await centerServicesController.updateCenterService({ user } as RequestWithLoggedUser, centerServiceId, request)

      await expect(updatingRessource).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('When soft deleting a center service', () => {
    it('should success with valid id', async () => {
      // Given
      const serviceOptionId = 'existingCenterServiceId'

      // When
      const response = await centerServicesController.deleteCenterService(serviceOptionId)

      // Then
      expect(response.statusCode).toBe(200)
    })

    it('should fail with valid id', async () => {
      // Given
      const serviceOptionId = 'qs3dfg2sqd5f416s5qf4'

      // When
      const updatingServiceOption = async (): Promise<MessageResponse> => await centerServicesController.deleteCenterService(serviceOptionId)

      // Then
      await expect(updatingServiceOption).rejects.toThrow()
    })
  })

  describe('When deactivating a center service', () => {
    it('should success with valid id', async () => {
      // Given
      const serviceOptionId = 'existingCenterServiceId'

      // When
      const response = await centerServicesController.deactivateCenterService(serviceOptionId)

      // Then
      expect(response.statusCode).toBe(200)
    })

    it('should fail with valid id', async () => {
      // Given
      const serviceOptionId = 'qs3dfg2sqd5f416s5qf4'

      // When
      const updatingServiceOption = async (): Promise<MessageResponse> => await centerServicesController.deactivateCenterService(serviceOptionId)

      // Then
      await expect(updatingServiceOption).rejects.toThrow()
    })
  })
})
