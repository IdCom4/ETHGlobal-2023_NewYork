import { BoxesService } from '@Api/boxes/boxes.service'
import { instance, mock, when } from 'ts-mockito'
import { BoxRepository, CenterRepository } from '@/repositories'
import { Box } from '@Schemas/box'
import { BoxCategories } from '@Common/enums'
import { Center } from '@Schemas/center'
import { StrictAddress } from '@Schemas/common/pojos'
import { InstantiatingDataWrapper } from '@Common/classes'

const mockedCenter = [
  Center.of('Center 1', StrictAddress.of('Street 1', 'City 1', 'ZipCode 1', [1, 1])),
  Center.of('Center 2', StrictAddress.of('Street 2', 'City 2', 'ZipCode 2', [2, 2])),
]

const mockedBoxes = [
  Box.of({
    name: 'Box 1',
    category: BoxCategories.MECABOX,
    isAvailable: true,
    formulas: [],
    description: 'Description 1',
    center: mockedCenter[0],
  }),
  Box.of({
    name: 'Box 2',
    category: BoxCategories.DETAILINGBOX,
    isAvailable: false,
    formulas: [],
    description: 'Description 2',
    center: mockedCenter[0],
  }),
  Box.of({
    name: 'Box 3',
    category: BoxCategories.MECABOX,
    isAvailable: true,
    formulas: [],
    description: 'Description 3',
    center: mockedCenter[1],
  }),
  Box.of({
    name: 'Box 4',
    category: BoxCategories.DETAILINGBOX,
    isAvailable: false,
    formulas: [],
    description: 'Description 4',
    center: mockedCenter[1],
  }),
  Box.of({
    name: 'Box 5',
    category: BoxCategories.WASHBOX,
    isAvailable: true,
    formulas: [],
    description: 'Description 5',
    center: mockedCenter[1],
  }),
]
describe('Service - BoxesService', () => {
  let service: BoxesService

  beforeAll(() => {
    const mockedCenterRepository = buildCenterRepositoryMock()
    const mockedBoxRepository = buildBoxRepositoryMock()

    service = new BoxesService(instance(mockedBoxRepository), instance(mockedCenterRepository))
  })

  describe('When getting all boxes', () => {
    it('should return all active boxes', async () => {
      // Given
      const options = { activesOnly: true }

      // When
      const boxes = await service.getAllBoxes(options)

      // Then
      expect(boxes).toHaveLength(3)
    })

    it('should return all boxes', async () => {
      // Given
      const options = { activesOnly: false }

      // When
      const boxes = await service.getAllBoxes(options)

      // Then
      expect(boxes).toHaveLength(5)
    })
  })

  describe('When getting a box by id', () => {
    it('should return the box', async () => {
      // Given
      const id = mockedBoxes[0]._id.toString()

      // When
      const box = await service.getBoxById(id)

      // Then
      expect(box).toEqual(mockedBoxes[0])
    })

    it('should throw an error if no box is found', async () => {
      // Given
      const id = '123456789'

      // When
      const promise = service.getBoxById(id)

      // Then
      await expect(promise).rejects.toThrowError()
    })
  })

  describe('When getting boxes by center id', () => {
    it('should return all active boxes of the center', async () => {
      // Given
      const centerId = mockedBoxes[0].centerId

      // When
      const boxes = await service.getBoxesByCenterId(centerId)

      // Then
      expect(boxes).toHaveLength(1)
    })

    it('should throw an error if no box is found', async () => {
      // Given
      const centerId = '123456789'

      // When
      const promise = service.getBoxesByCenterId(centerId)

      // Then
      await expect(promise).rejects.toThrowError()
    })
  })

  describe('When getting boxes by center id and category', () => {
    it('should return all active boxes of the center in the category', async () => {
      // Given
      const centerId = mockedBoxes[0].centerId
      const category = mockedBoxes[0].category

      // When
      const boxes = await service.getBoxesByCenterIdAndCategory(centerId, category)

      // Then
      expect(boxes).toHaveLength(1)
    })

    it('should throw an error if no box is found', async () => {
      // Given
      const centerId = '123456789'
      const category = BoxCategories.MECABOX

      // When
      const promise = service.getBoxesByCenterIdAndCategory(centerId, category)

      // Then
      await expect(promise).rejects.toThrowError()
    })
  })

  describe('When creating a box', () => {
    it('should return the created box', async () => {
      // Given
      const name = 'Box 6'
      const description = 'Description 6'
      const centerId = mockedCenter[0]._id.toString()
      const category = BoxCategories.MECABOX
      const isAvailable = true

      // When
      const box = await service.createBox(name, description, centerId, category, isAvailable)

      // Then
      const expectedBox = Box.of({ name, description, center: mockedCenter[0], category, isAvailable, formulas: [] })
      // Exclude _id for comparison
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id: _, ...boxWithoutId } = box
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id: __, ...expectedBoxWithoutId } = expectedBox

      expect(boxWithoutId).toEqual(expectedBoxWithoutId)
    })

    it('should throw an error if no center is found', async () => {
      // Given
      const name = 'Box 6'
      const description = 'Description 6'
      const centerId = '123456789'
      const category = BoxCategories.MECABOX
      const isAvailable = true

      // When
      const promise = service.createBox(name, description, centerId, category, isAvailable)

      // Then
      await expect(promise).rejects.toThrowError()
    })
  })

  describe('When updating a box', () => {
    it('should return the updated box', async () => {
      // Given
      const id = mockedBoxes[4]._id.toString()
      const name = 'Box 6'
      const description = 'Description 6'
      const category = BoxCategories.MECABOX
      const isAvailable = false

      // When
      await service.updateBox(id, name, description, category, isAvailable)

      // Then
      expect(mockedBoxes[4].name).toEqual(name)
      expect(mockedBoxes[4].description).toEqual(description)
      expect(mockedBoxes[4].category).toEqual(category)
      expect(mockedBoxes[4].isAvailable).toEqual(isAvailable)
    })

    it('should throw an error if no box is found', async () => {
      // Given
      const id = '123456789'
      const name = 'Box 6'

      // When
      const promise = service.updateBox(id, name)

      // Then
      await expect(promise).rejects.toThrowError()
    })
  })

  describe('When deleting a box', () => {
    it('should delete the box', async () => {
      // Given
      const id = mockedBoxes[4]._id.toString()

      // When
      const deletingBox = async (): Promise<void> => await service.deleteBoxById(id)

      // Then
      expect(deletingBox).not.toThrow()
    })

    it('should throw exception', async () => {
      // Given
      const id = mockedBoxes[4]._id.toString()

      // When
      const deletingBox = async (): Promise<void> => await service.deleteBoxById(id)

      // Then
      expect(deletingBox).not.toThrow()
    })
  })
})

function buildCenterRepositoryMock(): CenterRepository {
  const mockedCenterRepository = mock(CenterRepository)

  when(mockedCenterRepository.findAll).thenReturn(() => InstantiatingDataWrapper.fromData(Promise.resolve(mockedCenter)))

  when(mockedCenterRepository.findById).thenReturn((id) =>
    InstantiatingDataWrapper.fromData(Promise.resolve(mockedCenter.filter((center) => center._id.toString() === id.toString())[0]))
  )

  return mockedCenterRepository
}

function buildBoxRepositoryMock(): BoxRepository {
  const mockedBoxRepository = mock(BoxRepository)

  when(mockedBoxRepository.findAllActives).thenReturn(() =>
    InstantiatingDataWrapper.fromData(Promise.resolve(mockedBoxes.filter((box) => box.isAvailable)))
  )
  when(mockedBoxRepository.findAll).thenReturn(() => InstantiatingDataWrapper.fromData(Promise.resolve(mockedBoxes)))
  when(mockedBoxRepository.findById).thenReturn((id) =>
    InstantiatingDataWrapper.fromData(Promise.resolve(mockedBoxes.filter((box) => box._id.toString() === id.toString())[0]))
  )
  when(mockedBoxRepository.findActiveById).thenReturn((id) =>
    InstantiatingDataWrapper.fromData(Promise.resolve(mockedBoxes.filter((box) => box._id.toString() === id.toString() && box.isAvailable)[0]))
  )
  when(mockedBoxRepository.findAllActivesByCenterId).thenReturn((centerId) => {
    const boxes = mockedBoxes.filter((box) => box.centerId === centerId && box.isAvailable)

    return InstantiatingDataWrapper.fromData(Promise.resolve(boxes.length > 0 ? boxes : null) as Promise<Box[]>)
  })
  when(mockedBoxRepository.findAllActivesByCenterIdAndCategory).thenReturn((centerId, category) => {
    const boxes = mockedBoxes.filter((box) => box.centerId === centerId && box.category === category && box.isAvailable)

    return InstantiatingDataWrapper.fromData(Promise.resolve(boxes.length > 0 ? boxes : null) as Promise<Box[]>)
  })
  when(mockedBoxRepository.create).thenReturn(async (box) => Promise.resolve(box))
  when(mockedBoxRepository.updateAsIs).thenReturn(async () => Promise.resolve(true))
  when(mockedBoxRepository.delete).thenReturn(async (id) => {
    if (!mockedBoxes.find((box) => box._id.toString() === id.toString())) return Promise.resolve(false)
    else return Promise.resolve(true)
  })

  return mockedBoxRepository
}
