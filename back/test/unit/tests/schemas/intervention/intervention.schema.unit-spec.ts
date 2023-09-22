import { Intervention } from '@Schemas/intervention'
import { IllegalArgumentException } from '@Common/exceptions'

describe('Schema - Intervention', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const label = 'Nettoyer les olives'
      const category = 'category'

      // When
      const centerService = Intervention.of(label, category)

      // Then
      expect(centerService.label).toBe(label)
      expect(centerService.skillIds).toBe(category)
    })

    /*
    The purpose of this test is to verify the tests performed when instating the object.
  Indeed, the IDE notices that the variables are undefined and throws a compilation error.
  On the other hand, at runtime, it is possible that these values are undefined and no error will be thrown.
  That's why I choose to intentionally ignore typescript errors in order to perform these tests.
*/
    it.each([
      /* eslint-disable prettier/prettier */
      { test_name: 'undefined label', label: undefined }
      /* eslint-enable prettier/prettier */
    ])('should fail with $test_name', ({ label }) => {
      // When
      // @ts-ignore
      const construct = (): Intervention => Intervention.of(label, 'category')

      expect(construct).toThrowError(IllegalArgumentException)
    })

    it('should update the intervention', async () => {
      // Given
      const issue = Intervention.of('label', 'category')
      const newLabel = 'newLabel'
      const newCategory = 'newCategory'

      // When
      issue.update(newLabel, newCategory)

      // Then
      expect(issue).toBeDefined()
      expect(issue.label).toBe(newLabel)
      expect(issue.skillIds).toBe(newCategory)
    })
  })
})
