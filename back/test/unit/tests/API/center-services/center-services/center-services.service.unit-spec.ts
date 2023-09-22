import { instance, mock, when } from 'ts-mockito'
import { CenterServicesService } from '@Api/center-services/center-services/center-services.service'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { CenterServiceRepository } from '@/repositories/center-service.repository'
import { CenterService } from '@Schemas/center-service'
import { PublicFile } from '@Schemas/common/pojos'
import { CenterServiceNotFoundException } from '@Common/exceptions/schemas/center-service'
import { HostedFileReference } from '@Schemas/hostedFileReference'
import { User } from '@Schemas/user'
import { InstantiatingDataWrapper } from '@Common/classes'

describe('Service - CenterServicesService', () => {
  let centerServicesService: CenterServicesService

  beforeAll(() => {
    const mockedCenterServiceRepository = mock(CenterServiceRepository)
    when(mockedCenterServiceRepository.findMany).thenReturn((query) => {
      if (query._isActive)
        return InstantiatingDataWrapper.fromData(
          Promise.resolve([CenterService.of('Titre', 'Sous-titre', 'Description', true, new PublicFile('qsd5f4', 'url', 'png'))])
        )
      else
        return InstantiatingDataWrapper.fromData(
          Promise.resolve([
            CenterService.of('Titre', 'Sous-titre', 'Description', true, new PublicFile('qsd5f4', 'url', 'png')),
            CenterService.of('Titre', 'Sous-titre', 'Description', false, new PublicFile('qsd5f4', 'url', 'png')),
            CenterService.of('Titre', 'Sous-titre', 'Description', false, new PublicFile('qsd5f4', 'url', 'png')),
          ])
        )
    })
    when(mockedCenterServiceRepository.findAll).thenReturn(() =>
      InstantiatingDataWrapper.fromData(
        Promise.resolve([
          CenterService.of('Titre', 'Sous-titre', 'Description', true, new PublicFile('qsd5f4', 'url', 'png')),
          CenterService.of('Titre', 'Sous-titre', 'Description', false, new PublicFile('qsd5f4', 'url', 'png')),
          CenterService.of('Titre', 'Sous-titre', 'Description', false, new PublicFile('qsd5f4', 'url', 'png')),
        ])
      )
    )
    when(mockedCenterServiceRepository.findBy).thenReturn((query) => {
      if (query._id === 'existingCenterServiceId')
        return InstantiatingDataWrapper.fromData(
          Promise.resolve(CenterService.of('Titre', 'Sous-titre', 'Description', true, new PublicFile('qsd5f4', 'url', 'png')))
        )
      else return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<CenterService>)
    })
    when(mockedCenterServiceRepository.findById).thenReturn((id) => {
      return id === 'existingCenterServiceId'
        ? InstantiatingDataWrapper.fromData(
            Promise.resolve(CenterService.of('Titre', 'Sous-titre', 'Description', true, new PublicFile('qsd5f4', 'url', 'png')))
          )
        : InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<CenterService>)
    })
    when(mockedCenterServiceRepository.create).thenReturn(async (instance) => instance)
    when(mockedCenterServiceRepository.updateAsIs).thenReturn(async () => true)

    const mockedHostedFilesService = mock(HostedFilesService)
    when(mockedHostedFilesService.upload).thenReturn(async (file, uploaderId, isPrivate) =>
      HostedFileReference.of(`test-${file.name}`, file.name ?? 'name', 'pnj', uploaderId, isPrivate)
    )

    centerServicesService = new CenterServicesService(instance(mockedCenterServiceRepository), instance(mockedHostedFilesService))
  })

  describe('When getting center services', () => {
    it('should return all active center services with activeOnly parameter set on true', async () => {
      // When
      const centerServices = await centerServicesService.getAllCenters({ activeOnly: true })

      // Then
      expect(centerServices.length).toBe(1)
    })

    it('should return all center services with activeOnly parameter set on false', async () => {
      // When
      const centerServices = await centerServicesService.getAllCenters({ activeOnly: false })

      // Then
      expect(centerServices.length).toBe(3)
    })
  })

  describe('When getting a center service by id', () => {
    it('should success with a valid id', async () => {
      // Given
      const centerServiceId = 'existingCenterServiceId'

      // When
      const centerService = await centerServicesService.getCenterServiceById(centerServiceId)

      // Then
      expect(centerService).toBeTruthy()
    })

    it('should fail with an invalid id', async () => {
      // Given
      const centerServiceId = '684qsf68qs4f68q1fq6s8f1q6s8gf1q68g16h81y68jh1d6uj8d'

      // When
      const gettingCenterService = async (): Promise<CenterService> => await centerServicesService.getCenterServiceById(centerServiceId)

      // Then
      await expect(gettingCenterService).rejects.toThrow(CenterServiceNotFoundException)
    })
  })

  it('should create a new center service', async () => {
    // given
    const user = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345')
    const title = 'Titre'
    const subtitle = 'Sous-titre'
    const description = 'Description'
    const isActive = true
    const picture = 'data:image/png;base64,AQ=='

    // Then
    const createdCenterService = await centerServicesService.createCenterService(user, title, subtitle, description, isActive, picture)

    // When
    expect(createdCenterService.title).toBe(title)
    expect(createdCenterService.subtitle).toBe(subtitle)
    expect(createdCenterService.description).toBe(description)
    expect(createdCenterService.isActive).toBe(isActive)
    expect(createdCenterService.picture).toBeTruthy()
  })

  describe('When updating center service', () => {
    it('should success with valid id', async () => {
      // Given
      const uploader = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345')
      const centerServiceId = 'existingCenterServiceId'
      const title = 'Titree'
      const subtitle = 'Sous-Tittree'
      const description = 'Descriptionnnnnnnn'
      const isActive = false

      // When
      const didUpdate = await centerServicesService.updateCenterService(uploader, centerServiceId, title, subtitle, description, isActive)

      // Then
      expect(didUpdate).toBe(true)
    })

    it('should fail with invalid id', async () => {
      // Given
      const uploader = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345')
      const centerServiceId = '6dfg41h68df4gh'
      const title = 'Titree'
      const subtitle = 'Sous-Tittree'
      const description = 'Descriptionnnnnnnn'
      const isActive = false

      // When
      const updatingCenterService = async (): Promise<boolean> =>
        await centerServicesService.updateCenterService(uploader, centerServiceId, title, subtitle, description, isActive)

      // Then
      await expect(updatingCenterService).rejects.toThrow(CenterServiceNotFoundException)
    })
  })

  describe('When soft deleting ressource', () => {
    it('should success with valid id', async () => {
      // Given
      const centerServiceId = 'existingCenterServiceId'

      // When
      const deletingCenterService = async (): Promise<void> => centerServicesService.deleteCenterService(centerServiceId)

      // Then
      await expect(deletingCenterService()).resolves.not.toThrow()
    })

    it('should fail with valid id', async () => {
      // Given
      const centerServiceId = 'wsdxg51sdf3g651'

      // When
      const deletingCenterService = async (): Promise<void> => centerServicesService.deleteCenterService(centerServiceId)

      // Then
      await expect(deletingCenterService).rejects.toThrow(CenterServiceNotFoundException)
    })
  })

  describe('When deactivating  ressource', () => {
    it('should success with valid id', async () => {
      // Given
      const centerServiceId = 'existingCenterServiceId'

      // When
      const deletingCenterService = async (): Promise<void> => centerServicesService.deactivateCenterService(centerServiceId)

      // Then
      await expect(deletingCenterService()).resolves.not.toThrow()
    })

    it('should fail with valid id', async () => {
      // Given
      const centerServiceId = 'wsdxg51sdf3g651'

      // When
      const deletingCenterService = async (): Promise<void> => centerServicesService.deactivateCenterService(centerServiceId)

      // Then
      await expect(deletingCenterService).rejects.toThrow(CenterServiceNotFoundException)
    })
  })
})
