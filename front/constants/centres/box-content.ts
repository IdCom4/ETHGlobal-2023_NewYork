export const BOXES: BOX_CATEGORIES = {
  MECANIC_BOX: {
    category: 'MECABOX',
    name: 'MECANIC',
    mainTitle: "Garage Solidaire moderne et convivial à Rambouillet, à la frontière entre les Yvelines et l'Eure-et-Loire",
    meta_description:
      "Location de Boxes Mécaniques à Rambouillet dès 18 €. Plus qu'un Garage Associatif, notre équipe vous accueille dans un cadre moderne et convivial.",
    url_box: 'box-mecanique',
    bannerImage:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Boxes+M%C3%A9canique/Avec+voitures/WEBP/R%C3%A9vision+-+Porsche+911+997+-+4.webp',
    altBannerImage: 'Garage en libre service, Yvelines, Eure-et-Loire, Essonne',
    titlePage: 'Boxes Mécanique',
    boxes: ['M1', 'M2'],
    subtitle: `
    <p class="largest">Nos Boxes Mécanique sont équipés d'outils de qualité (Facom) vous permettant de réaliser vous même l'essentiel des opérations d'entretien.</p> 
    <br/>
    <p class="largest">Plus qu'un simple Self Garage ou Garage Associatif, notre équipe vous accueille dans un cadre moderne et convivial.</p>`,
    introduction: [
      {
        icon: 'fa-solid fa-wrench',
        textIntro: `Réservez un boxe entièrement équipé de 15 minutes à 1 journée`
      },
      {
        icon: 'fa-solid fa-bolt',
        textIntro: `De la révision au remplacement d'embrayage en passant par la préparation circuit`
      }
    ],
    corporateValues: [
      {
        value: 'Un Expert ValueMyCar à votre Service',
        image:
          'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/2.+Un+expert+%C3%A0+votre+service/Vidange-de-boite-de-vitesse-automatique-Ford-Mustang-1965-2-1.webp',
        alt: 'Expert sur une Mustang',
        describe: "Un membre de l'équipe ValueMyCar est présent sur place afin de vous apporter les conseils nécessaires."
      },
      {
        value: 'Un Entretien Responsable',
        image:
          'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/3.+Un+entretien+responsable/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Bac-de-r%C3%A9cup%C3%A9ration-d_huile-1-1.webp',
        alt: "Récupération d'huil - Self Garage, Yvelines, Eure-et-Loire, Essonne",
        describe:
          "L’ensemble de vos huiles, pièces et déchets sont retraités. Le bon entretien de votre véhicule permettra d’en réduire les émissions polluantes et d'en allonger la durée de vie."
      },
      {
        value: "Réduisez votre Budget d'entretien",
        image:
          'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/4.+R%C3%A9duisez+votre+budget/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Outils-Facom-complet-2-1.webp',
        alt: 'Outils facom à disposition',
        describe: "Economisez sur le cout de la main d'œuvre. Utilisez des pièces neuves ou reconditionnées achetées au meilleur prix."
      }
    ],
    tarifs: [
      {
        time: 1,
        price: 18
      },
      {
        time: 2,
        price: 24
      },
      {
        time: 4,
        price: 39
      },
      {
        time: 8,
        price: 69
      },
      {
        time: 16,
        price: 129
      },
      {
        time: 32,
        price: 199
      }
    ],
    tools: [
      'Pont élévateur',
      "Bac de récupération d'huile",
      'Kit de vidange',
      'Purgeur de freins',
      'Repousse piston freins',
      'Clé à choc',
      'Douilles à choc',
      'Clés dynamométriques',
      'Clés mixtes',
      'Clés de tension de courroie',
      'Clés à pipe de bouchée',
      'Clés males longues (6 pans, torx à têtes sphériques)',
      'Clés à tuyauter',
      'Clé à pipe 6x6 pans 27mm',
      'Tournevis',
      'Pinces',
      'Marteaux et burins',
      'Cliquets et douilles',
      'Kit de distribution',
      'Extracteur de rotules et module extracteur',
      'Verrin de fosse',
      'Coupe tube',
      'Controleur étanchéité refroidissement',
      'Testeur de batterie, multimètre',
      'Chasse goupille, outils à dégarnir',
      'Outil à chanfreiner',
      "Fraise pour puit d'injecteur",
      'Coffret pour poulie altenateur'
    ],
    reviews: [
      {
        name: 'B Joel',
        date: '08/09',
        rating: 5,
        contains:
          "Garage en location avec vraiment tout l'outillage nécessaire à disposition et même beaucoup plus qu'il n'en faut pour la majorité des bricoleurs. J'y suis venu pour remplacer un embrayage de Mégane Dci et tout est top, du garage a la cuisine pour manger en passant par la douche."
      },
      {
        name: 'Ilkan Pala',
        date: '01/06',
        rating: 5,
        contains: `Super Centre automobile pour faire de la mécanique soit même ou lavage/detailing. 
          Les outils sont fournis et de très bonne qualité. J'ai pu effectuer la vidange + changement des filtres 
          + changement des supports moteur sans problème sur mon véhicule. Sans oublier l'accueil au top ! Merci 
          ValuemyCar Rambouillet !!`
      },
      {
        name: 'Nabil Belkessa',
        date: '12/06',
        rating: 5,
        contains: `Je viens de découvrir ce concept original qui me permet de louer un box mécanique ou bien un box pour faire
         un lavage pour ma voiture, très bon accueil professionnalisme irréprochable assistance et prix raisonnable j’ai 
         fait pratiquement 100 km pour faire la vidange pour ma voiture et je le regrette pas tout est mis à disposition 
         du matériel à usage professionnel un pont pour soulever la voiture du matériel pour récupérer l’huile de voiture 
         et les filtres usagés rien à dire je le conseille vivement`
      },
      {
        name: 'rodolphe alvarez',
        date: '08/11',
        rating: 5,
        contains: `J'avais besoin de faire une vidange, j'ai découvert ce centre par hasard et franchement je ne le regrette pas. L'équipe est accueillante et très pro. De plus, le centre est très bien équipé tout en étant fonctionnel et très propre. Parmi tous les centres que j'ai connu, c'est vraiment le meilleur (et de loin). Je reviendrais, c'est sûr.`
      },
      {
        name: 'Ju Lien',
        date: '02/10',
        rating: 5,
        contains: `GÉNIAL ! L’accueil est top, les outils sont complet et neuf. J’ai changé disques et plaquettes de freins avant. Forfait 1h. En commandant mes pièces sur internet + la location du box mécanique j’ai économisé 100€ sur le devis norauto. Je recommande !`
      },
      {
        name: 'Julie Rocca',
        date: '01/09',
        rating: 5,
        contains: `Super centre, doté d’équipements de qualité. Les employés sont de bon conseils si nous avons des questions sur la mécanique et nous assistent si besoin.Je recommande!`
      },
      {
        name: 'Fred DNZ',
        date: '07/01',
        rating: 5,
        contains: `Excellent centre auto pour faire de la mécanique soi même.
          Outillage complet et de qualité.
          Responsable accueillant et à l'écoute.Prix correct.
          Je recommande`
      },
      {
        name: 'Pauline T. (Poppie jenkinz)',
        date: '21/05',
        rating: 5,
        contains: `J'ai pu réparé ma voiture tout en tranquillité et sécurité ! beaucoup d'outil à disposition et le personnel très avenant et passionné de voiture.`
      },
      {
        name: 'J M',
        date: '18/04',
        rating: 5,
        contains: `Très bon accueil et accompagnement de la part de l'équipe pour ma 1ere vidange. Box très propre et tous les outils sont à disposition. J'y reviendrai avec plaisir pour mes prochains entretiens. Bravo à vous !`
      },
      {
        name: 'Carrey Éric',
        date: '17/02',
        rating: 5,
        contains: `Personnels accueillant ,
          Matos et boxe au top , 👍👍👍
          J'ai effectué vidange de boite Dsg sur mon véhicule .
          Nickel !!.
          Les yeux fermés.`
      },
      {
        name: 'Damien Mallet',
        date: '12/03',
        rating: 5,
        contains: `Très bon accueil , le personnel est a l’écoute . L’atelier est très bien équipé avec du matériel de pros . Pour ma part j’ai changé disque plaquettes de frein et une vidange. On peut fermer le box s’il fait froid . Je recommande vivement !`
      },
      {
        name: 'joejoe joe',
        date: '10/01',
        rating: 5,
        contains: `Réservé la veille, très bien accueilli, matériel full Facom, pont ciseaux, gestion des déchets, tarifs raisonnables. Je conseille sans réserve sur ma première expérience !`
      },
      {
        name: 'thomi L',
        date: '24/01',
        rating: 5,
        contains: `Réservation pour remplacement de la ligne d'échappement, je suis pleinement satisfait ! Accueil et explication par l'équipe jeune et motivé. L'ambiance est familial aussi bien avec l'équipe que les autres clients les box sont propres et équipé full facom.  Je reviendrais !`
      },
      {
        name: 'Stephane louis',
        date: '12/06',
        rating: 5,
        contains: `Un local très bien équipé,propre,du personnel très agréable que demander de mieux. Mon remplacement de ligne de échappement m a permis d économiser plus de 400€ pour 39€ de location du box.`
      },
      {
        name: 'S. Saporita',
        date: '22/06',
        rating: 5,
        contains: `2e passage chez VmC ce jours : toujours au top, vidange et réparation fastidieuse d'un moteur et mécanisme lève vitre. Le patron est les employés sont super sympas et volontaires pour aider dès qu'il y en a besoin.
        Les box et les locaux sont super propres et agréables à utiliser.
        Je recommande sans hésiter ce spot pour entretenir, réparer et prendre soin de sa voiture`
      },
      {
        name: 'WeDNuts',
        date: '26/05',
        rating: 5,
        contains: `Bonjour, suite à mon passage aujourd’hui pour réaliser ma vidange, j’ai été très bien accueilli, le personnel est à l’écoute et prêt à répondre à ma moindre demande.
        Entreprise à la pointe, station de lavage, atelier mécanique, atelier detailling au top.
        Vous pouvez vous y rendre sans hésitation !
        Rien que du positif +++`
      }
    ],
    carouselPictures: [
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Pr%C3%A9paration-avant-circuit-Audi-A1-Quattro-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Bac-de-r%C3%A9cup%C3%A9ration-d_huile-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Remplacement-disques-de-frein-Citroen-C3-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Outils-Facom-complet-18-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Servante-Facom-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/R%C3%A9vision-g%C3%A9n%C3%A9rale-Mercedes-Classe-E-cabriolet-noire-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Panneau-de-vidange-Facom-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/R%C3%A9vision-compl%C3%A8te-Audi-RS4-B7-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Outils-Facom-complet-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Remplacement-disques-de-frein-Mustang-bleue-3-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Outils-Facom-complet-3-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/R%C3%A9vision-g%C3%A9n%C3%A9rale-BMW-Serie-3-e46-noire-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Recyclage-huile-et-verrin-de-fosse-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Remplacement-disques-et-plaquettes-Citroen-Saxo-blanche-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Outils-Facom-complet-19-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/R%C3%A9vision-Porsche-911-997-4-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Outils-Facom-complet-7-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Remplacement-disques-de-frein-Mustang-bleue-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Servante-Facom-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Remplacement-disques-et-plaquettes-Mercedes-C63-AMG-courp%C3%A9-3-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Self-Garage-Garage-Associatif-Yvelines-_-Eures-et-Loire-Outils-Facom-complet-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/R%C3%A9vision-compl%C3%A8te-Audi-RS4-B7-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Remplacement-disques-et-plaquettes-Mercedes-C63-AMG-courp%C3%A9-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/R%C3%A9vision-g%C3%A9n%C3%A9rale-Mazda-MX5-NA-bleue-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Remplamcent-disques-et-plaquettes-BMW-serie-3-e46-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/R%C3%A9vision-g%C3%A9n%C3%A9rale-Nissan-370Z-grise-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/Remplacement-disques-de-frein-Mustang-bleue-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+M%C3%A9canique/5.+Photos+carroussel/R%C3%A9vision-Opel-Astra-1-1.webp'
    ]
  },
  WASHING_BOX: {
    category: 'WASHBOX',
    name: 'WASHING',
    mainTitle: "Station de Lavage auto et moto à Rambouillet, à la frontière entre les Yvelines et l'Eure-et-Loire",
    meta_description:
      'Station de Lavage à Rambouillet. Boxe privatif tout équipé. Equipements professionnels pour le nettoyage interieur et exterieur de votre véhicule.',
    url_box: 'box-lavage',
    bannerImage:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/1.+Photo+du+haut/Prelavage-carrosserie-Audi-A1-Quattro-1.webp',
    altBannerImage: 'Prelavage carrosserie Audi A1',
    titlePage: 'Boxes Lavage',
    boxes: ['L1', 'L2'],
    subtitle: `
    <p class="largest">Nos Boxes Lavage sont équipés d'un système haute pression utilisant de l'eau osmosée ainsi que de nombreux équipements destinés au lavage interieur et exterieur.</p>
    <br/> 
    <p class="largest">Reservez votre espace privatisé et utilisez l'ensemble de nos équipements à volonté le temps de votre réservation.</p>`,
    introduction: [
      {
        icon: 'fa-solid fa-wrench',
        textIntro: 'Réservez un boxe entièrement équipé de 15 minutes à 1 journée'
      },
      {
        icon: 'fa-solid fa-bolt',
        textIntro: 'Du simple lavage exterieur haute pression au lavage à la main en passant par le shampouinage interieur'
      }
    ],
    corporateValues: [
      {
        value: 'Un Expert ValueMyCar à votre Service',
        image:
          'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/2.+Un+expert+%C3%A0+votre+service/Station+de+lavage+Rambouillet+-+Yvelines+%26+Eure+et+Loire.webp',
        alt: 'Programmes de lavage disponibles, Yvelines, Eure-et-Loire, Essonne',
        describe: "Un membre de l'équipe ValueMyCar est présent sur place afin de vous apporter les conseils nécessaires."
      },
      {
        value: 'Un Lavage Responsable',
        image:
          'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/3.+Un+lavage+responsable/Station-de-lavage-%C3%A0-Rambouillet-Boxes-de-lavage-Yvelines-_-Eure-et-Loire-8.webp',
        alt: 'Station de lavage utilitaires, Yvelines, Eure-et-Loire, Essonne',
        describe:
          "L'ensemble de nos eaux de lavage sont dépoluées avant d'être réutilisées dans le réseau public. Un lavage régulier de votre véhicule évite la pollution des sols et des nappes phréatiques."
      },
      {
        value: 'Redonnez de la Valeur à votre véhicule',
        image:
          'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/4.+Redonnez+de+la+valeur+%C3%A0+votre+v%C3%A9hicule/Lavage-interieur-exterieur-vW-Tiguan-2-2.webp',
        alt: 'lavage intérieur et extérieur Tiguan 2, Yvelines, Eure-et-Loire, Essonne',
        describe:
          "Avant une vente ou un retour de leasing, remettez votre véhicule dans un état proche de celui d'origine. Augmentez son prix de revente ou réduisez les pénalités de fin de location."
      }
    ],
    tarifs: [
      {
        time: 1,
        price: 18
      },
      {
        time: 2,
        price: 24
      },
      {
        time: 4,
        price: 39
      },
      {
        time: 8,
        price: 69
      },
      {
        time: 16,
        price: 129
      },
      {
        time: 32,
        price: 199
      }
    ],
    tools: [
      'Système haute pression (6 programmes)',
      'Sécheur',
      'Aspirateur',
      'Soufflette à air comprimé',
      'Inhecteur extracteur',
      'Nettoyeur vapeur',
      'Tornador',
      'Seaux et gants de lavage',
      'Microfibres de séchage',
      'Brosses, plumeaux et pinceux à jantes',
      'Pinceuax exterieurs (hard et soft)',
      'Brosse plastique',
      'Pinceux interieurs (hard, soft, précision)'
    ],
    reviews: [
      {
        name: 'Nicolas Le Manach',
        date: '02/05',
        rating: 5,
        contains: `Super centre de lavage, une équipe au top qui est toujours là pour vous conseiller, des outils professionnels à disposition et un box qui ferme, fini l’aspirateur dans le froid ! c’est génial ça fait vraiment la différence et un prix très raisonnable ! J’adore ce centre ! 👌🏼👌🏼`
      },
      {
        name: 'Wajid Ait',
        date: '07/06',
        rating: 5,
        contains: `Très bon accueil, le responsable est très accueillant et a l'écoute. Endroit idéal pour un lavage en toute tranquillité ça change des stations totales où on doit se presser. Je reviendrais pour un polissage 👌💯
        Je vous recommande ce lieux!!!`
      },
      {
        name: 'Peter Baudin',
        date: '07/07',
        rating: 5,
        contains: `Accueil très agréable avec un interlocuteur compétent et bienveillant.
        Des produits de qualité et un matériel fonctionnel qui m’ont permis de nettoyer mon véhicule correctement en un temps record. Je recommande sans hésitation.`
      },
      {
        name: 'Quentin Rouanet',
        date: '12/04',
        rating: 5,
        contains: `Super expérience de lavage auto !
        Équipe au top qui n'hésite pas à donner un coup de main et de bons conseils.
        Locaux magnifiques, matérielle impeccable, et produits de très bonne qualité pour un lavage efficace.
        À tous les passionnés autos, je ne peux que vous reccomander ces lieux.`
      },
      {
        name: 'Valentin Wetzel',
        date: '29/06',
        rating: 5,
        contains: `Superbe endroit pour laver sa voiture en toute tranquillité avec du matériel de bonne qualité. Le personnel est top et super sympa. Il me reste plus qu’à essayer le box detailing :)`
      },
      {
        name: 'Hugo et Alix Feillens',
        date: '11/04',
        rating: 5,
        contains: `Équipe très accueillante et sympathique que cela soit pour récupérer des colis que pour proposer leur service de nettoyage. Tout est bien expliqué avant le début du nettoyage pour qu’on puisse faire le travail correctement. Les équipements sont de qualité et fonctionnent très bien. Je préfère largement prendre mon temps et laver ma voiture ici que dans un centre classique. Idéal pour motards également grâce au souffleur qui permet de sécher toute la moto et la selle avant de repartir. Je recommande sans hésiter !`
      }
    ],
    carouselPictures: [
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Lavage-%C3%A0-la-main-Yvelines-Seaux-de-lavage.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Pr%C3%A9lavage-carrosserie-Alfa-Rom%C3%A9o-Giulia-Quadrifoglio-rouge-4-2.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Nettoyage-moteur-Ferrari-F430-noire-2-2.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Station-de-lavage-%C3%A0-Rambouillet-S%C3%A9cheur-de-carrosserie-Yvelines-_-Eure-et-Loire-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Prelavage-carrosserie-Audi-A1-Quattro-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/S%C3%A9chage-carrosserie-Mercedes-AMG-GT-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Station-de-lavage-en-interieur-%C3%A0-Rambouillet-Boxe-de-lavage-Yvelines-_-Eure-et-Loire-6.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Nettoyage-auto-interieur-Yvelines-Aspirateur-centralis%C3%A9.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Pr%C3%A9lavage-carrosserie-Alpine-a110-4-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Station-de-lavage-%C3%A0-Rambouillet-Boxes-de-lavage-Yvelines-_-Eure-et-Loire-8_1_-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Porsche-911-3.2-G50-grise-apr%C3%A8s-lavage-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Lavage-auto-%C3%A0-Rambouillet-mircrofibres-de-lavage.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/S%C3%A9chage-Harley-Davidson-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Station+de+lavage+Rambouillet+-+Yvelines+%26+Eure+et+Loire.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Pr%C3%A9lavage-carrosserie-Aston-Martin-v8-Vantage-S-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Porsche-911-SC-Targa-bleu-apr%C3%A8s-lavage-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Pr%C3%A9lavage-carrosserie-Toyota-Yaris-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Station-de-lavage-%C3%A0-Rambouillet-Soufflette-%C3%A0-air-comprim%C3%A9-Yvelines-_-Eure-et-Loire-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Pr%C3%A9lavage-carrosserie-Alfa-Rom%C3%A9o-Giulia-Quadrifoglio-rouge-6-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Pr%C3%A9lavage-carrosserie-Audi-RS6-C7-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Pr%C3%A9lavage-carrosserie-BMW-M6-Cabriolet-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Station-de-lavage-%C3%A0-Rambouillet-Boxes-de-lavage-Yvelines-_-Eure-et-Loire-8.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Porsche-Macan-apr%C3%A8s-lavage-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Pr%C3%A9lavage-carrosseerie-Audi-R8-V10-noire-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Station-de-lavage-%C3%A0-Rambouillet-Boxes-de-lavage-Yvelines-_-Eure-et-Loire-7.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Pr%C3%A9lavage-carrosserie-Alpine-a110-5-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Prelavage-carrosserie-Porsche-911-3.2-G50.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Station-de-lavage-%C3%A0-Rambouillet-Soufflette-%C3%A0-air-comprim%C3%A9-Yvelines-_-Eure-et-Loire-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Pr%C3%A9lavage-Carrosserie-Aston-Martin-v8-Vantage-S-bis-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Lavage/5.+Carroussel/Station-de-lavage-eure-et-loire-Foam-Lance.webp'
    ]
  },
  DETAILING_BOX: {
    category: 'DETAILINGBOX',
    name: 'DETAILING',
    mainTitle: "Centre Esthétique Auto et Moto à Rambouillet, à la frontière entre les Yvelines et l'Eure-et-Loire",
    meta_description:
      'Location de Boxes Equipés à Rambouillet dès 18 €. Detailing, Polissage, Lustrage, Car Staging, suppression de Rayures, rénovation de phares.',
    url_box: 'box-detailing',
    bannerImage:
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/1.+Photo+du+haut/Detailing-Mazda-MXA-NA-21-1.webp',
    altBannerImage: 'Detailing Mazda, Yvelines, Eure-et-Loire, Essonne',
    titlePage: 'Boxes Esthétique',
    boxes: ['D1', 'D2'],
    subtitle: `
    <p class="largest">Nos Boxes Esthétiques sont équipés de l'ensemble des matériels nécessaires à l'entretien de l'exterieur et l'interieur de votre véhicule (polisseuses, injecteur extracteur, nettoyeur vapeur...).</p>
    <br /> 
    <p class="largest">L'utilisation de l'essentiel des produits est inclus dans votre location (polish, tampons de polissage, microfibres, barre d'argile...).</p>
    <br />
    <p class="largest">Profitez des conseils de notre équipe et travaillez dans un cadre confortable et convivial.</p>
    `,
    introduction: [
      {
        icon: 'fa-solid fa-wrench',
        textIntro: 'Réservez un boxe entièrement équipé de 15 minutes à 1 journée'
      },
      {
        icon: 'fa-solid fa-bolt',
        textIntro: 'Du polissage à la pose de céramique en passant par le lavage chassis'
      }
    ],
    corporateValues: [
      {
        value: 'Un Expert ValueMyCar à votre Service',
        image:
          'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/2.+Un+expert+%C3%A0+votre+service/Photo-sans-plaque-_6_-1.webp',
        alt: 'Boxes de polissage, Yvelines, Eure-et-Loire, Essonne',
        describe: "Un membre de l'équipe ValueMyCar est présent sur place afin de vous apporter les conseils nécessaires."
      },
      {
        value: 'Un Entretien Responsable',
        image:
          'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/3.+Un+entretien+responsable/Centre-esth%C3%A9tiqe-automobile-Yvelines-_-Eure-et-Loire-Boxe-Detailing-3-1.webp',
        alt: 'Boxe de detailing, Yvelines, Eure-et-Loire, Essonne',
        describe:
          "L'essentiel des défauts esthétiques peuvent être corrigés en évitant des opérations polluantes telles que la peinture ou le remplacement de pièces."
      },
      {
        value: 'Redonnez de la Valeur à votre véhicule',
        image:
          'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/4.+Redonner+de+la+valeur+%C3%A0+votre+v%C3%A9hicule/Detailing-Porsche-Boxser-S-gris-6-1.webp',
        alt: 'Detailing Porsche Boxster grise, Yvelines, Eure-et-Loire, Essonne',
        describe:
          "Avant une vente ou un retour de leasing, remettez votre véhicule dans un état proche de celui d'origine. Augmentez son prix de revente ou réduisez les pénalités de fin de location."
      }
    ],
    tarifs: [
      {
        time: 1,
        price: 18
      },
      {
        time: 2,
        price: 24
      },
      {
        time: 4,
        price: 39
      },
      {
        time: 8,
        price: 69
      },
      {
        time: 16,
        price: 129
      },
      {
        time: 32,
        price: 199
      }
    ],
    tools: [
      'Pont élévateur',
      'Nettoyeur haute pression',
      'Sécheur',
      'Polisseuses orbitales',
      'Ponceuxe',
      'Pads et produits de polissage',
      'Pads et produits de lustrage',
      'Aspirateur',
      'Injecteur Extracteur',
      'Nettoyeur vapeur',
      'Tornador',
      'Seaux et gants de lavage',
      'Microfibres de séchage',
      'Brosses, plumeaux et pinceux à jantes',
      'Pinceuax exterieurs (hard et soft)',
      'Brosse plastique',
      'Pinceux interieurs (hard, soft, précision)',
      "Brosse poils d'animaux",
      'Brosse cuir',
      "Barre d'argile"
    ],
    reviews: [
      {
        name: 'Wajid Ait',
        date: '01/06',
        rating: 5,
        contains: `Très bon accueil, le responsable est très accueillant et a l'écoute. Endroit idéal pour un lavage en toute tranquillité ça change des stations totales où on doit se presser. Je reviendrais pour un polissage 👌💯
        Je vous recommande ce lieux!!!`
      },
      {
        name: 'Ilkan Pala',
        date: '01/06',
        rating: 5,
        contains: `Super Centre automobile pour faire de la mécanique soit même ou lavage/detailing. 
          Les outils sont fournis et de très bonne qualité. J'ai pu effectuer la vidange + changement des filtres 
          + changement des supports moteur sans problème sur mon véhicule. Sans oublier l'accueil au top ! Merci 
          ValuemyCar Rambouillet !!`
      },
      {
        name: 'Valentin Wetzel',
        date: '29/06',
        rating: 5,
        contains: `Superbe endroit pour laver sa voiture en toute tranquillité avec du matériel de bonne qualité. Le personnel est top et super sympa. Il me reste plus qu’à essayer le box detailing :)`
      },
      {
        name: 'Ersel Pala',
        date: '13/06',
        rating: 5,
        contains: `Le concept est génial ! Un garage ou l'on peut s'occuper de son véhicule pratiquement de A à Z (nettoyage, detailing, mécanique ...)
        Venue pour un changement de support moteur et une révisions, j'ai donc loué un box mécanique. Tout les outils nécessaires son mis à disposition pour tout type de travaux et c'est du matériel de très bonne qualité.
        Un très bon accueil, le gérant est sympa et ne manque pas de professionnalisme.
        C'était un plaisir ! Je reviendrai sans hésitation.`
      },
      {
        name: 'michel julien',
        date: '24/03',
        rating: 5,
        contains: `Très bon accueil et conseils, locaux propre et fonctionnel, le rapport qualité /prix est imbattable, ils ont des produits de qualités (la cire est superbe) tout comme les équipements, le concept est super, ça change des stations classique ou l'on doit se presser !! je reviendrais pour un lustrage !`
      },
      {
        name: 'K P',
        date: '06/03',
        rating: 5,
        contains: `Tout simplement parfait. Il faut savoir dire lorsque c’est bien aussi. Personnel très accueillant. J’ai utilisé le nettoyeur haute pression ainsi que l’aspirateur. Très efficaces, pas abîmés comme bien souvent en centre de lavage. Matériel ergonomique. Les produits sont efficaces et à « volonté » durant le lavage. J’y suis également allé afin de polir 2/3 parties de mon véhicule que j’ai pu rattraper à merveille et ainsi m’éviter d’amener mon véhicule chez un carrossier qui m’aurait demandé plusieurs centaines d’euros. Qui plus est, je trouve le prix très correct : 39€ pour un lavage interieur + extérieur + polissage des 2/3 parties rayées sur mon véhicule. J’ai également apprécié le fait que l’on puisse se faire couler un café, profiter d’une cuisine aménagée ou bien prendre une douche si l’on a a utiliser le box mécanique par exemple. Enfin, la carte de fidélité n’est pas avare, après seulement 100€ dépensés, un quart d’heure de 18€ d’offert, cela change des programmes de fidélité ou l’on doit dépenser bien plus pour « gagner » beaucoup moins. Super concept, continuez ainsi, je reviendrai volontier !`
      }
    ],
    carouselPictures: [
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Lavage-chassis-Volskwagen-Touareg-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Pose-de-c%C3%A9ramique-Mercedes-Class-A-noire-9-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Centre-esth%C3%A9tiqe-automobile-Yvelines-_-Eure-et-Loire-Boxe-Detailing-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Polissage-carroserie-Golf-7-GTI-blanche-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Detailing-exterieur-Porsche-Boxster-S-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Centre-esth%C3%A9tiqe-automobile-Yvelines-_-Eure-et-Loire-S%C3%A9cheur-de-carrosserie-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Shampouinage-si%C3%A8ges-et-moquettes-Injecteur-extracteur-2-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Detailing-Porsche-Cayman-S-gris-1-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Centre-esth%C3%A9tiqe-automobile-Yvelines-_-Eure-et-Loire-Polisseuses-de-carroisserie-1-min-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Polissage-carrosserie-Audi-RS6-C8-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Detailing-Nissan-GTR-blanche-5-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Centre-esth%C3%A9tiqe-automobile-Yvelines-_-Eure-et-Loire-S%C3%A9cheur-et-Foam-Lance-8-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Pose-de-c%C3%A9ramique-Jaguar-XKR-noire-13-2.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Lavage-chassis-Morgan-4-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Centre-esth%C3%A9tiqe-automobile-Yvelines-_-Eure-et-Loire-S%C3%A9cheur-et-Foam-Lance-9-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Shampouinage-si%C3%A8ges-et-moquettes-Injecteur-extracteur-3-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Photo-sans-plaque-_5__1_-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Detailing-Mazda-MXA-NA-8-1.webp',
      'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Esth%C3%A9tique/5.+Carroussel/Boxe-Esth%C3%A9tique-BMW-M3e46-jaune-1.webp'
    ]
  }
}
