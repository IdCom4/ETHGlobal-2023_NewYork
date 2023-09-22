import { IssuesController } from '@Api/issues/issues.controller'
import { instance, mock, when } from 'ts-mockito'
import { IssuesService } from '@Api/issues/issues.service'
import { Issue } from '@Schemas/issue/issue.schema'
import { CreateIssueRequest } from '@Api/issues/requests/create-issue.dto'
import { MessageResponse } from '@Common/request-io/responses-dto'
import { IssueNotFoundException } from '@Common/exceptions/schemas/issue/issue-not-found.exception'
import { IssueAlreadyExistsException } from '@Common/exceptions/schemas/issue/issue-already-exists.exception'

describe('Controller - IssuesController', () => {
  let issuesController: IssuesController

  beforeAll(() => {
    const mockedIssuesService = mock(IssuesService)
    when(mockedIssuesService.findAll).thenReturn(async () => {
      return [Issue.of('Issue1'), Issue.of('Issue2')]
    })
    when(mockedIssuesService.getById).thenReturn(async (id: string) => {
      if (id !== 'existingId') throw new IssueNotFoundException()
      return Issue.of('Issue1')
    })
    when(mockedIssuesService.createIssue).thenReturn(async (label, skills) => {
      if (label === 'existingLabel') throw new IssueAlreadyExistsException()
      return Issue.of(label, skills)
    })
    when(mockedIssuesService.updateIssue).thenReturn(async (id, label, skills) => {
      if (id !== 'existingId') throw new IssueNotFoundException()
      const issue = new Issue()
      issue.update(label, skills)
      return issue
    })
    when(mockedIssuesService.deleteIssue).thenReturn(async (id: string) => {
      if (id !== 'existingId') throw new IssueNotFoundException()
      return true
    })
    when(mockedIssuesService.getByLabel).thenReturn(async (label: string) => {
      if (label !== 'existingLabel') return []
      return [Issue.of('Issue1')]
    })

    issuesController = new IssuesController(instance(mockedIssuesService))
  })

  it('should return all issues', async () => {
    // When
    const result = await issuesController.getAll()

    // Then
    expect(result.length).toBeGreaterThan(0)
  })

  describe('When getting issue by id', () => {
    it('should return issue with existing id', async () => {
      // Given
      const id = 'existingId'

      // When
      const result = await issuesController.getById(id)

      // Then
      expect(result).toBeDefined()
    })

    it('should throw with non-existing id', async () => {
      // Given
      const id = 'nonExistingId'

      // When
      const result = async (): Promise<Issue> => await issuesController.getById(id)

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  describe('When getting issue by label', () => {
    it('should return issue with existing label', async () => {
      // Given
      const label = 'existingLabel'

      // When
      const result = await issuesController.getByLabel(label)

      // Then
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return an empty array with existing label', async () => {
      // Given
      const label = 'nonExistingLabel'

      // When
      const result = await issuesController.getByLabel(label)

      // Then
      expect(result.length).toBe(0)
    })
  })

  describe('When creating issue', () => {
    it('should return created issue', async () => {
      // Given
      const createRequest: CreateIssueRequest = {
        label: 'label',
        skillIds: ['skill1', 'skill2'],
      }

      // When
      const result = await issuesController.create(createRequest)

      // Then
      expect(result).toBeDefined()
    })

    it('should throw with an already known label', async () => {
      // Given
      const createRequest: CreateIssueRequest = {
        label: 'existingLabel',
        skillIds: ['skill1', 'skill2'],
      }

      // When
      const result = async (): Promise<Issue> => await issuesController.create(createRequest)

      // Then
      await expect(result).rejects.toThrow()
    })
  })

  it('should update issue', async () => {
    // Given
    const id = 'existingId'
    const updateRequest: CreateIssueRequest = {
      label: 'label',
      skillIds: ['skill1', 'skill2'],
    }

    // When
    const result = await issuesController.update(id, updateRequest)

    // Then
    expect(result).toBeDefined()
    expect(result.label).toBe(updateRequest.label)
    expect(result.skillIds).toBe(updateRequest.skillIds)
  })

  it('should delete issue', async () => {
    // Given
    const id = 'existingId'

    // When
    const result = await issuesController.delete(id)

    // Then
    expect(result).toBeDefined()
    expect(result).toBeInstanceOf(MessageResponse)
  })
})
