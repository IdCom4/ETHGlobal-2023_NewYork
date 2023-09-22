import { SkillsService } from '@Api/skills/skills.service'
import { instance, mock, when } from 'ts-mockito'
import { ProfessionalRepository } from '@/repositories'
import { SkillRepository } from '@/repositories/skill.repository'
import { Skill } from '@/schemas/skill/skill.schema'
import { UserNotFoundException } from '@Common/exceptions/schemas/user/user-not-found.exception'
import { ProfessionalUser, User } from '@Schemas/user'
import { StrictAddress } from '@Schemas/common/pojos'
import { InstantiatingDataWrapper } from '@Common/classes'

describe('Service - SkillsService', () => {
  let skillsService: SkillsService

  beforeAll(() => {
    const mockedProfessionalRepositoryClass = mock(ProfessionalRepository)
    const mockedSkillRepositoryClass = mock(SkillRepository)
    when(mockedSkillRepositoryClass.findAll).thenReturn(() =>
      InstantiatingDataWrapper.fromData(Promise.resolve([Skill.of('Test1'), Skill.of('Test2')]))
    )
    when(mockedProfessionalRepositoryClass.findProfessionalById).thenReturn((userId) => {
      if (userId === '123456789') {
        return InstantiatingDataWrapper.fromData(
          Promise.resolve(
            User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', {
              skillIds: ['some-skill-id'],
              workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
            }) as ProfessionalUser
          )
        )
      } else throw new UserNotFoundException('User introuvable')
    })
    when(mockedSkillRepositoryClass.findMany).thenReturn(() => {
      return InstantiatingDataWrapper.fromData(Promise.resolve([Skill.of('Test1'), Skill.of('Test2')]))
    })
    when(mockedSkillRepositoryClass.findById).thenReturn((id) => {
      if (id === '123456789') {
        return InstantiatingDataWrapper.fromData(Promise.resolve(Skill.of('Test1')))
      } else throw new UserNotFoundException('Skill introuvable')
    })

    skillsService = new SkillsService(instance(mockedSkillRepositoryClass), instance(mockedProfessionalRepositoryClass))
  })

  it('should return all skills', async () => {
    // When
    const response = await skillsService.getAll()

    // Then
    expect(response).toBeTruthy()
  })

  describe('When getting skills of an user', () => {
    it('should success with a valid user', async () => {
      // Given
      const userId = '123456789'

      // When
      const response = await skillsService.getByUserId(userId)

      // Then
      expect(response).toBeTruthy()
    })

    it('should fail with an invalid user', async () => {
      // Given
      const userId = '987654321'

      // When
      const requesting = async (): Promise<Skill[]> => await skillsService.getByUserId(userId)

      // Then
      await expect(requesting).rejects.toThrow(UserNotFoundException)
    })
  })
  describe('When getting a skill by id', () => {
    it('should success with a valid id', async () => {
      // Given
      const id = '123456789'

      // When
      const response = await skillsService.getById(id)

      // Then
      expect(response).toBeTruthy()
    })

    it('should fail with an invalid id', async () => {
      // Given
      const id = '987654321'

      // When
      const requesting = async (): Promise<Skill> => await skillsService.getById(id)

      // Then
      await expect(requesting).rejects.toThrow(UserNotFoundException)
    })
  })
})
