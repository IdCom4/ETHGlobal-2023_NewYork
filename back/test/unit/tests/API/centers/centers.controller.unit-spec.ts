import { CentersService, TBoxCategoriesFormulas } from '@Api/centers/centers.service'
import { instance, mock, when } from 'ts-mockito'
import { StrictAddress } from '@Schemas/common/pojos'
import { Center } from '@Schemas/center'
import { BoxCategories, DaysOfWeek } from '@Common/enums'
import { Box, Formula } from '@Schemas/box'
import { CentersController } from '@Api/centers/centers.controller'
import { CreateCenterRequest, UpdateCenterRequest } from '@Api/centers/requests'
import { StrictAddressDTO, WeekOpeningHoursDTO } from '@Common/request-io/request-dto'
import { MessageResponse } from '@Common/request-io/responses-dto'
import { UpdateCenterFormulasRequest } from '@Api/centers/requests/update-center-formulas.dto'
import { FormulaDTO } from '@Api/centers/requests/pojos/formula.dto'

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

describe('Service - CentersController', () => {
  let controller: CentersController

  beforeAll(() => {
    const mockedBoxesService = buildCentersServiceMock()
    mockedCenters[3].softDelete()

    controller = new CentersController(instance(mockedBoxesService))
  })

  it('should return all active centers when calling GET []', async () => {
    // When
    const centers = await controller.getAllCenters()

    // Then
    expect(centers).toBeDefined()
    expect(centers.length).toBe(mockedCenters.length - 1)
  })

  describe('When calling GET [:CENTER_ID]', () => {
    it('should return the center', async () => {
      // Given
      const centerId = mockedCenters[0]._id.toString()

      // When
      const center = await controller.getCenterById(centerId)

      // Then
      expect(center).toBeDefined()
    })

    it('should throw if id is unknown', async () => {
      // Given
      const centerId = 'unknownId'

      // When
      const center = async (): Promise<Center> => controller.getCenterById(centerId)

      // Then
      await expect(center).rejects.toThrow()
    })
  })

  describe('When calling POST []', () => {
    it('should return the created center', async () => {
      // Given
      const request: CreateCenterRequest = {
        name: 'New center',
        location: Object.initClassByReflection(StrictAddressDTO, {
          street: 'streeeeeeeeeeeeeeeeeeeeeeeeet',
          zipCode: 'zipCode',
          city: 'city',
          coordinates: [1, 1],
        }),
      }

      // When
      const center = await controller.createCenter(request)

      // Then
      expect(center).toBeDefined()
      expect(center.name).toBe(request.name)
      expect(center.location.street).toBe(request.location.street)
    })

    it('should throw if a center with the same name already exists', async () => {
      // Given
      const request: CreateCenterRequest = {
        name: 'Center 1',
        location: Object.initClassByReflection(StrictAddressDTO, {
          street: 'street',
          zipCode: 'zipCode',
          city: 'city',
          coordinates: [1, 1],
        }),
      }

      // When
      const center = controller.createCenter(request)

      // Then
      await expect(center).rejects.toThrow()
    })
  })

  describe('When calling PUT [:formulas]', () => {
    it('should return the updated center', async () => {
      // Given
      const request: UpdateCenterFormulasRequest = {
        centerId: mockedCenters[4]._id.toString(),
        boxCategory: BoxCategories.MECABOX,
        formulas: [Object.initClassByReflection(FormulaDTO, { label: 'Formula 1', nbrQuarterHour: 1, price: 15 })],
      }

      // When
      const messageResponse = await controller.updateCenterFormulas(request)

      // Then
      expect(messageResponse).toBeDefined()
      expect(messageResponse.statusCode).toBe(200)
    })

    it('should throw if center id is unknown', async () => {
      // Given
      // Given
      const request: UpdateCenterFormulasRequest = {
        centerId: 'unknownId',
        boxCategory: BoxCategories.MECABOX,
        formulas: [Object.initClassByReflection(FormulaDTO, { label: 'Formula 1', nbrQuarterHour: 1, price: 15 })],
      }

      // When
      const center = async (): Promise<MessageResponse> => await controller.updateCenterFormulas(request)

      // Then
      await expect(center).rejects.toThrow()
    })
  })

  describe('When calling PUT [:CENTER_ID]', () => {
    it('should return the updated center', async () => {
      // Given
      const centerId = mockedCenters[4]._id.toString()
      const request: UpdateCenterRequest = {
        name: 'New center',
        location: Object.initClassByReflection(StrictAddressDTO, {
          street: 'street',
          zipCode: 'zipCode',
          city: 'city',
          coordinates: [1, 1],
        }),
        openingHours: Object.initClassByReflection(WeekOpeningHoursDTO, {
          [DaysOfWeek.MONDAY]: { begin: '00:00', end: '00:00' },
          [DaysOfWeek.TUESDAY]: { begin: '01:00', end: '10:00' },
          [DaysOfWeek.WEDNESDAY]: { begin: '00:00', end: '00:00' },
          [DaysOfWeek.THURSDAY]: { begin: '00:00', end: '00:00' },
          [DaysOfWeek.FRIDAY]: { begin: '00:00', end: '00:00' },
          [DaysOfWeek.SATURDAY]: { begin: '00:00', end: '00:00' },
          [DaysOfWeek.SUNDAY]: { begin: '00:00', end: '00:00' },
        }),
      }

      // When
      const messageResponse = await controller.updateCenter(centerId, request)

      // Then
      expect(messageResponse).toBeDefined()
      expect(messageResponse.statusCode).toBe(200)
    })

    it('should throw if center id is unknown', async () => {
      // Given
      const centerId = 'unknownId'
      const request: UpdateCenterRequest = {
        name: 'New center',
      }

      // When
      const center = async (): Promise<MessageResponse> => controller.updateCenter(centerId, request)

      // Then
      await expect(center).rejects.toThrow()
    })
  })

  describe('When calling DELETE [:CENTER_ID]', () => {
    it('should success on deletion', async () => {
      // Given
      const centerId = mockedCenters[4]._id.toString()

      // When
      const success = async (): Promise<MessageResponse> => await controller.deleteCenter(centerId)

      // Then
      expect(success).not.toThrow()
    })

    it('should throw if center is already deleted', async () => {
      // Given
      const centerId = mockedCenters[3]._id.toString()

      // When
      const center = controller.deleteCenter(centerId)

      // Then
      await expect(center).rejects.toThrow()
    })

    it('should throw if center id is unknown', async () => {
      // Given
      const centerId = 'unknownId'

      // When
      const center = controller.deleteCenter(centerId)

      // Then
      await expect(center).rejects.toThrow()
    })
  })

  describe('When calling GET [formulas/:CENTER_ID]', () => {
    it('should success', async () => {
      // Given
      const centerId = mockedCenters[0]._id.toString()

      // When
      const formulas = await controller.getCenterFormulas(centerId)

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
      const formulas = controller.getCenterFormulas(centerId)

      // Then
      await expect(formulas).rejects.toThrow()
    })
  })
})

function buildCentersServiceMock(): CentersService {
  const mockedCentersService = mock(CentersService)

  const mockedGetCenterByIdMethod = (centerId: string): Promise<Center> => {
    const foundCenters = mockedCenters.filter((center) => center._id.toString() === centerId.toString() && !center.isSoftDeleted())
    if (foundCenters.length === 0) throw new Error('Center not found')

    return Promise.resolve(foundCenters[0])
  }

  when(mockedCentersService.getAllCenters).thenReturn(() => Promise.resolve(mockedCenters.filter((center) => !center.isSoftDeleted())))
  when(mockedCentersService.getCenterById).thenReturn(mockedGetCenterByIdMethod)
  when(mockedCentersService.createCenter).thenReturn(async (name, location) => {
    const centersWithSameName = mockedCenters.filter((center) => center.name === name)

    if (centersWithSameName.length > 0) throw new Error('Center already exists')

    return Center.of(name, location)
  })
  when(mockedCentersService.updateCenter).thenReturn(async (centerId, newName, newLocation, newOpeningHours) => {
    const center = await mockedGetCenterByIdMethod(centerId)
    center.update({ name: newName, location: newLocation, openingHours: newOpeningHours })

    return Promise.resolve(center)
  })
  when(mockedCentersService.updateCenterFormulasByCategory).thenReturn(async (centerId) => {
    await mockedGetCenterByIdMethod(centerId)
  })
  when(mockedCentersService.deleteCenter).thenReturn(async (centerId) => {
    const center = await mockedGetCenterByIdMethod(centerId)
    if (center.isSoftDeleted()) throw new Error('Center already deleted')
    center.softDelete()
  })
  when(mockedCentersService.getCenterFormulasByCategories).thenReturn(async (centerId) => {
    const center = await mockedGetCenterByIdMethod(centerId)
    const boxes = mockedBoxes.filter((box) => box.centerId.toString() === center._id.toString() && !box.isSoftDeleted())
    const formulasByCategories: TBoxCategoriesFormulas = {
      [BoxCategories.DETAILINGBOX]: [],
      [BoxCategories.MECABOX]: [],
      [BoxCategories.WASHBOX]: [],
    }
    for (const box of boxes) {
      if (!formulasByCategories[box.category]) formulasByCategories[box.category] = []
      formulasByCategories[box.category].push(...box.formulas)
    }

    return formulasByCategories
  })

  return mockedCentersService
}
