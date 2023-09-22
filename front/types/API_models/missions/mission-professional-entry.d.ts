import { MissionProposalStatuses } from './mission.enum.d'

export {}

declare global {
  interface IMessage {
    index: number
    content?: string
    attachment?: IPublicFile
    senderId?: string
    receiverId?: string
    bySystem: boolean
    sentAt: string
    seenByAt: Record<string, string>
  }

  interface IMissionProfessionalEntry {
    professional: ILiteProfessionalUser
    proposal?: IMissionProfessionalProposal
    messages: IMessage[]
    active: boolean
  }

  interface IMissionCompleteProfessionalEntry extends IMissionProfessionalEntry {
    proposal: IMissionProfessionalProposal
  }

  interface IOwnMissionProfessionalEntry extends IMissionProfessionalEntry {
    privateNote?: string
  }

  interface IMissionProfessionalProposal {
    status: MissionProposalStatuses
    startDate: string
    pickupAddress: IStrictAddress
    quote: IMissionQuote
  }

  interface IMissionQuote {
    workForces: IMissionQuoteProduct[]
    consumables: IMissionQuoteProduct[]
    placeAndEquipments: IMissionQuoteProduct[]
    totalHT: number
    tvaRate: number
    totalTTCToClient: number
    VMCFees: number
    totalTTCToProfessional: number
    sentAt: string
  }

  interface IMissionQuoteProduct {
    description: string
    quantity: number
    unitPriceHT: number
  }
}
