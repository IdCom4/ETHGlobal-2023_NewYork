import { JwtAuthGuard, ProfessionalJwtAuthGuard } from '@/common/auth/guards/jwt'
import { AuthApiDecorators } from '@/common/decorators/swagger.decorator'
import { AuthType } from '@/common/enums/auth-type.enum'
import { Mission } from '@/schemas/mission'
import { ParseIntPipe, Request, SerializeOptions } from '@nestjs/common'
import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common/decorators'
import { HttpStatus } from '@nestjs/common/enums'
import { ApiResponse, ApiTags } from '@nestjs/swagger/dist/decorators'
import { MissionsService } from './missions.service'
import {
  CreateMissionRequest,
  NewMissionProfessionalProposalRequest,
  MessageRequest,
  FinishMissionRequest,
  ValidateMissionRequest,
  OpenDisputeRequest,
  UpdatePrivateNoteRequest,
  GetAvailableProfessionalsRequest,
} from './requests'
import { ClientMissionResponse, ProfessionalMissionResponse } from './responses'
import { UserGroups } from '@/common/enums'
import { MessageResponse } from '@/common/request-io/responses-dto'
import { ProfessionalUser } from '@/schemas/user'
import { PaymentIntentResponse } from '../payments/responses'
import { IllegalArgumentException } from '@Common/exceptions'
import { LiteProfessionalProfileResponse } from '@/common/request-io/responses-dto/user'

@ApiTags('missions')
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  /**
   * Get all available professionals for a pre mission request.
   * @remarks POST Method
   *
   * @param {GetAvailableProfessionalsRequest} request The sent request with needed and validated information
   * @return {Mission} the new mission
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mission créée avec succès', type: [LiteProfessionalProfileResponse] })
  @Post('/available-professionals')
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({})
  public async getAvailableProfessionals(@Body() request: GetAvailableProfessionalsRequest): Promise<LiteProfessionalProfileResponse[]> {
    const availableProfessionals = await this.missionsService.getMostRelevantAvailableProfessionalsForMission(
      request.issueIds,
      request.address.toStrictAddress(),
      request.maxDistance
    )

    return availableProfessionals.map((professional) => new LiteProfessionalProfileResponse(professional.professionalProfile))
  }

  /**
   * Create a mission.
   * @remarks POST Method
   *
   * @param {RequestWithLoggedUser} loggedUser A request wrapper containing the logged user
   * @param {CreateMissionRequest} request The sent request with needed and validated information
   * @return {Mission} the new mission
   */
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Mission créée avec succès', type: Mission })
  @AuthApiDecorators(AuthType.JWT)
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async createMission(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Body() request: CreateMissionRequest
  ): Promise<ClientMissionResponse> {
    const createdMission = await this.missionsService.createMission(
      loggedUser,
      request.vehicleId,
      request.issueIds,
      request.description,
      request.idealStartingMoment,
      request.idealPickupAddress.toStrictAddress(),
      request.maxDistance,
      request.hasSpareParts,
      request.attachments
    )

    const data = await this.missionsService.findMissionsRelatedDocumentsAsClient([createdMission])

    const { selectedProfessionals, vehicleData } = data[createdMission._id.toString()]

    return new ClientMissionResponse(loggedUser, createdMission, selectedProfessionals, vehicleData)
  }

  /**
   * Allows a mission professional to refuse it, if possible.
   * @remarks POST Method
   *
   * @param {RequestWithLoggedUser} loggedProfessional The professional doing the request
   * @param {string} missionId The id of the mission to cancel
   * @return {MessageResponse} the feedback of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mission refusée avec succès', type: MessageResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Post('refuse/:MISSION_ID')
  @UseGuards(ProfessionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async professionalRefuseMission(
    @Request() { user: loggedProfessional }: RequestWithLoggedUser<ProfessionalUser>,
    @Param('MISSION_ID') missionId: string
  ): Promise<MessageResponse> {
    await this.missionsService.professionalRefuseMission(missionId, loggedProfessional)

    return new MessageResponse(HttpStatus.OK, 'Mission refusée avec succès')
  }

  /**
   * Allows a mission professional to propose a quote, if possible.
   * @remarks PATCH Method
   *
   * @param {RequestWithLoggedUser} loggedProfessional The professional doing the request
   * @param {string} missionId The id of the mission
   * @param {NewMissionProfessionalProposalRequest} request The request object containing the proposal
   * @return {ProfessionalMissionResponse} the updated mission
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Devis envoyé avec succès', type: ProfessionalMissionResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('send-proposal/:MISSION_ID')
  @UseGuards(ProfessionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async professionalSendNewProposal(
    @Request() { user: loggedProfessional }: RequestWithLoggedUser<ProfessionalUser>,
    @Param('MISSION_ID') missionId: string,
    @Body() request: NewMissionProfessionalProposalRequest
  ): Promise<ProfessionalMissionResponse> {
    if (!missionId.isValidMongooseId()) throw new IllegalArgumentException('La valeur de la mission est invalide.')

    const mission = await this.missionsService.professionalSendProposal(loggedProfessional, missionId, {
      startDate: request.startDate,
      pickupAddress: request.pickupAddress.toStrictAddress(),
      quote: request.quote,
    })

    const { vehicleData, client } = (await this.missionsService.findMissionsRelatedDocumentsAsProfessional([mission]))[missionId]

    return new ProfessionalMissionResponse(loggedProfessional, mission, client, vehicleData)
  }

  /**
   * Allows a mission professional to update its private note
   * @remarks PATCH Method
   *
   * @param {RequestWithLoggedUser} loggedProfessional The professional doing the request
   * @param {string} missionId The id of the mission
   * @param {NewMissionProfessionalProposalRequest} request The request object containing the proposal
   * @return {ProfessionalMissionResponse} the updated mission
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Note privée mise à jour', type: MessageResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('update-private-note/:MISSION_ID')
  @UseGuards(ProfessionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async professionalUpdatesItsPrivateNote(
    @Request() { user: loggedProfessional }: RequestWithLoggedUser<ProfessionalUser>,
    @Param('MISSION_ID') missionId: string,
    @Body() request: UpdatePrivateNoteRequest
  ): Promise<MessageResponse> {
    await this.missionsService.professionalUpdatesItsPrivateNote(loggedProfessional._id.toString(), missionId, request.privateNote)

    return new MessageResponse(HttpStatus.OK, 'Note privée mise à jour')
  }

  /**
   * Allows a mission client to deny a professional and its proposal.
   * @remarks PATCH Method
   *
   * @param {RequestWithLoggedUser} loggedClient The client doing the request
   * @param {string} missionId The id of the mission
   * @param {string} professionalId The id of the professional to deny
   * @return {MessageResponse} the feedback of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Spécialiste refusé avec succès', type: MessageResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('deny-professional/:MISSION_ID')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async clientDenyProfessional(
    @Request() { user: loggedClient }: RequestWithLoggedUser,
    @Param('MISSION_ID') missionId: string,
    @Query('professional-id') professionalId: string
  ): Promise<MessageResponse> {
    await this.missionsService.clientDenyProfessional(loggedClient, missionId, professionalId)

    return new MessageResponse(HttpStatus.OK, 'Spécialiste refusé avec succès')
  }

  /**
   * Allows a mission client to pay the quote of his chosen professional.
   * @remarks PATCH Method
   *
   * @param {RequestWithLoggedUser} loggedClient The client doing the request
   * @param {string} missionId The id of the mission
   * @param {string} professionalId The id of the professional who's proposal to accept
   * @return {PaymentIntentResponse} the feedback of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Paiement du devis en cours', type: PaymentIntentResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('accept-proposal/:MISSION_ID')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async clientAcceptProfessionalProposal(
    @Request() { user: loggedClient }: RequestWithLoggedUser,
    @Param('MISSION_ID') missionId: string,
    @Query('professional-id') professionalId: string
  ): Promise<PaymentIntentResponse> {
    const { paymentId, status, paymentIdClientSecret } = await this.missionsService.clientAcceptProfessionalProposal(
      loggedClient,
      missionId,
      professionalId
    )

    return new PaymentIntentResponse(paymentId, status, paymentIdClientSecret)
  }

  /**
   * Allows a mission professional to set the mission as done.
   * @remarks PATCH Method
   *
   * @param {RequestWithLoggedUser} loggedProfessional The professional doing the request
   * @param {string} missionId The id of the mission
   * @param {FinishMissionRequest} request The request with all the required information to finish the mission
   * @return {MessageResponse} the feedback of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mission terminée avec succès', type: MessageResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('finish/:MISSION_ID')
  @UseGuards(ProfessionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async professionalFinishMission(
    @Request() { user: loggedProfessional }: RequestWithLoggedUser<ProfessionalUser>,
    @Param('MISSION_ID') missionId: string,
    @Body() request: FinishMissionRequest
  ): Promise<MessageResponse> {
    await this.missionsService.professionalFinishMission(
      loggedProfessional,
      missionId,
      request.vehicleMileage,
      request.interventionIds,
      request.otherInterventions
    )

    return new MessageResponse(HttpStatus.OK, 'Mission terminée avec succès')
  }

  /**
   * Allows a mission client to validate or not that the mission was properly completed.
   * @remarks PATCH Method
   *
   * @param {RequestWithLoggedUser} loggedUser The client doing the request
   * @param {string} missionId The id of the mission
   * @param {ValidateMissionRequest} request The request with all the required information to finish the mission
   * @return {MessageResponse} the feedback of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'La mission a été validée avec succès', type: MessageResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('validate/:MISSION_ID')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async clientValidateMission(
    @Request() { user: loggedUser }: RequestWithLoggedUser<ProfessionalUser>,
    @Param('MISSION_ID') missionId: string,
    @Body() request: ValidateMissionRequest
  ): Promise<MessageResponse> {
    await this.missionsService.clientValidateMission(
      loggedUser,
      missionId,
      request.reviewOfProfessional?.toReview(loggedUser),
      request.reviewOfWebsite?.toReview(loggedUser)
    )

    return new MessageResponse(HttpStatus.OK, 'La mission a été validée avec succès')
  }

  /**
   * Allows a mission client to open a dipute about the completion of its mission.
   * @remarks PATCH Method
   *
   * @param {RequestWithLoggedUser} loggedUser The client doing the request
   * @param {string} missionId The id of the mission
   * @param {OpenDisputeRequest} request The request with all the required information to open the dispute
   * @return {MessageResponse} the feedback of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Votre retour a été pris en compte', type: MessageResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('open-dispute/:MISSION_ID')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async clientOpenDispute(
    @Request() { user: loggedUser }: RequestWithLoggedUser<ProfessionalUser>,
    @Param('MISSION_ID') missionId: string,
    @Body() request: OpenDisputeRequest
  ): Promise<MessageResponse> {
    await this.missionsService.clientOpenDispute(loggedUser, missionId, request.reason)

    return new MessageResponse(
      HttpStatus.OK,
      'Nous avons été notifié de votre retour et allons communiquer avec vous et le spécialiste dans les plus brefs délais'
    )
  }

  /**
   * Allows a mission client to cancel his mission, if possible.
   * @remarks POST Method
   *
   * @param {RequestWithLoggedUser} loggedUser A request wrapper containing the logged user
   * @param {string} missionId The id of the mission to cancel
   * @return {MessageResponse} the feedback of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mission annulée avec succès', type: MessageResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Post('cancel/:MISSION_ID')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async clientCancelMission(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('MISSION_ID') missionId: string
  ): Promise<MessageResponse> {
    await this.missionsService.cancelMission(missionId, loggedUser._id.toString())

    return new MessageResponse(HttpStatus.OK, 'Mission annulée avec succès')
  }

  /**
   * send a message.
   * @remarks POST Method
   *
   * @param {RequestWithLoggedUser} loggedUser A request wrapper containing the logged user
   * @param {String} missionId The ID of the mission the message belongs to
   * @param {MessageRequest} request The request object that contains the message's information
   * @return {Mission} the new mission
   */
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Message envoyé avec succès', type: Mission })
  @AuthApiDecorators(AuthType.JWT)
  @Post('message/:MISSION_ID')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async sendMessageTo(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('MISSION_ID') missionId: string,
    @Body() request: MessageRequest
  ): Promise<MessageResponse> {
    await this.missionsService.userSendMessageTo(missionId, loggedUser, request.receiverId, request.content, request.attachment)
    return new MessageResponse(HttpStatus.OK, 'Message envoyé avec succès')
  }

  /**
   * Set message as seen.
   * @remarks PATCH Method
   *
   * @param {RequestWithLoggedUser} loggedUser A request wrapper containing the logged user
   * @param {String} missionId The ID of the mission the message belongs to
   * @param {String} professionalId The ID of the professional affiliated to the conversation
   * @param {String} messageIndex The index of the message
   * @return {Mission} the new mission
   */
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Message vu avec succès', type: Mission })
  @AuthApiDecorators(AuthType.JWT)
  @Patch('message/:MISSION_ID/')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async setMessageAsSeen(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('MISSION_ID') missionId: string,
    @Query('professional-id') professionalId: string,
    @Query('message-index', ParseIntPipe) messageIndex: number
  ): Promise<MessageResponse> {
    await this.missionsService.setMessageAsSeen(missionId, loggedUser, professionalId, messageIndex)
    return new MessageResponse(HttpStatus.OK, 'Message vu avec succès')
  }

  /**
   * Get all client's missions.
   * @remarks GET Method
   *
   * @param {RequestWithLoggedUser} loggedClient The client doing the request
   * @return {Array<ClientMissionResponse>} the list of missions
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Missions récupérées avec succès', type: Array<ClientMissionResponse> })
  @AuthApiDecorators(AuthType.JWT)
  @Get('client')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async getClientMissions(@Request() { user: loggedClient }: RequestWithLoggedUser): Promise<ClientMissionResponse[]> {
    const missions = await this.missionsService.getClientMissions(loggedClient._id.toString())

    const missionsData = await this.missionsService.findMissionsRelatedDocumentsAsClient(missions)

    return missions.map((mission) => {
      const { vehicleData, selectedProfessionals } = missionsData[mission._id.toString()]
      return new ClientMissionResponse(loggedClient, mission, selectedProfessionals, vehicleData)
    })
  }

  /**
   * Get a client's mission by id.
   * @remarks GET Method
   *
   * @param {String} missionId The mission id to get
   * @param {RequestWithLoggedUser} loggedClient The client doing the request
   * @return {ClientMissionResponse} the mission
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mission récupérée avec succès', type: ClientMissionResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Get('client/by-id/:ID')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async getClientMissionById(
    @Param('ID') missionId: string,
    @Request() { user: loggedClient }: RequestWithLoggedUser
  ): Promise<ClientMissionResponse> {
    const mission = await this.missionsService.getClientMissionById(loggedClient._id.toString(), missionId)

    const missionsData = await this.missionsService.findMissionsRelatedDocumentsAsClient([mission])
    const { vehicleData, selectedProfessionals } = missionsData[missionId]

    return new ClientMissionResponse(loggedClient, mission, selectedProfessionals, vehicleData)
  }

  /**
   * Get all professional's missions.
   * @remarks GET Method
   *
   * @param {RequestWithLoggedUser} loggedProfessional The professional doing the request
   * @return {Array<ProfessionalMissionResponse>} the missions
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Missions récupérées avec succès', type: Array<ProfessionalMissionResponse> })
  @AuthApiDecorators(AuthType.JWT)
  @Get('professional')
  @UseGuards(ProfessionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async getProfessionalMissions(
    @Request() { user: loggedProfessional }: RequestWithLoggedUser<ProfessionalUser>
  ): Promise<ProfessionalMissionResponse[]> {
    const missions = await this.missionsService.getProfessionalMissions(loggedProfessional, true)

    const missionsData = await this.missionsService.findMissionsRelatedDocumentsAsProfessional(missions)

    return missions.map((mission) => {
      const { vehicleData, client } = missionsData[mission._id.toString()]
      return new ProfessionalMissionResponse(loggedProfessional, mission, client, vehicleData)
    })
  }

  /**
   * Get a professional's mission by id.
   * @remarks GET Method
   *
   * @param {String} missionId The mission id to get
   * @param {RequestWithLoggedUser} loggedProfessional The professional doing the request
   * @return {ProfessionalMissionResponse} the mission
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Mission récupérée avec succès', type: ProfessionalMissionResponse })
  @AuthApiDecorators(AuthType.JWT)
  @Get('professional/by-id/:ID')
  @UseGuards(ProfessionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ groups: [UserGroups.LOGGED_REQUEST] })
  public async getProfessionalMissionById(
    @Param('ID') missionId: string,
    @Request() { user: loggedProfessional }: RequestWithLoggedUser<ProfessionalUser>
  ): Promise<ProfessionalMissionResponse> {
    const mission = await this.missionsService.getProfessionalMissionById(loggedProfessional, missionId)

    const missionsData = await this.missionsService.findMissionsRelatedDocumentsAsProfessional([mission])
    const { vehicleData, client } = missionsData[missionId]

    return new ProfessionalMissionResponse(loggedProfessional, mission, client, vehicleData)
  }
}
