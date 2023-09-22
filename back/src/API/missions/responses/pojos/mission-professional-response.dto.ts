import { LiteProfessionalResponse } from '@/common/request-io/responses-dto/user'
import { Message } from '@/schemas/common/pojos'
import { MissionProfessionalEntry, MissionProfessionalProposal } from '@/schemas/mission/pojos'
import { ProfessionalUser } from '@/schemas/user'
import { Expose, Type } from 'class-transformer'

export class MissionProfessionalEntryResponse {
  /* eslint-disable prettier/prettier */
  @Expose()                                           public professional: LiteProfessionalResponse
  @Expose() @Type(() => MissionProfessionalProposal)  public proposal?: MissionProfessionalProposal
  @Expose() @Type(() => Message)                      public messages: Message[]
  @Expose()                                           public active: boolean
  /* eslint-enable prettier/prettier */

  constructor(professionalUser: ProfessionalUser, missionProfessional: MissionProfessionalEntry) {
    this.professional = new LiteProfessionalResponse(professionalUser)
    this.proposal = missionProfessional.proposal
    this.messages = missionProfessional.messages
    this.active = missionProfessional.active
  }
}

export class OwnMissionProfessionalEntryResponse extends MissionProfessionalEntryResponse {
  @Expose() public privateNote?: string

  constructor(professionalUser: ProfessionalUser, missionProfessional: MissionProfessionalEntry) {
    super(professionalUser, missionProfessional)
    this.privateNote = missionProfessional.privateNote
  }
}
