import { IllegalArgumentException } from '@Common/exceptions'
import { Issue } from '@Schemas/issue/issue.schema'

describe('Schema - Issue', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const label = 'Nettoyer les olives'
      const skills = ['skill1', 'skill2']

      // When
      const centerService = Issue.of(label, skills)

      // Then
      expect(centerService.label).toBe(label)
      expect(centerService.skillIds).toBe(skills)
    })

    /*
        The purpose of this test is to verify the tests performed when instating the object.
      Indeed, the IDE notices that the variables are undefined and throws a compilation error.
      On the other hand, at runtime, it is possible that these values are undefined and no error will be thrown.
      That's why I choose to intentionally ignore typescript errors in order to perform these tests.
    */
    it.each([
      /* eslint-disable prettier/prettier */
      { test_name: 'undefined label', label: undefined}
      /* eslint-enable prettier/prettier */
    ])('should fail with $test_name', ({ label }) => {
      // When
      // @ts-ignore
      const construct = (): Issue => Issue.of(label)

      expect(construct).toThrowError(IllegalArgumentException)
    })
  })

  it('should update issue', async () => {
    // Given
    const issue = Issue.of('label', ['skill1', 'skill2'])
    const newLabel = 'newLabel'
    const newSkills = ['newSkill1', 'newSkill2']

    // When
    issue.update(newLabel, newSkills)

    // Then
    expect(issue).toBeDefined()
    expect(issue.label).toBe(newLabel)
    expect(issue.skillIds).toBe(newSkills)
  })
})
