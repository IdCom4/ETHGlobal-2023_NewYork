import { MissionProposalStatuses, MissionStatuses } from '@/common/enums/schemas'
import { TimestampedDBDocument } from '../db-document.abstract-schema'
import { PaymentData, StrictAddress, Review } from '../common/pojos'
import { ChosenProfessionalEntry, MissionClientRequest, MissionProfessionalEntry, MissionReport, TMissionQuotePayload } from './pojos'
import { Severity, modelOptions, prop } from '@typegoose/typegoose'
import { Type } from 'class-transformer'
import { BadRequestException, ForbiddenException, InternalServerErrorException } from '@nestjs/common'
import { MissionNotFoundException } from '@/common/exceptions/schemas/mission'
import { PaymentProviderStatuses } from '@/common/enums'
import { MissionClientFeedback } from '@Schemas/mission/pojos'

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class Mission extends TimestampedDBDocument {
  /* eslint-disable prettier/prettier */
  @prop({ required: true, _id: false })                                           protected _status: MissionStatuses
  @prop({ required: false, _id: false })  @Type(() => PaymentData)                protected _paymentData?: PaymentData
  @prop({ required: true, _id: false })   @Type(() => MissionClientRequest)       protected _clientRequest: MissionClientRequest
  @prop({ required: true, _id: false })   @Type(() => MissionProfessionalEntry)   protected _professionalEntries: MissionProfessionalEntry[]
  @prop({ required: false, _id: false })  @Type(() => MissionReport)              protected _report?: MissionReport
  @prop({ required: false, _id: false })                                          protected _invoiceId?: string
  @prop({ required: false, _id: false })                                          protected _adminRequiredAction?: string
  @prop({ required: false, _id: false })                                          protected _adminNote?: string
  @prop({ required: false, _id: false })                                          protected _dispute?: string
  @prop({ required: false, _id: false })  @Type(() => MissionClientFeedback)      protected _clientFeedback?: MissionClientFeedback
  @prop({ required: false, _id: false })                                          protected _startedAt?: Date
  @prop({ required: false, _id: false })                                          protected _finishedAt?: Date
  @prop({ required: false, _id: false })                                          protected _deliveredAt?: Date
  @prop({ required: false, _id: false })                                          protected _canceledAt?: Date
  @prop({ required: false, _id: false })                                          protected _canceledByClient?: boolean
  /* eslint-enable prettier/prettier */

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(clientRequest: MissionClientRequest, professionalIds: string[]): Mission {
    const mission = new Mission()

    mission._status = MissionStatuses.WAITING_FOR_QUOTE
    mission._clientRequest = clientRequest
    mission._professionalEntries = professionalIds.map((id) => MissionProfessionalEntry.of(id))

    return mission
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get status():                 MissionStatuses                           { return this._status                }
  get paymentData():            PaymentData | undefined                   { return this._paymentData           }
  get clientRequest():          MissionClientRequest                      { return this._clientRequest         }
  get professionalEntries():    MissionProfessionalEntry[]                { return this._professionalEntries   }
  get report():                 MissionReport | undefined                 { return this._report                }
  get invoiceId():              string | undefined                        { return this._invoiceId             }
  get adminRequiredAction():    string | undefined                        { return this._adminRequiredAction   }
  get adminNote():              string | undefined                        { return this._adminNote             }
  get dispute():                string | undefined                        { return this._dispute               }
  get clientFeedback():         MissionClientFeedback | undefined         { return this._clientFeedback        }
  get startedAt():              Date | undefined                          { return this._startedAt             }
  get finishedAt():             Date | undefined                          { return this._finishedAt            }
  get deliveredAt():            Date | undefined                          { return this._deliveredAt           }
  get canceledAt():             Date | undefined                          { return this._canceledAt            }
  get canceledByClient():       boolean | undefined                       { return this._canceledByClient      }
  /* eslint-enable prettier/prettier */

  public setInvoiceId(invoiceId: string): void {
    this._invoiceId = invoiceId
  }

  // TODO : Voir pour mettre le chosen professional en tant que propriété de la mission
  public getChosenProfessionalEntry(): ChosenProfessionalEntry {
    if (!this.isInAlreadyStartedState()) throw new BadRequestException('Cette mission ne contient pas encore de spécialiste attitré')
    const entry = this._professionalEntries.find((entry) => entry.proposal?.status === MissionProposalStatuses.ACCEPTED)
    if (!entry || !entry.proposal) throw new InternalServerErrorException("La mission n'a pas de spécialiste attitré")

    return entry as ChosenProfessionalEntry
  }

  /**
   * Fetches the provided professionalId related entry
   * @param professionalId the id of the professional
   * @returns the entry of the professional
   *
   * @throws {MissionNotFoundException} if provided id doesn't belong to one of mission's professionals
   */
  public getProfessionalEntry(professionalId: string): MissionProfessionalEntry {
    const entry = this._professionalEntries.find((entry) => entry.professionalId === professionalId)

    if (!entry) throw new MissionNotFoundException()

    return entry
  }

  public getRemainingActiveProfessionalIds(): string[] {
    return this.getRemainingActiveProfessionalEntries().map((entry) => entry.professionalId)
  }

  public getRemainingActiveProfessionalEntries(): MissionProfessionalEntry[] {
    return this._professionalEntries.filter((entry) => entry.active)
  }

  public setAdminRequiredAction(action: string): void {
    this._adminRequiredAction = action
  }

  public setAdminNote(note: string): void {
    this._adminNote = note
  }

  public isOnDispute(): boolean {
    return !!this._dispute
  }

  public isInUpdatableState(): boolean {
    return this._status === MissionStatuses.WAITING_FOR_QUOTE || this._status === MissionStatuses.QUOTE_PENDING
  }

  public isInAlreadyStartedState(): boolean {
    return this._status === MissionStatuses.IN_PROGRESS || this._status === MissionStatuses.FINISHED || this._status === MissionStatuses.DELIVERED
  }

  /* >==== MAIN METHODS ====> */

  /**
   * Deny a professional its participation in the mission
   * @param professionalId The id of the professional to deny
   *
   * @throws {ForbiddenException} if mission is not updatable anymore (mission has started already)
   * @throws {MissionNotFoundException} if provided id doesn't belong to one of mission's professionals
   * @throws {BadRequestException} if professional is not active anymore
   */
  public denyProfessional(professionalId: string): void {
    if (!this.isInUpdatableState()) throw new ForbiddenException('Vous ne pouvez plus refuser de spécialiste pour cette mission')

    const proposal = this.getActiveProfessionalEntry(professionalId)
    proposal.setInactive()
  }

  /**
   * Deny a professional its participation in the mission
   * @remarks Checks that the provided id belongs to one of mission's professionals, and that he can refuse it
   *
   * @param professionalId the id of the professional refusing the mission
   * @returns the inactive entry of the professional
   *
   * @throws {MissionNotFoundException} if provided id doesn't belong to one of mission's professionals
   * @throws {BadRequestException} if professional has already refused mission
   * @throws {ForbiddenException} if a mission is no longer refusable
   */
  public setProfessionalAsRefusingTheMission(professionalId: string): MissionProfessionalEntry {
    const entry = this.getActiveProfessionalEntry(professionalId)

    if (!this.isInUpdatableState()) throw new ForbiddenException('Vous ne pouvez plus refuser cette mission')

    entry.setInactive()

    return entry
  }

  /**
   * Create or update professional's proposal, if it can be done
   * @param professionalId the id of the professional updating his proposal
   * @param proposalPayload the payload of the proposal
   * @returns {MissionProfessionalEntry} The updated professional's entry
   *
   * @throws {MissionNotFoundException} if provided id doesn't belong to one of mission's professionals
   * @throws {BadRequestException} if professional is not active anymore
   * @throws {ForbiddenException} if a mission is no longer updatable
   */
  public professionalSendNewProposal(professionalId: string, proposalPayload: IMissionProfessionalProposalPayload): MissionProfessionalEntry {
    const professionalEntry = this.getActiveProfessionalEntry(professionalId)

    //TODO: Do not forget to uncomment this line
    // if (!this.isInUpdatableState()) throw new ForbiddenException('Vous ne pouvez plus proposer de devis pour cette mission')

    const { startDate, pickupAddress, quote } = proposalPayload
    professionalEntry.setNewProposal(startDate, pickupAddress, quote)

    this._status = MissionStatuses.QUOTE_PENDING

    return professionalEntry
  }

  public updatePaymentData(payment: { paymentId: string; status: PaymentProviderStatuses }): void {
    if (!this._paymentData) this._paymentData = PaymentData.of(payment.paymentId, payment.status)
    else this._paymentData.update(payment.status, payment.paymentId)
  }

  /**
   * Select a professional and start the mission, if it can be done
   * @param selectedProfessionalId the id of the selected professional
   *
   * @throws {MissionNotFoundException} if provided id doesn't belong to one of mission's professionals
   * @throws {BadRequestException} if professional is not active anymore
   * @throws {ForbiddenException} if mission cannot be started
   * @returns {String} the ids of all the rejected professionals
   */
  public start(selectedProfessionalId: string): string[] {
    // check that professional belongs to the mission and is active
    const selectedProfessionalEntry = this.getActiveProfessionalEntry(selectedProfessionalId)
    selectedProfessionalEntry.setAsChosen()

    // check that mission is in quote pending state
    if (this._status !== MissionStatuses.QUOTE_PENDING)
      throw new ForbiddenException("Vous ne pouvez pas commencez une mission n'ayant pas de devis en attente")

    // get rejected professionals entries
    const notSelectedProfessionalEntries = this.getRemainingActiveProfessionalEntries().filter(
      (entry) => entry.professionalId !== selectedProfessionalId
    )

    // set them as inactive
    notSelectedProfessionalEntries.forEach((entry) => entry.setInactive())

    // set mission as started
    this._status = MissionStatuses.IN_PROGRESS

    // return rejected professionals ids
    return notSelectedProfessionalEntries.map((entry) => entry.professionalId)
  }

  /**
   * Sets a mission as finished and create its report
   * @param professionalId The professional finishing the mission
   * @param vehicleMileage The mileage of the vehicle at the end of the mission
   * @param interventionIds An Id list of the registered intervention performed by the professional during the mission
   * @param otherInterventions A list of all the unregistered intervention performed by the professional during the mission
   *
   * @throws {MissionNotFoundException} if provided id doesn't belong to one of mission's professionals
   * @throws {BadRequestException} if professional is not active anymore
   * @throws {ForbiddenException} if the mission is not in progress
   *
   * @returns true if everything went well
   */
  public finish(professionalId: string, vehicleMileage: number, interventionIds: string[], otherInterventions: string[]): void {
    // check that the professional belongs to the mission and is active
    this.getActiveProfessionalEntry(professionalId)

    // check mission status
    if (this._status !== MissionStatuses.IN_PROGRESS) throw new ForbiddenException('Vous ne pouvez terminer une mission que si elle est en cours')

    // set report
    this._report = MissionReport.of(vehicleMileage, interventionIds, otherInterventions)

    // set the status
    this._status = MissionStatuses.FINISHED
  }

  /**
   * Sets a mission as unvalidated
   * @param clientId The mission client id
   * @param reason The reason why the client is opening a dispute
   *
   * @throws {MissionNotFoundException} if provided id doesn't belong to the mission's client
   */
  public openDispute(clientId: string, reason: string): void {
    // check that client is indeed the client
    if (this.clientRequest.clientId !== clientId) throw new MissionNotFoundException()

    // check that mission can be unvalidated
    if (this._status !== MissionStatuses.FINISHED) throw new ForbiddenException('Vous ne pouvez pas invalider une mission non terminée')

    this._dispute = reason
  }

  /**
   * Sets a mission as validated
   * @param clientId The mission client id
   * @param reviewOfProfessional The client review of its experience with the professional
   * @param reviewOfWebsite The client review of its experience on the website
   *
   * @throws {MissionNotFoundException} if provided id doesn't belong to the mission's client
   */
  public validateByClient(clientId: string, reviewOfProfessional?: Review, reviewOfWebsite?: Review): void {
    // check that client is indeed the client
    if (this.clientRequest.clientId !== clientId) throw new MissionNotFoundException()

    // check that mission can be validated
    if (this._status !== MissionStatuses.FINISHED) throw new ForbiddenException('Vous ne pouvez pas valider une mission non terminée')

    this._dispute = undefined
    this._clientFeedback = MissionClientFeedback.of(reviewOfProfessional, reviewOfWebsite)
    this._status = MissionStatuses.DELIVERED
    this._deliveredAt = new Date()
  }

  /**
   * Cancels the mission, set all professionals to inactive, and returns a list of id of all professionals that were still active
   *
   * @param canceledByClient a value to indicate if the mission is canceled by user action
   * @returns an id list of all professionals that were still active
   */
  public cancel(canceledByClient: boolean): string[] {
    if (this._canceledAt) throw new BadRequestException('Mission déjà annulée')

    this._canceledAt = new Date()
    this._canceledByClient = canceledByClient

    const remainingActiveProfessionals = this.getRemainingActiveProfessionalEntries()
    remainingActiveProfessionals.forEach((entry) => entry.setInactive())

    this._status = MissionStatuses.CANCELED

    return remainingActiveProfessionals.map((entry) => entry.professionalId)
  }

  /**
   * Fetches the provided professionalId related active entry
   * @param professionalId the id of the professional
   * @returns the entry of the professional
   *
   * @throws {MissionNotFoundException} if provided id doesn't belong to one of mission's professionals
   * @throws {BadRequestException} if professional is not active anymore
   */
  public getActiveProfessionalEntry(professionalId: string): MissionProfessionalEntry {
    const entry = this.getProfessionalEntry(professionalId)

    if (!entry.active) throw new BadRequestException('Ce spécialiste ne participe plus à cette mission')

    return entry
  }
}

export interface IMissionProfessionalProposalPayload {
  startDate: Date
  pickupAddress: StrictAddress
  quote: TMissionQuotePayload
}
