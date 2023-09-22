import { Message, MessageBlueprint, PublicFile, StrictAddress } from '@/schemas/common/pojos'
import { prop } from '@typegoose/typegoose'
import { MissionProfessionalProposal, MissionProfessionalProposalBlueprint, TMissionQuotePayload } from './mission-professional-proposal'
import { Type } from 'class-transformer'
import { BadRequestException } from '@nestjs/common'

export class MissionProfessionalEntry {
  /* eslint-disable prettier/prettier */
  @prop({ required: true, _id: false })                                            protected _professionalId: string
  @prop({ required: false, _id: false })                                           protected _privateNote?: string
  @prop({ required: false, _id: false })  @Type(() => MissionProfessionalProposal) protected _proposal?: MissionProfessionalProposal
  @prop({ required: true, _id: false })   @Type(() => Message)                     protected _messages: Message[] = []
  @prop({ required: true, _id: false })                                            protected _active: boolean
  /* eslint-enable prettier/prettier */

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(professionalId: string): MissionProfessionalEntry {
    const professional = new MissionProfessionalEntry()

    professional._professionalId = professionalId
    professional._active = true

    return professional
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get professionalId():  string                                         { return this._professionalId      }                               
  get privateNote():     string | undefined                             { return this._privateNote         }
  get proposal():        MissionProfessionalProposal | undefined        { return this._proposal            }
  get messages():        Message[]                                      { return this._messages            }
  get active():          boolean                                        { return this._active              }
  /* eslint-enable prettier/prettier */

  public updatePrivateNote(privateNote: string): void {
    this._privateNote = privateNote
  }

  public setNewProposal(startDate: Date, pickupAddress: StrictAddress, quote: TMissionQuotePayload): MissionProfessionalProposal {
    this._proposal = MissionProfessionalProposal.of(startDate, pickupAddress, quote)

    return this._proposal
  }

  public setAsChosen(): void {
    if (!this._active) throw new BadRequestException("Vous ne pouvez pas choisir un devis d'un spécialiste inactif")
    if (!this._proposal) throw new BadRequestException('Ce spécialiste ne vous a pas fait de proposition')

    this._proposal.accept()
  }

  public setInactive(): void {
    this._active = false
    if (this._proposal) this._proposal.deny()
  }

  public newMessage(
    content: string | undefined,
    attachment: PublicFile | undefined,
    bySystem: boolean,
    senderId?: string,
    receiverId?: string
  ): Message {
    const message = Message.of(this._messages.length, content, attachment, bySystem, senderId, receiverId)

    this._messages.push(message)

    return message
  }
}

export abstract class ChosenProfessionalEntry extends MissionProfessionalEntry {
  protected _proposal: MissionProfessionalProposal

  get proposal(): MissionProfessionalProposal {
    return this._proposal
  }
}

export abstract class MissionProfessionalEntryBlueprint extends MissionProfessionalEntry {
  public _professionalId: string
  public _privateNote?: string
  public _proposal?: MissionProfessionalProposalBlueprint
  public _messages: MessageBlueprint[]
  public _active: boolean
}
