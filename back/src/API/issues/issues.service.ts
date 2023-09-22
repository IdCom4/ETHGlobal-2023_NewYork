import { IssueRepository } from '@/repositories/issue.repository'
import { Issue } from '@Schemas/issue/issue.schema'
import { IssueNotFoundException } from '@Common/exceptions/schemas/issue/issue-not-found.exception'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { Injectable } from '@nestjs/common'
import { IssueAlreadyExistsException } from '@Common/exceptions/schemas/issue/issue-already-exists.exception'

@Injectable()
export class IssuesService {
  constructor(private readonly issueRepository: IssueRepository) {}

  /**
   * Get all issues.
   *
   * @returns {Issue[]} All issues.
   */
  public async findAll(): Promise<Issue[]> {
    return this.issueRepository.findAll().getOr([])
  }

  /**
   * Get all issues whose id are provided.
   *
   * @returns {Issue[]} All issues whose id were provided.
   */
  public async findAllByIds(issueIds: string[]): Promise<Issue[]> {
    return this.issueRepository.findList(issueIds).getOr([])
  }

  /**
   * Get an issue by its id.
   *
   * @param {string} id The id of the issue.
   * @returns {Issue} The issue.
   *
   * @throws {IssueNotFoundException} If the issue is not found.
   */
  public async getById(id: string): Promise<Issue> {
    return this.issueRepository.findById(id).getOrThrow(new IssueNotFoundException())
  }

  /**
   * Get an issue by its label.
   * It will search for issues containing the search string.
   *
   * @param {string} searchString The label of the issue.
   * @returns {Issue[]} The issue.
   */
  public async getByLabel(searchString: string): Promise<Issue[]> {
    return this.issueRepository.searchByLabel(searchString).getOr([])
  }

  /**
   * Create an issue.
   *
   * @param {string} label The label of the issue.
   * @param {string[]} [skillIds] The skills of the issue.(Optional)
   * @returns {Issue} The created issue.
   */
  public async createIssue(label: string, skillIds?: string[]): Promise<Issue> {
    if (await this.issueRepository.findBy({ _label: label }).getOrNull()) throw new IssueAlreadyExistsException()

    const issue = Issue.of(label, skillIds)
    return this.issueRepository.create(issue)
  }

  /**
   * Delete an issue.
   *
   * @param {string} id The id of the issue.
   * @returns {boolean} True if the issue has been deleted, false otherwise.
   */
  public async deleteIssue(id: string): Promise<boolean> {
    return this.issueRepository.delete(id)
  }

  /**
   * Update an issue.
   *
   * @param {string} id The id of the issue.
   * @param {string} label The new label of the issue.
   * @param {string[]} skillIds The new skills of the issue.
   * @returns {Issue} The updated issue.
   *
   * @throws {InternalServerErrorException} If an error occurred during the update.
   */
  public async updateIssue(id: string, label?: string, skillIds?: string[]): Promise<Issue> {
    const issue = await this.getById(id)
    issue.update(label, skillIds)
    if (await this.issueRepository.updateAsIs(issue)) return issue
    else throw new InternalServerErrorException("Une erreur inconnue est survenue lors de la mise à jour de l'issue")
  }
}
