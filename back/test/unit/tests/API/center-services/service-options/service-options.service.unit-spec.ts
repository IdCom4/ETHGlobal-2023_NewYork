import { instance, mock, when } from 'ts-mockito'
import { PricesByVehicleType, ServiceOption } from '@Schemas/center-service'
import { ServiceOptionsService } from '@Api/center-services/service-options/service-options.service'
import { ServiceOptionRepository } from '@/repositories/service-option.repository'
import { ServiceOptionNotFoundException } from '@Common/exceptions/schemas/center-service'
import { InstantiatingDataWrapper } from '@Common/classes'

describe('Service - ServiceOptionsService', () => {
  let serviceOptionService: ServiceOptionsService

  beforeAll(() => {
    const mockedServiceOptionRepository = mock(ServiceOptionRepository)
    when(mockedServiceOptionRepository.findAll).thenReturn(() =>
      InstantiatingDataWrapper.fromData(Promise.resolve([ServiceOption.of('Titre'), ServiceOption.of('Titre'), ServiceOption.of('Titre')]))
    )
    when(mockedServiceOptionRepository.findBy).thenReturn((query) => {
      if (query._id === 'existingServiceOptionId') return InstantiatingDataWrapper.fromData(Promise.resolve(ServiceOption.of('Titre')))
      else return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<ServiceOption>)
    })
    when(mockedServiceOptionRepository.findById).thenReturn((id) => {
      return id === 'existingServiceOptionId'
        ? InstantiatingDataWrapper.fromData(Promise.resolve(ServiceOption.of('Titre')))
        : InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<ServiceOption>)
    })
    when(mockedServiceOptionRepository.create).thenReturn(async (instance) => instance)
    when(mockedServiceOptionRepository.updateAsIs).thenReturn(async () => true)
    when(mockedServiceOptionRepository.delete).thenReturn(async (id) => id === 'existingServiceOptionId')

    serviceOptionService = new ServiceOptionsService(instance(mockedServiceOptionRepository))
  })

  it('should return all active service options', async () => {
    // When
    const centerServices = await serviceOptionService.getAllServiceOptions()

    // Then
    expect(centerServices.length).toBe(3)
  })

  describe('When getting a service option by id', () => {
    it('should success with a valid id', async () => {
      // Given
      const serviceOptionId = 'existingServiceOptionId'

      // When
      const serviceOption = await serviceOptionService.getServiceOptionById(serviceOptionId)

      // Then
      expect(serviceOption).toBeTruthy()
    })

    it('should fail with an invalid id', async () => {
      // Given
      const serviceOptionId = '684qsf68qs4f68q1fq6s8f1q6s8gf1q68g16h81y68jh1d6uj8d'

      // When
      const gettingServiceOption = async (): Promise<ServiceOption> => await serviceOptionService.getServiceOptionById(serviceOptionId)

      // Then
      await expect(gettingServiceOption).rejects.toThrow(ServiceOptionNotFoundException)
    })
  })

  it('should create a new service option', async () => {
    // given
    const title = 'Titre'
    const extraPrices = new PricesByVehicleType(1)

    // Then
    const createdServiceOption = await serviceOptionService.createServiceOption(title, extraPrices)

    // When
    expect(createdServiceOption.title).toBe(title)
    expect(createdServiceOption.extraPrices).toBe(extraPrices)
  })

  describe('When updating service option', () => {
    it('should success with valid id', async () => {
      // Given
      const serviceOptionId = 'existingServiceOptionId'
      const title = 'Titree'
      const extraPrices = new PricesByVehicleType(1, 5, 6)

      // When
      const didUpdate = await serviceOptionService.updateServiceOption(serviceOptionId, title, extraPrices)

      // Then
      expect(didUpdate).toBe(true)
    })

    it('should fail with invalid id', async () => {
      // Given
      const serviceOptionId = 'existingServiceOptionId'
      const title = 'Titree'
      const extraPrices = new PricesByVehicleType(1, 5, 6)

      // When
      const didUpdate = await serviceOptionService.updateServiceOption(serviceOptionId, title, extraPrices)

      // Then
      expect(didUpdate).toBe(true)
    })
  })

  describe('When deleting ressource', () => {
    it('should success with valid id', async () => {
      // Given
      const centerServiceId = 'existingServiceOptionId'

      // When
      const deletingCenterService = await serviceOptionService.deleteServiceOption(centerServiceId)

      // Then
      expect(deletingCenterService).toBe(true)
    })

    it('should fail with valid id', async () => {
      // Given
      const serviceOptionId = 'wsdxg51sdf3g651'

      // When
      const deletingCenterService = await serviceOptionService.deleteServiceOption(serviceOptionId)

      // Then
      expect(deletingCenterService).toBe(false)
    })
  })
})
