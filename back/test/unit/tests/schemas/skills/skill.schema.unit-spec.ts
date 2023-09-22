import { IllegalArgumentException } from '@Common/exceptions/illegal-argument.exception'
import { Skill } from '@/schemas/skill/skill.schema'
import { SkillCategory } from '@Common/enums/schemas/skill.schema.enum'

describe('Schema - Skill', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const label = 'Nettoyer les olives'
      const categories = [SkillCategory.DETAILING, SkillCategory.CAR_STAGING]

      // When
      const centerService = Skill.of(label, categories)

      // Then
      expect(centerService.label).toBe(label)
      expect(centerService.categories).toBe(categories)
    })

    /*
        The purpose of this test is to verify the tests performed when instating the object.
      Indeed, the IDE notices that the variables are undefined and throws a compilation error.
      On the other hand, at runtime, it is possible that these values are undefined and no error will be thrown.
      That's why I choose to intentionally ignore typescript errors in order to perform these tests.
    */
    it.each([
      /* eslint-disable prettier/prettier */
      { test_name: 'should fail with undefined label', label: undefined, categories: [SkillCategory.DETAILING, SkillCategory.CAR_STAGING] }
      /* eslint-enable prettier/prettier */
    ])('$test_name', ({ label, categories }) => {
      // When
      // @ts-ignore
      const construct = (): Skill => Skill.of(label, categories)

      expect(construct).toThrowError(IllegalArgumentException)
    })
  })
})
