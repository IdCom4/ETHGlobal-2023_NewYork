import { Sexes } from '@/types/constants/models/user'

export const JohnDoe: IProfessionalUser = {
  _id: '001',
  name: 'John',
  lastName: 'Doe',
  phone: '0605040302',
  email: 'john.doe@gmail.com',
  sex: Sexes.MAN,
  birthday: '01/01/1975 00:00',
  picture: {
    fileReferenceId: 'xxxxxxxxxxxxxxxxxxxxxxx',
    fileUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-XHbhDY5ZwNVcHm8z3sdNy_CU3HzTgrdIOw&usqp=CAU',
    fileExtension: 'image/jpeg'
  },
  homeAddress: {
    street: '7 Rue Saint-Jean',
    city: 'Aubusson, France',
    zipCode: '23200',
    coordinates: [45.953874, 2.169364]
  },
  billingAddress: {
    street: '9 Place Jean Giraudoux',
    city: 'Créteil, France',
    zipCode: '94000',
    coordinates: [48.784362, 2.44953]
  },
  notifications: [
    {
      title: 'Exemple de notification mission',
      message: "Voici une notification à propos d'une mission",
      link: '/client/missions/xxxxxxxxxxxxxxxxxxxxxxx',
      createdAt: '01/01/2023 18:00'
    },
    {
      title: 'Exemple de notification profil pro',
      message: 'Voici une notification à propos du profil pro',
      link: '/specialiste/profil/',
      createdAt: '05/01/2023 12:30'
    }
  ],
  vehiclesId: ['xxxxxxxxxxxxxxxxxxxxxxx'],
  createdAt: '01/01/0000 00:00',
  centerClientProfile: {
    bookingsId: ['xxxxxxxxxxxxxxxxxxxxxxx'],
    notificationPreferences: {
      bookingValidated: {
        email: true,
        sms: false
      },
      bookingCanceled: {
        email: true,
        sms: false
      }
    },
    customerId: 'xxxxxxxxxxxxxxxxxxxxxxx',
    cgu: true
  },
  missionClientProfile: {
    missionsId: ['xxxxxxxxxxxxxxxxxxxxxxx'],
    favoriteProfessionalsId: ['xxxxxxxxxxxxxxxxxxxxxxx'],
    notificationPreferences: {
      newQuoteReceived: {
        email: true,
        sms: true
      },
      missionFinished: {
        email: true,
        sms: true
      },
      newMissionProposal: {
        email: false,
        sms: false
      },
      missionCanceledByProfessional: {
        email: true,
        sms: false
      }
    },
    customerId: 'cus_MzIDaBWa7M1vfX',
    cgu: true
  },
  professionalProfile: {
    businessName: 'Terminacar',
    businessPicture: {
      fileReferenceId: 'xxxxxxxxxxxxxxxxxxxxxxx',
      fileURL: 'https://i.etsystatic.com/11143919/r/il/d5fb58/4218244338/il_794xN.4218244338_h93x.jpg',
      fileExtension: 'image/jpg'
    },
    businessPhone: '0604030201',
    businessEmail: 'terminacar.auto@gmail.com',
    businessPresentation: 'Asta la vista baby.',
    notificationPreferences: {
      newMissionReceived: {
        email: true,
        sms: true
      },
      newQuoteRequired: {
        email: false,
        sms: true
      },
      missionValidatedByClient: {
        email: true,
        sms: true
      },
      professionalDeniedByClient: {
        email: true,
        sms: false
      },
      missionCanceledByClient: {
        email: true,
        sms: false
      }
    },
    company: {
      siret: 'siret-number',
      legalForm: 'SARL',
      denomination: 'Terminacar',
      legalAddress: {
        street: '9 Place Jean Giraudoux',
        city: 'Créteil, France',
        zipCode: '94000',
        coordinates: [48.784362, 2.44953]
      },
      naf: 'naf'
    },
    workAddress: {
      street: '9 Place Jean Giraudoux',
      city: 'Créteil, France',
      zipCode: '94000',
      coordinates: [48.784362, 2.44953]
    },
    billingAddress: {
      street: '9 Place Jean Giraudoux',
      city: 'Créteil, France',
      zipCode: '94000',
      coordinates: [48.784362, 2.44953]
    },
    averageHourlyRate: 120,
    averageAvailability: 'Soirs uniquement',
    maxTravelDistance: 30,
    history: {
      studies: [
        {
          id: 0,
          schoolName: 'Math Sup',
          schoolAddress: {
            street: '9 Place Jean Giraudoux',
            city: 'Créteil, France',
            zipCode: '94000',
            coordinates: [48.784362, 2.44953]
          },
          grade: 'Dresseur de lion',
          dateRange: {
            begin: '01/05/1997',
            end: '30/04/1999'
          }
        }
      ],
      professionalExperiences: [
        {
          id: 0,
          enterprise: 'Titanic & Co',
          role: 'PDG',
          dateRange: {
            begin: '07/08/2000',
            end: '27/10/2005'
          }
        },
        {
          id: 1,
          enterprise: 'Renault',
          role: 'Standardiste',
          dateRange: {
            begin: '12/11/2006',
            end: '14/03/2010'
          }
        }
      ],
      realisations: [
        {
          id: 0,
          title: 'Dompteur de lion en freelance',
          description: "J'emenais mes lions chez les particuliers et leur faisait une démonstration",
          files: [
            {
              fileReferenceId: 'xxxxxxxxxxxxxxxxxxxxxxx',
              fileURL:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv7VWyL88g7zVdNPDL2uryJ4HF52Yuq_lFsTHHqJ_mRsBI5oWl7oQBNMNOpafGI8G1Hwo&usqp=CAU',
              fileExtension: 'image/jpeg'
            },
            {
              fileReferenceId: 'xxxxxxxxxxxxxxxxxxxxxxx',
              fileURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSitF-O0C0YuxW2v8YNraRaxspe2jvi7KcsOg&usqp=CAU',
              fileExtension: 'image/jpeg'
            },
            {
              fileReferenceId: 'xxxxxxxxxxxxxxxxxxxxxxx',
              fileURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
              fileExtension: 'video/mp4'
            }
          ]
        }
      ]
    },
    curriculum: {
      fileReferenceId: 'xxxxxxxxxxxxxxxxxxxxxxx',
      fileURL: 'https://media.mycvfactory.com/images/V1_CV-32_jpeg.original.jpg',
      fileExtension: 'image/jpg'
    },
    insurance: {
      fileReferenceId: 'xxxxxxxxxxxxxxxxxxxxxxx',
      fileURL: 'https://www.companeo.com/ibb/fr_FR/guide/2014/06/assurance_multirisque/assurance_professionnelle_contrat_entreprise.jpg',
      fileExtension: 'image/jpg'
    },
    missionsId: ['xxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxx'],
    clientReviews: [
      {
        rating: 4,
        date: '01/01/2023 22:15',
        message: 'Super prestation, la voiture roule',
        userId: 'xxxxxxxxxxxxxxxxxxxxxxx',
        userName: 'Laurel'
      },
      {
        rating: 2,
        date: '01/03/2023 09:42',
        message: 'la voiture roule, mais pas très bonne prestation',
        userId: 'xxxxxxxxxxxxxxxxxxxxxxx',
        userName: 'Hardi'
      }
    ],
    isFavoriteOf: ['xxxxxxxxxxxxxxxxxxxxxxx'],
    professionalPaymentData: {
      iban: 'FR76xxxxxxxxxxxxxxxxxxxxxxx',
      documentationType: 'iban',
      additionalDocumentation: false,
      pastDue: [],
      status: 'SUCCESS',
      accountId: 'some-account-id'
    },
    nbrFinishedMissions: 5,
    skillIds: ['some-skill-id'],
    completionScore: 100,
    vmcCertified: true,
    ecologicalCharter: true
  }
}

export const allUsers: IUser[] = [JohnDoe]
