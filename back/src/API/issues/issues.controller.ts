import { IssuesService } from '@Api/issues/issues.service'
import { Issue } from '@Schemas/issue/issue.schema'
import { Body, Controller, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Delete } from '@nestjs/common/decorators/http'
import { AdminJwtAuthGuard } from '@Common/auth/guards/jwt'
import { AuthType } from '@Common/enums/auth-type.enum'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { CreateIssueRequest } from '@Api/issues/requests/create-issue.dto'
import { MessageResponse } from '@Common/request-io/responses-dto'
import { BadRequestException } from '@nestjs/common/exceptions'
import { UpdateIssueRequest } from '@Api/issues/requests/update-issue.dto'
import { GetIssuesByIdRequest } from './requests'

@ApiTags('issues')
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  /**
   * Get all the issues
   *
   * @returns All the issues
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de toutes les issues', type: [Issue], isArray: true })
  @Get()
  public async getAll(): Promise<Issue[]> {
    return await this.issuesService.findAll()
  }

  /**
   * Get all the issues whose ids are provided
   *
   * @returns All the issues whose ids were provided
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de toutes les issues', type: [Issue], isArray: true })
  @Post('by-ids')
  public async getAllByIds(@Body() request: GetIssuesByIdRequest): Promise<Issue[]> {
    return await this.issuesService.findAllByIds(request.issueIds)
  }

  /**
   * Get all the issues containing the given label
   *
   * @param label The label to search for
   * @returns All the issues containing the given label
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de toutes les issues contenant ce label', type: [Issue], isArray: true })
  @Get('label/:LABEL')
  public async getByLabel(@Param('LABEL') label: string): Promise<Issue[]> {
    return await this.issuesService.getByLabel(label)
  }

  /**
   * Get an issue by its id
   *
   * @param id The id of the issue to get
   * @returns The issue with the corresponding id
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Récupération de l'issue avec l'id correspondant", type: [Issue], isArray: true })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Aucune issue n'a été trouvée" })
  @Get(':ID')
  public async getById(@Param('ID') id: string): Promise<Issue> {
    return await this.issuesService.getById(id)
  }

  /**
   * Create an issue
   *
   * @param request The request containing the issue's data
   * @returns The created issue
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Création d'une issue", type: Issue })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Une issue avec le même label existe déjà' })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(AdminJwtAuthGuard)
  @Post()
  public async create(@Body() request: CreateIssueRequest): Promise<Issue> {
    return await this.issuesService.createIssue(request.label, request.skillIds)
  }

  /**
   * Delete an issue
   *
   * @param id The id of the issue to delete
   * @returns A message indicating if the issue has been deleted
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Suppression d'une issue", type: Boolean })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Erreur inconnue lors de la suppression de l'issue" })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(AdminJwtAuthGuard)
  @Delete(':ID')
  public async delete(@Param('ID') id: string): Promise<MessageResponse> {
    if (await this.issuesService.deleteIssue(id)) return new MessageResponse(HttpStatus.OK, 'Issue supprimée avec succès')
    else throw new BadRequestException("Erreur inconnue lors de la suppression de l'issue. Vérifiez les données envoyées.")
  }

  /**
   * Update an issue
   *
   * @param id The id of the issue to update
   * @param request The request containing the issue's data
   * @returns The updated issue
   */
  @ApiResponse({ status: HttpStatus.OK, description: "Mise à jour d'une issue", type: Issue })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Aucune issue n'a été trouvée" })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Erreur inconnue lors de la mise à jour de l'issue" })
  @AuthApiDecorators(AuthType.JWT)
  @UseGuards(AdminJwtAuthGuard)
  @Patch(':ID')
  public async update(@Param('ID') id: string, @Body() request: UpdateIssueRequest): Promise<Issue> {
    return await this.issuesService.updateIssue(id, request.label, request.skillIds)
  }
}
