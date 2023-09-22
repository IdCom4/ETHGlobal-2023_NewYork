import { PublicFile } from '@Schemas/common/pojos'
import { BoxCategories } from '@Common/enums/schemas/box.schema.enum'
import { IllegalArgumentException } from '@Common/exceptions/illegal-argument.exception'
import { CenterService, PricesByVehicleType } from '@Schemas/center-service'
import '@/extensions'

describe('Schema - CenterService', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const title = 'Nettoyer les olives'
      const subtitle = 'Ceci est un sous-titre'
      const description = "Ceci est une description un peu plus longue car une description c'est long des fois"
      const isActive = true
      const picture = new PublicFile('reference', 'url', 'png')
      const numberOfSales = 65468468534
      const optionIds = ['s8941fh', 's5df4sf']
      const categories = [BoxCategories.DETAILINGBOX]
      const prices = new PricesByVehicleType(1, 2, 3, 4)

      // When
      const centerService = CenterService.of(title, subtitle, description, isActive, picture, numberOfSales, optionIds, categories, prices)

      // Then
      expect(centerService.title).toBe(title)
      expect(centerService.subtitle).toBe(subtitle)
      expect(centerService.description).toBe(description)
      expect(centerService.isActive).toBe(isActive)
      expect(centerService.picture).toBe(picture)
      expect(centerService.numberOfSales).toBe(numberOfSales)
      expect(centerService.optionIds).toBe(optionIds)
      expect(centerService.categories).toBe(categories)
      expect(centerService.prices).toBe(prices)
      expect(centerService.deletedAt).toBeFalsy()
    })

    /*
        The purpose of this test is to verify the tests performed when instating the object.
      Indeed, the IDE notices that the variables are undefined and throws a compilation error
      On the other hand, at runtime, it is possible that these values are undefined and no error will be thrown.
      That's why I choose to intentionally ignore typescript errors in order to perform these tests.
    */
    it.each([
      /* eslint-disable prettier/prettier */
      {
        test_name: 'should fail with undefined title',
        title: undefined,
        subtitle: 'Sous-titre',
        description: 'Description',
        isActive: true,
        picture: new PublicFile('qs5d', 'url', 'png'),
        numberOfSales: 2
      },
      {
        test_name: 'should fail with undefined subtitle',
        title: 'Titre',
        subtitle: undefined,
        description: 'Description',
        isActive: true,
        picture: new PublicFile('qs5d', 'url', 'png'),
        numberOfSales: 2
      },
      {
        test_name: 'should fail with undefined description',
        title: 'Titre',
        subtitle: 'Sous-titre',
        description: undefined,
        isActive: true,
        picture: new PublicFile('qs5d', 'url', 'png'),
        numberOfSales: 2
      },
      {
        test_name: 'should fail with undefined isActive',
        title: 'Titre',
        subtitle: 'Sous-titre',
        description: 'Description',
        isActive: undefined,
        picture: new PublicFile('qs5d', 'url', 'png'),
        numberOfSales: 2
      },
      {
        test_name: 'should fail with undefined picture',
        title: 'Titre',
        subtitle: 'Sous-titre',
        description: 'Description',
        isActive: true,
        picture: undefined,
        numberOfSales: 2
      },
      {
        test_name: 'should fail with negative number of sales',
        title: 'Titre',
        subtitle: 'Sous-titre',
        description: 'Description',
        isActive: true,
        picture: undefined,
        numberOfSales: -2
      }
      /* eslint-enable prettier/prettier */
    ])('$test_name', ({ title, subtitle, description, isActive, picture, numberOfSales }) => {
      // When
      // @ts-ignore
      const construct = (): CenterService => CenterService.of(title, subtitle, description, isActive, picture, numberOfSales)

      expect(construct).toThrowError(IllegalArgumentException)
    })

    it('should deactivate instance', () => {
      // Given
      const centerService = CenterService.of('Titre', 'Sous-Titre', 'Description', true, new PublicFile('qsfqsdf', 'url', 'pnj'))

      // When
      centerService.deactivate()

      // Then
      expect(centerService.isActive).toStrictEqual(false)
    })

    it('should soft delete instance', () => {
      // Given
      const centerService = CenterService.of('Titre', 'Sous-Titre', 'Description', true, new PublicFile('qsfqsdf', 'url', 'pnj'))

      // When
      centerService.softDelete()

      // Then
      expect(centerService.deletedAt).toBeTruthy()
    })

    describe('When checking if center service is soft deleted', () => {
      it('should return true with a not soft deleted instance', () => {
        // Given
        const centerService = CenterService.of('Titre', 'Sous-Titre', 'Description', true, new PublicFile('qsfqsdf', 'url', 'pnj'))

        // When
        const isSoftDelete = centerService.isSoftDeleted()

        // Then
        expect(isSoftDelete).toStrictEqual(false)
      })

      it('should return false with a soft deleted instance', () => {
        // Given
        const centerService = CenterService.of('Titre', 'Sous-Titre', 'Description', true, new PublicFile('qsfqsdf', 'url', 'pnj'))
        centerService.softDelete()

        // When
        const isSoftDelete = centerService.isSoftDeleted()

        // Then
        expect(isSoftDelete).toStrictEqual(true)
      })
    })
  })
})
