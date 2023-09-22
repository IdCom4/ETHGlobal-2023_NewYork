import { instance, mock, when } from 'ts-mockito'
import { InterventionsService } from '@Api/interventions/interventions.service'
import { Intervention } from '@Schemas/intervention'
import { InterventionRepository } from '@/repositories'
import { InstantiatingDataWrapper } from '@Common/classes'

const mockedInterventions: Intervention[] = [
  Intervention.of('Intervention 1', 'Description 1'),
  Intervention.of('Intervention 2', 'Description 2'),
  Intervention.of('Intervention 3', 'Description 3'),
  Intervention.of('Intervention 4', 'Description 4'),
  Intervention.of('Intervention 5', 'Description 5'),
]

describe('Service - InterventionsService', () => {
  let service: InterventionsService

  beforeAll(() => {
    const interventionsService = buildInterventionRepositoryMock()

    service = new InterventionsService(instance(interventionsService))
  })

  it('should return all interventions when calling GET []', async () => {
    // When
    const result = await service.getAll()

    expect(result).toHaveLength(5)
    result.forEach((intervention, index) => {
      expect(intervention).toBeInstanceOf(Intervention)
      expect(intervention.label).toEqual(mockedInterventions[index].label)
    })
  })

  describe('When calling [:ID]', () => {
    it('should success with valid id', async () => {
      // When
      const result = await service.getById(mockedInterventions[0]._id.toString())

      expect(result).toStrictEqual(mockedInterventions[0])
    })

    it('should fail with invalid id', async () => {
      // When
      const result = async (): Promise<Intervention> => await service.getById('Intervention 1')

      await expect(result).rejects.toThrow()
    })
  })
})

function buildInterventionRepositoryMock(): InterventionRepository {
  const mockedInterventionRepository: InterventionRepository = mock(InterventionRepository)

  when(mockedInterventionRepository.findAll).thenReturn(() => InstantiatingDataWrapper.fromData(Promise.all(mockedInterventions)))
  when(mockedInterventionRepository.findById).thenReturn((id) => {
    const filteredUsers = mockedInterventions.filter((user) => user._id.toString() === id.toString())[0]

    return filteredUsers
      ? InstantiatingDataWrapper.fromData(Promise.resolve(filteredUsers))
      : InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<Intervention>)
  })

  return mockedInterventionRepository
}
