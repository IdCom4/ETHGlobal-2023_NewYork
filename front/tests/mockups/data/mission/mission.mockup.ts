import { MissionProposalStatuses } from '@/types/API_models/missions/mission.enum'
import { liteJohnDoe } from '../missions.mockup'
import { quote } from './quote.mockup'

export const missionProfessionalProposal: IMissionProfessionalProposal = {
  startDate: '02/01/2023 10:30',
  status: MissionProposalStatuses.ACCEPTED,
  pickupAddress: {
    street: '2 rue Espiot',
    city: 'Bordeaux',
    zipCode: '33800',
    coordinates: [-51.2, -42.3]
  },
  quote: quote
}

export const missionProposal: IOwnMissionProfessionalEntry = {
  professional: liteJohnDoe,
  privateNote: 'ceci sont mes notes privées',
  proposal: missionProfessionalProposal,
  messages: [],
  active: true
}
