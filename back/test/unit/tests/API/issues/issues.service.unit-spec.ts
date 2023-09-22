import { instance, mock, when } from 'ts-mockito'
import { IssuesService } from '@Api/issues/issues.service'
import { Issue } from '@Schemas/issue/issue.schema'
import { IssueRepository } from '@/repositories/issue.repository'
import { InstantiatingDataWrapper } from '@Common/classes'

describe('Service - IssuesService', () => {
  let issuesService: IssuesService

  beforeAll(() => {
    const mockedIssueRepository = mock(IssueRepository)
    when(mockedIssueRepository.findAll).thenReturn(() => {
      return InstantiatingDataWrapper.fromData(Promise.resolve([Issue.of('Issue1'), Issue.of('Issue2')]))
    })
    when(mockedIssueRepository.findById).thenReturn((id: string) => {
      if (id !== 'existingId') return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<Issue>)
      return InstantiatingDataWrapper.fromData(Promise.resolve(Issue.of('Issue1')))
    })
    when(mockedIssueRepository.findBy).thenReturn((query) => {
      if (query._label !== 'existingLabel') return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<Issue>)
      return InstantiatingDataWrapper.fromData(Promise.resolve(Issue.of('Issue1')))
    })
    when(mockedIssueRepository.create).thenReturn(async (issue: Issue) => {
      return issue
    })
    when(mockedIssueRepository.updateAsIs).thenReturn(async () => {
      return true
    })
    when(mockedIssueRepository.delete).thenReturn(async (id: string) => {
      return id === 'existingId'
    })
    when(mockedIssueRepository.searchByLabel).thenReturn((label: string) => {
      if (label !== 'existingLabel') return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<Issue[]>)
      return InstantiatingDataWrapper.fromData(Promise.resolve([Issue.of('Issue1')]))
    })

    issuesService = new IssuesService(instance(mockedIssueRepository))
  })

  it('should return all issues', async () => {
    // When
    const result = await issuesService.findAll()

    // Then
    expect(result.length).toBeGreaterThan(0)
  })

  describe('When getting issue by id', () => {
    it('should return issue with existing id', async () => {
      // Given
      const id = 'existingId'

      // When
      const result = await issuesService.getById(id)

      // Then
      expect(result).toBeDefined()
    })

    it('should throw with non-existing id', async () => {
      // Given
      const id = 'nonExistingId'

      // When
      const result = async (): Promise<Issue> => await issuesService.getById(id)

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  describe('When getting issue by label', () => {
    it('should return issue with existing label', async () => {
      // Given
      const label = 'existingLabel'

      // When
      const result = await issuesService.getByLabel(label)

      // Then
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return an empty array with existing label', async () => {
      // Given
      const label = 'nonExistingLabel'

      // When
      const result = await issuesService.getByLabel(label)

      // Then
      expect(result.length).toBe(0)
    })
  })

  describe('When creating issue', () => {
    it('should return created issue', async () => {
      // Given
      const label = 'label'
      const skills = ['skill1', 'skill2']

      // When
      const result = await issuesService.createIssue(label, skills)

      // Then
      expect(result).toBeDefined()
    })

    it('should throw with an already known label', async () => {
      // Given
      const label = 'existingLabel'
      const skills = ['skill1', 'skill2']

      // When
      const result = async (): Promise<Issue> => await issuesService.createIssue(label, skills)

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  it('should update issue', async () => {
    // Given
    const id = 'existingId'
    const newLabel = 'label'
    const newSkills = ['skill1', 'skill2']

    // When
    const result = await issuesService.updateIssue(id, newLabel, newSkills)

    // Then
    expect(result).toBeDefined()
    expect(result.label).toBe(newLabel)
    expect(result.skillIds).toBe(newSkills)
  })

  it('should delete issue', async () => {
    // Given
    const id = 'existingId'

    // When
    const result = await issuesService.deleteIssue(id)

    // Then
    expect(result).toBeTruthy()
  })
})
