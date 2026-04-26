// ─── QUIZ DATA - STRUCTURE OFFICIELLE MENFP 2024 ────────────────────────────
// Généré selon les programmes du secondaire haïtien
// Catégories: SVT, SES, SMP, LLA

export const QUIZ_DATA = {
  // ──────────────────────────────────────────────────────────────────────────
  // 🧬 SVT (Sciences de la Vie et de la Terre)
  // ──────────────────────────────────────────────────────────────────────────
  
  "Biologie": [
    {
      q: "L'ADN est composé de : ",
      choices: ["Acides aminés", "Nucléotides", "Acides gras", "Glucose"],
      answer: 1,
      note: "L'ADN est un polynucléotide (base azotée + désoxyribose + phosphate)."
    },
    {
      q: "Les bases azotées de l'ADN sont : ",
      choices: [
        "Adénine, Uracile, Guanine, Cytosine",
        "Adénine, Thymine, Guanine, Cytosine (A-T et G-C)",
        "Adénine, Thymine, Uracile, Cytosine",
        "Guanine, Uracile, Thymine, Adénine"
      ],
      answer: 1,
      note: "ADN : 4 bases — A, T, G, C. Paires complémentaires : A-T (2 liaisons H) et G-C (3 liaisons H)."
    },
    {
      q: "La cellule est l'unité de base de : ",
      choices: ["La matière", "La vie", "L'énergie", "La lumière"],
      answer: 1,
      note: "La cellule est l'unité structurelle et fonctionnelle de tous les êtres vivants."
    },
    {
      q: "La photosynthèse se produit dans : ",
      choices: ["Les mitochondries", "Les chloroplastes", "Le noyau", "Les ribosomes"],
      answer: 1,
      note: "Les chloroplastes contiennent la chlorophylle et sont le siège de la photosynthèse."
    },
    {
      q: "L'appareil de Golgi a pour fonction : ",
      choices: [
        "Produire de l'énergie",
        "Trier et distribuer les protéines vers leur destination",
        "Répliquer l'ADN",
        "Effectuer la photosynthèse"
      ],
      answer: 1,
      note: "L'appareil de Golgi trie, modifie et dirige les protéines vers leur destination (sécrétion, membrane...)."
    },    {
      q: "Les lysosomes contiennent : ",
      choices: ["De l'ADN", "Des enzymes digestives hydrolytiques", "De la chlorophylle", "Des ribosomes"],
      answer: 1,
      note: "Les lysosomes contiennent des enzymes hydrolytiques pour digérer les déchets cellulaires."
    },
    {
      q: "La thyroïde produit : ",
      choices: [
        "L'insuline",
        "La thyroxine (T3, T4) régulant le métabolisme",
        "L'adrénaline",
        "Le glucagon"
      ],
      answer: 1,
      note: "La thyroïde produit la thyroxine (T3, T4) qui régule le métabolisme basal et la croissance."
    },
    {
      q: "La méiose produit : ",
      choices: [
        "2 cellules diploïdes identiques",
        "4 cellules haploïdes génétiquement différentes",
        "2 cellules haploïdes",
        "4 cellules diploïdes différentes"
      ],
      answer: 1,
      note: "Méiose : 4 cellules haploïdes (n) par brassage génétique (crossing-over en prophase I + ségrégation aléatoire)."
    },
    {
      q: "Le crossing-over se produit lors de : ",
      choices: ["La mitose", "La prophase I de la méiose", "La phase S", "La télophase II"],
      answer: 1,
      note: "Crossing-over en prophase I : échange de segments entre chromosomes homologues → brassage intrachromosomique."
    },
    {
      q: "Un gamète humain contient : ",
      choices: ["46 chromosomes", "23 chromosomes", "48 chromosomes", "22 chromosomes"],
      answer: 1,
      note: "Gamètes (spermatozoïde, ovule) : n = 23 chromosomes (22 autosomes + 1 gonosome X ou Y)."
    }
  ],
  
  "Géologie": [
    {
      q: "Les fossiles sont importants car ils permettent : ",
      choices: [
        "Uniquement de dater les roches",
        "De reconstituer l'histoire de la vie et de dater les strates géologiques",
        "De prédire les tremblements de terre",
        "De trouver du pétrole uniquement"      ],
      answer: 1,
      note: "Fossiles = restes/traces d'êtres vivants dans les roches. Permettent : datation relative, reconstitution des paléoenvironnements, évolution."
    },
    {
      q: "La stratigraphie étudie : ",
      choices: [
        "Les êtres vivants actuels",
        "Les couches (strates) géologiques et leur succession chronologique",
        "Les volcans",
        "Les tremblements de terre"
      ],
      answer: 1,
      note: "Stratigraphie : étude des strates pour reconstituer l'histoire de la Terre."
    },
    {
      q: "Le principe de superposition dit que : ",
      choices: [
        "La couche la plus récente est en bas",
        "La couche la plus ancienne est en bas, la plus récente en haut",
        "Toutes les couches ont le même âge",
        "Les couches sont horizontales"
      ],
      answer: 1,
      note: "Principe de Sténon : dans une série sédimentaire non déformée, la couche la plus ancienne est en bas."
    },
    {
      q: "La tectonique des plaques explique : ",
      choices: [
        "Uniquement les volcans",
        "Les mouvements des lithosphères, les séismes, les volcans, la formation des montagnes",
        "Uniquement les séismes",
        "La formation des océans uniquement"
      ],
      answer: 1,
      note: "Tectonique des plaques (1960s) : lithosphère découpée en plaques mobiles sur l'asthénosphère."
    },
    {
      q: "Les roches sédimentaires se forment par : ",
      choices: [
        "La solidification du magma",
        "L'accumulation et la lithification de sédiments",
        "La métamorphose sous haute pression",
        "La fusion de roches existantes"
      ],
      answer: 1,
      note: "Roches sédimentaires (calcaire, grès, argile) : sédiments déposés → compaction → lithification (diagenèse)."
    },
    {
      q: "La théorie de la dérive des continents (Wegener) propose que : ",      choices: [
        "Les continents sont fixes",
        "Les continents actuels proviennent d'un supercontinent (Pangée) fragmenté",
        "Les océans se forment par évaporation",
        "Les montagnes se forment par compression de l'air"
      ],
      answer: 1,
      note: "Wegener (1912) : la Pangée s'est fragmentée il y a ~200 Ma."
    },
    {
      q: "La radioactivité permet une datation : ",
      choices: [
        "Relative uniquement",
        "Absolute (en années) grâce à la demi-vie des isotopes",
        "Impossible",
        "Uniquement pour les fossiles récents"
      ],
      answer: 1,
      note: "Datation absolue : mesure du rapport isotope père/isotope fils. Ex: ¹⁴C (5730 ans), ⁴⁰K/⁴⁰Ar (1,3 Ga)."
    },
    {
      q: "La demi-vie radioactive est : ",
      choices: [
        "Le temps de vie totale d'un atome",
        "Le temps nécessaire pour que la moitié des noyaux radioactifs se désintègrent",
        "La durée d'une éruption volcanique",
        "Le temps de formation d'un fossile"
      ],
      answer: 1,
      note: "Demi-vie (t½) = temps pour que 50% des noyaux parents se désintègrent."
    },
    {
      q: "L'île d'Hispaniola est partagée entre : ",
      choices: [
        "Haïti et Cuba",
        "Haïti et la République Dominicaine",
        "Haïti et Porto Rico",
        "Haïti et la Jamaïque"
      ],
      answer: 1,
      note: "Hispaniola = Haïti (ouest) + République Dominicaine (est)."
    },
    {
      q: "La superficie d'Haïti est d'environ : ",
      choices: ["27 750 km²", "50 000 km²", "10 000 km²", "100 000 km²"],
      answer: 0,
      note: "Haïti = 27 750 km² (tiers occidental d'Hispaniola)."
    }
  ],
    "Chimie": [
    {
      q: "La loi des gaz parfaits est : ",
      choices: ["PV = nRT", "P = V/nRT", "PV = T/nR", "PVT = nR"],
      answer: 0,
      note: "PV = nRT (R = 8,314 J/mol·K). Valable pour gaz parfaits (faible pression, haute température)."
    },
    {
      q: "La loi de Boyle-Mariotte (T constant) est : ",
      choices: ["PV = constante", "V/T = constante", "P/T = constante", "P = V²"],
      answer: 0,
      note: "Boyle-Mariotte (isotherme) : à T constant, P×V = constante."
    },
    {
      q: "La loi de Gay-Lussac (V constant) est : ",
      choices: ["PV = constante", "P/T = constante (P₁/T₁ = P₂/T₂)", "V/T = constante", "PT = constante"],
      answer: 1,
      note: "Gay-Lussac (isochore) : à V constant, P/T = constante."
    },
    {
      q: "La potasse est : ",
      choices: ["KOH (base forte)", "NaOH", "Ca(OH)₂", "Mg(OH)₂"],
      answer: 0,
      note: "Potasse : KOH (base forte). Soude : NaOH."
    },
    {
      q: "Le carbone asymétrique est lié à : ",
      choices: ["4 atomes identiques", "4 groupes différents", "2 doubles liaisons", "Un atome H seulement"],
      answer: 1,
      note: "Carbone asymétrique (C*) : C lié à 4 substituants différents → énantiomères."
    },
    {
      q: "Un alcool primaire possède le groupe : ",
      choices: ["-COOH", "-CHO", "-CH₂OH", "-C=O"],
      answer: 2,
      note: "Alcool primaire : groupe -CH₂OH."
    },
    {
      q: "Un aldéhyde possède le groupe fonctionnel : ",
      choices: ["-COOH", "-CHO (en bout de chaîne)", "-C=O entre deux C", "-OH"],
      answer: 1,
      note: "Aldéhyde : groupe -CHO en bout de chaîne."
    },
    {
      q: "Une cétone possède le groupe fonctionnel : ",
      choices: ["-COOH", "-CHO", "-C=O entre deux carbones", "-NH₂"],
      answer: 2,
      note: "Cétone : groupe carbonyle -C(=O)- entre deux carbones."
    },
    {      q: "Un acide carboxylique possède le groupe : ",
      choices: ["-COOH", "-CHO", "-COO⁻", "-OH"],
      answer: 0,
      note: "Acide carboxylique : -COOH."
    },
    {
      q: "La saponification est : ",
      choices: [
        "Une réaction acide-base",
        "Une base forte (NaOH) + ester → savon + alcool",
        "Un alcool",
        "L'eau seule"
      ],
      answer: 1,
      note: "Saponification (totale et irréversible) : ester + NaOH → sel d'acide carboxylique (savon) + alcool."
    }
  ],
  
  // ──────────────────────────────────────────────────────────────────────────
  // 🌍 SES (Sciences Économiques et Sociales)
  // ──────────────────────────────────────────────────────────────────────────
  
  "Histoire": [
    {
      q: "L'occupation américaine d'Haïti a duré de : ",
      choices: ["1804 à 1820", "1915 à 1934", "1930 à 1960", "1800 à 1815"],
      answer: 1,
      note: "L'occupation américaine d'Haïti : 28 juillet 1915 → 15 août 1934 (19 ans)."
    },
    {
      q: "Charlemagne Péralte fut : ",
      choices: [
        "Un président haïtien",
        "Le chef de la résistance haïtienne contre l'occupation américaine (1915-1934)",
        "Un écrivain haïtien",
        "Un général français"
      ],
      answer: 1,
      note: "Charlemagne Péralte (1885-1919) : leader des Cacos, résista à l'occupation américaine."
    },
    {
      q: "Bois Caïman (1791) représente : ",
      choices: [
        "Une bataille militaire",
        "La cérémonie vodou qui lança l'insurrection des esclaves",
        "La proclamation de l'indépendance",
        "Un traité de paix"
      ],
      answer: 1,
      note: "Bois Caïman : cérémonie vodou du 14 août 1791 — lancée par Dutty Boukman."    },
    {
      q: "L'indépendance d'Haïti a été proclamée le : ",
      choices: ["1er janvier 1804", "18 novembre 1803", "30 novembre 1803", "9 février 1807"],
      answer: 0,
      note: "1er janvier 1804 : Dessalines proclame l'indépendance à Gonaïves."
    },
    {
      q: "La dette d'indépendance haïtienne imposée par la France en 1825 a été : ",
      choices: [
        "Refusée par Haïti",
        "Payée jusqu'en 1947 — fardeau économique historique énorme",
        "Annulée après 10 ans",
        "Partiellement payée"
      ],
      answer: 1,
      note: "Haïti a payé la 'dette coloniale' à la France (1825-1947) — environ 150 millions de francs-or."
    },
    {
      q: "Le BUNEXE est l'organisme haïtien qui : ",
      choices: [
        "Gère les banques",
        "Organise les examens officiels (Baccalauréat)",
        "Distribue l'aide internationale",
        "Gère les passeports"
      ],
      answer: 1,
      note: "BUNEXE = Bureau National des Examens d'État — organise le Baccalauréat en Haïti."
    },
    {
      q: "La Révolution cubaine (1959) a été menée par : ",
      choices: ["Batista", "Fidel Castro et Che Guevara", "Simon Bolívar", "Toussaint Louverture"],
      answer: 1,
      note: "Révolution cubaine (1959) : Fidel Castro, Che Guevara."
    },
    {
      q: "Le Conseil de sécurité de l'ONU a combien de membres permanents ? ",
      choices: ["3", "5", "7", "15"],
      answer: 1,
      note: "5 membres permanents : États-Unis, Russie, Chine, Royaume-Uni, France (droit de veto)."
    },
    {
      q: "Les Objectifs du Développement Durable (ODD) ont été adoptés en : ",
      choices: ["2000", "2005", "2015", "2020"],
      answer: 2,
      note: "Les 17 ODD ont été adoptés en septembre 2015 (Agenda 2030)."
    },
    {
      q: "Toussaint Louverture a été : ",
      choices: [        "Un président haïtien",
        "Le leader de la Révolution haïtienne (1743-1803)",
        "Un écrivain français",
        "Un général américain"
      ],
      answer: 1,
      note: "Toussaint Louverture (1743-1803) : leader de la Révolution haïtienne, gouverneur de Saint-Domingue."
    }
  ],
  
  "Géographie": [
    {
      q: "Haïti est située : ",
      choices: [
        "Dans l'océan Pacifique",
        "Dans les Caraïbes, sur l'île d'Hispaniola",
        "En Amérique du Sud",
        "En Afrique de l'Ouest"
      ],
      answer: 1,
      note: "Haïti occupe le tiers occidental de l'île d'Hispaniola (Caraïbes)."
    },
    {
      q: "La capitale d'Haïti est : ",
      choices: ["Cap-Haïtien", "Port-au-Prince", "Jacmel", "Les Cayes"],
      answer: 1,
      note: "Port-au-Prince = capitale politique et économique d'Haïti depuis 1770."
    },
    {
      q: "Le point culminant d'Haïti est : ",
      choices: ["La Selle (2680m)", "La Hotte (2347m)", "Le Morne du Cibao", "La Montagne Noire"],
      answer: 0,
      note: "Pic la Selle (2680m) = point culminant d'Haïti, dans le Massif de la Selle (Sud-Est)."
    },
    {
      q: "Le principal fleuve d'Haïti est : ",
      choices: ["L'Artibonite", "La Guayamouc", "Le Limbé", "La Rivière Froide"],
      answer: 0,
      note: "L'Artibonite = plus long fleuve d'Haïti (320 km)."
    },
    {
      q: "Haïti partage l'île d'Hispaniola avec : ",
      choices: ["Cuba", "La République Dominicaine", "Jamaïque", "Porto Rico"],
      answer: 1,
      note: "Hispaniola = île partagée entre Haïti (ouest, 1/3) et République Dominicaine (est, 2/3)."
    },
    {
      q: "La population d'Haïti est d'environ : ",
      choices: ["5 millions", "12 millions", "20 millions", "50 millions"],
      answer: 1,      note: "Haïti ≈ 12 millions d'habitants (2024)."
    },
    {
      q: "La monnaie haïtienne est : ",
      choices: ["Le dollar", "La gourde", "L'euro", "Le peso"],
      answer: 1,
      note: "La gourde (HTG) = monnaie nationale d'Haïti depuis 1813."
    },
    {
      q: "Les langues officielles d'Haïti sont : ",
      choices: [
        "Français seulement",
        "Créole et français",
        "Anglais et espagnol",
        "Créole seulement"
      ],
      answer: 1,
      note: "Article 5 Constitution 1987 : Créole et français = langues officielles."
    },
    {
      q: "Le séisme de 2010 a eu lieu le : ",
      choices: ["12 janvier 2010", "1er janvier 2010", "12 février 2010", "20 mars 2010"],
      answer: 0,
      note: "Séisme du 12 janvier 2010 : magnitude 7.0, ~230 000 morts."
    },
    {
      q: "La Caraïbe est une région : ",
      choices: [
        "D'Amérique du Nord",
        "D'Amérique centrale et des Antilles",
        "D'Europe",
        "D'Asie"
      ],
      answer: 1,
      note: "Caraïbe = région des Antilles + Amérique centrale."
    }
  ],
  
  "Économie": [
    {
      q: "La pauvreté multidimensionnelle (PNUD) prend en compte : ",
      choices: [
        "Uniquement le revenu",
        "Le revenu + l'accès à l'éducation + la santé + les conditions de vie",
        "Uniquement l'accès à la nourriture",
        "La richesse culturelle uniquement"
      ],
      answer: 1,
      note: "Pauvreté multidimensionnelle (PNUD) : combine revenus, santé, éducation, eau, assainissement."
    },    {
      q: "En Haïti, le principal défi économique est : ",
      choices: [
        "L'excès de richesse",
        "La pauvreté, la faible industrialisation, l'instabilité politique et les catastrophes naturelles",
        "La surpopulation uniquement",
        "L'excès d'importations uniquement"
      ],
      answer: 1,
      note: "Défis haïtiens : pauvreté (60%+), faible industrialisation, instabilité politique."
    },
    {
      q: "Le secteur informel en Haïti représente : ",
      choices: [
        "Une part négligeable",
        "La majorité de l'activité économique haïtienne (commerce, artisanat, agriculture de subsistance)",
        "Uniquement les activités illégales",
        "Le secteur industriel"
      ],
      answer: 1,
      note: "En Haïti, l'économie informelle représente environ 70-80% de l'activité économique."
    },
    {
      q: "Le 'coumbite' dans 'Gouverneurs de la Rosée' représente : ",
      choices: [
        "Un rite vodou",
        "La tradition haïtienne du travail collectif solidaire (coopérative agricole paysanne)",
        "Un combat politique",
        "Une danse folklorique"
      ],
      answer: 1,
      note: "Le coumbite : tradition paysanne haïtienne de travail collectif — symbole de solidarité."
    },
    {
      q: "La concurrence dans un marché : ",
      choices: [
        "Détruit les entreprises",
        "Stimule l'innovation, la qualité et la réduction des prix au profit des consommateurs",
        "Augmente toujours les prix",
        "Crée des monopoles"
      ],
      answer: 1,
      note: "Concurrence : force qui pousse les entreprises à innover, améliorer leur qualité."
    },
    {
      q: "Le 'pitch' d'un projet entrepreneurial est : ",
      choices: [
        "Un document comptable",
        "Une présentation courte et percutante du projet devant des investisseurs ou partenaires potentiels",
        "Un plan financier détaillé",        "Un contrat de travail"
      ],
      answer: 1,
      note: "Pitch = présentation courte (3-5 min) pour convaincre investisseurs."
    },
    {
      q: "L'analyse SWOT d'une entreprise étudie : ",
      choices: [
        "Seulement les forces",
        "Forces, Faiblesses, Opportunités, Menaces",
        "Seulement les opportunités et menaces",
        "Les finances uniquement"
      ],
      answer: 1,
      note: "SWOT : Forces + Faiblesses (internes) + Opportunités + Menaces (externes)."
    },
    {
      q: "Le marketing digital inclut : ",
      choices: [
        "Uniquement les affiches",
        "SEO, réseaux sociaux, email, publicité en ligne (Google/Facebook Ads)",
        "Uniquement la radio",
        "Uniquement la télévision"
      ],
      answer: 1,
      note: "Marketing digital : SEO, réseaux sociaux, email, content marketing, publicité en ligne."
    },
    {
      q: "La mobilité sociale ascendante désigne : ",
      choices: [
        "Le déplacement géographique",
        "Le passage vers un statut social supérieur",
        "La descente dans la hiérarchie",
        "L'immobilité sociale"
      ],
      answer: 1,
      note: "Mobilité sociale ascendante = passage d'une classe inférieure à une classe supérieure."
    },
    {
      q: "Le PIB (Produit Intérieur Brut) mesure : ",
      choices: [
        "La population d'un pays",
        "La richesse produite dans un pays en un an",
        "Le nombre d'entreprises",
        "Le taux de chômage"
      ],
      answer: 1,
      note: "PIB = valeur totale des biens et services produits dans un pays en un an."
    }
  ],  
  "Philosophie": [
    {
      q: "Kant définit l'autonomie morale comme : ",
      choices: [
        "Obéir aux désirs",
        "Se donner à soi-même sa propre loi morale (liberté = autonomie de la raison)",
        "Obéir à l'État",
        "Suivre ses instincts"
      ],
      answer: 1,
      note: "Kant : autonomie = se donner la loi morale par la raison."
    },
    {
      q: "En Haïti, la liberté est devenue un idéal national grâce à : ",
      choices: [
        "La colonisation française",
        "La Révolution de 1804 — première révolution d'esclaves qui conquit la liberté par les armes",
        "L'aide américaine",
        "L'influence espagnole"
      ],
      answer: 1,
      note: "Haïti (1804) : première république noire indépendante."
    },
    {
      q: "Hobbes décrit l'état de nature comme : ",
      choices: [
        "Un paradis de liberté",
        "Une guerre de tous contre tous (bellum omnium contra omnes)",
        "Un état de coopération",
        "Une communauté harmonieuse"
      ],
      answer: 1,
      note: "Léviathan (1651) : sans État, la vie est 'solitaire, pauvre, méchante, brutale et courte'."
    },
    {
      q: "La logique formelle distingue vrai/faux selon : ",
      choices: [
        "Le principe de causalité",
        "Le principe de bivalence (toute proposition est vraie ou fausse)",
        "Le principe de relativité",
        "Le principe de plaisir"
      ],
      answer: 1,
      note: "Logique classique : principe de bivalence + non-contradiction + tiers exclu."
    },
    {
      q: "Descartes affirme 'Je pense donc je suis' (Cogito ergo sum) comme : ",
      choices: [
        "Une croyance religieuse",        "La première certitude indubitable — la conscience de penser prouve l'existence",
        "Une opinion",
        "Une révélation divine"
      ],
      answer: 1,
      note: "Cogito ergo sum (Méditations, 1641) : la conscience de penser est la seule certitude indubitable."
    },
    {
      q: "Selon Freud, l'inconscient est : ",
      choices: [
        "Identique à la conscience",
        "La partie du psychisme échappant à la conscience (refoulé, pulsions)",
        "Le cerveau en sommeil",
        "Une invention philosophique sans réalité"
      ],
      answer: 1,
      note: "Freud : l'inconscient (ça, surmoi) contient des désirs refoulés."
    },
    {
      q: "La conscience morale est : ",
      choices: [
        "La conscience perceptive",
        "La capacité de distinguer le bien du mal et de se juger soi-même",
        "La mémoire",
        "L'imagination"
      ],
      answer: 1,
      note: "Conscience morale = jugement de valeur sur nos actions (bien/mal, devoir)."
    },
    {
      q: "Durkheim est connu pour son étude sur : ",
      choices: [
        "La lutte des classes",
        "Le suicide comme fait social (Le Suicide, 1897)",
        "La bureaucratie",
        "La révolution prolétarienne"
      ],
      answer: 1,
      note: "Durkheim : le suicide est un fait social lié à l'intégration et la régulation sociale."
    },
    {
      q: "Le droit à l'éducation est reconnu par : ",
      choices: [
        "Uniquement la Constitution haïtienne",
        "La Constitution haïtienne de 1987 (Art. 32) et la DUDH (Art. 26)",
        "Aucun texte international",
        "Uniquement dans les pays développés"
      ],
      answer: 1,
      note: "Art. 26 DUDH + Art. 32 Constitution haïtienne : l'éducation est un droit fondamental."    },
    {
      q: "La théorie du contrat social de Rousseau affirme que : ",
      choices: [
        "L'État est naturel et antérieur aux hommes",
        "La société est fondée sur un accord visant le bien commun (volonté générale)",
        "Le roi détient son pouvoir de Dieu",
        "La guerre est l'état naturel de l'homme"
      ],
      answer: 1,
      note: "Rousseau (Du Contrat Social, 1762) : la légitimité politique vient d'un contrat social."
    }
  ],
  
  // ──────────────────────────────────────────────────────────────────────────
  // 📐 SMP (Sciences Mathématiques et Physiques)
  // ──────────────────────────────────────────────────────────────────────────
  
  "Analyse": [
    {
      q: "La limite de f(x) = 1/x quand x → +∞ est : ",
      choices: ["0", "1", "+∞", "-∞"],
      answer: 0,
      note: "lim(1/x) quand x→+∞ = 0."
    },
    {
      q: "La dérivée de f(x) = x^n est : ",
      choices: ["f'(x) = nx^(n-1)", "f'(x) = x^(n-1)", "f'(x) = n/x", "f'(x) = nx^n"],
      answer: 0,
      note: "Règle de puissance : d/dx(x^n) = nx^(n-1)."
    },
    {
      q: "La dérivée de f(x) = e^x est : ",
      choices: ["f'(x) = e^x", "f'(x) = xe^(x-1)", "f'(x) = ln(x)", "f'(x) = 1/x"],
      answer: 0,
      note: "La fonction exponentielle est sa propre dérivée."
    },
    {
      q: "La dérivée de f(x) = ln(x) est : ",
      choices: ["f'(x) = 1/x", "f'(x) = x", "f'(x) = e^x", "f'(x) = ln(x)"],
      answer: 0,
      note: "d/dx(ln(x)) = 1/x, pour x > 0."
    },
    {
      q: "L'intégrale de f(x) = x dx est : ",
      choices: ["x²/2 + C", "x² + C", "2x + C", "1 + C"],
      answer: 0,
      note: "∫x dx = x²/2 + C."
    },
    {      q: "Une fonction est continue en a si : ",
      choices: ["lim(x→a) f(x) = f(a)", "f(a) = 0", "f'(a) existe", "f est définie en a"],
      answer: 0,
      note: "Continuité en a : la limite quand x→a égale la valeur f(a)."
    },
    {
      q: "Le théorème des valeurs intermédiaires s'applique si : ",
      choices: ["f est continue sur [a,b]", "f est dérivable sur [a,b]", "f est positive sur [a,b]", "f est croissante sur [a,b]"],
      answer: 0,
      note: "TVI : si f continue sur [a,b], alors f prend toutes les valeurs entre f(a) et f(b)."
    },
    {
      q: "La dérivée de f(x) = sin(x) est : ",
      choices: ["f'(x) = cos(x)", "f'(x) = -sin(x)", "f'(x) = -cos(x)", "f'(x) = tan(x)"],
      answer: 0,
      note: "d/dx(sin(x)) = cos(x)."
    },
    {
      q: "La dérivée de f(x) = cos(x) est : ",
      choices: ["f'(x) = sin(x)", "f'(x) = -sin(x)", "f'(x) = cos(x)", "f'(x) = -cos(x)"],
      answer: 1,
      note: "d/dx(cos(x)) = -sin(x)."
    },
    {
      q: "La fonction exponentielle e^x est : ",
      choices: ["Toujours positive et strictement croissante", "Toujours négative", "Parfois négative", "Décroissante"],
      answer: 0,
      note: "e^x > 0 pour tout x ∈ ℝ."
    }
  ],
  
  "Algèbre": [
    {
      q: "La résolution de ax + b = 0 donne : ",
      choices: ["x = -b/a", "x = b/a", "x = -a/b", "x = a/b"],
      answer: 0,
      note: "ax + b = 0 → ax = -b → x = -b/a."
    },
    {
      q: "Le discriminant Δ de ax² + bx + c = 0 est : ",
      choices: ["Δ = b² - 4ac", "Δ = b² + 4ac", "Δ = 4ac - b²", "Δ = b - 4ac"],
      answer: 0,
      note: "Δ = b² - 4ac. Si Δ > 0 : 2 solutions."
    },
    {
      q: "Les solutions de ax² + bx + c = 0 (Δ ≥ 0) sont : ",
      choices: ["x = (-b ± √Δ)/(2a)", "x = (b ± √Δ)/(2a)", "x = (-b ± Δ)/(2a)", "x = (-b ± √Δ)/a"],
      answer: 0,
      note: "Formule quadratique : x = (-b ± √(b²-4ac))/(2a)."
    },    {
      q: "La somme des racines de ax² + bx + c = 0 est : ",
      choices: ["S = -b/a", "S = b/a", "S = c/a", "S = -c/a"],
      answer: 0,
      note: "S = x₁ + x₂ = -b/a."
    },
    {
      q: "Le produit des racines de ax² + bx + c = 0 est : ",
      choices: ["P = c/a", "P = -c/a", "P = b/a", "P = -b/a"],
      answer: 0,
      note: "P = x₁ × x₂ = c/a."
    },
    {
      q: "La factorisation de x² - a² est : ",
      choices: ["(x - a)(x + a)", "(x - a)²", "(x + a)²", "x(x - a)"],
      answer: 0,
      note: "Différence de carrés : x² - a² = (x-a)(x+a)."
    },
    {
      q: "La factorisation de x² + 2ax + a² est : ",
      choices: ["(x + a)²", "(x - a)²", "(x + a)(x - a)", "x² + a²"],
      answer: 0,
      note: "Carré parfait : x² + 2ax + a² = (x+a)²."
    },
    {
      q: "Un système de 2 équations à 2 inconnues se résout par : ",
      choices: ["Substitution ou combinaison linéaire", "Addition seulement", "Multiplication seulement", "Division seulement"],
      answer: 0,
      note: "Méthodes : substitution ou combinaison."
    },
    {
      q: "La valeur absolue |x| est définie par : ",
      choices: ["|x| = x si x ≥ 0, -x si x < 0", "|x| = x toujours", "|x| = -x toujours", "|x| = 0"],
      answer: 0,
      note: "|x| = distance de x à 0."
    },
    {
      q: "L'inéquation |x| < a (a > 0) équivaut à : ",
      choices: ["-a < x < a", "x < a", "x > -a", "x < -a ou x > a"],
      answer: 0,
      note: "|x| < a ↔ -a < x < a."
    }
  ],
  
  "Suite": [
    {
      q: "Une suite arithmétique de raison r vérifie : ",
      choices: ["u(n+1) = u(n) + r", "u(n+1) = u(n) × r", "u(n+1) = u(n) - r", "u(n+1) = u(n) / r"],
      answer: 0,
      note: "Suite arithmétique : chaque terme = précédent + raison r."    },
    {
      q: "Le terme général d'une suite arithmétique est : ",
      choices: ["u(n) = u(0) + nr", "u(n) = u(0) × r^n", "u(n) = u(0) + r/n", "u(n) = u(0) - nr"],
      answer: 0,
      note: "Formule explicite : u(n) = u(0) + nr."
    },
    {
      q: "La somme des n premiers termes d'une suite arithmétique est : ",
      choices: ["S = n(u(0) + u(n-1))/2", "S = n × u(0)", "S = n² × r", "S = u(0) + nr"],
      answer: 0,
      note: "S = nombre de termes × (premier + dernier)/2."
    },
    {
      q: "Une suite géométrique de raison q vérifie : ",
      choices: ["u(n+1) = u(n) × q", "u(n+1) = u(n) + q", "u(n+1) = u(n) - q", "u(n+1) = u(n) / q"],
      answer: 0,
      note: "Suite géométrique : chaque terme = précédent × raison q."
    },
    {
      q: "Le terme général d'une suite géométrique est : ",
      choices: ["u(n) = u(0) × q^n", "u(n) = u(0) + nq", "u(n) = u(0) × nq", "u(n) = u(0) / q^n"],
      answer: 0,
      note: "Formule explicite : u(n) = u(0) × q^n."
    },
    {
      q: "La somme des n premiers termes d'une suite géométrique (q ≠ 1) est : ",
      choices: ["S = u(0) × (1 - q^n)/(1 - q)", "S = n × u(0)", "S = u(0) × nq", "S = u(0) × q^n"],
      answer: 0,
      note: "S = premier terme × (1 - q^n)/(1 - q)."
    },
    {
      q: "Une suite est croissante si : ",
      choices: ["u(n+1) ≥ u(n) pour tout n", "u(n+1) ≤ u(n) pour tout n", "u(n+1) = u(n) pour tout n", "u(n) > 0 pour tout n"],
      answer: 0,
      note: "Croissante : u(n+1) ≥ u(n)."
    },
    {
      q: "Une suite est majorée si : ",
      choices: ["Il existe M tel que u(n) ≤ M pour tout n", "Il existe m tel que u(n) ≥ m pour tout n", "u(n) tend vers +∞", "u(n) tend vers 0"],
      answer: 0,
      note: "Majorée : tous les termes ≤ M."
    },
    {
      q: "Une suite converge si : ",
      choices: ["Elle a une limite finie L quand n → +∞", "Elle tend vers +∞", "Elle tend vers -∞", "Elle oscille sans limite"],
      answer: 0,
      note: "Convergence : lim(n→∞) u(n) = L (finie)."
    },
    {      q: "La limite de q^n quand n → +∞ (|q| < 1) est : ",
      choices: ["0", "1", "+∞", "-∞"],
      answer: 0,
      note: "Si |q| < 1 : lim(q^n) = 0."
    }
  ],
  
  "Complexe": [
    {
      q: "Le nombre imaginaire i vérifie : ",
      choices: ["i² = -1", "i² = 1", "i² = 0", "i² = i"],
      answer: 0,
      note: "Définition : i² = -1."
    },
    {
      q: "La forme algébrique d'un nombre complexe est : ",
      choices: ["z = a + ib (a,b ∈ ℝ)", "z = a + b", "z = ab", "z = a/b"],
      answer: 0,
      note: "Forme algébrique : z = a + ib."
    },
    {
      q: "Le conjugué de z = a + ib est : ",
      choices: ["z̄ = a - ib", "z̄ = -a + ib", "z̄ = -a - ib", "z̄ = b + ia"],
      answer: 0,
      note: "Conjugué : z̄ = a - ib."
    },
    {
      q: "Le module de z = a + ib est : ",
      choices: ["|z| = √(a² + b²)", "|z| = a + b", "|z| = a² + b²", "|z| = √(a + b)"],
      answer: 0,
      note: "Module : |z| = √(a² + b²)."
    },
    {
      q: "La forme trigonométrique de z est : ",
      choices: ["z = r(cos θ + i sin θ)", "z = r(cos θ - i sin θ)", "z = r(sin θ + i cos θ)", "z = r + iθ"],
      answer: 0,
      note: "Forme trigonométrique : z = r(cos θ + i sin θ)."
    },
    {
      q: "La forme exponentielle de z est : ",
      choices: ["z = re^(iθ)", "z = r + iθ", "z = re^θ", "z = rθ^i"],
      answer: 0,
      note: "Formule d'Euler : e^(iθ) = cos θ + i sin θ."
    },
    {
      q: "L'équation z² = -1 a pour solutions : ",
      choices: ["i et -i", "1 et -1", "0", "i seulement"],
      answer: 0,
      note: "z² = -1 → z = ±i."
    },    {
      q: "L'équation z² = 1 a pour solutions : ",
      choices: ["1 et -1", "i et -i", "0", "1 seulement"],
      answer: 0,
      note: "z² = 1 → z = ±1."
    },
    {
      q: "Le plan complexe est muni d'un repère : ",
      choices: ["Orthonormé direct (O, u⃗, v⃗)", "Quelconque", "Uniquement l'axe des réels", "Uniquement l'axe des imaginaires"],
      answer: 0,
      note: "Plan complexe : axe horizontal = réels, axe vertical = imaginaires."
    },
    {
      q: "L'affixe du vecteur AB (A(z_A), B(z_B)) est : ",
      choices: ["z_B - z_A", "z_A - z_B", "z_A + z_B", "z_A × z_B"],
      answer: 0,
      note: "Affixe de AB⃗ = z_B - z_A."
    }
  ],
  
  "Probabilité": [
    {
      q: "La probabilité d'un événement A est : ",
      choices: ["P(A) ∈ [0, 1]", "P(A) ∈ [0, +∞[", "P(A) ∈ ]-∞, +∞[", "P(A) ∈ [1, +∞["],
      answer: 0,
      note: "P(A) ∈ [0,1]. P(∅) = 0, P(Ω) = 1."
    },
    {
      q: "La probabilité de l'événement contraire Ā est : ",
      choices: ["P(Ā) = 1 - P(A)", "P(Ā) = P(A)", "P(Ā) = 1 + P(A)", "P(Ā) = 0"],
      answer: 0,
      note: "P(Ā) = 1 - P(A)."
    },
    {
      q: "La probabilité de A ∪ B (A ou B) est : ",
      choices: ["P(A∪B) = P(A) + P(B) - P(A∩B)", "P(A∪B) = P(A) + P(B)", "P(A∪B) = P(A) × P(B)", "P(A∪B) = P(A) - P(B)"],
      answer: 0,
      note: "Formule de Poincaré : P(A∪B) = P(A) + P(B) - P(A∩B)."
    },
    {
      q: "Si A et B sont incompatibles (disjoints) : ",
      choices: ["P(A∪B) = P(A) + P(B)", "P(A∪B) = P(A) × P(B)", "P(A∩B) = P(A) × P(B)", "P(A∩B) = 1"],
      answer: 0,
      note: "Incompatibles : A∩B = ∅."
    },
    {
      q: "Si A et B sont indépendants : ",
      choices: ["P(A∩B) = P(A) × P(B)", "P(A∩B) = P(A) + P(B)", "P(A∪B) = P(A) × P(B)", "P(A|B) = P(B)"],
      answer: 0,
      note: "Indépendance : P(A∩B) = P(A)×P(B)."    },
    {
      q: "La probabilité conditionnelle P(A|B) est : ",
      choices: ["P(A|B) = P(A∩B)/P(B) (si P(B) > 0)", "P(A|B) = P(A)/P(B)", "P(A|B) = P(B)/P(A)", "P(A|B) = P(A∩B) × P(B)"],
      answer: 0,
      note: "Définition : P(A|B) = P(A∩B)/P(B)."
    },
    {
      q: "Le nombre de combinaisons C(n,k) est : ",
      choices: ["C(n,k) = n!/(k!(n-k)!)", "C(n,k) = n!/k!", "C(n,k) = n×k", "C(n,k) = (n+k)!"],
      answer: 0,
      note: "C(n,k) = 'n parmi k'."
    },
    {
      q: "La loi binomiale B(n,p) a pour espérance : ",
      choices: ["E = np", "E = n/p", "E = p/n", "E = n + p"],
      answer: 0,
      note: "Binomiale B(n,p) : E = np."
    },
    {
      q: "La probabilité de tirer un As dans un jeu de 52 cartes est : ",
      choices: ["4/52 = 1/13", "1/52", "1/4", "13/52"],
      answer: 0,
      note: "4 As dans 52 cartes → P = 4/52 = 1/13."
    },
    {
      q: "La probabilité d'obtenir pile avec une pièce équilibrée est : ",
      choices: ["1/2", "1/4", "1/3", "1"],
      answer: 0,
      note: "Pièce équilibrée : P(pile) = 1/2."
    }
  ],
  
  "Géométrie": [
    {
      q: "Le produit scalaire de u⃗(x,y) et v⃗(x',y') est : ",
      choices: ["u⃗·v = xx' + yy'", "u⃗·v = xy' + x'y", "u⃗·v = xx' - yy'", "u⃗·v = x + y + x' + y'"],
      answer: 0,
      note: "Produit scalaire : u⃗·v⃗ = xx' + yy'."
    },
    {
      q: "Deux vecteurs sont orthogonaux si : ",
      choices: ["u⃗·v⃗ = 0", "u⃗·v = 1", "|u⃗| = |v⃗|", "u⃗ = v"],
      answer: 0,
      note: "Orthogonalité : u⃗·v⃗ = 0."
    },
    {
      q: "La norme d'un vecteur u⃗(x,y) est : ",
      choices: ["|u⃗| = (x² + y²)", "|u⃗| = x + y", "|u⃗| = x² + y²", "|u⃗| = (x + y)"],
      answer: 0,      note: "Norme : |u⃗| = √(x² + y²)."
    },
    {
      q: "L'équation d'un cercle de centre O(0,0) et rayon R est : ",
      choices: ["x² + y² = R²", "x² + y² = R", "(x-a)² + (y-b)² = R", "x + y = R"],
      answer: 0,
      note: "Cercle centre O, rayon R : x² + y² = R²."
    },
    {
      q: "L'équation d'une droite est : ",
      choices: ["ax + by + c = 0", "x² + y² = 1", "xy = 1", "x + y = 1"],
      answer: 0,
      note: "Équation cartésienne : ax + by + c = 0."
    },
    {
      q: "Le coefficient directeur d'une droite y = mx + p est : ",
      choices: ["m", "p", "-m", "-p"],
      answer: 0,
      note: "Forme réduite : y = mx + p."
    },
    {
      q: "Deux droites sont parallèles si : ",
      choices: ["Elles ont le même coefficient directeur", "Leurs coefficients directeurs sont opposés", "Le produit de leurs coefficients = -1", "Elles se coupent en un point"],
      answer: 0,
      note: "Parallèles : m₁ = m₂."
    },
    {
      q: "Deux droites sont perpendiculaires si : ",
      choices: ["m₁ × m₂ = -1", "m₁ = m₂", "m₁ + m₂ = 0", "m₁ - m₂ = 0"],
      answer: 0,
      note: "Perpendiculaires : m₁ × m₂ = -1."
    },
    {
      q: "La distance entre A(x_A, y_A) et B(x_B, y_B) est : ",
      choices: ["AB = √[(x_B-x_A)² + (y_B-y_A)²]", "AB = |x_B - x_A| + |y_B - y_A|", "AB = (x_B-x_A)² + (y_B-y_A)²", "AB = |x_B + x_A| + |y_B + y_A|"],
      answer: 0,
      note: "Distance : AB = √[(Δx)² + (Δy)²]."
    },
    {
      q: "Le milieu de AB a pour coordonnées : ",
      choices: ["M((x_A+x_B)/2, (y_A+y_B)/2)", "M(x_A+x_B, y_A+y_B)", "M((x_A-x_B)/2, (y_A-y_B)/2)", "M(x_A-x_B, y_A-y_B)"],
      answer: 0,
      note: "Milieu : moyenne des coordonnées."
    }
  ],
  
  "Physiques": [
    {
      q: "La chute libre (sans frottement) est un mouvement : ",
      choices: [        "Circulaire uniforme",
        "Rectiligne uniformément accéléré (a = g = 9,8 m/s² vers le bas)",
        "Rectiligne uniforme",
        "Parabolique uniquement"
      ],
      answer: 1,
      note: "Chute libre : mouvement rectiligne uniformément accéléré."
    },
    {
      q: "La trajectoire d'un projectile (avec vitesse initiale horizontale) est : ",
      choices: ["Une droite", "Une parabole", "Un cercle", "Une ellipse"],
      answer: 1,
      note: "Projectile : trajectoire parabolique."
    },
    {
      q: "La pression atmosphérique au niveau de la mer est d'environ : ",
      choices: ["10³ Pa", "10⁵ Pa (≈ 101 325 Pa = 1 atm)", "10⁷ Pa", "10 Pa"],
      answer: 1,
      note: "P₀ ≈ 10⁵ Pa = 1 atm."
    },
    {
      q: "La quantité de mouvement p est : ",
      choices: ["p = m/v", "p = mv", "p = m + v", "p = mv²"],
      answer: 1,
      note: "Quantité de mouvement : p = mv."
    },
    {
      q: "Le travail d'une force F est : ",
      choices: ["W = F/d", "W = F·d·cosα", "W = F + d", "W = F - d"],
      answer: 1,
      note: "Travail : W = F·d·cosα."
    },
    {
      q: "La puissance mécanique P est : ",
      choices: ["P = W × t", "P = W / t (ou P = F·v)", "P = W + t", "P = W - t"],
      answer: 1,
      note: "Puissance : P = W/t."
    },
    {
      q: "L'énergie cinétique Ec est : ",
      choices: ["Ec = mv", "Ec = ½mv²", "Ec = mgh", "Ec = ½m²v"],
      answer: 1,
      note: "Énergie cinétique : Ec = ½mv²."
    },
    {
      q: "L'énergie potentielle de pesanteur Ep est : ",
      choices: ["Ep = ½mv²", "Ep = mgh", "Ep = mg/h", "Ep = mgh²"],
      answer: 1,
      note: "Énergie potentielle : Ep = mgh."
    },    {
      q: "Le 1er principe de Newton (inertie) énonce que : ",
      choices: [
        "Toute force produit une accélération",
        "Un objet reste au repos ou en MRU si la résultante des forces est nulle",
        "L'action est égale à la réaction",
        "La masse est proportionnelle au poids"
      ],
      answer: 1,
      note: "1ère loi : si ΣF = 0, alors v = constante."
    },
    {
      q: "Le 2ème principe de Newton (PFD) énonce que : ",
      choices: ["F = m + a", "ΣF = ma", "F = m/a", "F = a/m"],
      answer: 1,
      note: "2ème loi : ΣF = ma."
    }
  ],
  
  // ──────────────────────────────────────────────────────────────────────────
  // 📚 LLA (Lettres, Langues et Arts)
  // ──────────────────────────────────────────────────────────────────────────
  
  "Créole": [
    {
      q: "Daprè règleman IPN (1980), alfabe kreyòl la gen konbyen lèt ? ",
      choices: ["26 lèt", "30 lèt", "32 lèt", "28 lèt"],
      answer: 2,
      note: "Alfabe kreyòl ofisyèl la (IPN 1980) gen 32 lèt."
    },
    {
      q: "Ki son vwayèl ki ekziste nan kreyòl epi ki ekri 'ou' ? ",
      choices: [
        "Son /ɔ/ tankou 'or' an fransè",
        "Son /u/ tankou 'ou' nan 'ou di' an fransè",
        "Son /w/ sèlman",
        "Son /o/ louvri"
      ],
      answer: 1,
      note: "'Ou' nan kreyòl = son /u/."
    },
    {
      q: "Ki fason ki kòrèk pou ekri vèb 'manger' (fransè) an kreyòl ? ",
      choices: ["manje", "manjé", "mangé", "mänge"],
      answer: 0,
      note: "Règ IPN : nan kreyòl pa gen aksan."
    },
    {
      q: "Nan kreyòl ofisyèl, ki lèt ki itilize pou son /k/ ? ",
      choices: [        "'c' ak 'k' toude",
        "Sèlman 'k' — 'c' pa bay son /k/ nan kreyòl IPN",
        "'q' sèlman",
        "'c' sèlman"
      ],
      answer: 1,
      note: "IPN 1980 : sèlman 'k' ki ekri son /k/."
    },
    {
      q: "Kijan yo ekri son /tʃ/ (tankou 'ch' nan 'cheese' an anglè) nan kreyòl ? ",
      choices: ["ch", "tch", "ts", "chy"],
      answer: 1,
      note: "Son /tʃ/ ekri 'tch' nan kreyòl ofisyèl."
    },
    {
      q: "Ki fòm vèb 'manje' nan tan prezan pou 'mwen' ? ",
      choices: ["Mwen manje", "Mwen te manje", "Mwen ap manje", "Mwen a manje"],
      answer: 0,
      note: "Prezan : 'Mwen manje'."
    },
    {
      q: "Nan kreyòl, ki makè ki endike yon aksyon kap pase kounye a (prezan progresif) ? ",
      choices: ["te", "ap", "va", "te ap"],
      answer: 1,
      note: "Makè prezan progresif : 'ap'."
    },
    {
      q: "Ki makè ki endike yon aksyon ki te fèt nan pase (tan pase) ? ",
      choices: ["ap", "va", "te", "a"],
      answer: 2,
      note: "Makè tan pase : 'te'."
    },
    {
      q: "Ki makè ki endike yon aksyon ki pral fèt (tan fiti) ? ",
      choices: ["te", "ap", "a / va / ava", "nan"],
      answer: 2,
      note: "Makè fiti : 'a', 'va', 'ava'."
    },
    {
      q: "Ki fòm negatif ki kòrèk nan kreyòl pou di 'Je ne mange pas' ? ",
      choices: ["Mwen ne manje pas", "Mwen pa manje", "Mwen pa ap manje pas", "Mwen non manje"],
      answer: 1,
      note: "Negasyon an kreyòl : 'pa'."
    }
  ],
  
  "Français": [
    {
      q: "L'Étranger commence par : ",
      choices: [        "'Il était une fois'",
        "'Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas.'",
        "'Je pense donc je suis'",
        "'Longtemps je me suis couché de bonne heure'"
      ],
      answer: 1,
      note: "L'Étranger, incipit : 'Aujourd'hui, maman est morte.'"
    },
    {
      q: "Qui a écrit 'Candide' ? ",
      choices: ["Rousseau", "Voltaire", "Diderot", "Montesquieu"],
      answer: 1,
      note: "Candide (1759) = conte philosophique de Voltaire."
    },
    {
      q: "Le mouvement littéraire de la Négritude inclut : ",
      choices: ["Victor Hugo", "Aimé Césaire, Léopold Sédar Senghor", "Molière", "Baudelaire"],
      answer: 1,
      note: "Négritude : Césaire, Senghor, Damas."
    },
    {
      q: "Quel auteur haïtien a écrit 'Gouverneurs de la Rosée' ? ",
      choices: ["Jacques Roumain", "René Depestre", "Dany Laferrière", "Marie Vieux-Chauvet"],
      answer: 0,
      note: "Jacques Roumain (1907-1944) : 'Gouverneurs de la Rosée' (1944)."
    },
    {
      q: "Le surréalisme est associé à : ",
      choices: ["André Breton", "Victor Hugo", "Flaubert", "Zola"],
      answer: 0,
      note: "André Breton : Manifeste du surréalisme (1924)."
    },
    {
      q: "Qui a écrit 'Les Misérables' ? ",
      choices: ["Balzac", "Victor Hugo", "Zola", "Flaubert"],
      answer: 1,
      note: "Victor Hugo : 'Les Misérables' (1862)."
    },
    {
      q: "Molière est connu pour : ",
      choices: ["Ses tragédies", "Ses comédies (Tartuffe, Le Misanthrope)", "Ses poèmes", "Ses essais"],
      answer: 1,
      note: "Molière : comédies satiriques."
    },
    {
      q: "Albert Camus a écrit : ",
      choices: ["La Peste", "Germinal", "Madame Bovary", "Le Rouge et le Noir"],
      answer: 0,
      note: "Albert Camus : 'La Peste' (1947)."
    },    {
      q: "Jean-Paul Sartre est associé à : ",
      choices: ["Existentialisme", "Romantisme", "Classicisme", "Surréalisme"],
      answer: 0,
      note: "Sartre : existentialisme."
    },
    {
      q: "Simone de Beauvoir a écrit : ",
      choices: ["Le Deuxième Sexe", "Les Fleurs du Mal", "À la recherche du temps perdu", "Germinal"],
      answer: 0,
      note: "Simone de Beauvoir : 'Le Deuxième Sexe' (1949)."
    }
  ],
  
  "Anglais": [
    {
      q: "Which sentence is grammatically correct? ",
      choices: ["She don't like coffee.", "She doesn't like coffee.", "She not like coffee.", "She isn't like coffee."],
      answer: 1,
      note: "3rd person singular present: use 'does not' (doesn't)."
    },
    {
      q: "Choose the correct form: 'I ___ to school every day.' ",
      choices: ["going", "go", "goes", "am go"],
      answer: 1,
      note: "Simple present, 1st person: 'I go'."
    },
    {
      q: "What is the past tense of 'go'? ",
      choices: ["goed", "gone", "went", "go"],
      answer: 2,
      note: "'Go' is irregular. Past = 'went'."
    },
    {
      q: "Which is the correct plural of 'child'? ",
      choices: ["childs", "children", "childes", "childern"],
      answer: 1,
      note: "'Child' → 'children' (irregular)."
    },
    {
      q: "What is the comparative form of 'good'? ",
      choices: ["gooder", "more good", "better", "best"],
      answer: 2,
      note: "'Good' → 'better' (comparative)."
    },
    {
      q: "Which is the correct question form? ",
      choices: ["Where you are from?", "Where are you from?", "You are from where?", "From where you are?"],
      answer: 1,
      note: "WH-question: WH-word + auxiliary + subject + verb."    },
    {
      q: "'If it rains, I ___ stay at home.' (First Conditional) ",
      choices: ["would", "will", "stayed", "am going"],
      answer: 1,
      note: "First Conditional: If + present, will + base verb."
    },
    {
      q: "'If I were rich, I ___ travel the world.' (Second Conditional) ",
      choices: ["will", "would", "shall", "can"],
      answer: 1,
      note: "Second Conditional: If + past, would + base verb."
    },
    {
      q: "Which modal verb expresses POSSIBILITY? ",
      choices: ["must", "should", "might", "will"],
      answer: 2,
      note: "'Might' expresses possibility."
    },
    {
      q: "'By the time she arrived, I ___ already left.' (Past Perfect) ",
      choices: ["have", "had", "was", "did"],
      answer: 1,
      note: "Past Perfect: had + past participle."
    }
  ],
  
  "Espagnol": [
    {
      q: "¿Cómo se dice 'Je suis' en español? ",
      choices: ["yo soy", "tú eres", "él es", "nosotros somos"],
      answer: 0,
      note: "'Je suis' = 'yo soy'."
    },
    {
      q: "¿Cuál es la conjugación de 'tener' en primera persona singular (presente)? ",
      choices: ["tiene", "tienes", "tengo", "teno"],
      answer: 2,
      note: "'Tener' : yo tengo."
    },
    {
      q: "¿Cómo se conjuga 'ir' en primera persona singular (presente)? ",
      choices: ["voy", "va", "vas", "voyo"],
      answer: 0,
      note: "'Ir' : yo voy."
    },
    {
      q: "¿Qué significa 'No como carne'? ",
      choices: ["Je mange de la viande", "Je ne mange pas de viande", "Je vais manger", "J'ai mangé"],
      answer: 1,      note: "'No como carne.' = Je ne mange pas de viande."
    },
    {
      q: "¿Cómo se dice 'Vivo en Haití'? ",
      choices: ["Je vis en Haïti", "Vivir en Haití", "Estoy vivir en Haití", "Yo vivo en Haití"],
      answer: 0,
      note: "'Vivo en Haití' = Je vis en Haïti."
    },
    {
      q: "¿Qué es el 'spanglish'? ",
      choices: [
        "El español antiguo",
        "La mezcla de español e inglés, especialmente en comunidades hispanas en EE.UU.",
        "Un dialecto latinoamericano",
        "El español de España"
      ],
      answer: 1,
      note: "Spanglish : mélange espagnol/anglais."
    },
    {
      q: "¿Cuál es el subjuntivo presente de 'hablar' (que yo)? ",
      choices: ["que yo hablo", "que yo hable", "que yo habla", "que yo hablaré"],
      answer: 1,
      note: "Subjonctif : que yo hable."
    },
    {
      q: "¿Los números del 1 al 10 en español? ",
      choices: ["uno, dos, tres... diez", "un, deux, trois... dix", "one, two, three... ten", "uno, due, tre... dieci"],
      answer: 0,
      note: "uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez."
    },
    {
      q: "¿Qué significa 'buenos días'? ",
      choices: ["Bonsoir", "Bonjour (matin)", "Bonne nuit", "Au revoir"],
      answer: 1,
      note: "'Buenos días' = Bonjour (matin)."
    },
    {
      q: "¿Cómo se dice 'gracias' en francés? ",
      choices: ["merci", "por favor", "de nada", "hola"],
      answer: 0,
      note: "'Gracias' = 'merci'."
    }
  ],
  
  "Littérature Haïtienne": [
    {
      q: "Qui a écrit 'Ainsi parla l'oncle' ? ",
      choices: ["Jacques Roumain", "Jean Price-Mars", "René Depestre", "Dany Laferrière"],
      answer: 1,      note: "Jean Price-Mars (1928) : fondateur de la négritude haïtienne."
    },
    {
      q: "Dany Laferrière est connu pour : ",
      choices: [
        "Gouverneurs de la Rosée",
        "L'Énigme du retour",
        "Comment faire l'amour avec un Nègre sans se fatiguer",
        "Les Arbres musiciens"
      ],
      answer: 2,
      note: "Dany Laferrière : 'Comment faire l'amour...' (1985)."
    },
    {
      q: "Marie Vieux-Chauvet a écrit : ",
      choices: ["Amour, Colère, Folie", "Le Pays des autres", "Compère Général Soleil", "Dézafi"],
      answer: 0,
      note: "Marie Vieux-Chauvet : 'Amour, Colère, Folie' (1968)."
    },
    {
      q: "Frankétienne est associé au mouvement : ",
      choices: ["Surréalisme", "Spiralisme", "Réalisme", "Classicisme"],
      answer: 1,
      note: "Frankétienne : co-fondateur du Spiralisme."
    },
    {
      q: "Edwidge Danticat écrit principalement en : ",
      choices: ["Créole", "Français", "Anglais", "Espagnol"],
      answer: 2,
      note: "Edwidge Danticat : écrit en anglais."
    },
    {
      q: "Le 'coumbite' dans 'Gouverneurs de la Rosée' représente : ",
      choices: [
        "Un rite vodou",
        "La tradition haïtienne du travail collectif solidaire",
        "Un combat politique",
        "Une danse folklorique"
      ],
      answer: 1,
      note: "Le coumbite : tradition paysanne de travail collectif."
    },
    {
      q: "Bois Caïman (1791) représente : ",
      choices: [
        "Une bataille militaire",
        "La cérémonie vodou qui lança l'insurrection des esclaves",
        "La proclamation de l'indépendance",
        "Un traité de paix"
      ],      answer: 1,
      note: "Bois Caïman : cérémonie vodou du 14 août 1791."
    },
    {
      q: "Le vodou haïtien est : ",
      choices: [
        "Une pratique de sorcellerie malveillante uniquement",
        "Une religion traditionnelle afro-haïtienne — officiellement reconnue en 2003",
        "Un jeu théâtral",
        "Un crime"
      ],
      answer: 1,
      note: "Vodou = religion authentique (reconnaissance 2003)."
    },
    {
      q: "Jacques Roumain a fondé : ",
      choices: ["Le Parti Communiste Haïtien", "Le Musée d'Art Haïtien", "L'Université d'État", "Le Journal Le Nouvelliste"],
      answer: 0,
      note: "Jacques Roumain : fondateur du Parti Communiste Haïtien (1934)."
    },
    {
      q: "René Depestre est connu pour : ",
      choices: ["Le Mât de cocagne", "Hadriana dans tous mes rêves", "Les Arbres musiciens", "Compère Général Soleil"],
      answer: 1,
      note: "René Depestre : 'Hadriana dans tous mes rêves' (1988)."
    }
  ],
  
  "Littérature Française": [
    {
      q: "Qui a écrit 'Les Misérables' ? ",
      choices: ["Balzac", "Victor Hugo", "Zola", "Flaubert"],
      answer: 1,
      note: "Victor Hugo : 'Les Misérables' (1862)."
    },
    {
      q: "Molière est connu pour : ",
      choices: ["Ses tragédies", "Ses comédies (Tartuffe, Le Misanthrope)", "Ses poèmes", "Ses essais"],
      answer: 1,
      note: "Molière : comédies satiriques."
    },
    {
      q: "Albert Camus a écrit : ",
      choices: ["La Peste", "Germinal", "Madame Bovary", "Le Rouge et le Noir"],
      answer: 0,
      note: "Albert Camus : 'La Peste' (1947)."
    },
    {
      q: "Jean-Paul Sartre est associé à : ",
      choices: ["Existentialisme", "Romantisme", "Classicisme", "Surréalisme"],      answer: 0,
      note: "Sartre : existentialisme."
    },
    {
      q: "Simone de Beauvoir a écrit : ",
      choices: ["Le Deuxième Sexe", "Les Fleurs du Mal", "À la recherche du temps perdu", "Germinal"],
      answer: 0,
      note: "Simone de Beauvoir : 'Le Deuxième Sexe' (1949)."
    },
    {
      q: "Voltaire a écrit : ",
      choices: ["Candide", "Les Misérables", "Germinal", "Madame Bovary"],
      answer: 0,
      note: "Voltaire : 'Candide' (1759)."
    },
    {
      q: "Baudelaire a écrit : ",
      choices: ["Les Fleurs du Mal", "Candide", "Germinal", "Les Misérables"],
      answer: 0,
      note: "Baudelaire : 'Les Fleurs du Mal' (1857)."
    },
    {
      q: "Zola est associé au : ",
      choices: ["Naturalisme", "Romantisme", "Classicisme", "Surréalisme"],
      answer: 0,
      note: "Zola : naturalisme."
    },
    {
      q: "Flaubert a écrit : ",
      choices: ["Madame Bovary", "Germinal", "Les Misérables", "Candide"],
      answer: 0,
      note: "Flaubert : 'Madame Bovary' (1857)."
    },
    {
      q: "Proust a écrit : ",
      choices: [
        "À la recherche du temps perdu",
        "Les Misérables",
        "Germinal",
        "Madame Bovary"
      ],
      answer: 0,
      note: "Proust : 'À la recherche du temps perdu'."
    }
  ],
  
  "Dissertation": [
    {
      q: "L'introduction d'une dissertation comprend : ",
      choices: [        "Uniquement la problématique",
        "Amorce, définition, problématique, annonce du plan",
        "Uniquement le plan",
        "Uniquement la conclusion"
      ],
      answer: 1,
      note: "Introduction : 1) Amorce, 2) Définition, 3) Problématique, 4) Plan."
    },
    {
      q: "Une problématique est : ",
      choices: ["Un résumé du sujet", "Une question centrale qui guide la réflexion", "Une opinion personnelle", "Une citation"],
      answer: 1,
      note: "Problématique = question centrale."
    },
    {
      q: "Le plan dialectique comprend : ",
      choices: ["Thèse / Antithèse / Synthèse", "Introduction / Développement / Conclusion", "Description / Analyse / Interprétation", "Passé / Présent / Futur"],
      answer: 0,
      note: "Plan dialectique : Thèse / Antithèse / Synthèse."
    },
    {
      q: "Un argument doit être appuyé par : ",
      choices: ["Rien", "Un exemple concret", "Une opinion", "Une émotion"],
      answer: 1,
      note: "Argument + Exemple = persuasion."
    },
    {
      q: "La conclusion d'une dissertation doit : ",
      choices: [
        "Introduire de nouveaux arguments",
        "Synthétiser et ouvrir sur une perspective plus large",
        "Répéter l'introduction mot pour mot",
        "Poser une nouvelle problématique"
      ],
      answer: 1,
      note: "Conclusion : 1) Synthèse, 2) Réponse, 3) Ouverture."
    },
    {
      q: "Ki sa 'pwoblematis' vle di nan yon disètasyon ? ",
      choices: [
        "Rezime sijè a",
        "Kesyon santral ki gide tout analiz la — fòmile sou fòm kesyon enpòtan",
        "Premye paragraf la",
        "Konklizyon an"
      ],
      answer: 1,
      note: "Pwoblematis = kesyon fondamantal."
    },
    {
      q: "Ki sa 'pwen de vi' (point de vue) naratè a vle di ? ",      choices: [
        "Opinyon politik otè a",
        "Pèspektiv naratè a — kijan li wè epi prezante evènman yo (omniyan, entèn, ekstèn)",
        "Kote istwa a pase",
        "Lè istwa a pase"
      ],
      answer: 1,
      note: "Pwen de vi : naratè omniyan, entèn, ekstèn."
    },
    {
      q: "Ki diferans ant 'fòm' ak 'fon' yon tèks literè ? ",
      choices: [
        "Yo menm bagay tout bon",
        "Fòm = fason pou di (stil, figi); Fon = sa yo di (mesaj, tèm)",
        "Fòm = tit la; Fon = kontni an",
        "Fòm = longè; Fon = lajè"
      ],
      answer: 1,
      note: "Fòm = stil, teknik, figi. Fon = mesaj, tèm, ide."
    },
    {
      q: "Ki pwen de vi kote naratè a se youn nan pèsonaj yo ? ",
      choices: ["Naratè omniyan", "Naratè entèn (premye pèsòn)", "Naratè ekstèn", "Pa gen naratè"],
      answer: 1,
      note: "Naratè entèn = premye pèsòn ('mwen')."
    },
    {
      q: "'Incipit' yon roman vle di : ",
      choices: [
        "Fen roman an",
        "Premye fraz oswa premye pati roman an — enpòtan pou prezante istwa a",
        "Non otè a",
        "Tit liv la"
      ],
      answer: 1,
      note: "Incipit = kòmansman yon tèks literè."
    }
  ],
  
  "Éducation Esthétique et Artistique": [
    {
      q: "La peinture naïve haïtienne est qualifiée d''authentique' car : ",
      choices: [
        "Elle imite les maîtres européens",
        "Elle exprime la réalité, le vodou et l'identité haïtienne sans formation académique",
        "Elle est plus facile à réaliser",
        "Elle utilise des matériaux locaux seulement"
      ],
      answer: 1,
      note: "Art naïf haïtien : authenticité totale."    },
    {
      q: "Philomé Obin est connu pour : ",
      choices: ["Ses sculptures", "Ses peintures naïves sur l'histoire haïtienne", "Sa musique", "Sa danse"],
      answer: 1,
      note: "Philomé Obin : peintre naïf."
    },
    {
      q: "Hector Hyppolite est associé à : ",
      choices: ["L'art abstrait", "La peinture vodou et les loas", "La sculpture moderne", "La photographie"],
      answer: 1,
      note: "Hector Hyppolite : peintre vodou."
    },
    {
      q: "La musique compas a été créée par : ",
      choices: ["Nemours Jean-Baptiste", "Bob Marley", "Fela Kuti", "Celia Cruz"],
      answer: 0,
      note: "Nemours Jean-Baptiste (1955) : crée le compas direct."
    },
    {
      q: "Le carnaval haïtien est influencé par : ",
      choices: [
        "Uniquement la culture française",
        "Les traditions africaines, le vodou, et les influences européennes",
        "Uniquement la culture américaine",
        "La culture asiatique"
      ],
      answer: 1,
      note: "Carnaval haïtien : synthèse cultures."
    },
    {
      q: "L'art haïtien contemporain inclut : ",
      choices: [
        "Uniquement la peinture",
        "Peinture, sculpture, musique, danse, littérature",
        "Uniquement la musique",
        "Uniquement la danse"
      ],
      answer: 1,
      note: "Art haïtien = multiple."
    },
    {
      q: "Le Centre d'Art de Port-au-Prince a été fondé en : ",
      choices: ["1944", "1950", "1960", "1970"],
      answer: 0,
      note: "Centre d'Art : 1944."
    },
    {
      q: "Les couleurs vives dans l'art haïtien symbolisent : ",
      choices: [        "La tristesse",
        "La joie de vivre, la résilience et la culture haïtienne",
        "La pauvreté",
        "La guerre"
      ],
      answer: 1,
      note: "Couleurs vives = joie, résilience."
    },
    {
      q: "Le vodou dans l'art haïtien représente : ",
      choices: [
        "Uniquement des rituels",
        "Une source d'inspiration spirituelle et culturelle",
        "Uniquement des danses",
        "Uniquement des chants"
      ],
      answer: 1,
      note: "Vodou = inspiration artistique."
    },
    {
      q: "L'art haïtien est reconnu internationalement pour : ",
      choices: [
        "Son originalité et son authenticité",
        "Son imitation de l'art européen",
        "Son absence de technique",
        "Son manque de diversité"
      ],
      answer: 0,
      note: "Art haïtien = original et authentique."
    }
  ],
  
  "Éducation Physique et Sportive": [
    {
      q: "L'IMC (Indice de Masse Corporelle) se calcule par : ",
      choices: [
        "Poids (kg) × Taille (m)",
        "Poids (kg) / Taille² (m²)",
        "Poids (kg) × Taille (m)",
        "Taille (m) / Poids (kg)"
      ],
      answer: 1,
      note: "IMC = Poids / Taille²."
    },
    {
      q: "La fréquence cardiaque maximale approximative est : ",
      choices: ["220 - âge", "200 - âge", "180 - âge", "250 - âge"],
      answer: 0,
      note: "FCmax ≈ 220 - âge."
    },    {
      q: "L'échauffement avant le sport sert à : ",
      choices: [
        "Rien",
        "Préparer muscles et articulations, prévenir les blessures",
        "Fatiguer l'athlète",
        "Refroidir le corps"
      ],
      answer: 1,
      note: "Échauffement : prépare le corps."
    },
    {
      q: "L'hydratation pendant l'effort est importante car : ",
      choices: [
        "Elle fait grossir",
        "Elle compense les pertes d'eau par la transpiration et maintient la performance",
        "Elle ralentit la digestion",
        "Elle refroidit trop le corps"
      ],
      answer: 1,
      note: "Hydratation : compense pertes hydriques."
    },
    {
      q: "Les glucides sont importants pour le sportif car : ",
      choices: [
        "Ils font grossir",
        "Ils fournissent l'énergie rapide nécessaire à l'effort (4 kcal/g)",
        "Ils ne servent à rien",
        "Ils remplacent les protéines"
      ],
      answer: 1,
      note: "Glucides = carburant principal."
    },
    {
      q: "Le football est joué avec : ",
      choices: ["10 joueurs par équipe", "11 joueurs par équipe", "12 joueurs par équipe", "9 joueurs par équipe"],
      answer: 1,
      note: "Football : 11 joueurs par équipe."
    },
    {
      q: "Le basketball est joué avec : ",
      choices: ["4 joueurs par équipe", "5 joueurs par équipe", "6 joueurs par équipe", "7 joueurs par équipe"],
      answer: 1,
      note: "Basketball : 5 joueurs par équipe."
    },
    {
      q: "La durée d'un match de football professionnel est : ",
      choices: ["45 minutes", "90 minutes", "60 minutes", "120 minutes"],
      answer: 1,
      note: "Football : 90 minutes (2 × 45 min)."    },
    {
      q: "Le volleyball se joue avec : ",
      choices: ["5 joueurs par équipe", "6 joueurs par équipe", "7 joueurs par équipe", "8 joueurs par équipe"],
      answer: 1,
      note: "Volleyball : 6 joueurs par équipe."
    },
    {
      q: "L'athlétisme inclut : ",
      choices: [
        "Uniquement la course",
        "Course, saut, lancer",
        "Uniquement le saut",
        "Uniquement le lancer"
      ],
      answer: 1,
      note: "Athlétisme = course, saut, lancer."
    }
  ],
  
  "Éducation à la Citoyenneté": [
    {
      q: "Le droit à un procès équitable (due process) garantit : ",
      choices: [
        "Le droit d'être condamné rapidement",
        "Le droit d'être présumé innocent, jugé par un tribunal impartial, avec accès à un avocat et à une défense",
        "Le droit de choisir ses juges",
        "Le droit d'échapper à toute condamnation"
      ],
      answer: 1,
      note: "Procès équitable : présomption d'innocence, tribunal impartial."
    },
    {
      q: "La société civile comprend : ",
      choices: [
        "Uniquement le gouvernement",
        "L'ensemble des organisations et associations de citoyens indépendantes de l'État",
        "L'armée nationale",
        "Le gouvernement élu"
      ],
      answer: 1,
      note: "Société civile : ONG, syndicats, médias, etc."
    },
    {
      q: "Les droits fondamentaux dans la Constitution haïtienne de 1987 incluent : ",
      choices: [
        "Uniquement le droit de vote",
        "Le droit à la vie, à la liberté, à l'éducation, à la santé, au travail et à la dignité humaine",
        "Uniquement les droits politiques",
        "Les droits du gouvernement uniquement"      ],
      answer: 1,
      note: "Constitution 1987 : droits civils, politiques, économiques, sociaux."
    },
    {
      q: "La Déclaration universelle des droits de l'homme (DUDH) a été adoptée par l'ONU le : ",
      choices: ["1er janvier 1804", "10 décembre 1948", "14 juillet 1789", "24 octobre 1945"],
      answer: 1,
      note: "DUDH : 10 décembre 1948."
    },
    {
      q: "La séparation des pouvoirs (Montesquieu) comprend : ",
      choices: ["Uniquement l'exécutif", "Exécutif, Législatif, Judiciaire", "Uniquement le législatif", "Uniquement le judiciaire"],
      answer: 1,
      note: "Montesquieu : 3 pouvoirs."
    },
    {
      q: "Le vote est : ",
      choices: [
        "Une obligation dans tous les pays",
        "Un droit et un devoir civique dans une démocratie",
        "Interdit aux jeunes",
        "Réservé aux riches"
      ],
      answer: 1,
      note: "Vote = droit et devoir civique."
    },
    {
      q: "La laïcité signifie : ",
      choices: [
        "L'interdiction de toutes les religions",
        "La neutralité de l'État vis-à-vis des religions — liberté de croyance pour tous",
        "L'imposition d'une religion d'État",
        "L'athéisme obligatoire"
      ],
      answer: 1,
      note: "Laïcité : État neutre."
    },
    {
      q: "L'égalité devant la loi signifie : ",
      choices: [
        "Tout le monde est riche",
        "Tous les citoyens sont soumis aux mêmes lois, sans discrimination",
        "Tout le monde a le même travail",
        "Tout le monde vote pareil"
      ],
      answer: 1,
      note: "Égalité : mêmes droits, mêmes devoirs."
    },
    {      q: "La corruption est : ",
      choices: [
        "Une pratique normale",
        "L'abus de pouvoir à des fins personnelles — illégal et nuisible au développement",
        "Une tradition culturelle",
        "Un droit des fonctionnaires"
      ],
      answer: 1,
      note: "Corruption = abus de pouvoir."
    },
    {
      q: "Le développement durable prend en compte : ",
      choices: [
        "Uniquement l'économie",
        "Économie, environnement, société (3 piliers)",
        "Uniquement l'environnement",
        "Uniquement la société"
      ],
      answer: 1,
      note: "Développement durable : 3 piliers."
    }
  ],
  
  "Numérique et Informatique": [
    {
      q: "Qu'est-ce qu'un algorithme ? ",
      choices: [
        "Un langage de programmation",
        "Une suite d'instructions précises et ordonnées pour résoudre un problème",
        "Un type d'ordinateur",
        "Un logiciel antivirus"
      ],
      answer: 1,
      note: "Algorithme : séquence d'étapes logiques."
    },
    {
      q: "Qu'est-ce que le binaire en informatique ? ",
      choices: [
        "Un système à base 10",
        "Le système de numération à base 2 (0 et 1)",
        "Un type de fichier",
        "Un réseau informatique"
      ],
      answer: 1,
      note: "Binaire : système base 2."
    },
    {
      q: "Qu'est-ce qu'un langage de programmation ? ",
      choices: [
        "Une langue humaine comme le français",        "Un langage formel permettant de donner des instructions à un ordinateur",
        "Un type de fichier",
        "Un système d'exploitation"
      ],
      answer: 1,
      note: "Langage : Python, Java, JavaScript..."
    },
    {
      q: "Python est un langage de programmation caractérisé par : ",
      choices: [
        "Une syntaxe très complexe",
        "Une syntaxe claire et lisible — très utilisé pour débuter, la data science, l'IA",
        "Un usage uniquement pour les jeux vidéo",
        "Un langage obsolète"
      ],
      answer: 1,
      note: "Python : syntaxe simple, polyvalent."
    },
    {
      q: "Qu'est-ce que la RAM dans un ordinateur ? ",
      choices: [
        "Un stockage permanent",
        "La mémoire vive temporaire utilisée par le processeur",
        "Le disque dur",
        "Le processeur"
      ],
      answer: 1,
      note: "RAM = mémoire de travail temporaire."
    },
    {
      q: "Le CPU (Central Processing Unit) est : ",
      choices: [
        "La carte graphique",
        "Le processeur — le cerveau de l'ordinateur",
        "La mémoire RAM",
        "Le disque dur"
      ],
      answer: 1,
      note: "CPU : exécute les calculs."
    },
    {
      q: "La différence entre HDD et SSD est : ",
      choices: [
        "Aucune différence",
        "Le SSD est plus rapide, plus résistant — le HDD est plus lent mais moins cher",
        "Le HDD est plus récent",
        "Le SSD stocke moins de données"
      ],
      answer: 1,
      note: "SSD = rapide, HDD = lent."    },
    {
      q: "Qu'est-ce que le 'Open Source' ? ",
      choices: [
        "Un logiciel qui coûte cher",
        "Un logiciel dont le code source est accessible, modifiable et redistribuable",
        "Un logiciel uniquement pour les experts",
        "Un logiciel sans fonctionnalités"
      ],
      answer: 1,
      note: "Open Source : code source ouvert."
    },
    {
      q: "La vie privée numérique concerne : ",
      choices: [
        "Uniquement les mots de passe",
        "Le contrôle de ses données personnelles en ligne",
        "Le droit d'utiliser Internet gratuitement",
        "L'absence de tout contrôle en ligne"
      ],
      answer: 1,
      note: "Vie privée numérique : contrôle des données."
    },
    {
      q: "Qu'est-ce qu'un réseau informatique ? ",
      choices: [
        "Un seul ordinateur",
        "Un ensemble d'ordinateurs connectés pour partager des ressources",
        "Un logiciel",
        "Un type de clavier"
      ],
      answer: 1,
      note: "Réseau : interconnexion d'ordinateurs."
    },
    {
      q: "Internet est : ",
      choices: [
        "Un seul ordinateur",
        "Un réseau mondial de réseaux interconnectés utilisant le protocole TCP/IP",
        "Un logiciel de navigation",
        "Un moteur de recherche"
      ],
      answer: 1,
      note: "Internet = réseau mondial."
    },
    {
      q: "Un navigateur web est : ",
      choices: [
        "Un moteur de recherche",
        "Un logiciel pour afficher les pages web (Chrome, Firefox, Safari)",        "Un réseau social",
        "Un antivirus"
      ],
      answer: 1,
      note: "Navigateur : Chrome, Firefox, Safari."
    },
    {
      q: "Le HTML sert à : ",
      choices: [
        "Styliser les pages web",
        "Structurer le contenu des pages web",
        "Programmer la logique",
        "Gérer les bases de données"
      ],
      answer: 1,
      note: "HTML = structure."
    },
    {
      q: "Le CSS sert à : ",
      choices: [
        "Structurer le contenu",
        "Styliser les pages web (couleurs, polices, mise en page)",
        "Gérer les bases de données",
        "Compiler le code"
      ],
      answer: 1,
      note: "CSS = style."
    },
    {
      q: "JavaScript est utilisé pour : ",
      choices: [
        "Uniquement le style",
        "Rendre les pages web interactives",
        "Uniquement la structure",
        "Uniquement les bases de données"
      ],
      answer: 1,
      note: "JavaScript = interactivité."
    },
    {
      q: "Une base de données sert à : ",
      choices: [
        "Styliser les pages",
        "Stocker et organiser des données de manière structurée",
        "Naviguer sur Internet",
        "Compiler le code"
      ],
      answer: 1,
      note: "Base de données : MySQL, PostgreSQL."
    },    {
      q: "Le phishing (hameçonnage) est : ",
      choices: [
        "Une technique de pêche",
        "Une fraude en ligne pour voler des informations sensibles",
        "Un virus informatique",
        "Un logiciel légitime"
      ],
      answer: 1,
      note: "Phishing : fraude en ligne."
    },
    {
      q: "Un mot de passe sécurisé doit : ",
      choices: [
        "Être court et simple",
        "Être long (12+ caractères), avec majuscules, minuscules, chiffres, symboles",
        "Être '123456'",
        "Être le même partout"
      ],
      answer: 1,
      note: "Mot de passe : long et complexe."
    },
    {
      q: "La double authentification (2FA) est : ",
      choices: [
        "Inutile",
        "Une couche de sécurité supplémentaire (mot de passe + code SMS/app)",
        "Un virus",
        "Un logiciel payant"
      ],
      answer: 1,
      note: "2FA = sécurité supplémentaire."
    },
    {
      q: "Le cloud computing est : ",
      choices: [
        "Un type de météo",
        "L'utilisation de serveurs distants pour stocker et traiter des données",
        "Un logiciel de bureau",
        "Un réseau local"
      ],
      answer: 1,
      note: "Cloud = stockage à distance."
    }
  ]
};

export default QUIZ_DATA;