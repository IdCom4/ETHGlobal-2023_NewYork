import { BoxesController } from '@Api/boxes/boxes.controller'
import { instance, mock, when } from 'ts-mockito'
import { BoxesService } from '@Api/boxes/boxes.service'
import { Box, Formula } from '@Schemas/box'
import { BoxCategories } from '@Common/enums'
import { Center } from '@Schemas/center'
import { StrictAddress } from '@Schemas/common/pojos'
import { BoxNotFoundException } from '@Common/exceptions/schemas/box'
import { CenterNotFoundException } from '@Common/exceptions/schemas/center'
import { HttpStatus } from '@nestjs/common/enums'
import { MessageResponse } from '@Common/request-io/responses-dto'

describe('Controller - BoxesController', () => {
  let controller: BoxesController

  beforeAll(async () => {
    const mockedBoxesService = buildBoxesServiceMock()
    controller = new BoxesController(instance(mockedBoxesService))
  })

  it('should return all boxes when requesting them', async () => {
    // When
    const boxes = await controller.getAllBoxes()

    // Then
    expect(boxes).toHaveLength(2)
  })

  describe('When requesting a box by id', () => {
    it('should return the box when it exists', async () => {
      // Given
      const id = 'existingId'

      // When
      const box = await controller.getBoxById(id)

      // Then
      expect(box).toBeDefined()
    })

    it('should throw an error when the box does not exist', async () => {
      // Given
      const id = 'nonExistingId'

      // When
      const gettingBox = async (): Promise<Box> => await controller.getBoxById(id)

      // Then
      await expect(gettingBox()).rejects.toThrow(BoxNotFoundException)
    })
  })

  describe('When requesting all boxes of a center', () => {
    describe('With an existing center id', () => {
      it('should return bookable boxes only', async () => {
        // Given
        const id = 'existingId'

        // When
        const box = await controller.getAllBoxesByCenterId(id, true)

        // Then
        expect(box).toHaveLength(1)
      })

      it('should return all boxes', async () => {
        // Given
        const id = 'existingId'

        // When
        const box = await controller.getAllBoxesByCenterId(id, false)

        // Then
        expect(box).toHaveLength(1)
      })
    })

    describe('With an unknown center id', () => {
      it('should throw with bookable only', async () => {
        // Given
        const id = 'nonExistingId'

        // When
        const box = async (): Promise<Box[]> => await controller.getAllBoxesByCenterId(id, true)

        // Then
        await expect(box()).rejects.toThrow(CenterNotFoundException)
      })

      it('should throw without bookable only', async () => {
        // Given
        const id = 'nonExistingId'

        // When
        const box = async (): Promise<Box[]> => await controller.getAllBoxesByCenterId(id, true)

        // Then
        await expect(box()).rejects.toThrow(CenterNotFoundException)
      })
    })
  })

  it('should create a box', async () => {
    // Given
    const name = 'Name'
    const description = 'Description'
    const centerId = 'existingId'
    const category = BoxCategories.MECABOX
    const isAvailable = true

    // When
    const box = await controller.createBox({ name, description, centerId, category, isAvailable })

    // Then
    expect(box).toBeDefined()
  })

  describe('When updating a box', () => {
    it('should update with an existing id', async () => {
      // Given
      const name = 'Name'
      const description = 'Description'
      const boxId = 'existingId'
      const category = BoxCategories.MECABOX
      const isAvailable = true

      // When
      const box = await controller.updateBox(boxId, { name, description, category, isAvailable })

      // Then
      expect(box.statusCode).toBe(HttpStatus.OK)
    })

    it('should fail with an unknown id', async () => {
      // Given
      const name = 'Name'
      const description = 'Description'
      const boxId = 'nonExistingId'
      const category = BoxCategories.MECABOX
      const isAvailable = true

      // When
      const updatingBox = async (): Promise<MessageResponse> => await controller.updateBox(boxId, { name, description, category, isAvailable })

      // Then
      await expect(updatingBox).rejects.toThrow(BoxNotFoundException)
    })
  })

  it('should delete a box', async () => {
    // When
    const box = await controller.deleteBox('boxId')

    // Then
    expect(box.statusCode).toBe(HttpStatus.OK)
  })
})

function buildBoxesServiceMock(): BoxesService {
  const mockedBoxesService = mock(BoxesService)

  when(mockedBoxesService.getAllBoxes).thenReturn(async (options) => {
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    return options.activesOnly
      ? [
          Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas }),
          Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: false, formulas }),
        ]
      : [
          Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas }),
          Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas }),
          Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: false, formulas }),
        ]
    /* eslint-enable @typescript-eslint/no-unsafe-return */
  })

  when(mockedBoxesService.getBoxById).thenReturn(async (id) => {
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    if (id === 'existingId')
      return Box.of({
        name: 'Name',
        description: 'Description',
        center,
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas,
      })
    else throw new BoxNotFoundException()
  })

  when(mockedBoxesService.getBoxesByCenterId).thenReturn(async (centerId) => {
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    if (centerId === 'existingId')
      return [
        Box.of({
          name: 'Name',
          description: 'Description',
          center,
          category: BoxCategories.MECABOX,
          isAvailable: true,
          formulas,
        }),
      ]
    else throw new CenterNotFoundException()
  })

  when(mockedBoxesService.createBox).thenReturn(async (name, description, centerId, category, isAvailable) => {
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    return Box.of({ name, description, center, category, isAvailable, formulas })
  })

  when(mockedBoxesService.updateBox).thenReturn(async (boxId) => {
    if (boxId === 'existingId') return true
    else throw new BoxNotFoundException()
  })

  return mockedBoxesService
}
