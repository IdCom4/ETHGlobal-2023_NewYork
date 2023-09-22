import { CentersService } from '@Api/centers/centers.service'
import { BoxesService } from '@Api/boxes/boxes.service'
import { instance, mock, when } from 'ts-mockito'
import { CenterRepository } from '@/repositories'
import { StrictAddress, TimeRange } from '@Schemas/common/pojos'
import { Center, WeekOpeningHours } from '@Schemas/center'
import { InstantiatingDataWrapper } from '@Common/classes'
import { BoxCategories, DaysOfWeek } from '@Common/enums'
import { Box, Formula } from '@Schemas/box'

const mockedCenters = [
  Center.of('Center 1', StrictAddress.of('street', 'zipCode', 'city', [1, 1])),
  Center.of('Center 2', StrictAddress.of('street', 'zipCode', 'city', [1, 1])),
  Center.of('Center 3', StrictAddress.of('street', 'zipCode', 'city', [1, 1])),
  Center.of('Center 4', StrictAddress.of('street', 'zipCode', 'city', [1, 1])),
  Center.of('Center 5', StrictAddress.of('street', 'zipCode', 'city', [1, 1])),
]

const mockedBoxes = [
  Box.of({
    name: 'Box 1',
    category: BoxCategories.MECABOX,
    isAvailable: true,
    formulas: [Formula.of('Formula 1', 1, 15), Formula.of('Formula 2', 1, 15)],
    description: 'Description 1',
    center: mockedCenters[0],
  }),
  Box.of({
    name: 'Box 2',
    category: BoxCategories.DETAILINGBOX,
    isAvailable: false,
    formulas: [Formula.of('Formula 3', 1, 15), Formula.of('Formula 4', 1, 15)],
    description: 'Description 2',
    center: mockedCenters[0],
  }),
  Box.of({
    name: 'Box 3',
    category: BoxCategories.MECABOX,
    isAvailable: true,
    formulas: [],
    description: 'Description 3',
    center: mockedCenters[1],
  }),
  Box.of({
    name: 'Box 4',
    category: BoxCategories.DETAILINGBOX,
    isAvailable: false,
    formulas: [],
    description: 'Description 4',
    center: mockedCenters[1],
  }),
  Box.of({
    name: 'Box 5',
    category: BoxCategories.WASHBOX,
    isAvailable: true,
    formulas: [],
    description: 'Description 5',
    center: mockedCenters[1],
  }),
]

describe('Service - CentersService', () => {
  let service: CentersService

  beforeAll(() => {
    const mockedBoxesService = buildBoxesServiceMock()
    const mockedCenterRepository = buildCenterRepository()
    mockedCenters[3].softDelete()

    service = new CentersService(instance(mockedBoxesService), instance(mockedCenterRepository))
  })

  describe('When creating a center', () => {
    it('should return the created center', async () => {
      // Given
      const name = 'New center'
      const location = StrictAddress.of('street', 'zipCode', 'city', [1, 1])

      // When
      const center = await service.createCenter(name, location)

      // Then
      expect(center).toBeDefined()
      expect(center.name).toBe(name)
      expect(center.location).toBe(location)
    })

    it('should throw if a center with the same name already exists', async () => {
      // Given
      const name = 'Center 1'
      const location = StrictAddress.of('street', 'zipCode', 'city', [1, 1])

      // When
      const center = service.createCenter(name, location)

      // Then
      await expect(center).rejects.toThrow()
    })
  })

  describe('When updating a center', () => {
    it('should return the updated center', async () => {
      // Given
      const centerId = mockedCenters[4]._id.toString()
      const newName = 'New name'
      const newLocation = StrictAddress.of('street', 'zipCode', 'city', [1, 1])
      const newOpeningHours = WeekOpeningHours.createEmpty().setDaysOfWeekOpeningHours({ [DaysOfWeek.FRIDAY]: TimeRange.of('01:00', '23:00') })

      // When
      const center = await service.updateCenter(centerId, newName, newLocation, newOpeningHours)

      // Then
      expect(center).toBeDefined()
      expect(center.name).toBe(newName)
      expect(center.location).toBe(newLocation)
      expect(center.openingHours).toBe(newOpeningHours)
    })

    it('should throw if center id is unknown', async () => {
      // Given
      const centerId = 'unknownId'
      const newName = 'New name'

      // When
      const center = service.updateCenter(centerId, newName)

      // Then
      await expect(center).rejects.toThrow()
    })
  })

  describe('When getting all centers', () => {
    it('should return all active centers', async () => {
      // Given
      const options = { activesOnly: true }

      // When
      const centers = await service.getAllCenters(options)

      // Then
      expect(centers).toBeDefined()
      expect(centers.length).toBe(4)
    })

    it('should return all centers', async () => {
      // Given
      const options = { activesOnly: false }

      // When
      const centers = await service.getAllCenters(options)

      // Then
      expect(centers).toBeDefined()
      expect(centers.length).toBe(mockedCenters.length)
    })
  })

  describe('When getting a center by id', () => {
    it('should return the center', async () => {
      // Given
      const centerId = mockedCenters[0]._id.toString()

      // When
      const center = await service.getCenterById(centerId)

      // Then
      expect(center).toBeDefined()
    })

    it('should throw if id is unknown', async () => {
      // Given
      const centerId = 'unknownId'

      // When
      const center = service.getCenterById(centerId)

      // Then
      await expect(center).rejects.toThrow()
    })
  })

  describe('When deleting a center', () => {
    it('should success on deletion', async () => {
      // Given
      const centerId = mockedCenters[0]._id.toString()

      // When
      const success = async (): Promise<void> => await service.deleteCenter(centerId)

      // Then
      expect(success).not.toThrow()
    })

    it('should throw if center is already deleted', async () => {
      // Given
      const centerId = mockedCenters[3]._id.toString()

      // When
      const center = service.deleteCenter(centerId)

      // Then
      await expect(center).rejects.toThrow()
    })

    it('should throw if center id is unknown', async () => {
      // Given
      const centerId = 'unknownId'

      // When
      const center = service.deleteCenter(centerId)

      // Then
      await expect(center).rejects.toThrow()
    })
  })

  describe('When getting formulas by category', () => {
    it('should success', async () => {
      // Given
      const centerId = mockedCenters[0]._id.toString()

      // When
      const formulas = await service.getCenterFormulasByCategories(centerId)

      // Then
      expect(formulas).toBeDefined()
      expect(formulas[BoxCategories.MECABOX]).toHaveLength(2)
      expect(formulas[BoxCategories.MECABOX][0].label).toBe('Formula 1')
      expect(formulas[BoxCategories.MECABOX][1].label).toBe('Formula 2')
      expect(formulas[BoxCategories.DETAILINGBOX]).toHaveLength(2)
      expect(formulas[BoxCategories.DETAILINGBOX][0].label).toBe('Formula 3')
      expect(formulas[BoxCategories.DETAILINGBOX][1].label).toBe('Formula 4')
    })

    it('should fail if center id is unknown', async () => {
      // Given
      const centerId = 'unknownId'

      // When
      const formulas = service.getCenterFormulasByCategories(centerId)

      // Then
      await expect(formulas).rejects.toThrow()
    })
  })
})

function buildBoxesServiceMock(): BoxesService {
  const mockedBoxesService = mock(BoxesService)
  when(mockedBoxesService.getBoxesByCenterId).thenReturn(async (centerId) => {
    const boxes = mockedBoxes.filter((box) => box.centerId.toString() === centerId.toString())
    if (boxes.length === 0) throw new Error('No boxes found')
    return boxes
  })
  when(mockedBoxesService.deleteBoxesByCenterId).thenReturn(async (centerId) => {
    return mockedBoxes.filter((box) => box.centerId.toString() === centerId.toString()).length
  })

  return mockedBoxesService
}

function buildCenterRepository(): CenterRepository {
  const mockedCenterRepository = mock(CenterRepository)
  when(mockedCenterRepository.create).thenReturn((center) => Promise.resolve(center))
  when(mockedCenterRepository.findByName).thenReturn((name) =>
    InstantiatingDataWrapper.fromData(Promise.resolve(mockedCenters.filter((center) => center.name.toString() === name)[0]))
  )
  when(mockedCenterRepository.findActiveById).thenReturn((id) =>
    InstantiatingDataWrapper.fromData(
      Promise.resolve(mockedCenters.filter((center) => center._id.toString() === id.toString() && !center.isSoftDeleted())[0])
    )
  )
  when(mockedCenterRepository.findById).thenReturn((id) =>
    InstantiatingDataWrapper.fromData(Promise.resolve(mockedCenters.filter((center) => center._id.toString() === id.toString())[0]))
  )
  when(mockedCenterRepository.findAll).thenReturn(() => InstantiatingDataWrapper.fromData(Promise.resolve(mockedCenters)))
  when(mockedCenterRepository.findAllActives).thenReturn(() =>
    InstantiatingDataWrapper.fromData(Promise.resolve(mockedCenters.filter((center) => !center.isSoftDeleted())))
  )
  when(mockedCenterRepository.updateAsIs).thenReturn(() => Promise.resolve(true))

  return mockedCenterRepository
}
