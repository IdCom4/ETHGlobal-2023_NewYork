import { StrictAddress, StrictAddressBlueprint } from '@/schemas/common/pojos'
import { prop } from '@typegoose/typegoose'
import { MissionQuote, MissionQuoteBlueprint, TMissionQuoteProduct } from './mission-quote'
import { Expose, Type } from 'class-transformer'
import { BadRequestException } from '@nestjs/common/exceptions'
import '@/extensions'
import { MissionProposalStatuses } from '@/common/enums/schemas'

export class MissionProfessionalProposal {
  /* eslint-disable prettier/prettier */
  @prop({ required: true, _id: false }) @Expose({ name: 'status' })                                     protected _status: MissionProposalStatuses
  @prop({ required: true, _id: false }) @Expose({ name: 'startDate' })                                  protected _startDate: Date
  @prop({ required: true, _id: false }) @Expose({ name: 'pickupAddress' })  @Type(() => StrictAddress)  protected _pickupAddress: StrictAddress
  @prop({ required: true, _id: false }) @Expose({ name: 'quote' })          @Type(() => MissionQuote)   protected _quote: MissionQuote
  /* eslint-enable prettier/prettier */

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(startDate: Date, pickupAddress: StrictAddress, quote: TMissionQuotePayload): MissionProfessionalProposal {
    const proposal = new MissionProfessionalProposal()

    if (startDate.isBefore(new Date())) throw new BadRequestException('La date de prise en charge du véhicule doit être ultérieur à maintenant')

    proposal._startDate = startDate
    proposal._pickupAddress = pickupAddress
    proposal._quote = MissionQuote.of(quote.tvaRate, quote.workForces, quote.consumables, quote.placeAndEquipments)

    proposal._status = MissionProposalStatuses.SENT

    return proposal
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get status():         MissionProposalStatuses  { return this._status                 }
  get startDate():      Date                { return this._startDate          }
  get pickupAddress():  StrictAddress       { return this._pickupAddress      }
  get quote():          MissionQuote        { return this._quote              }
  /* eslint-enable prettier/prettier */

  public accept(): void {
    this._status = MissionProposalStatuses.ACCEPTED
  }

  public deny(): void {
    this._status = MissionProposalStatuses.DENIED
  }
}

export abstract class MissionProfessionalProposalBlueprint extends MissionProfessionalProposal {
  public _status: MissionProposalStatuses
  public _startDate: Date
  public _pickupAddress: StrictAddressBlueprint
  public _quote: MissionQuoteBlueprint
}

export type TMissionQuotePayload = {
  tvaRate: number
  workForces: TMissionQuoteProduct[]
  consumables: TMissionQuoteProduct[]
  placeAndEquipments: TMissionQuoteProduct[]
}
