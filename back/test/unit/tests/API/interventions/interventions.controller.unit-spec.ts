import { instance, mock, when } from 'ts-mockito'
import { InterventionsService } from '@Api/interventions/interventions.service'
import { InterventionsController } from '@Api/interventions/interventions.controller'
import { Intervention } from '@Schemas/intervention'

const mockedInterventions: Intervention[] = [
  Intervention.of('Intervention 1', 'Description 1'),
  Intervention.of('Intervention 2', 'Description 2'),
  Intervention.of('Intervention 3', 'Description 3'),
  Intervention.of('Intervention 4', 'Description 4'),
  Intervention.of('Intervention 5', 'Description 5'),
]

describe('Controller - InterventionsController', () => {
  let controller: InterventionsController

  beforeAll(() => {
    const interventionsService = buildInterventionsServiceMock()

    controller = new InterventionsController(instance(interventionsService))
  })

  it('should return all interventions when calling GET []', async () => {
    // When
    const result = await controller.getAll()

    expect(result).toHaveLength(5)
    result.forEach((intervention, index) => {
      expect(intervention).toBeInstanceOf(Intervention)
      expect(intervention.label).toEqual(mockedInterventions[index].label)
    })
  })

  describe('When calling [:ID]', () => {
    it('should success with valid id', async () => {
      // When
      const result = await controller.getById('5f50a9f4e7841c3b5f2a57a0')

      expect(result).toStrictEqual(mockedInterventions[0])
    })

    it('should fail with invalid id', async () => {
      // When
      const result = async (): Promise<Intervention> => await controller.getById('Intervention 1')

      await expect(result).rejects.toThrow()
    })
  })
})

function buildInterventionsServiceMock(): InterventionsService {
  const mockedInterventionsService: InterventionsService = mock(InterventionsService)

  when(mockedInterventionsService.getAll).thenReturn(async () => mockedInterventions)
  when(mockedInterventionsService.getById).thenReturn(async () => {
    return mockedInterventions[0]
  })

  return mockedInterventionsService
}
