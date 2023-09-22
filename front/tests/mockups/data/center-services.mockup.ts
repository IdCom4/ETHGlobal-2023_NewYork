import { CenterServiceOptionCategories } from '@/types/constants/centers/center-services'
//TODO: nutrition sièges en cuir faire option
//TODO: formule qui se retrouve en tant que service (Rayure profonde par exemple), on gère comment ?
const centerServices: Array<ICenterService> = [
  {
    id: 'xxxx000016',
    title: 'Lavage intérieur & exterieur',
    numberOfSales: 999,
    subtitle: `Haute pression`,
    prices: {
      priceTTC2Seats: 119,
      priceTTC5Seats: 169,
      priceTTC7Seats: 239
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Lavage+interieur+exterieur/Lavage-interieur-exterieur-Tesla-2-2.webp',
    alt: 'lavage intérieur extérieur Tesla',
    description: [
      {
        title: 'Lavage haute pression :',
        steps: ['Produit jantes', 'Prélavage', 'Lavage', 'Rinçage', 'Finition eau osmosée']
      },
      {
        title: 'Nettoyage des contours de porte et de coffre',
        steps: []
      },
      {
        title: 'Aspiration habitacle :',
        steps: ['Sièges', 'Moquettes', 'Tapis']
      },
      {
        title: 'Nettoyage des plastiques intérieurs :',
        steps: ['Tableau de bord', 'Intérieurs de portes', 'Console centrale']
      },
      {
        title: 'Nettoyage des vitres et pare-brise :',
        steps: ['Intérieur', 'Extérieur']
      }
    ],
    isActive: true,
    serviceCategories: ['WASH'],
    optionsIds: [
      // 'opt-serv_14',
      // 'opt-serv_16',
      // 'opt-serv_15',
      // 'opt-serv_18',
      // 'opt-serv_17',
      // 'opt-serv_21',
      // 'opt-serv_22',
      // 'opt-serv_23',
      // 'opt-serv_24',
      // 'opt-serv_02',
      // 'opt-serv_06',
      // 'opt-serv_07',
      // 'opt-serv_08',
      // 'opt-serv_09',
      // 'opt-serv_11',
      // 'opt-serv_12',
      // 'opt-serv_13',
      // 'opt-serv_03',
      // 'opt-serv_35',
      // 'opt-serv_39',
      // 'opt-serv_30',
      // 'opt-serv_31',
      // 'opt-serv_32',
      // 'opt-serv_33',
      // 'opt-serv_27',
      // 'opt-serv_26',
      // 'opt-serv_28',
      // 'opt-serv_29',
      // 'opt-serv_42'
    ]
  },
  {
    id: 'xxxx000015',
    title: 'Lavage exterieur haute-pression',
    numberOfSales: 16,
    subtitle: '',
    prices: {
      priceTTC2Wheels: 29,
      priceTTC2Seats: 39,
      priceTTC5Seats: 49,
      priceTTC7Seats: 59
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Lavage+exterieur+haute+pression/Lavage+exterieur+haute+pression_Toyota+Yaris.webp',
    alt: 'lavage extérieur Haute Pression Toyota Yarris',
    description: [
      {
        title: 'Lavage haute pression :',
        steps: ['Produit jantes', 'Prélavage', 'Lavage', 'Rinçage', 'Finition eau osmosée']
      },
      {
        title: 'Nettoyage des contours de porte et de coffre',
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['WASH'],
    optionsIds: [
      // 'opt-serv_14',
      // 'opt-serv_16',
      // 'opt-serv_15',
      // 'opt-serv_18',
      // 'opt-serv_17',
      // 'opt-serv_21',
      // 'opt-serv_22',
      // 'opt-serv_23',
      // 'opt-serv_24',
      // 'opt-serv_35',
      // 'opt-serv_39',
      // 'opt-serv_30',
      // 'opt-serv_31',
      // 'opt-serv_32',
      // 'opt-serv_33',
      // 'opt-serv_27',
      // 'opt-serv_26',
      // 'opt-serv_28',
      // 'opt-serv_29',
      // 'opt-serv_42',
      // 'opt-serv_38'
    ]
  },
  {
    id: 'xxxx000014',
    title: 'Lavage exterieur à la main',
    numberOfSales: 5,
    subtitle: '',
    prices: {
      priceTTC2Wheels: 99,
      priceTTC2Seats: 129,
      priceTTC5Seats: 139,
      priceTTC7Seats: 169
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Lavage+exterieur+%C3%A0+la+main/Lavage+exterieur+%C3%A0+la+main_Porsche+911+SC+Targa-bleu.webp',
    alt: 'lavage à la main Porsche 911',
    description: [
      {
        title: 'Lavage exterieur à la main :',
        steps: [
          'Nettoyage manuel des jantes',
          'Prélavage carrosserie',
          'Lavage carrosserie à la main (technique des 2 seaux)',
          "Rinçage à l'eau osmosée",
          'Cire de protection',
          'Finition osmosée'
        ]
      },
      {
        title: 'Séchage :',
        steps: ['Séchage manuel', 'Séchage à air']
      }
    ],
    isActive: true,
    serviceCategories: ['WASH'],
    optionsIds: [
      // 'opt-serv_15',
      // 'opt-serv_18',
      // 'opt-serv_17',
      // 'opt-serv_21',
      // 'opt-serv_22',
      // 'opt-serv_23',
      // 'opt-serv_24',
      // 'opt-serv_35',
      // 'opt-serv_39',
      // 'opt-serv_30',
      // 'opt-serv_31',
      // 'opt-serv_32',
      // 'opt-serv_33',
      // 'opt-serv_27',
      // 'opt-serv_26',
      // 'opt-serv_28',
      // 'opt-serv_29',
      // 'opt-serv_42',
      // 'opt-serv_38'
    ]
  },
  {
    id: 'xxxx000013',
    title: 'Nettoyage interieur',
    numberOfSales: 2,
    subtitle: '',
    prices: {
      priceTTC2Seats: 89,
      priceTTC5Seats: 129,
      priceTTC7Seats: 189
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Nettoyage+interieur/Nettoyage-interieur-exterieur-vW-Tiguan-2-2.webp',
    alt: 'Nettoyage interieur Tiguan',
    description: [
      {
        title: 'Aspiration habitacle :',
        steps: ['Sièges', 'Moquettes', 'Tapis']
      },
      {
        title: 'Nettoyage des plastiques interieurs :',
        steps: ['Tableau de bord', 'Interieurs de portes', 'Console centrale']
      },
      {
        title: 'Nettoyage des vitres et parebrise :',
        steps: ['Interieur', 'Exterieur']
      }
    ],
    isActive: true,
    serviceCategories: ['WASH'],
    optionsIds: [
      // 'opt-serv_02',
      // 'opt-serv_06',
      // 'opt-serv_07',
      // 'opt-serv_08',
      // 'opt-serv_09',
      // 'opt-serv_11',
      // 'opt-serv_12',
      // 'opt-serv_13',
      // 'opt-serv_03',
      // 'opt-serv_27'
    ]
  },
  {
    id: 'xxxx000012',
    title: 'Traitement céramique',
    numberOfSales: 80,
    subtitle: '(véhicules sans défaut) 1 passe',
    prices: {
      priceTTC2Wheels: 599,
      priceTTC2Seats: 999,
      priceTTC5Seats: 1099,
      priceTTC7Seats: 1499
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Traitement+c%C3%A9ramique/Pose-de-c%C3%A9ramique-Jaguar-XKR-noire-13_3.webp',
    alt: 'Traitement céramique Jaguar noire',
    description: [
      {
        title: 'Préparation au polissage :',
        steps: [
          'Prélavage carrosserie',
          'Lavage à la main parties basses',
          'Lavage à la main parties hautes',
          'Décontamination de la carrosserie',
          'Masquage des parties à proteger'
        ]
      },
      {
        title: "Polissage de l'ensemble de la carrosserie (1 passe)",
        steps: []
      },
      {
        title: 'Préparation post polissage :',
        steps: ['Suppression du masquage', 'Nettoyage de la poussière de polissage']
      },
      {
        title: "Rinçage à l'eau osmosée",
        steps: []
      },
      {
        title: 'Application de la protection céramique (1 couche)',
        steps: []
      },
      {
        title: 'Essuyage de la protection céramique',
        steps: []
      },
      {
        title: 'Séchage de la protection céramique',
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['DETAILING'],
    optionsIds: [
      // 'opt-serv_14',
      // 'opt-serv_21',
      // 'opt-serv_22',
      // 'opt-serv_23',
      // 'opt-serv_24',
      // 'opt-serv_34',
      // 'opt-serv_35',
      // 'opt-serv_40',
      // 'opt-serv_41',
      // 'opt-serv_31',
      // 'opt-serv_32',
      // 'opt-serv_33',
      // 'opt-serv_26',
      // 'opt-serv_42'
    ]
  },
  {
    id: 'xxxx000011',
    title: 'Car Staging',
    numberOfSales: 0,
    subtitle: 'Préparation à la vente',
    prices: {
      priceTTC2Seats: 279,
      priceTTC5Seats: 349,
      priceTTC7Seats: 419
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Car+Staging+-+Pr%C3%A9paration+%C3%A0+la+vente/Car+Staging-Pr%C3%A9paration+%C3%A0+la+vente+-+Peugeot+207.webp',
    alt: 'Staging peugeot 207',
    description: [
      {
        title: 'Lavage exterieur à la main :',
        steps: [
          'Nettoyage manuel des jantes',
          'Prélavage carrosserie',
          'Lavage carrosserie à la main (technique des 2 seaux)',
          "Rinçage à l'eau osmosée",
          'Cire de protection',
          'Finition osmosée'
        ]
      },
      {
        title: 'Séchage :',
        steps: ['Séchage manuel', 'Séchage à air']
      },
      {
        title: 'Nettoyage des contours de porte et de coffre',
        steps: []
      },
      {
        title: 'Aspiration habitacle :',
        steps: ['Sièges', 'Moquettes', 'Tapis']
      },
      {
        title: 'Nettoyage des plastiques interieurs :',
        steps: ['Tableau de bord', 'Interieurs de portes', 'Console centrale']
      },
      {
        title: 'Nettoyage manuel des vitres et parebrise :',
        steps: ['Interieur', 'Exterieur']
      },
      {
        title: 'Aspiration et shampouinage du coffre',
        steps: []
      },
      {
        title: 'Shampouinage interieur :',
        steps: ['Sièges', 'Moquettes', 'Tapis']
      },
      {
        title: 'Nettoyage des plastiques interieurs :',
        steps: ['Tableau de bord', 'Interieurs de portes', 'Console centrale']
      }
    ],
    isActive: true,
    serviceCategories: ['WASH'],
    optionsIds: [
      // 'opt-serv_01',
      // 'opt-serv_02',
      // 'opt-serv_03',
      // 'opt-serv_04',
      // 'opt-serv_05',
      // 'opt-serv_06',
      // 'opt-serv_07',
      // 'opt-serv_08',
      // 'opt-serv_09',
      // 'opt-serv_11',
      // 'opt-serv_12',
      // 'opt-serv_13',
      // 'opt-serv_14',
      // 'opt-serv_10',
      // 'opt-serv_15',
      // 'opt-serv_16',
      // 'opt-serv_17',
      // 'opt-serv_18',
      // 'opt-serv_19',
      // 'opt-serv_20',
      // 'opt-serv_21',
      // 'opt-serv_22',
      // 'opt-serv_23',
      // 'opt-serv_24',
      // 'opt-serv_26',
      // 'opt-serv_27',
      // 'opt-serv_28',
      // 'opt-serv_29',
      // 'opt-serv_30',
      // 'opt-serv_31',
      // 'opt-serv_32',
      // 'opt-serv_33',
      // 'opt-serv_34',
      // 'opt-serv_35',
      // 'opt-serv_36',
      // 'opt-serv_37',
      // 'opt-serv_38',
      // 'opt-serv_39',
      // 'opt-serv_40',
      // 'opt-serv_41',
      // 'opt-serv_42'
    ]
  },
  {
    id: 'xxxx000010',
    title: 'Retour de leasing',
    numberOfSales: 7,
    subtitle: '',
    prices: {
      priceTTC2Seats: 199,
      priceTTC5Seats: 249,
      priceTTC7Seats: 329
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Retour+de+leasing/Retour+de+leasing+-Citroen-C4-Aircoss-2.webp',
    alt: 'Retour de leasing Citroen C4',
    description: [
      {
        title: 'Lavage haute pression :',
        steps: ['Produit jantes', 'Prélavage', 'Lavage', 'Rinçage', 'Finition eau osmosée']
      },
      {
        title: 'Nettoyage des contours de porte et de coffre',
        steps: []
      },
      {
        title: 'Aspiration habitacle :',
        steps: ['Sièges', 'Moquettes', 'Tapis']
      },
      {
        title: 'Aspiration et shampouinage du coffre',
        steps: []
      },
      {
        title: 'Shampouinage interieur :',
        steps: ['Sièges', 'Moquettes', 'Tapis']
      },
      {
        title: 'Nettoyage des plastiques interieurs :',
        steps: ['Tableau de bord', 'Interieurs de portes', 'Console centrale']
      }
    ],
    isActive: true,
    serviceCategories: ['WASH'],
    optionsIds: [
      // 'opt-serv_14',
      // 'opt-serv_23',
      // 'opt-serv_24',
      // 'opt-serv_39',
      // 'opt-serv_40',
      // 'opt-serv_41',
      // 'opt-serv_06',
      // 'opt-serv_07',
      // 'opt-serv_08',
      // 'opt-serv_09',
      // 'opt-serv_11',
      // 'opt-serv_13',
      // 'opt-serv_27'
    ]
  },
  {
    id: 'xxxx00009',
    title: 'Polissage',
    numberOfSales: 50,
    subtitle: 'Carrosserie complète (1 passe)',
    prices: {
      priceTTC2Wheels: 299,
      priceTTC2Seats: 549,
      priceTTC5Seats: 649,
      priceTTC7Seats: 749
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Polissage+carrosserie+coml%C3%A8te+-+1+passe/Polissage+carrosserie_Alfa+Delta+Integrale.webp',
    alt: 'Polissage carrosserie complète Alfa Delta',
    description: [
      {
        title: 'Préparation au polissage :',
        steps: [
          'Prélavage carrosserie',
          'Lavage à la main parties basses',
          'Lavage à la main parties hautes',
          'Décontamination de la carrosserie',
          'Masquage des parties à protéger'
        ]
      },
      {
        title: "Polissage de l'ensemble de la carrosserie (1 passe)",
        steps: []
      },
      {
        title: 'Préparation post polissage :',
        steps: ['Suppression du masquage', 'Nettoyage de la poussière de polissage']
      },
      {
        title: "Rinçage à l'eau osmosée",
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['DETAILING'],
    optionsIds: []
  },
  {
    id: 'xxxx00008',
    title: 'Polissage',
    numberOfSales: 10,
    subtitle: '1 élément - 1 passe',
    prices: {
      priceTTC2Wheels: 99,
      priceTTC2Seats: 99,
      priceTTC5Seats: 99,
      priceTTC7Seats: 99
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Polissage+1+%C3%A9l%C3%A9ment+-+1+passe/Polissage-carroserie-Golf-7-GTI-blanche-2_3.webp',
    alt: 'Polissage un élément Golf 7 GTI',
    description: [
      {
        title: "Préparation de l'élément :",
        steps: ['Prélavage carrosserie', "Lavage à la main de l'élément", "Décontamination de l'élément", 'Masquage des parties à protéger']
      },
      {
        title: "Polissage de l'élément (1 passe)",
        steps: []
      },
      {
        title: 'Préparation post polissage :',
        steps: ['Suppression du masquage', 'Nettoyage de la poussière de polissage']
      },
      {
        title: "Rinçage à l'eau osmosée",
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['RENOVATION']
  },
  {
    id: 'xxxx00007',
    title: 'Lustrage',
    numberOfSales: 16,
    subtitle: 'Carrosserie complète (1 passe)',
    prices: {
      priceTTC2Wheels: 299,
      priceTTC2Seats: 499,
      priceTTC5Seats: 499,
      priceTTC7Seats: 599
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Lustrage+carrosserie+compl%C3%A8te+-+1+passe/Lustrage+carrosserie_Ferrari+348.webp',
    alt: 'Lustrage carrosserie complète Ferrari 348',
    description: [
      {
        title: 'Préparation au lustrage :',
        steps: [
          'Prélavage carrosserie',
          'Lavage à la main parties basses',
          'Lavage à la main parties hautes',
          'Décontamination de la carrosserie',
          'Masquage des parties à protéger'
        ]
      },
      {
        title: "Lustrage de l'ensemble de la carrosserie (1 passe)",
        steps: []
      },
      {
        title: 'Préparation post lustrage :',
        steps: ['Suppression du masquage', 'Nettoyage de la poussière de lustrage']
      },
      {
        title: "Rinçage à l'eau osmosée",
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['DETAILING']
  },
  {
    id: 'xxxx00006',
    title: 'Lustrage',
    numberOfSales: 5,
    subtitle: '1 élément - 1 passe',
    prices: {
      priceTTC2Wheels: 79,
      priceTTC2Seats: 79,
      priceTTC5Seats: 79,
      priceTTC7Seats: 79
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Lustrage+1+%C3%A9l%C3%A9ment+-+1+passe/Lustrage+carrosserie_Porsche+930+rouge.webp',
    alt: 'Lustrage un élément Porsche 930 rouge',
    description: [
      {
        title: "Préparation de l'élément :",
        steps: ['Prélavage carrosserie', "Décontamination de l'élément", 'Masquage des parties à protéger']
      },
      {
        title: "Lustrage de l'élément (1 passe)",
        steps: []
      },
      {
        title: 'Préparation post lustrage :',
        steps: ['Suppression du masquage', 'Nettoyage de la poussière de lustrage']
      },
      {
        title: "Rinçage à l'eau osmosée",
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['RENOVATION']
  },
  {
    id: 'xxxx00005',
    title: 'Polissage et Lustrage',
    numberOfSales: 2,
    subtitle: '(1 passe) - Carrosserie complète',
    prices: {
      priceTTC2Wheels: 499,
      priceTTC2Seats: 949,
      priceTTC5Seats: 999,
      priceTTC7Seats: 1299
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Polissage+(1+passe)+et+Lustrage+(1+passe)+-+Carrosserie+compl%C3%A8te/Polissage+carrosserie+-Porsche-Boxster-S_3.webp',
    alt: 'Polissage et lustrage, carrosserie complète Porsche Boxster',
    description: [
      {
        title: 'Préparation de la carrosserie :',
        steps: [
          'Prélavage carrosserie',
          'Lavage à la main parties basses',
          'Lavage à la main parties hautes',
          'Décontamination de la carrosserie',
          'Masquage des parties à protéger'
        ]
      },
      {
        title: "Polissage de l'ensemble de la carrosserie (1 passe)",
        steps: []
      },
      {
        title: 'Nettoyage de la poussière de polissage',
        steps: []
      },
      {
        title: "Lustrage de l'ensemble de la carrosserie (1 passe)",
        steps: []
      },
      {
        title: 'Préparation post lustrage :',
        steps: ['Suppression du masquage', 'Nettoyage de la poussière de polissage']
      },
      {
        title: "Rinçage à l'eau osmosée",
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['RENOVATION']
  },
  {
    id: 'xxxx00004',
    title: 'Polissage et Lustrage',
    numberOfSales: 11,
    subtitle: ' (1 passe) - 1 élément',
    prices: {
      priceTTC2Wheels: 149,
      priceTTC2Seats: 149,
      priceTTC5Seats: 149,
      priceTTC7Seats: 149
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Polissage+(1+passe)+et+Lustrage+(1+passe)+-+1+%C3%A9l%C3%A9ment/Polissage+carrosserie+-BMW-M3e46-jaune_1.webp',
    alt: 'Polissage et lustrage un élément, BMW M3e46 jaune',
    description: [
      {
        title: "Préparation de l'élément :",
        steps: ['Prélavage carrosserie', "Lavage à la main de l'élément", "Décontamination de l'élément", 'Masquage des parties à protéger']
      },
      {
        title: "Polissage de l'élément (1 passe)",
        steps: []
      },
      {
        title: 'Nettoyage de la poussière de polissage',
        steps: []
      },
      {
        title: "Lustrage de l'élément (1 passe)",
        steps: []
      },
      {
        title: 'Préparation post polissage :',
        steps: ['Suppression du masquage', 'Nettoyage de la poussière de polissage']
      },
      {
        title: "Rinçage à l'eau osmosée",
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['RENOVATION']
  },
  {
    id: 'xxxx00003',
    title: 'Rénovation de phares',
    numberOfSales: 12,
    subtitle: '(Polissage de 2 phares)',
    prices: {
      priceTTC2Wheels: 69,
      priceTTC2Seats: 69,
      priceTTC5Seats: 69,
      priceTTC7Seats: 69
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/R%C3%A9novation+2+phares+(Polissage)/R%C3%A9novation-de-phare-Porsche-996-GT3-RS.webp',
    alt: 'Polissage deux phares Porsche 996',
    description: [
      {
        title: 'Nettoyage des phares',
        steps: []
      },
      {
        title: 'Polissage des phares',
        steps: []
      },
      {
        title: 'Nettoyage de la poussière de polissage',
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['RENOVATION']
  },
  {
    id: 'xxxx00002',
    title: 'Stickage',
    numberOfSales: 0,
    subtitle: '',
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Stickage/Pose-de-covering-Fiat-500-noire-2_3.webp',
    alt: 'Stickage sur une fiat 500 noire',
    description: [
      {
        title: 'Pose dde films décoratifs',
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['OTHER']
  },
  {
    id: 'xxxx00001',
    title: 'Destickage',
    numberOfSales: 0,
    subtitle: '',
    picture: 'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Services+esth%C3%A9tiques/Destickage/Destickage-Fiat-500-noire.webp',
    alt: 'Destickage fiat 500 noire',
    description: [
      {
        title: 'Suppression de films décoratifs',
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['OTHER']
  },
  {
    id: 'xxxx000017',
    title: 'Nettoyage moteur',
    numberOfSales: 0,
    subtitle: '(vapeur)',
    prices: {
      priceTTC2Wheels: 39,
      priceTTC2Seats: 69,
      priceTTC5Seats: 69,
      priceTTC7Seats: 69
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Lavage+moteur+-+Ferrari+F430.webp',
    alt: 'Nettoyage moteur Ferrari F430',
    description: [
      {
        title: 'Nettoyage du moteur à la vapeur',
        steps: []
      },
      {
        title: 'Nettoyage des parties accessibles au pinceau et/ou à la microfibre',
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['OTHER']
  },
  {
    id: 'xxxx000018',
    title: 'Lavage chassis',
    numberOfSales: 0,
    subtitle: '(vapeur)',
    prices: {
      priceTTC2Seats: 99,
      priceTTC5Seats: 99,
      priceTTC7Seats: 99
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Lavage+chassis+-+Mitsubishi+Lancer+Evo+rouge+-+1.webp',
    alt: 'Lavage chassis Mitsubishi rouge',
    description: [
      {
        title: 'Placement du véhicule sur un pont à verrins',
        steps: []
      },
      {
        title: 'Pulvérisation de savon au canon à mousse',
        steps: []
      },
      {
        title: 'Brossage manuel des parties accessibles',
        steps: []
      },
      {
        title: "Rinçage à l'eau claire",
        steps: []
      }
    ],
    isActive: true,
    serviceCategories: ['OTHER']
  },
  //TODO: SHOULD be an option
  // {
  //   id: 'xxxx000019',
  //   title: 'Désinfection air habitacle',
  //   numberOfSales: 0,
  //   subtitle: '',
  //   prices: {
  //     priceTTC2Seats: 79,
  //     priceTTC5Seats: 79,
  //     priceTTC7Seats: 79
  //   },
  //   picture: '',
  //   alt: '',
  //   isActive: true
  // },

  //TODO: Should be an option
  // {
  //   id: 'xxxx000020',
  //   title: 'Nettoyage des sièges',
  //   numberOfSales: 0,
  //   subtitle: 'En cuire',
  //   prices: {
  //     priceTTC2Seats: 39,
  //     priceTTC5Seats: 59,
  //     priceTTC7Seats: 79
  //   },
  //   picture: '',
  //   alt: '',
  //   isActive: true
  // },

  //TODO: Should be an option
  // {
  //   id: 'xxxx000022',
  //   title: 'Nutrition des sièges',
  //   numberOfSales: 0,
  //   subtitle: 'En cuire',
  //   prices: {
  //     priceTTC2Seats: 39,
  //     priceTTC5Seats: 59,
  //     priceTTC7Seats: 79
  //   },
  //   picture: '',
  //   alt: '',
  //   isActive: true
  // },
  {
    id: 'xxxx000023',
    title: 'Supression des rayures',
    numberOfSales: 0,
    subtitle: 'Sur devis',
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Suppression-de-rayures_1.webp',
    alt: 'Suppression de rayures sur voiture grise',
    description: [
      {
        title: 'Poli-lustrage de la rayure',
        steps: []
      }
    ],
    isActive: true
  },
  {
    id: 'xxxx000020',
    title: 'Suppression des bosses',
    numberOfSales: 0,
    subtitle: '',
    description: [
      {
        title: 'Débosselage manuel',
        steps: []
      }
    ],
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Suppression_de_bosse_-Porsche-911-991-Carrera-4-GTS-rouge-3-1.webp',
    alt: 'Suppression de bosse sur Porsche 911',
    isActive: true,
    serviceCategories: ['RENOVATION']
  },

  //TODO: Should be an option
  // {
  //   id: 'xxxx000021',
  //   title: 'Nettoyage & nutrition des sièges',
  //   numberOfSales: 0,
  //   subtitle: 'En cuire',
  //   prices: {
  //     priceTTC2Seats: 59,
  //     priceTTC5Seats: 99,
  //     priceTTC7Seats: 119
  //   },
  //   picture: '',
  //   alt: '',
  //   isActive: true
  // },
  {
    id: 'xxxx000021',
    title: 'Detailing',
    numberOfSales: 0,
    subtitle: '',
    description: [
      {
        title: 'Travail dans le détail exterieur et/ ou interieur',
        steps: []
      }
    ],
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Detailing+-+Ford+Mustang+.webp',
    alt: 'Detailing sur Ford Mustang',
    isActive: true,
    serviceCategories: ['DETAILING']
  },
  {
    id: 'xxxx000024',
    title: 'Rénovation 1 phare',
    numberOfSales: 0,
    subtitle: '(Polissage)',
    description: [
      {
        title: 'Nettoyage du phare',
        steps: []
      },
      {
        title: 'Polissage du phare',
        steps: []
      },
      {
        title: 'Nettoyage de la poussière de polissage',
        steps: []
      }
    ],
    prices: {
      priceTTC2Wheels: 49,
      priceTTC2Seats: 49,
      priceTTC5Seats: 49,
      priceTTC7Seats: 49
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Polissage-1-phare-Suzuki-Swift.webp',
    alt: 'Polissage un phare Suzuki',
    isActive: true,
    serviceCategories: ['RENOVATION']
  },
  {
    id: 'xxxx000024',
    title: 'Rénovation 1 phare',
    numberOfSales: 0,
    subtitle: '(Ponçage + Polissage)',
    description: [
      {
        title: 'Nettoyage du phare',
        steps: []
      },
      {
        title: 'Ponçage manuel',
        steps: []
      },
      {
        title: 'Nettoyage du phare',
        steps: []
      },
      {
        title: 'Polissage du phare',
        steps: []
      },
      {
        title: 'Nettoyage de la poussière de polissage',
        steps: []
      }
    ],
    prices: {
      priceTTC2Wheels: 69,
      priceTTC2Seats: 69,
      priceTTC5Seats: 69,
      priceTTC7Seats: 69
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Poncage-Polissage-1-phare-Citroen-SM-noire.webp',
    alt: 'Ponçage et polissage un phare Citroen SM',
    isActive: true,
    serviceCategories: ['RENOVATION']
  },
  {
    id: 'xxxx000024',
    title: 'Rénovation 2 phares',
    numberOfSales: 0,
    subtitle: '(Ponçage + Polissage)',
    description: [
      {
        title: 'Nettoyage des phares',
        steps: []
      },
      {
        title: 'Ponçage manuel',
        steps: []
      },
      {
        title: 'Nettoyage des phares',
        steps: []
      },
      {
        title: 'Polissage des phares',
        steps: []
      },
      {
        title: 'Nettoyage de la poussière de polissage',
        steps: []
      }
    ],
    prices: {
      priceTTC2Wheels: 99,
      priceTTC2Seats: 99,
      priceTTC5Seats: 99,
      priceTTC7Seats: 99
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Poncage-Polissage-2-phares-Renault-Clio-4-RS-jaune.webp',
    alt: 'Ponçage et polissage deux phares Renault',
    isActive: true,
    serviceCategories: ['RENOVATION']
  },
  {
    id: 'xxxx000025',
    title: 'Lavage intérieur & extérieur',
    numberOfSales: 0,
    subtitle: 'À la main',
    description: [
      {
        title: 'Lavage extérieur à la main :',
        steps: [
          'Nettoyage manuel des jantes',
          'Prélavage carrosserie',
          'Lavage carrosserie à la main (technique des 2 seaux)',
          "Rinçage à l'eau osmosée",
          'Cire de protection',
          'Finition osmosée'
        ]
      },
      {
        title: 'Séchage :',
        steps: ['Séchage manuel', 'Séchage à air']
      },
      {
        title: 'Nettoyage des contours de porte et de coffre',
        steps: []
      },
      {
        title: 'Aspiration habitacle :',
        steps: ['Sièges', 'Moquettes', 'Tapis']
      },
      {
        title: 'Nettoyage des plastiques intérieurs :',
        steps: ['Tableau de bord', 'Intérieurs de portes', 'Console centrale']
      },
      {
        title: 'Nettoyage des vitres et pare-brise :',
        steps: ['Intérieur', 'Extérieur']
      }
    ],
    prices: {
      priceTTC2Seats: 199,
      priceTTC5Seats: 249,
      priceTTC7Seats: 349
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Lavage+%C3%A0+la+main+-+BMW+M5.webp',
    alt: 'Lavage extérieur à la main BMW M5',
    isActive: true,
    serviceCategories: ['WASH']
  },
  {
    id: 'xxxx000026',
    title: 'Rayure profonde - Poli-Lustrage',
    numberOfSales: 0,
    subtitle: "Jusqu'à 30 cm",
    description: [
      {
        title: "Préparation de l'élément :",
        steps: ['Prélavage carrosserie', "Lavage à la main de l'élément", "Décontamination de l'élément", 'Masquage des parties à protéger']
      },
      {
        title: "Ponçage de l'élément",
        steps: []
      },
      {
        title: "Nettoyage de l'élément",
        steps: []
      },
      {
        title: "Polissage de l'élément",
        steps: []
      },
      {
        title: 'Préparation post polissage :',
        steps: ['Suppression du masquage', 'Nettoyage de la poussière de polissage']
      },
      {
        title: "Rinçage à l'eau osmosée",
        steps: []
      }
    ],
    prices: {
      priceTTC2Seats: 99,
      priceTTC2Wheels: 99,
      priceTTC5Seats: 99,
      priceTTC7Seats: 99
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Poli-Lustrage-rayure-Mazda-MX5-NA-bleue.webp',
    alt: 'Poli-lustrage Mazda MX5',
    isActive: true,
    serviceCategories: ['RENOVATION']
  },
  {
    id: 'xxxx000027',
    title: 'Nettoyage & protection',
    numberOfSales: 0,
    subtitle: 'Capote cabriolet',
    description: [
      {
        title: 'Nettoyage de la capote :',
        steps: ["Rinçage à l'eau claire", 'Pulvérisation de produit nettoyant', 'Brossage manuel', "Rinçage à l'eau claire"]
      },
      {
        title: 'Protection de la capote :',
        steps: ["Application manuelle d'un produit hydrophobe"]
      }
    ],
    prices: {
      priceTTC2Seats: 139,
      priceTTC5Seats: 139,
      priceTTC7Seats: 139
    },
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Lavage-exterieur-MG-rouge-1.webp',
    alt: 'Nettoyage capote cabriolet MG Rouge',
    isActive: true,
    serviceCategories: ['OTHER']
  },
  {
    id: 'xxxx000028',
    title: 'Nettoyage intérieur à la vapeur',
    numberOfSales: 0,
    subtitle: 'Sur devis',
    description: [
      {
        title: 'Nettoyage à la vapeur des parties encrassées',
        steps: []
      }
    ],
    picture:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Services+esth%C3%A9tiques/WEBP/Nettoyage-interieur-vapeur-Toyota-Yaris-propre.webp',
    alt: 'Nettoyage intérieur vapeur Toyota Yarris',
    isActive: true,
    serviceCategories: ['OTHER']
  }
]

const serviceOptions: Array<IServiceOption> = [
  // INTERIOR
  {
    id: 'opt-serv_01',
    title: 'Nettoyage manuel sièges, moquettes et tapis',
    optionPrice: {
      priceTTC2Seats: 69,
      priceTTC5Seats: 79,
      priceTTC7Seats: 89
    },
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  {
    id: 'opt-serv_02',
    title: 'Shampouinage siège, moquettes et tapis',
    optionPrice: {
      priceTTC2Seats: 39,
      priceTTC5Seats: 49,
      priceTTC7Seats: 69
    },
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  {
    id: 'opt-serv_03',
    title: 'Nettoyage interieur à la vapeur',
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  {
    id: 'opt-serv_04',
    title: 'Nettoyage manuel des vitres',
    optionPrice: {
      priceTTC2Seats: 64,
      priceTTC5Seats: 99,
      priceTTC7Seats: 129
    },
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  {
    id: 'opt-serv_05',
    title: 'Aspiration coffre',
    optionPrice: {
      priceTTC2Seats: 29,
      priceTTC5Seats: 29,
      priceTTC7Seats: 29
    },
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  {
    id: 'opt-serv_06',
    title: 'Shampouinage coffre',
    optionPrice: {
      priceTTC2Seats: 39,
      priceTTC5Seats: 39,
      priceTTC7Seats: 39
    },
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  {
    title: "Poils d'animaux - Poils longs",
    id: 'opt-serv_07',
    optionPrice: {
      priceTTC2Seats: 49,
      priceTTC5Seats: 64,
      priceTTC7Seats: 99
    },
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  {
    title: "Poils d'animaux - Poils courts",
    id: 'opt-serv_08',
    optionPrice: {
      priceTTC2Seats: 69,
      priceTTC5Seats: 84,
      priceTTC7Seats: 129
    },
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  {
    title: 'Sable sièges, tapis et moquettes',
    id: 'opt-serv_09',
    optionPrice: {
      priceTTC2Seats: 69,
      priceTTC5Seats: 89,
      priceTTC7Seats: 129
    },
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  {
    title: 'Nettoyage des sièges en cuirs',
    id: 'opt-serv_11',
    optionPrice: {
      priceTTC2Seats: 39,
      priceTTC5Seats: 59,
      priceTTC7Seats: 79
    },
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  {
    title: 'Nettoyage & nutrition des sièges en cuirs',
    id: 'opt-serv_12',
    optionPrice: {
      priceTTC2Seats: 39,
      priceTTC5Seats: 59,
      priceTTC7Seats: 79
    },
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  {
    title: 'Désinfection air habitacle',
    id: 'opt-serv_13',
    optionPrice: {
      priceTTC2Seats: 79,
      priceTTC5Seats: 79,
      priceTTC7Seats: 79
    },
    optionCategory: CenterServiceOptionCategories.INTERIOR
  },
  // EXTERIOR
  {
    title: 'Lavage jantes approndi',
    id: 'opt-serv_14',
    optionPrice: {
      priceTTC2Wheels: 19,
      priceTTC2Seats: 19,
      priceTTC5Seats: 19,
      priceTTC7Seats: 19
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Céramique - 2ème couche',
    id: 'opt-serv_10',
    optionPrice: {
      priceTTC2Seats: 149,
      priceTTC5Seats: 149,
      priceTTC7Seats: 149
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Cire de protection liquide',
    id: 'opt-serv_15',
    optionPrice: {
      priceTTC2Wheels: 19,
      priceTTC2Seats: 19,
      priceTTC5Seats: 19,
      priceTTC7Seats: 19
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Séchage de carrosserie',
    id: 'opt-serv_16',
    optionPrice: {
      priceTTC2Wheels: 49,
      priceTTC2Seats: 49,
      priceTTC5Seats: 49,
      priceTTC7Seats: 69
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Pose de cire carrosserie naturelle (sans séchage)',
    id: 'opt-serv_17',
    optionPrice: {
      priceTTC2Wheels: 79,
      priceTTC2Seats: 109,
      priceTTC5Seats: 129,
      priceTTC7Seats: 169
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Pose de cire céramique liquide (sans séchage)',
    id: 'opt-serv_18',
    optionPrice: {
      priceTTC2Wheels: 49,
      priceTTC2Seats: 59,
      priceTTC5Seats: 79,
      priceTTC7Seats: 109
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Pose de cire carrosserie naturelle (avec séchage)',
    id: 'opt-serv_19',
    optionPrice: {
      priceTTC2Wheels: 129,
      priceTTC2Seats: 159,
      priceTTC5Seats: 179,
      priceTTC7Seats: 249
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Pose de cire céramique liquide (avec séchage)',
    id: 'opt-serv_20',
    optionPrice: {
      priceTTC2Wheels: 89,
      priceTTC2Seats: 109,
      priceTTC5Seats: 129,
      priceTTC7Seats: 179
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Brillant pneus',
    id: 'opt-serv_21',
    optionPrice: {
      priceTTC2Wheels: 29,
      priceTTC2Seats: 29,
      priceTTC5Seats: 29,
      priceTTC7Seats: 29
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Chromes échappement',
    id: 'opt-serv_22',
    optionPrice: {
      priceTTC2Wheels: 39,
      priceTTC2Seats: 39,
      priceTTC5Seats: 39,
      priceTTC7Seats: 39
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Traitement des joints exterieurs',
    id: 'opt-serv_23',
    optionPrice: {
      priceTTC2Seats: 39,
      priceTTC5Seats: 49,
      priceTTC7Seats: 69
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Traitement des plastiques exterieurs',
    id: 'opt-serv_24',
    optionPrice: {
      priceTTC2Seats: 39,
      priceTTC5Seats: 59,
      priceTTC7Seats: 69
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },
  {
    title: 'Lavage chassis',
    id: 'opt-serv_43',
    optionPrice: {
      priceTTC2Seats: 99,
      priceTTC5Seats: 99,
      priceTTC7Seats: 99
    },
    optionCategory: CenterServiceOptionCategories.EXTERIOR
  },

  // CABRIOLET
  {
    title: 'Nettoyage et protection capote cabriolet',
    id: 'opt-serv_26',
    optionPrice: {
      priceTTC2Seats: 139,
      priceTTC5Seats: 139,
      priceTTC7Seats: 139
    },
    optionCategory: CenterServiceOptionCategories.CABRIOLET
  },
  // COMMERCIAL VEHICLE
  {
    title: 'Karcher coffre utilitaire',
    id: 'opt-serv_27',
    optionPrice: {
      priceTTC2Seats: 49,
      priceTTC5Seats: 49,
      priceTTC7Seats: 49
    },
    optionCategory: CenterServiceOptionCategories.COMMERCIAL_VEHICLE
  },
  // SECURITY
  {
    title: 'Traitement hydrophobe du parebrise',
    id: 'opt-serv_28',
    optionPrice: {
      priceTTC2Wheels: 39,
      priceTTC2Seats: 39,
      priceTTC5Seats: 39,
      priceTTC7Seats: 39
    },
    optionCategory: CenterServiceOptionCategories.SECURITY
  },
  {
    title: 'Traitement hydrophobe des vitres',
    id: 'opt-serv_29',
    optionPrice: {
      priceTTC2Seats: 39,
      priceTTC5Seats: 59,
      priceTTC7Seats: 69
    },
    optionCategory: CenterServiceOptionCategories.SECURITY
  },
  // HEADLIGHT
  {
    title: 'Rénovation 2 phares (Polissage)',
    id: 'opt-serv_30',
    optionPrice: {
      priceTTC2Wheels: 69,
      priceTTC2Seats: 69,
      priceTTC5Seats: 69,
      priceTTC7Seats: 69
    },
    optionCategory: CenterServiceOptionCategories.HEADLIGHT
  },
  {
    title: 'Rénovation 1 phare (Polissage)',
    id: 'opt-serv_31',
    optionPrice: {
      priceTTC2Wheels: 49,
      priceTTC2Seats: 49,
      priceTTC5Seats: 49,
      priceTTC7Seats: 49
    },
    optionCategory: CenterServiceOptionCategories.HEADLIGHT
  },
  {
    title: 'Rénovation 2 phares (Ponçage + Polissage)',
    id: 'opt-serv_32',
    optionPrice: {
      priceTTC2Wheels: 89,
      priceTTC2Seats: 89,
      priceTTC5Seats: 89,
      priceTTC7Seats: 89
    },
    optionCategory: CenterServiceOptionCategories.HEADLIGHT
  },
  {
    title: 'Rénovation 1 phare (Ponçage + Polissage)',
    id: 'opt-serv_33',
    optionPrice: {
      priceTTC2Wheels: 69,
      priceTTC2Seats: 69,
      priceTTC5Seats: 69,
      priceTTC7Seats: 69
    },
    optionCategory: CenterServiceOptionCategories.HEADLIGHT
  },
  // POLISH
  {
    title: 'Polissage - Carrosserie complète (1 passe)',
    id: 'opt-serv_34',
    optionPrice: {
      priceTTC2Wheels: 329,
      priceTTC2Seats: 499,
      priceTTC5Seats: 549,
      priceTTC7Seats: 699
    },
    optionCategory: CenterServiceOptionCategories.POLISH
  },
  {
    title: 'Polissage - 1 élément (1 passe)',
    id: 'opt-serv_35',
    optionPrice: {
      priceTTC2Seats: 99,
      priceTTC5Seats: 99,
      priceTTC7Seats: 99
    },
    optionCategory: CenterServiceOptionCategories.POLISH
  },
  {
    title: 'Lustrage - Carrosserie complète (1 passe)',
    id: 'opt-serv_36',
    optionPrice: {
      priceTTC2Wheels: 399,
      priceTTC2Seats: 499,
      priceTTC5Seats: 549,
      priceTTC7Seats: 699
    },
    optionCategory: CenterServiceOptionCategories.POLISH
  },
  {
    title: 'Lustrage - 1 élément (1 passe)',
    id: 'opt-serv_37',
    optionPrice: {
      priceTTC2Seats: 99,
      priceTTC5Seats: 99,
      priceTTC7Seats: 99
    },
    optionCategory: CenterServiceOptionCategories.POLISH
  },
  {
    title: 'Polissage (1 passe) et Lustrage (1 passe) - Carrosserie complète',
    id: 'opt-serv_38',
    optionPrice: {
      priceTTC2Wheels: 499,
      priceTTC2Seats: 949,
      priceTTC5Seats: 999,
      priceTTC7Seats: 1299
    },
    optionCategory: CenterServiceOptionCategories.POLISH
  },
  {
    title: 'Polissage (1 passe) et Lustrage (1 passe) - 1 élément',
    id: 'opt-serv_39',
    optionPrice: {
      priceTTC2Seats: 149,
      priceTTC5Seats: 149,
      priceTTC7Seats: 149
    },
    optionCategory: CenterServiceOptionCategories.POLISH
  },
  // BODYWORK DEFECT
  {
    title: 'Suppression de bosses',
    id: 'opt-serv_40',
    optionCategory: CenterServiceOptionCategories.BODYWORK_DEFECT
  },
  {
    title: 'Suppression de rayures',
    id: 'opt-serv_41',
    optionCategory: CenterServiceOptionCategories.BODYWORK_DEFECT
  },
  // MOTOR
  {
    title: 'Nettoyage moteur (vapeur)',
    id: 'opt-serv_42',
    optionPrice: {
      priceTTC2Wheels: 39,
      priceTTC2Seats: 69,
      priceTTC5Seats: 69,
      priceTTC7Seats: 69
    },
    optionCategory: CenterServiceOptionCategories.MOTOR
  }
]

export { centerServices, serviceOptions }
