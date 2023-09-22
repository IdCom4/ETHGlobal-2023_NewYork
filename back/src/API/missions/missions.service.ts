import { IssueNotFoundException } from '@/common/exceptions/schemas/issue/issue-not-found.exception'
import { VehicleNotFoundException } from '@/common/exceptions/schemas/vehicles/vehicle-not-found.exception'
import { IssueRepository, MissionRepository, ProfessionalRepository, UserRepository, VehicleBrandRepository, VehicleRepository } from '@/repositories'
import { PublicFile, Review, StrictAddress } from '@/schemas/common/pojos'
import { IMissionProfessionalProposalPayload, Mission, MissionBlueprint, MissionClientRequest } from '@/schemas/mission'
import { ProfessionalUser, User } from '@/schemas/user'
import { Inject, Injectable } from '@nestjs/common/decorators'
import { DatesUtils } from '@/common/utils'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { ProfessionalsService } from '@Api/professionals/professionals.service'
import '@/extensions'
import { ProfessionalNotFoundException, UserNotFoundException } from '@/common/exceptions/schemas/user'
import { IMailAPI } from '@/common/external-service-providers-api'
import { Vehicle } from '@/schemas/vehicle'
import { MissionNotFoundException } from '@/common/exceptions/schemas/mission'
import { BadRequestException, ForbiddenException, HttpException } from '@nestjs/common'
import { DocumentTypes, MissionStatuses, PaymentProviderStatuses, VmcCompaniesKeyNames } from '@/common/enums'
import { PaymentsService } from '../payments/payments.service'
import { Interval } from '@nestjs/schedule'
import { InvoicesService } from '../invoices/invoices.service'
import { Issue } from '@/schemas/issue'

@Injectable()
export class MissionsService {
  constructor(
    @Inject('MailAPI') private readonly mailAPI: IMailAPI,
    private readonly professionalsService: ProfessionalsService,
    private readonly invoicesService: InvoicesService,
    private readonly hostedFilesService: HostedFilesService,
    private readonly paymentsService: PaymentsService,
    private readonly missionRepository: MissionRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly vehicleBrandRepository: VehicleBrandRepository,
    private readonly userRepository: UserRepository,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly issueRepository: IssueRepository
  ) {}

  public async getMostRelevantAvailableProfessionalsForMission(
    issues: Array<Issue | string>,
    address: StrictAddress,
    maxDistance: number,
    limit = 20
  ): Promise<ProfessionalUser[]> {
    if (!issues.length) return []

    // if issues contains Issue instances keep them, else fetch them by their ids
    const finalIssues: Issue[] = issues[0] instanceof Issue ? (issues as Issue[]) : await this.issueRepository.findList(issues as string[]).getOr([])

    return await this.professionalsService.fetchMostRelevantProfessionalsForMission(finalIssues, address, maxDistance, limit)
  }

  public async createMission(
    client: User,
    vehicleId: string,
    issueIds: string[],
    description: string,
    idealStartingMoment: string,
    idealPickupAddress: StrictAddress,
    maxDistance: number,
    hasSpareParts: boolean,
    attachments?: TBase64File[]
  ): Promise<Mission> {
    // check if vehicle exists & belongs to the client
    const vehicle = await this.vehicleRepository
      .findActiveBy({ _id: vehicleId, _ownerId: client._id.toString() })
      .getOrThrow(new VehicleNotFoundException())

    // check that issues exists
    const prunedIssueIds = issueIds.removeDuplicates()
    const issues = await this.issueRepository.findList(prunedIssueIds).getOr([])
    if (issues.length !== prunedIssueIds.length) throw new IssueNotFoundException()

    // check that there is relevant professionals
    const relevantProfessionals = await this.getMostRelevantAvailableProfessionalsForMission(issues, idealPickupAddress, maxDistance)
    if (!relevantProfessionals.length) throw new ProfessionalNotFoundException('Aucun spécialiste ne correspond à votre besoin')

    // upload files
    const uploadedFiles = attachments ? await this.uploadMissionAtachments(attachments, client._id.toString(), vehicleId, new Date()) : []

    const clientRequest = MissionClientRequest.of(
      client._id.toString(),
      vehicleId,
      prunedIssueIds,
      description,
      idealStartingMoment,
      idealPickupAddress,
      maxDistance,
      hasSpareParts,
      uploadedFiles
    )

    // create mission
    const mission = Mission.of(
      clientRequest,
      relevantProfessionals.map((pro) => pro._id.toString())
    )

    // save it to DB
    const savedMission = await this.missionRepository.create(mission)
    const missionId = savedMission._id.toString()

    // update & save client
    client.missionClientProfile.missionsId.push(missionId)
    this.userRepository.updateAsIs(client)

    // update & save professionals
    relevantProfessionals.forEach((pro) => {
      pro.professionalProfile.missionsId.push(missionId)
      this.userRepository.updateAsIs(pro)
    })

    // send mails
    this.mailAPI.sendNewMissionCreatedEmail(savedMission._id.toString(), client, vehicle, relevantProfessionals)

    return savedMission
  }

  public async professionalSendProposal(
    professional: ProfessionalUser,
    missionId: string,
    proposalPayload: IMissionProfessionalProposalPayload
  ): Promise<Mission> {
    // check if mission exists
    const mission = await this.missionRepository.findById(missionId).getOrThrow(new MissionNotFoundException())

    const professionalId = professional._id.toString()

    // check that the professional can send a new proposal and do so
    mission.professionalSendNewProposal(professionalId, proposalPayload)
    this.missionRepository.updateAsIs(mission)

    // send mail to the client
    const { vehicleData, client } = (await this.findMissionsRelatedDocumentsAsProfessional([mission]))[missionId]
    this.mailAPI.sendMissionNewQuoteReceivedToClient(vehicleData.vehicle, client, professional)

    return mission
  }

  public async professionalUpdatesItsPrivateNote(professionalId: string, missionId: string, privateNote: string): Promise<void> {
    // get the mission
    const mission = await this.missionRepository.findByIdAndProfessionalId(missionId, professionalId).getOrThrow(new MissionNotFoundException())

    const entry = mission.getProfessionalEntry(professionalId)
    entry.updatePrivateNote(privateNote)

    await this.missionRepository.updateAsIs(mission)
  }

  public async clientAcceptProfessionalProposal(loggedClient: User, missionId: string, selectedProfessionalId: string): Promise<IPaymentResponse> {
    // get the mission
    const mission = await this.missionRepository
      .findByIdAndClientId(missionId, loggedClient._id.toString())
      .getOrThrow(new MissionNotFoundException())

    // check mission and professional proposal status
    if (mission.status !== MissionStatuses.QUOTE_PENDING)
      throw new ForbiddenException("Vous ne pouvez pas commencer une mission qui n'a pas de devis en attente")

    const professionalEntry = mission.getActiveProfessionalEntry(selectedProfessionalId)
    if (!professionalEntry.proposal) throw new BadRequestException("Ce devis n'existe pas")

    // setup payment
    const paymentResponse = await this.paymentsService.createPaymentIntent(
      loggedClient,
      VmcCompaniesKeyNames.PLATEFORME,
      professionalEntry.proposal.quote.totalTTCToClient,
      {
        documentType: DocumentTypes.MISSION,
        documentId: missionId,
      },
      { selectedProfessionalId }
    )

    // update and save mission
    mission.updatePaymentData(paymentResponse)

    this.missionRepository.updateAsIs(mission)

    return paymentResponse
  }

  public async validateClientPayment(paymentEvent: IPaymentEvent): Promise<void> {
    // check that payment succedeed
    if (!paymentEvent.paymentId || paymentEvent.eventStatus !== 'success')
      throw new ForbiddenException("La mission ne peut commencer qu'une fois les fonds reçus")

    // get the mission
    const mission = await this.missionRepository.findById(paymentEvent.documentId).getOrThrow(new MissionNotFoundException())

    // set mission as started
    const selectedProfessionalId = paymentEvent.metadata['selectedProfessionalId']
    const rejectedProfessionalIds = mission.start(selectedProfessionalId)

    // update payment data
    mission.updatePaymentData({ paymentId: paymentEvent.paymentId, status: PaymentProviderStatuses.SUCCESS })

    await this.missionRepository.updateAsIs(mission)

    // send mails
    const vehicle = await this.vehicleRepository.findById(mission.clientRequest.vehicleId).getOrThrow(new VehicleNotFoundException())
    const rejectedProfessionals = await this.professionalRepository.findProfessionalList(rejectedProfessionalIds).getOr([])

    rejectedProfessionals.forEach((pro) => this.mailAPI.sendMissionClientChoseAnotherProfessional(vehicle, pro))
  }

  public async clientDenyProfessional(loggedClient: User, missionId: string, professionalId: string): Promise<boolean> {
    const clientId = loggedClient._id.toString()
    // check if mission exists
    const mission = await this.missionRepository.findByIdAndClientId(missionId, clientId).getOrThrow(new MissionNotFoundException())

    // deny professional
    mission.denyProfessional(professionalId)

    this.missionRepository.updateAsIs(mission)

    // send mail
    const vehicle = await this.vehicleRepository.findById(mission.clientRequest.vehicleId).getOrThrow(new VehicleNotFoundException())
    const professional = await this.professionalRepository.findProfessionalById(professionalId).getOrThrow(new ProfessionalNotFoundException())
    this.mailAPI.sendMissionClientChoseAnotherProfessional(vehicle, professional)

    // check if there is at least one professional left
    // or if mission is to be canceled
    const activeEntries = mission.getRemainingActiveProfessionalEntries()
    const shouldMissionBeCanceled = !!activeEntries.length
    if (shouldMissionBeCanceled) this.cancelMission(missionId, clientId)

    return true
  }

  public async professionalRefuseMission(missionId: string, refusingProfessional: ProfessionalUser): Promise<boolean> {
    // check if mission exists
    const mission = await this.missionRepository.findById(missionId).getOrThrow(new MissionNotFoundException())

    const professionalId = refusingProfessional._id.toString()

    // check that professional is indeed in the mission and can refuse it
    const professionalEntry = mission.setProfessionalAsRefusingTheMission(professionalId)

    // if professional was the last active one, cancel it
    if (!mission.getRemainingActiveProfessionalEntries().length) this.cancelMission(missionId, professionalId)
    // else if he had submitted a pending proposal, alert the client
    else if (professionalEntry.proposal) {
      const { vehicleData, client } = (await this.findMissionsRelatedDocumentsAsProfessional([mission]))[missionId]

      this.mailAPI.sendProfessionalWithPendingQuoteRefusedMissionToClient(vehicleData.vehicle, client, refusingProfessional)
    }

    this.missionRepository.updateAsIs(mission)

    return true
  }

  public async professionalFinishMission(
    loggedProfessional: ProfessionalUser,
    missionId: string,
    vehicleMileage: number,
    interventionIds: string[],
    otherInterventions: string[]
  ): Promise<boolean> {
    const professionalId = loggedProfessional._id.toString()
    // check if mission exists
    const mission = await this.missionRepository.findByIdAndProfessionalId(missionId, professionalId).getOrThrow(new MissionNotFoundException())

    // check that mission is in progress
    if (mission.status !== MissionStatuses.IN_PROGRESS) throw new ForbiddenException('Vous ne pouvez valider une mission que si elle est en cours')

    const { vehicleData, client } = (await this.findMissionsRelatedDocumentsAsProfessional([mission]))[missionId]

    // check that mileage is correct
    if (vehicleData.vehicle.mileage > vehicleMileage)
      throw new BadRequestException('Vous ne pouvez pas renseigner un kilométrage inférieur à celui actuellement enregistré dans le vehicule')

    // set mission report
    const prunedInterventionIds = interventionIds.removeDuplicates()
    mission.finish(professionalId, vehicleMileage, prunedInterventionIds, otherInterventions)

    // save the mission
    this.missionRepository.updateAsIs(mission)

    // send mail
    this.mailAPI.sendMissionCompletedToClient(missionId, client.email, loggedProfessional.name)

    return true
  }

  public async clientValidateMission(client: User, missionId: string, reviewOfProfessional?: Review, reviewOfWebsite?: Review): Promise<void> {
    const clientId = client._id.toString()

    // check if mission exists
    const mission = await this.missionRepository.findByIdAndClientId(missionId, clientId).getOrThrow(new MissionNotFoundException())

    // check that mission can be validated
    if (mission.status !== MissionStatuses.FINISHED) throw new ForbiddenException('Vous ne pouvez pas valider une mission non terminée')

    // validate the mission
    mission.validateByClient(clientId, reviewOfProfessional, reviewOfWebsite)

    // get the professional
    const activeProfessionalId = mission.getRemainingActiveProfessionalIds()[0]
    const professional = await this.professionalRepository.findProfessionalById(activeProfessionalId).getOrThrow(new ProfessionalNotFoundException())

    // update its finished missions
    professional.professionalProfile.incrementFinishedMissions()

    // set the review if any
    if (reviewOfProfessional) professional.professionalProfile.addClientReview(reviewOfProfessional)

    // pay it
    await this.paymentsService.payProfessionalForMissionCompletion(professional, mission)

    await this.professionalRepository.updateAsIs(professional)

    // generate invoice
    const vehicle = await this.vehicleRepository.findById(mission.clientRequest.vehicleId).getOrThrow(new VehicleNotFoundException())
    const { invoiceInstance, invoiceFile } = await this.invoicesService.createVehicleInvoiceFromMission(mission, vehicle, client, professional)
    const invoiceId = invoiceInstance._id.toString()

    vehicle.addInvoiceId(invoiceId)
    mission.setInvoiceId(invoiceId)

    await this.vehicleRepository.updateAsIs(vehicle)
    await this.missionRepository.updateAsIs(mission)

    // send mail
    this.mailAPI.sendMissionInvoiceToClient(client.email, vehicle, client.name, professional.getFullName(), invoiceFile)
    this.mailAPI.sendMissionValidatedByClientToProfessional(professional.email, client.getFullName(), invoiceFile)
  }

  public async clientOpenDispute(loggedUser: User, missionId: string, reason: string): Promise<void> {
    const clientId = loggedUser._id.toString()

    // check if mission exists
    const mission = await this.missionRepository.findByIdAndClientId(missionId, clientId).getOrThrow(new MissionNotFoundException())

    // check that mission can be validated
    if (mission.status !== MissionStatuses.FINISHED) throw new ForbiddenException('Vous ne pouvez pas ouvrir un litige pour une mission non terminée')

    mission.openDispute(clientId, reason)
    await this.missionRepository.updateAsIs(mission)

    // and send mail to notifiy the admins
    const activeProfessionalId = mission.getRemainingActiveProfessionalIds()[0]
    const professional = await this.professionalRepository.findProfessionalById(activeProfessionalId).getOrThrow(new ProfessionalNotFoundException())

    await this.mailAPI.sendMissionClientOpenDisputeToAdmin(missionId, loggedUser, professional, reason)
  }

  public async cancelMission(missionId: string, cancelerId: string): Promise<Mission> {
    // check if mission exists
    const mission = await this.missionRepository.findById(missionId).getOrThrow(new MissionNotFoundException())

    // check whom is canceling the mission and if they're allowed to
    const { isCanceledByClient } = this.isCancelerAllowedToCancelTheMission(mission, cancelerId)

    // cancel mission
    const remainingActiveProfessionalIds = mission.cancel(isCanceledByClient)
    await this.missionRepository.updateAsIs(mission)

    // send mails
    const { vehicleData, client, selectedProfessionals } = (await this.findMissionsAllRelatedDocuments([mission]))[missionId]
    const remainingActiveProfessionals = isCanceledByClient
      ? selectedProfessionals.filter((pro) => remainingActiveProfessionalIds.includes(pro._id.toString()))
      : []

    await this.mailAPI.sendMissionCanceledEmail(vehicleData.vehicle, client, remainingActiveProfessionals, isCanceledByClient)

    return mission
  }

  public async userSendMessageTo(
    missionId: string,
    sender: User,
    receiverId: string,
    messageContent?: string,
    messageAttachment?: TBase64File
  ): Promise<void> {
    // check if mission exists
    const mission = await this.missionRepository.findById(missionId).getOrThrow(new MissionNotFoundException())

    // check if sender && receiver belongs to the mission
    const senderId = sender._id.toString()
    const isSenderTheClient = mission.clientRequest.clientId === senderId

    const professionalEntry = mission.getActiveProfessionalEntry(isSenderTheClient ? receiverId : senderId)
    const isSenderTheProfessional = !!professionalEntry

    // and that there is the client and a professional, not 2 of one kind
    if (!isSenderTheClient && !isSenderTheProfessional) throw new MissionNotFoundException()

    // upload attachment if there is one
    const attachment = messageAttachment
      ? (await this.uploadMissionAtachments([messageAttachment], senderId, mission.clientRequest.vehicleId, mission.getCreatedAt()))[0]
      : undefined

    // create the message
    professionalEntry.newMessage(messageContent, attachment, false, senderId, receiverId)

    // if there is an attachement and the message is sent by the user,
    // add it to the mission's global attachments
    // if (attachment && isSenderTheClient) mission.clientRequest.attachments.push(attachment)

    await this.missionRepository.updateAsIs(mission)

    // send mail
    const vehicle = await this.vehicleRepository.findById(mission.clientRequest.vehicleId).getOrThrow(new VehicleNotFoundException())
    const receiver = await this.userRepository.findById(receiverId).getOrThrow(new UserNotFoundException())

    await this.mailAPI.sendMissionNewMessageToReceiver(vehicle, sender.name, receiver)
  }

  public async setMessageAsSeen(missionId: string, user: User, professionalId: string, messageIndex: number): Promise<void> {
    // check if mission exists
    const mission = await this.missionRepository.findById(missionId).getOrThrow(new MissionNotFoundException())

    const userId = user._id.toString()

    // check that user belongs to the requested conversation
    if (userId !== mission.clientRequest.clientId && userId !== professionalId) throw new MissionNotFoundException()

    // get entry
    const professionalEntry = mission.getActiveProfessionalEntry(professionalId)
    if (messageIndex >= professionalEntry.messages.length) throw new BadRequestException("Ce message n'existe pas")

    // update and save data
    while (messageIndex >= 0 && !professionalEntry.messages[messageIndex].hasUserSeen(userId))
      professionalEntry.messages[messageIndex--].sawBy(userId)

    await this.missionRepository.updateAsIs(mission)
  }

  public async getClientMissions(
    clientId: string,
    options: { all?: boolean; onlyWithStatus?: MissionStatuses[]; excludeStatus?: MissionStatuses[] } = { excludeStatus: [MissionStatuses.CANCELED] }
  ): Promise<Mission[]> {
    // setup status filter if any
    const statusFilter: TDocumentMongoFilterQuery<MissionBlueprint> = options.all
      ? {}
      : options.excludeStatus
      ? { _status: { $nin: options.excludeStatus } }
      : options.onlyWithStatus
      ? { _status: { $in: options.onlyWithStatus } }
      : {}

    // fetch the missions
    const missions = await this.missionRepository.findMany({ '_clientRequest._clientId': clientId, ...statusFilter }).getOr([])

    return missions
  }

  public async getClientMissionById(clientId: string, missionId: string): Promise<Mission> {
    // fetch the mission
    return await this.missionRepository.findByIdAndClientId(missionId, clientId).getOrThrow(new MissionNotFoundException())
  }

  public async getProfessionalMissionsByProfessionalId(
    professionalId: string,
    whereProfessionalIsActiveOnly: boolean,
    options: { all?: boolean; onlyWithStatus?: MissionStatuses[]; excludeStatus?: MissionStatuses[] } = { excludeStatus: [MissionStatuses.CANCELED] }
  ): Promise<Mission[]> {
    const professional = await this.professionalRepository.findProfessionalById(professionalId).getOrThrow(new ProfessionalNotFoundException())

    // fetch the missions
    return this.getProfessionalMissions(professional, whereProfessionalIsActiveOnly, options)
  }

  public async getProfessionalMissions(
    professional: ProfessionalUser,
    whereProfessionalIsActiveOnly: boolean,
    options: { all?: boolean; onlyWithStatus?: MissionStatuses[]; excludeStatus?: MissionStatuses[] } = { excludeStatus: [MissionStatuses.CANCELED] }
  ): Promise<Mission[]> {
    // fetch the missions
    const missions = await this.getMissionsById(professional.professionalProfile.missionsId, options)

    if (whereProfessionalIsActiveOnly) {
      const professionalId = professional._id.toString()
      return missions.filter((mission) => mission.professionalEntries.find((entry) => entry.professionalId === professionalId)?.active)
    }

    return missions
  }

  public async getProfessionalMissionById(professional: ProfessionalUser, missionId: string): Promise<Mission> {
    // fetch the mission
    return await this.missionRepository.findByIdAndProfessionalId(missionId, professional._id.toString()).getOrThrow(new MissionNotFoundException())
  }

  public async getMissionsById(
    missionIds: string[],
    options: { all?: boolean; onlyWithStatus?: MissionStatuses[]; excludeStatus?: MissionStatuses[] } = { excludeStatus: [MissionStatuses.CANCELED] }
  ): Promise<Mission[]> {
    // setup status filter if any
    const statusFilter: TDocumentMongoFilterQuery<MissionBlueprint> = options.all
      ? {}
      : options.excludeStatus
      ? { _status: { $nin: options.excludeStatus } }
      : options.onlyWithStatus
      ? { _status: { $in: options.onlyWithStatus } }
      : {}

    return await this.missionRepository.findMany({ _id: { $in: missionIds }, ...statusFilter }).getOr([])
  }

  public async findMissionsAllRelatedDocuments(missions: Mission[]): Promise<Record<string, IMissionAllRelatedDocuments>> {
    const missionsProfessionals = await this.findMissionsRelatedProfessionals(missions)
    const missionsVehicleData = await this.findMissionsRelatedVehicleData(missions)
    const missionsClient = await this.findMissionsRelatedClient(missions)

    const map: Record<string, IMissionAllRelatedDocuments> = {}

    missions.forEach((mission) => {
      const missionId = mission._id.toString()

      map[missionId] = {
        client: missionsClient[missionId],
        vehicleData: missionsVehicleData[missionId],
        selectedProfessionals: missionsProfessionals[missionId],
      }
    })

    return map
  }

  public async findMissionsRelatedDocumentsAsProfessional(missions: Mission[]): Promise<Record<string, IMissionRelatedDocumentsAsProfessional>> {
    const missionsVehicleData = await this.findMissionsRelatedVehicleData(missions)
    const missionsClient = await this.findMissionsRelatedClient(missions)

    const map: Record<string, IMissionRelatedDocumentsAsProfessional> = {}

    missions.forEach((mission) => {
      const missionId = mission._id.toString()

      map[missionId] = {
        // find client
        client: missionsClient[missionId],
        // find vehicle
        vehicleData: missionsVehicleData[missionId],
      }
    })

    return map
  }

  public async findMissionsRelatedDocumentsAsClient(missions: Mission[]): Promise<Record<string, IMissionRelatedDocumentsAsClient>> {
    const missionsVehicleData = await this.findMissionsRelatedVehicleData(missions)
    const missionsProfessionals = await this.findMissionsRelatedProfessionals(missions)

    const map: Record<string, IMissionRelatedDocumentsAsClient> = {}

    missions.forEach((mission) => {
      const missionId = mission._id.toString()

      map[missionId] = {
        // find select professionals
        selectedProfessionals: missionsProfessionals[missionId],
        // find vehicle
        vehicleData: missionsVehicleData[missionId],
      }
    })

    return map
  }

  private async findMissionsRelatedProfessionals(missions: Mission[]): Promise<Record<string, ProfessionalUser[]>> {
    const missionsRelatedProfessionalIds: Array<string[]> = missions.map((mission) => mission.professionalEntries.map((pro) => pro.professionalId))

    const selectedProfessionalIds = missionsRelatedProfessionalIds.reduce((prev, current) => current.concat(prev), []).removeDuplicates()
    const selectedProfessionals = await this.professionalRepository.findProfessionalList(selectedProfessionalIds).getOr([])

    if (selectedProfessionals.length !== selectedProfessionalIds.length)
      throw new UserNotFoundException('Un ou plusieurs spécialistes sont introuvables')

    const map: Record<string, ProfessionalUser[]> = {}

    missions.forEach((mission) => {
      map[mission._id.toString()] = selectedProfessionals.filter((proUser) =>
        mission.professionalEntries.find((proEntry) => proEntry.professionalId === proUser._id.toString())
      )
    })

    return map
  }

  private async findMissionsRelatedClient(missions: Mission[]): Promise<Record<string, User>> {
    const professionalMissionsRelatedDocumentsIds: Array<{ clientId: string }> = missions.map((mission) => mission.clientRequest)

    const clientIds = professionalMissionsRelatedDocumentsIds.map((ids) => ids.clientId).removeDuplicates()
    const clients = await this.userRepository.findList(clientIds).getOr([])
    if (clients.length !== clientIds.length) throw new UserNotFoundException('Un ou plusieurs automobilistes sont introuvables')

    const map: Record<string, User> = {}

    missions.forEach((mission) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map[mission._id.toString()] = clients.find((client) => client._id.toString() === mission.clientRequest.clientId)!
    })

    return map
  }

  private async findMissionsRelatedVehicleData(missions: Mission[]): Promise<Record<string, { vehicle: Vehicle; brandName: string }>> {
    const missionsBasicRelatedDocumentsIds: Array<{ vehicleId: string }> = missions.map((mission) => ({
      vehicleId: mission.clientRequest.vehicleId,
    }))

    const vehicleIds = missionsBasicRelatedDocumentsIds.map((ids) => ids.vehicleId).removeDuplicates()
    const vehicles = await this.vehicleRepository.findList(vehicleIds).getOr([])

    const brandIds = vehicles.map((vehicle) => vehicle.brandId).removeDuplicates()
    const brands = await this.vehicleBrandRepository.findList(brandIds).getOr([])

    if (vehicles.length !== vehicleIds.length) throw new UserNotFoundException('Un ou plusieurs véhicules sont introuvables')

    const map: Record<string, { vehicle: Vehicle; brandName: string }> = {}

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    missions.forEach((mission) => {
      // find vehicle & brand
      const vehicle = vehicles.find((vehicle) => vehicle._id.toString() === mission.clientRequest.vehicleId)!

      map[mission._id.toString()] = {
        vehicle,
        brandName: brands.find((brand) => brand._id.toString() === vehicle.brandId)?.name || 'Marque inconnue',
      }
    })
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    return map
  }

  private async uploadMissionAtachments(
    attachments: TBase64File[],
    uploaderId: string,
    missionVehicleId: string,
    missionCreationDate: Date
  ): Promise<PublicFile[]> {
    const strDate = DatesUtils.getStrFromDate(missionCreationDate, 'dd-MM-yyyy')
    const filesPayload = attachments.map((file, index) => ({ content: file, name: `${missionVehicleId}_${strDate}_mission-attachment_${index}` }))
    const hostedFiles = await this.hostedFilesService.uploadMany(filesPayload, uploaderId, false)

    return hostedFiles.map((file) => file.toPublicFile())
  }

  private isCancelerAllowedToCancelTheMission(mission: Mission, cancelerId: string): { isCanceledByClient: boolean } {
    // check whom is canceling the mission and if they're allowed to
    // check if it's by client
    const isCanceledByClient = mission.clientRequest.clientId === cancelerId
    // else
    if (!isCanceledByClient) {
      const isCancelerAProfessionalOfTheMission = mission.professionalEntries.map((entry) => entry.professionalId).includes(cancelerId)

      // check if it's by a mission's professional
      if (!isCancelerAProfessionalOfTheMission) throw new MissionNotFoundException()
      const areAllMissionProfessionalsInactive = !!mission.getRemainingActiveProfessionalEntries().length
      // and that all other mission's professionals are inactive
      if (!areAllMissionProfessionalsInactive)
        throw new ForbiddenException(
          "Une mission ne peut pas être annulée par le retrait d'un spécialiste si d'autres spécialistes sont encore actifs"
        )
    }

    // check that it is in a cancelable state
    if (!mission.isInUpdatableState()) throw new HttpException('Vous ne pouvez pas annuler une mission commencée', 423 /* LOCKED */)

    return { isCanceledByClient }
  }

  @Interval(172800000) // every 48 hours: 48 * 60 * 60 * 1000
  private async automaticallyValidateOldCompletedAndNotUnvalidatedMissions(): Promise<void> {
    // if mission was completed more than 48 hours ago and still not validated or unvalidated, validate it
    const fourtyHeightHoursInMs = 172800000
    const completedAtLimit = new Date(Date.now() - fourtyHeightHoursInMs)

    // fetches missions
    const missionsToValidate = await this.missionRepository
      .findMany({
        _status: MissionStatuses.FINISHED,
        _dispute: { $nin: [undefined, ''] },
        _finishedAt: { $lte: completedAtLimit },
      })
      .getOr([])

    // fetches related data
    const clientsPerMission = await this.findMissionsRelatedClient(missionsToValidate)

    // validate them all
    for (const mission of missionsToValidate) {
      const missionId = mission._id.toString()
      const client = clientsPerMission[missionId]

      this.clientValidateMission(client, missionId)
    }
  }
}

/* eslint-disable @typescript-eslint/no-empty-interface */

export interface IMissionAllRelatedDocuments {
  vehicleData: { vehicle: Vehicle; brandName: string }
  selectedProfessionals: ProfessionalUser[]
  client: User
}
export interface IMissionRelatedVehicleData extends Omit<IMissionAllRelatedDocuments, 'client' | 'selectedProfessionals'> {}

export interface IMissionRelatedDocumentsAsClient extends Omit<IMissionAllRelatedDocuments, 'client'> {}

export interface IMissionRelatedDocumentsAsProfessional extends Omit<IMissionAllRelatedDocuments, 'selectedProfessionals'> {}
/* eslint-enable @typescript-eslint/no-empty-interface */
