import { MissionStatuses, MissionProposalStatuses } from '@/assets/ts/enums'
import { JohnDoe } from './users.mockup'

// FIRST MISSION

export const firstClientFile: IPublicFile = {
  fileExtension: 'image/jpg',
  fileReferenceId: '1',
  fileURL: 'https://www.cic.fr/partage/fr/CC/CIC-2015/assets/produits/contrat-entretien-auto/entete_917x400.jpg'
}
export const firstClientAdress: IStrictAddress = { street: '2 rue Espiot', city: 'Bordeaux', zipCode: '33800', coordinates: [0, 0] }
export const firstClientIssues: IIssue[] = [
  { _id: 'xxxx000001', label: 'Plaquettes', skillIds: ['xxxx000001', 'xxxx000002', 'xxxx000003'] },
  { _id: 'xxxx000002', label: 'Frein', skillIds: ['xxxx000001', 'xxxx000002', 'xxxx000003'] },
  { _id: 'xxxx000003', label: 'Disques', skillIds: ['xxxx000001', 'xxxx000002', 'xxxx000003'] }
]
export const firstClientVehicle: IOwnerVehicle = {
  _id: '001',
  ownerId: '001',
  plate: 'xx-456-xx',
  brand: 'Ferrari',
  model: 'Spider',
  year: 2015,
  mileage: 25160,
  /* pictures: [
    {
      fileExtension: 'image/jpg',
      fileURL:
        'https://static.fnac-static.com/multimedia/Images/FR/MDM/62/a4/38/3712098/1505-1/tsp20221130222341/Vehicule-Bb-Junior-Ferrari-Touch-Go-458-Italia-Rouge.jpg',
      fileReferenceId: 'xxxx0016'
    },
    {
      fileExtension: 'image/jpg',
      fileURL: 'https://www.icon-icon.com/wp-content/uploads/2021/05/bulletproof-ferrari-458-speciale-by-addarmor-front-view.jpg',
      fileReferenceId: 'xxxx0017'
    },
    {
      fileExtension: 'image/jpg',
      fileURL: 'https://images.ctfassets.net/uaddx06iwzdz/207RLctjDYKwKVAv1Zgc29/002ae010eb3ea37ca4356a3bc6217f50/ferrari-458-spider-l-01.jpg',
      fileReferenceId: 'xxxx0018'
    }
  ], */
  invoiceIds: []
}

export const mockedStrictAddress: IStrictAddress = {
  street: '43 rue Lafayette',
  city: 'Blois',
  zipCode: '41000',
  coordinates: [0, 0]
}

export const liteJohnDoe: ILiteProfessionalUser = {
  _id: 'some-id',
  name: 'John',
  lastName: 'Doe',
  picture: firstClientFile,
  professionalProfile: {
    businessName: JohnDoe.professionalProfile.businessName,
    businessPicture: JohnDoe.professionalProfile.businessPicture,
    businessPresentation: JohnDoe.professionalProfile.businessPresentation,
    workAddress: JohnDoe.professionalProfile.workAddress,
    averageHourlyRate: JohnDoe.professionalProfile.averageHourlyRate,
    averageAvailability: JohnDoe.professionalProfile.averageAvailability,
    maxTravelDistance: JohnDoe.professionalProfile.maxTravelDistance,
    skillIds: JohnDoe.professionalProfile.skillIds || [],
    history: JohnDoe.professionalProfile.history,
    curriculum: JohnDoe.professionalProfile.curriculum,
    insurance: JohnDoe.professionalProfile.insurance,
    nbrFinishedMissions: JohnDoe.professionalProfile.nbrFinishedMissions,
    clientReviews: JohnDoe.professionalProfile.clientReviews,
    isFavoriteOf: JohnDoe.professionalProfile.isFavoriteOf.length,
    completionScore: JohnDoe.professionalProfile.completionScore
  }
}

export const firstClientRequest: IPopulatedMissionClientRequest = {
  attachments: [
    {
      fileExtension: 'image/jpg',
      fileURL:
        'https://static.fnac-static.com/multimedia/Images/FR/MDM/62/a4/38/3712098/1505-1/tsp20221130222341/Vehicule-Bb-Junior-Ferrari-Touch-Go-458-Italia-Rouge.jpg',
      fileReferenceId: 'xxxx0016'
    },
    {
      fileExtension: 'image/jpg',
      fileURL: 'https://www.icon-icon.com/wp-content/uploads/2021/05/bulletproof-ferrari-458-speciale-by-addarmor-front-view.jpg',
      fileReferenceId: 'xxxx0017'
    },
    {
      fileExtension: 'image/jpg',
      fileURL: 'https://images.ctfassets.net/uaddx06iwzdz/207RLctjDYKwKVAv1Zgc29/002ae010eb3ea37ca4356a3bc6217f50/ferrari-458-spider-l-01.jpg',
      fileReferenceId: 'xxxx0018'
    }
  ],
  client: liteJohnDoe,
  description: 'Dort dans le garage pour tenir companie à sa voiture',
  hadSpareParts: true,
  idealPickupAddress: firstClientAdress,
  idealStartingMoment: 'Dès que possible',
  issues: firstClientIssues,
  issueIds: ['5ef10158ce735b5c94b22e26', '5ef10158ce735b5c94b22e27', '5ef10158ce735b5c94b22e28'],
  maxDistance: 10,
  vehicle: firstClientVehicle
}
export const firstProfessionalFile: IPublicFile = {
  fileReferenceId: '2',
  fileURL:
    'https://thumbs.dreamstime.com/b/homme-d-affaires-amusant-en-voiture-retard-pour-une-r%C3%A9union-un-jeune-%C3%A9nerv%C3%A9-et-fatigu%C3%A9-conduit-est-se-rencontrer-brune-de-161053426.jpg',
  fileExtension: 'image/jpg'
}

export const workForces: IMissionQuoteProduct[] = [
  {
    description: 'Jeune homme capable',
    quantity: 2,
    unitPriceHT: 100
  },
  {
    description: 'Pinoccio vient chez toi',
    quantity: 1,
    unitPriceHT: 299
  },
  {
    description: 'Weekend à Saint Denis',
    quantity: 2000,
    unitPriceHT: 4
  },
  {
    description: 'Sejour sur Namek',
    quantity: 45,
    unitPriceHT: 9877
  },
  {
    description: 'Création de rêve',
    quantity: 3,
    unitPriceHT: 27
  }
]
export const firstQuote: IMissionQuote = {
  workForces: [
    {
      description: 'Jeune homme capable',
      quantity: 2,
      unitPriceHT: 100
    }
  ],
  consumables: [
    {
      description: 'rabibochage',
      quantity: 1000,
      unitPriceHT: 0.1
    },
    {
      description: 'joint de culasse',
      quantity: 2,
      unitPriceHT: 599
    }
  ],
  placeAndEquipments: [],
  totalHT: 0,
  tvaRate: 0,
  totalTTCToClient: 6,
  VMCFees: 0,
  totalTTCToProfessional: 0,
  sentAt: '04/10/1997 11:00'
}
export const firstProposal: IMissionProfessionalProposal = {
  status: MissionProposalStatuses.SENT,
  startDate: '04/10/2024 15:00',
  pickupAddress: firstClientAdress,
  quote: firstQuote
}

export const mockedCardInfo: IMissionCardInfo<ILiteUser> = {
  issues: firstClientIssues,
  pickupAddress: firstClientAdress,
  specialInfo: 'une info de ouf',
  startDate: 'Des que possible',
  user: liteJohnDoe,
  userId: 'lmolololololo',
  missionId: 'egezgez'
}

export const firstProfessional: Array<IMissionProfessionalEntry> = [
  {
    active: true,
    messages: [],
    professional: liteJohnDoe,
    proposal: firstProposal
  }
]

export const ownProfessionalEntry: Array<IOwnMissionProfessionalEntry> = [
  {
    active: true,
    privateNote: 'hello world',
    messages: [],
    professional: liteJohnDoe,
    proposal: firstProposal
  }
]

//SECOND MISISON

export const secondClientFile: IPublicFile = {
  fileExtension: 'image/jpg',
  fileReferenceId: '1',
  fileURL: 'https://jardiprotec.fr/4808-tm_thickbox_default/jarre-hammamet-avec-anses-3-hauteurs.jpg'
}

export const liteJeanMichel: ILiteProfessionalUser = {
  _id: 'some-id',
  name: 'Jean',
  lastName: 'Michel',
  picture: secondClientFile,
  professionalProfile: {
    businessName: JohnDoe.professionalProfile.businessName,
    businessPicture: JohnDoe.professionalProfile.businessPicture,
    businessPresentation: JohnDoe.professionalProfile.businessPresentation,
    workAddress: JohnDoe.professionalProfile.workAddress,
    averageHourlyRate: JohnDoe.professionalProfile.averageHourlyRate,
    averageAvailability: JohnDoe.professionalProfile.averageAvailability,
    maxTravelDistance: JohnDoe.professionalProfile.maxTravelDistance,
    skillIds: JohnDoe.professionalProfile.skillIds || [],
    history: JohnDoe.professionalProfile.history,
    curriculum: JohnDoe.professionalProfile.curriculum,
    insurance: JohnDoe.professionalProfile.insurance,
    nbrFinishedMissions: JohnDoe.professionalProfile.nbrFinishedMissions,
    clientReviews: JohnDoe.professionalProfile.clientReviews,
    isFavoriteOf: JohnDoe.professionalProfile.isFavoriteOf.length,
    completionScore: JohnDoe.professionalProfile.completionScore
  }
}
export const secondClientAdress: IStrictAddress = { street: '43 rue Lafayette', city: 'Blois', zipCode: '41000', coordinates: [0, 0] }
export const secondClientIssues: IIssue[] = [
  {
    _id: 'xxxx000004',
    label: 'Lavage',
    skillIds: ['xxxx000001', 'xxxx000002', 'xxxx000003']
  },
  {
    _id: 'xxxx000005',
    label: 'Jantes',
    skillIds: ['xxxx000001', 'xxxx000002', 'xxxx000003']
  },
  {
    _id: 'xxxx000006',
    label: 'Detailing',
    skillIds: ['xxxx000001', 'xxxx000002', 'xxxx000003']
  }
]
export const secondClientVehicle: IOwnerVehicle = {
  _id: '002',
  ownerId: '001',
  plate: 'yy-789-yy',
  brand: 'Tesla',
  model: 'Model S',
  year: 2020,
  mileage: 15000,
  invoiceIds: []
}
export const secondClientRequest: IPopulatedMissionClientRequest = {
  attachments: [
    {
      fileReferenceId: '9',
      fileURL: 'https://www.automobile-magazine.fr/asset/cms/205366/config/152936/la-lamborghini-sian-fkp-37-a-lechelle-11-realisee-par-lego.jpg',
      fileExtension: 'image/jpg'
    }
  ],
  client: liteJeanMichel,
  description: 'dort dans le garage',
  hadSpareParts: false,
  idealPickupAddress: secondClientAdress,
  idealStartingMoment: 'La semaine prochaine',
  issues: secondClientIssues,
  issueIds: ['5ef10158ce735b5c94b22e29', '5ef10158ce735b5c94b22e2a'],
  maxDistance: 60,
  vehicle: secondClientVehicle
}
export const secondProfessionalFile: IPublicFile = {
  fileReferenceId: '3',
  fileURL: 'https://www.lemagdelentreprise.com/images/dossiers/2022-04/ouvrir-garage-auto-062818.jpg',
  fileExtension: 'image/jpg'
}
export const secondQuote: IMissionQuote = {
  workForces: [
    {
      description: 'Robin des bois',
      quantity: 1,
      unitPriceHT: 10
    }
  ],
  consumables: [
    {
      description: 'Arc',
      quantity: 1,
      unitPriceHT: 3499
    },
    {
      description: 'Fleches',
      quantity: 51,
      unitPriceHT: 3
    }
  ],
  placeAndEquipments: [],
  totalHT: 0,
  tvaRate: 0,
  totalTTCToClient: 0,
  VMCFees: 0,
  totalTTCToProfessional: 0,
  sentAt: '04/10/1997 11:00'
}
export const secondProposal: IMissionProfessionalProposal = {
  status: MissionProposalStatuses.SENT,
  startDate: '22/09/2023 09:30',
  pickupAddress: mockedStrictAddress,
  quote: secondQuote
}
export const secondProfessional: Array<IMissionProfessionalEntry> = [
  {
    active: true,
    messages: [],
    professional: liteJohnDoe,
    proposal: secondProposal
  }
]

//Third Mission

const thirdProdessionals: IMissionProfessionalEntry[] = [
  {
    active: true,
    messages: [],
    professional: liteJohnDoe,
    proposal: firstProposal
  },
  {
    active: true,
    messages: [],
    professional: liteJohnDoe,
    proposal: firstProposal
  },
  {
    active: true,
    messages: [],
    professional: liteJohnDoe,
    proposal: firstProposal
  }
]

export const thirdMission: IPopulatedMission = {
  _id: 'xxxx000003',
  status: MissionStatuses.QUOTE_PENDING,
  clientRequest: firstClientRequest,
  professionalEntries: thirdProdessionals,
  createdAt: '04/10/1997 11:00'
}
export const fourthMission: IPopulatedMission = {
  _id: 'xxxx000004',
  status: MissionStatuses.WAITING_FOR_QUOTE,
  clientRequest: secondClientRequest,
  professionalEntries: firstProfessional,
  createdAt: '04/10/1997 11:00'
}

export const populatedMissions: Array<IPopulatedMission> = [
  {
    _id: 'xxxx000001',
    status: MissionStatuses.IN_PROGRESS,
    clientRequest: firstClientRequest,
    professionalEntries: firstProfessional,
    createdAt: '04/10/1997 11:00'
  },
  {
    _id: 'xxxx000002',
    status: MissionStatuses.FINISHED,
    clientRequest: secondClientRequest,
    professionalEntries: secondProfessional,
    createdAt: '04/10/1997 11:00'
  },
  thirdMission,
  fourthMission
]

export const missions: Array<IMission> = [
  {
    _id: 'xxxx000001',
    status: MissionStatuses.IN_PROGRESS,
    clientRequest: firstClientRequest,
    professionalEntries: firstProfessional,
    createdAt: '04/10/1997 11:00'
  },
  {
    _id: 'xxxx000002',
    status: MissionStatuses.FINISHED,
    clientRequest: secondClientRequest,
    professionalEntries: secondProfessional,
    createdAt: '04/10/1997 11:00'
  },
  thirdMission,
  fourthMission
]

export const professionalMissions: Array<IProfessionalMission> = [
  {
    _id: 'xxxx000001',
    status: MissionStatuses.IN_PROGRESS,
    clientRequest: firstClientRequest,
    professionalEntries: [ownProfessionalEntry[0]],
    createdAt: '04/10/1997 11:00'
  },
  {
    _id: 'xxxx000002',
    status: MissionStatuses.FINISHED,
    clientRequest: secondClientRequest,
    professionalEntries: [ownProfessionalEntry[0]],
    createdAt: '04/10/1997 11:00'
  }
]
