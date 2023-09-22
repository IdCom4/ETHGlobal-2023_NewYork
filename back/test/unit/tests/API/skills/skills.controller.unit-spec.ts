import { SkillsController } from '@Api/skills/skills.controller'
import { SkillsService } from '@Api/skills/skills.service'
import { instance, mock, when } from 'ts-mockito'
import { Skill } from '@/schemas/skill/skill.schema'
import { UserNotFoundException } from '@Common/exceptions/schemas/user/user-not-found.exception'
import { UnprocessableEntityException } from '@nestjs/common'
import { SkillNotFoundException } from '@Common/exceptions/schemas/skill/skill-not-found.exception'

describe('Controller - SkillsController', () => {
  let skillsController: SkillsController

  beforeAll(() => {
    const mockedSkillsServiceClass = mock(SkillsService)
    when(mockedSkillsServiceClass.getAll).thenReturn(async () => [Skill.of('Test1'), Skill.of('Test2')])
    when(mockedSkillsServiceClass.getByUserId).thenReturn(async (userId) => {
      if (userId === '648820bfdf13f79a79c2c6cd') return [Skill.of('Test1'), Skill.of('Test2')]
      else throw new UserNotFoundException()
    })
    when(mockedSkillsServiceClass.getById).thenReturn(async (skillId) => {
      if (skillId === '648820bfdf13f79a79c2c6cd') return Skill.of('Test1')
      else throw new SkillNotFoundException()
    })

    skillsController = new SkillsController(instance(mockedSkillsServiceClass))
  })

  it('should return all skills (GET)', async () => {
    // When
    const response = await skillsController.getAll()

    // Then
    expect(response).toBeTruthy()
  })

  describe('When getting skills of an user (GET)', () => {
    it('should success with a valid user', async () => {
      // Given
      const userId = '648820bfdf13f79a79c2c6cd'

      // When
      const response = await skillsController.getByUserId(userId)

      // Then
      expect(response).toBeTruthy()
    })

    it('should fail with an invalid user', async () => {
      // Given
      const userId = '987654321'

      // When
      const requesting = async (): Promise<Skill[]> => await skillsController.getByUserId(userId)

      // Then
      await expect(requesting).rejects.toThrow(UnprocessableEntityException)
    })

    it('should fail with an unknown user', async () => {
      // Given
      const userId = '999990bfdf13f79a79c2c6ce'

      // When
      const requesting = async (): Promise<Skill[]> => await skillsController.getByUserId(userId)

      // Then
      await expect(requesting).rejects.toThrow(UserNotFoundException)
    })
  })

  describe('When getting a skill by id (GET)', () => {
    it('should success with a valid id', async () => {
      // Given
      const skillId = '648820bfdf13f79a79c2c6cd'

      // When
      const response = await skillsController.getById(skillId)

      // Then
      expect(response).toBeTruthy()
    })

    it('should fail with an invalid id', async () => {
      // Given
      const skillId = '123456789'

      // When
      const requesting = async (): Promise<Skill> => await skillsController.getById(skillId)

      // Then
      await expect(requesting).rejects.toThrow(UnprocessableEntityException)
    })

    it('should fail with an unknown id', async () => {
      // Given
      const skillId = '648820bfdf13f79a79c2c6ce'

      // When
      const requesting = async (): Promise<Skill> => await skillsController.getById(skillId)

      // Then
      await expect(requesting).rejects.toThrow(SkillNotFoundException)
    })
  })
})
