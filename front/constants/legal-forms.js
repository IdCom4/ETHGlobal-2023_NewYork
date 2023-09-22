export const LEGAL_FORMS = [
  { code: 1000, name: 'Entrepreneur individuel' },
  { code: 2110, name: 'Indivision entre personnes physiques' },
  { code: 2120, name: 'Indivision avec personne morale' },
  { code: 2210, name: 'Société créée de fait entre personnes physiques' },
  { code: 2220, name: 'Société créée de fait avec personne morale' },
  { code: 2310, name: 'Société en participation entre personnes physiques' },
  { code: 2320, name: 'Société en participation avec personne morale' },
  { code: 2385, name: 'Société en participation de professions libérales' },
  { code: 2400, name: 'Fiducie' },
  { code: 2700, name: 'Paroisse hors zone concordataire' },
  {
    code: 2900,
    name: 'Autre groupement de droit privé non doté de la personnalité morale'
  },
  {
    code: 3110,
    name: "Représentation ou agence commerciale d'état ou organisme public étranger immatriculé au RCS"
  },
  { code: 3120, name: 'Société commerciale étrangère immatriculée au RCS' },
  { code: 3205, name: 'Organisation internationale' },
  { code: 3210, name: 'État, collectivité ou établissement public étranger' },
  { code: 3220, name: 'Société étrangère non immatriculée au RCS' },
  { code: 3290, name: 'Autre personne morale de droit étranger' },
  {
    code: 4110,
    name: "Établissement public national à caractère industriel ou commercial doté d'un comptable public"
  },
  {
    code: 4120,
    name: "Établissement public national à caractère industriel ou commercial non doté d'un comptable public"
  },
  { code: 4130, name: 'Exploitant public' },
  {
    code: 4140,
    name: 'Établissement public local à caractère industriel ou commercial'
  },
  {
    code: 4150,
    name: "Régie d'une collectivité locale à caractère industriel ou commercial"
  },
  { code: 4160, name: 'Institution Banque de France' },
  { code: 5191, name: 'Société de caution mutuelle' },
  { code: 5192, name: 'Société coopérative de banque populaire' },
  { code: 5193, name: 'Caisse de crédit maritime mutuel' },
  { code: 5194, name: 'Caisse (fédérale) de crédit mutuel' },
  {
    code: 5195,
    name: 'Association coopérative inscrite (droit local Alsace Moselle)'
  },
  { code: 5196, name: "Caisse d'épargne et de prévoyance à forme coopérative" },
  { code: 5202, name: 'Société en nom collectif' },
  { code: 5203, name: 'Société en nom collectif coopérative' },
  { code: 5306, name: 'Société en commandite simple' },
  { code: 5307, name: 'Société en commandite simple coopérative' },
  { code: 5308, name: 'Société en commandite par actions' },
  { code: 5309, name: 'Société en commandite par actions coopérative' },
  {
    code: 5370,
    name: 'Société de Participations Financières de Profession Libérale Société en commandite par actions (SPFPL SCA)'
  },
  { code: 5385, name: "Société d'exercice libéral en commandite par actions" },
  { code: 5410, name: 'SARL nationale' },
  { code: 5415, name: "SARL d'économie mixte" },
  {
    code: 5422,
    name: "SARL immobilière pour le commerce et l'industrie (SICOMI)"
  },
  { code: 5426, name: 'SARL immobilière de gestion' },
  {
    code: 5430,
    name: "SARL d'aménagement foncier et d'équipement rural (SAFER)"
  },
  { code: 5431, name: "SARL mixte d'intérêt agricole (SMIA)" },
  { code: 5432, name: "SARL d'intérêt collectif agricole (SICA)" },
  { code: 5442, name: "SARL d'attribution" },
  { code: 5443, name: 'SARL coopérative de construction' },
  { code: 5451, name: 'SARL coopérative de consommation' },
  { code: 5453, name: 'SARL coopérative artisanale' },
  { code: 5454, name: "SARL coopérative d'intérêt maritime" },
  { code: 5455, name: 'SARL coopérative de transport' },
  { code: 5458, name: 'SARL coopérative ouvrière de production (SCOP)' },
  { code: 5459, name: 'SARL union de sociétés coopératives' },
  { code: 5460, name: 'Autre SARL coopérative' },
  {
    code: 5470,
    name: 'Société de Participations Financières de Profession Libérale Société à responsabilité limitée (SPFPL SARL)'
  },
  { code: 5485, name: "Société d'exercice libéral à responsabilité limitée" },
  { code: 5498, name: 'SARL unipersonnelle' },
  {
    code: 5499,
    name: 'Société à responsabilité limitée (sans autre indication)'
  },
  {
    code: 5505,
    name: "SA à participation ouvrière à conseil d'administration"
  },
  { code: 5510, name: "SA nationale à conseil d'administration" },
  { code: 5515, name: "SA d'économie mixte à conseil d'administration" },
  { code: 5520, name: "Fonds à forme sociétale à conseil d'administration" },
  {
    code: 5522,
    name: "SA immobilière pour le commerce et l'industrie (SICOMI) à conseil d'administration"
  },
  {
    code: 5525,
    name: "SA immobilière d'investissement à conseil d'administration"
  },
  {
    code: 5530,
    name: "SA d'aménagement foncier et d'équipement rural (SAFER) à conseil d'administration"
  },
  {
    code: 5531,
    name: "Société anonyme mixte d'intérêt agricole (SMIA) à conseil d'administration"
  },
  {
    code: 5532,
    name: "SA d'intérêt collectif agricole (SICA) à conseil d'administration"
  },
  { code: 5542, name: "SA d'attribution à conseil d'administration" },
  {
    code: 5543,
    name: "SA coopérative de construction à conseil d'administration"
  },
  { code: 5546, name: "SA de HLM à conseil d'administration" },
  {
    code: 5547,
    name: "SA coopérative de production de HLM à conseil d'administration"
  },
  { code: 5548, name: "SA de crédit immobilier à conseil d'administration" },
  {
    code: 5551,
    name: "SA coopérative de consommation à conseil d'administration"
  },
  {
    code: 5552,
    name: "SA coopérative de commerçants-détaillants à conseil d'administration"
  },
  { code: 5553, name: "SA coopérative artisanale à conseil d'administration" },
  {
    code: 5554,
    name: "SA coopérative (d'intérêt) maritime à conseil d'administration"
  },
  {
    code: 5555,
    name: "SA coopérative de transport à conseil d'administration"
  },
  {
    code: 5558,
    name: "SA coopérative ouvrière de production (SCOP) à conseil d'administration"
  },
  {
    code: 5559,
    name: "SA union de sociétés coopératives à conseil d'administration"
  },
  { code: 5560, name: "Autre SA coopérative à conseil d'administration" },
  {
    code: 5570,
    name:
      "Société de Participations Financières de Profession Libérale Société anonyme à conseil d'administration (SPFPL SA à conseil d'administration)"
  },
  {
    code: 5585,
    name: "Société d'exercice libéral à forme anonyme à conseil d'administration"
  },
  { code: 5599, name: "SA à conseil d'administration (s.a.i.)" },
  { code: 5605, name: 'SA à participation ouvrière à directoire' },
  { code: 5610, name: 'SA nationale à directoire' },
  { code: 5615, name: "SA d'économie mixte à directoire" },
  { code: 5620, name: 'Fonds à forme sociétale à directoire' },
  {
    code: 5622,
    name: "SA immobilière pour le commerce et l'industrie (SICOMI) à directoire"
  },
  { code: 5625, name: "SA immobilière d'investissement à directoire" },
  { code: 5630, name: 'Safer anonyme à directoire' },
  { code: 5631, name: "SA mixte d'intérêt agricole (SMIA)" },
  { code: 5632, name: "SA d'intérêt collectif agricole (SICA)" },
  { code: 5642, name: "SA d'attribution à directoire" },
  { code: 5643, name: 'SA coopérative de construction à directoire' },
  { code: 5646, name: 'SA de HLM à directoire' },
  {
    code: 5647,
    name: 'Société coopérative de production de HLM anonyme à directoire'
  },
  { code: 5648, name: 'SA de crédit immobilier à directoire' },
  { code: 5651, name: 'SA coopérative de consommation à directoire' },
  {
    code: 5652,
    name: 'SA coopérative de commerçants-détaillants à directoire'
  },
  { code: 5653, name: 'SA coopérative artisanale à directoire' },
  { code: 5654, name: "SA coopérative d'intérêt maritime à directoire" },
  { code: 5655, name: 'SA coopérative de transport à directoire' },
  {
    code: 5658,
    name: 'SA coopérative ouvrière de production (SCOP) à directoire'
  },
  { code: 5659, name: 'SA union de sociétés coopératives à directoire' },
  { code: 5660, name: 'Autre SA coopérative à directoire' },
  {
    code: 5670,
    name: 'Société de Participations Financières de Profession Libérale Société anonyme à Directoire (SPFPL SA à directoire)'
  },
  {
    code: 5685,
    name: "Société d'exercice libéral à forme anonyme à directoire"
  },
  { code: 5699, name: 'SA à directoire (s.a.i.)' },
  { code: 5710, name: 'SAS, société par actions simplifiée' },
  {
    code: 5720,
    name: 'Société par actions simplifiée à associé unique ou société par actions simplifiée unipersonnelle'
  },
  {
    code: 5770,
    name: 'Société de Participations Financières de Profession Libérale Société par actions simplifiée (SPFPL SAS)'
  },
  { code: 5785, name: "Société d'exercice libéral par action simplifiée" },
  { code: 5800, name: 'Société européenne' },
  { code: 6100, name: "Caisse d'Épargne et de Prévoyance" },
  { code: 6210, name: "Groupement européen d'intérêt économique (GEIE)" },
  { code: 6220, name: "Groupement d'intérêt économique (GIE)" },
  {
    code: 6316,
    name: "Coopérative d'utilisation de matériel agricole en commun (CUMA)"
  },
  { code: 6317, name: 'Société coopérative agricole' },
  { code: 6318, name: 'Union de sociétés coopératives agricoles' },
  { code: 6411, name: "Société d'assurance à forme mutuelle" },
  { code: 6511, name: 'Sociétés Interprofessionnelles de Soins Ambulatoires ' },
  {
    code: 6521,
    name: 'Société civile de placement collectif immobilier (SCPI)'
  },
  { code: 6532, name: "Société civile d'intérêt collectif agricole (SICA)" },
  { code: 6533, name: "Groupement agricole d'exploitation en commun (GAEC)" },
  { code: 6534, name: 'Groupement foncier agricole' },
  { code: 6535, name: 'Groupement agricole foncier' },
  { code: 6536, name: 'Groupement forestier' },
  { code: 6537, name: 'Groupement pastoral' },
  { code: 6538, name: 'Groupement foncier et rural' },
  { code: 6539, name: 'Société civile foncière' },
  { code: 6540, name: 'Société civile immobilière' },
  { code: 6541, name: 'Société civile immobilière de construction-vente' },
  { code: 6542, name: "Société civile d'attribution" },
  { code: 6543, name: 'Société civile coopérative de construction' },
  {
    code: 6544,
    name: "Société civile immobilière d' accession progressive à la propriété"
  },
  { code: 6551, name: 'Société civile coopérative de consommation' },
  { code: 6554, name: "Société civile coopérative d'intérêt maritime" },
  { code: 6558, name: 'Société civile coopérative entre médecins' },
  { code: 6560, name: 'Autre société civile coopérative' },
  { code: 6561, name: "SCP d'avocats" },
  { code: 6562, name: "SCP d'avocats aux conseils" },
  { code: 6563, name: "SCP d'avoués d'appel" },
  { code: 6564, name: "SCP d'huissiers" },
  { code: 6565, name: 'SCP de notaires' },
  { code: 6566, name: 'SCP de commissaires-priseurs' },
  { code: 6567, name: 'SCP de greffiers de tribunal de commerce' },
  { code: 6568, name: 'SCP de conseils juridiques' },
  { code: 6569, name: 'SCP de commissaires aux comptes' },
  { code: 6571, name: 'SCP de médecins' },
  { code: 6572, name: 'SCP de dentistes' },
  { code: 6573, name: "SCP d'infirmiers" },
  { code: 6574, name: 'SCP de masseurs-kinésithérapeutes' },
  { code: 6575, name: "SCP de directeurs de laboratoire d'analyse médicale" },
  { code: 6576, name: 'SCP de vétérinaires' },
  { code: 6577, name: 'SCP de géomètres experts' },
  { code: 6578, name: "SCP d'architectes" },
  { code: 6585, name: 'Autre société civile professionnelle' },
  { code: 6588, name: 'Société civile laitière' },
  { code: 6589, name: 'Société civile de moyens' },
  { code: 6595, name: 'Caisse locale de crédit mutuel' },
  { code: 6596, name: 'Caisse de crédit agricole mutuel' },
  { code: 6597, name: "Société civile d'exploitation agricole" },
  { code: 6598, name: 'Exploitation agricole à responsabilité limitée' },
  { code: 6599, name: 'Autre société civile' },
  {
    code: 6901,
    name: 'Autre personne de droit privé inscrite au registre du commerce et des sociétés'
  },
  { code: 7111, name: 'Autorité constitutionnelle' },
  { code: 7112, name: 'Autorité administrative ou publique indépendante' },
  { code: 7113, name: 'Ministère' },
  { code: 7120, name: "Service central d'un ministère" },
  { code: 7150, name: 'Service du ministère de la Défense' },
  {
    code: 7160,
    name: "Service déconcentré à compétence nationale d'un ministère (hors Défense)"
  },
  {
    code: 7171,
    name: "Service déconcentré de l'État à compétence (inter) régionale"
  },
  {
    code: 7172,
    name: "Service déconcentré de l'État à compétence (inter) départementale"
  },
  {
    code: 7179,
    name: "(Autre) Service déconcentré de l'État à compétence territoriale"
  },
  { code: 7190, name: 'Ecole nationale non dotée de la personnalité morale' },
  { code: 7210, name: 'Commune et commune nouvelle' },
  { code: 7220, name: 'Département' },
  { code: 7225, name: "Collectivité et territoire d'Outre Mer" },
  { code: 7229, name: '(Autre) Collectivité territoriale' },
  { code: 7230, name: 'Région' },
  { code: 7312, name: 'Commune associée et commune déléguée' },
  { code: 7313, name: 'Section de commune' },
  { code: 7314, name: 'Ensemble urbain' },
  { code: 7321, name: 'Association syndicale autorisée' },
  { code: 7322, name: 'Association foncière urbaine' },
  { code: 7323, name: 'Association foncière de remembrement' },
  { code: 7331, name: "Établissement public local d'enseignement" },
  { code: 7340, name: 'Pôle métropolitain' },
  { code: 7341, name: 'Secteur de commune' },
  { code: 7342, name: 'District urbain' },
  { code: 7343, name: 'Communauté urbaine' },
  { code: 7344, name: 'Métropole' },
  { code: 7345, name: 'Syndicat intercommunal à vocation multiple (SIVOM)' },
  { code: 7346, name: 'Communauté de communes' },
  { code: 7347, name: 'Communauté de villes' },
  { code: 7348, name: "Communauté d'agglomération" },
  {
    code: 7349,
    name: 'Autre établissement public local de coopération non spécialisé ou entente'
  },
  { code: 7351, name: 'Institution interdépartementale ou entente' },
  { code: 7352, name: 'Institution interrégionale ou entente' },
  { code: 7353, name: 'Syndicat intercommunal à vocation unique (SIVU)' },
  { code: 7354, name: 'Syndicat mixte fermé' },
  { code: 7355, name: 'Syndicat mixte ouvert' },
  {
    code: 7356,
    name: 'Commission syndicale pour la gestion des biens indivis des communes'
  },
  { code: 7357, name: "Pôle d'équilibre territorial et rural (PETR)" },
  { code: 7361, name: "Centre communal d'action sociale" },
  { code: 7362, name: 'Caisse des écoles' },
  { code: 7363, name: 'Caisse de crédit municipal' },
  { code: 7364, name: "Établissement d'hospitalisation" },
  { code: 7365, name: 'Syndicat inter hospitalier' },
  { code: 7366, name: 'Établissement public local social et médico-social' },
  { code: 7367, name: "Centre Intercommunal d'action sociale (CIAS)" },
  { code: 7371, name: "Office public d'habitation à loyer modéré (OPHLM)" },
  { code: 7372, name: "Service départemental d'incendie et de secours (SDIS)" },
  { code: 7373, name: 'Établissement public local culturel' },
  {
    code: 7378,
    name: "Régie d'une collectivité locale à caractère administratif"
  },
  { code: 7379, name: '(Autre) Établissement public administratif local' },
  { code: 7381, name: 'Organisme consulaire' },
  {
    code: 7382,
    name: "Établissement public national ayant fonction d'administration centrale"
  },
  {
    code: 7383,
    name: 'Établissement public national à caractère scientifique culturel et professionnel'
  },
  { code: 7384, name: "Autre établissement public national d'enseignement" },
  {
    code: 7385,
    name: 'Autre établissement public national administratif à compétence territoriale limitée'
  },
  {
    code: 7389,
    name: 'Établissement public national à caractère administratif'
  },
  { code: 7410, name: "Groupement d'intérêt public (GIP)" },
  { code: 7430, name: "Établissement public des cultes d'Alsace-Lorraine" },
  {
    code: 7450,
    name: 'Adresse public administratif, cercle et foyer dans les armées'
  },
  {
    code: 7470,
    name: 'Groupement de coopération sanitaire à gestion publique'
  },
  { code: 7490, name: 'Autre personne morale de droit administratif' },
  { code: 8110, name: 'Régime général de la Sécurité Sociale' },
  { code: 8120, name: 'Régime spécial de Sécurité Sociale' },
  { code: 8130, name: 'Institution de retraite complémentaire' },
  { code: 8140, name: 'Mutualité sociale agricole' },
  { code: 8150, name: 'Régime maladie des non-salariés non agricoles' },
  {
    code: 8160,
    name: 'Régime vieillesse ne dépendant pas du régime général de la Sécurité Sociale'
  },
  { code: 8170, name: "Régime d'assurance chômage" },
  { code: 8190, name: 'Autre régime de prévoyance sociale' },
  { code: 8210, name: 'Mutuelle' },
  { code: 8250, name: 'Assurance mutuelle agricole' },
  { code: 8290, name: 'Autre organisme mutualiste' },
  { code: 8310, name: "Comité central d'entreprise" },
  { code: 8311, name: "Comité d'établissement" },
  { code: 8410, name: 'Syndicat de salariés' },
  { code: 8420, name: 'Syndicat patronal' },
  { code: 8450, name: 'Ordre professionnel ou assimilé' },
  {
    code: 8470,
    name: 'Centre technique industriel ou comité professionnel du développement économique'
  },
  { code: 8490, name: 'Autre organisme professionnel' },
  { code: 8510, name: 'Institution de prévoyance' },
  { code: 8520, name: 'Institution de retraite supplémentaire' },
  { code: 9110, name: 'Syndicat de copropriété' },
  { code: 9150, name: 'Association syndicale libre' },
  { code: 9210, name: 'Association non déclarée' },
  { code: 9220, name: 'Association déclarée' },
  { code: 9221, name: "Association déclarée d'insertion par l'économique" },
  { code: 9222, name: 'Association intermédiaire' },
  { code: 9223, name: "Groupement d'employeurs" },
  {
    code: 9224,
    name: "Association d'avocats à responsabilité professionnelle individuelle"
  },
  { code: 9230, name: "Association déclarée, reconnue d'utilité publique" },
  { code: 9240, name: 'Congrégation' },
  {
    code: 9260,
    name: 'Association de droit local (Bas-Rhin, Haut-Rhin et Moselle)'
  },
  { code: 9300, name: 'Fondation' },
  { code: 9900, name: 'Autre personne morale de droit privé' },
  { code: 9970, name: 'Groupement de coopération sanitaire à gestion privée' }
]
