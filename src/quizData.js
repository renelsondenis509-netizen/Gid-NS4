// src/data/quizDataBase.js

export const QUIZ_DATA = {
  SVT: {
    label: "Sciences de la Vie et de la Terre",
    icon: "SVT",
    themes: {
      biologie: {
        label: "Biologie cellulaire",
        questions: [
          {
            id: "svt_bio_01",
            question: "De quoi est compose l'ADN ?",
            options: [
              "Acides amines",
              "Nucleotides",
              "Lipides",
              "Glucose"
            ],
            answer: 1,
            explanation: "L'ADN est compose de nucleotides contenant base azotee, desoxiribose et phosphate."
          },
          {
            id: "svt_bio_02",
            question: "Quel organite produit l'energie dans la cellule ?",
            options: [
              "Le noyau",
              "Le ribosome",
              "La mitochondrie",
              "L'appareil de Golgi"
            ],
            answer: 2,
            explanation: "La mitochondrie realise la respiration cellulaire et produit l'ATP."
          },
          {
            id: "svt_bio_03",
            question: "Combien de chromosomes possede une cellule humaine ?",
            options: ["23", "46", "48", "44"],
            answer: 1,
            explanation: "Les cellules humaines diploïdes contiennent 46 chromosomes soit 23 paires."
          }
        ]
      },
      genetique: {
        label: "Genetique",
        questions: [
          {
            id: "svt_gen_01",
            question: "Comment appelle-t-on les differentes formes d'un gene ?",
            options: ["Chromosomes", "Alleles", "Codons", "Proteines"],
            answer: 1,
            explanation: "Les alleles sont les differentes versions d'un meme gene."
          },
          {
            id: "svt_gen_02",
            question: "Qu'est-ce que la mitose ?",
            options: [
              "Division cellulaire produisant 4 cellules",
              "Division cellulaire produisant 2 cellules identiques",
              "Fusion de deux cellules",
              "Mort cellulaire programmee"
            ],
            answer: 1,
            explanation: "La mitose produit deux cellules filles genetiquement identiques a la cellule mere."
          },
          {
            id: "svt_gen_03",
            question: "Quel est le role de l'ARN messager ?",
            options: [
              "Stocker l'information genetique",
              "Transcrire l'ADN et transporter l'information vers les ribosomes",
              "Produire de l'energie",
              "Proteger le noyau"
            ],
            answer: 1,
            explanation: "L'ARNm transporte l'information genetique de l'ADN vers les ribosomes pour la synthese des proteines."
          }
        ]
      },
      evolution: {
        label: "Evolution",
        questions: [
          {
            id: "svt_evo_01",
            question: "Qui a propose la theorie de la selection naturelle ?",
            options: ["Lamarck", "Mendel", "Darwin", "Pasteur"],
            answer: 2,
            explanation: "Charles Darwin a propose la selection naturelle dans L'Origine des especes en 1859."
          },
          {
            id: "svt_evo_02",
            question: "Qu'est-ce qu'une espece ?",
            options: [
              "Un groupe d'individus de meme couleur",
              "Un groupe d'individus pouvant se reproduire et donner une descendance fertile",
              "Un groupe d'individus vivant au meme endroit",
              "Un groupe d'individus de meme taille"
            ],
            answer: 1,
            explanation: "Une espece regroupe les individus capables de se reproduire entre eux et de donner une descendance fertile."
          }
        ]
      }
    }
  },

  SES: {
    label: "Sciences Economiques et Sociales",
    icon: "SES",
    themes: {
      marche: {
        label: "Le marche",
        questions: [
          {
            id: "ses_mar_01",
            question: "Qu'est-ce que le prix d'equilibre ?",
            options: [
              "Le prix fixe par l'Etat",
              "Le prix ou l'offre egal la demande",
              "Le prix le plus bas du marche",
              "Le prix moyen pratique"
            ],
            answer: 1,
            explanation: "Le prix d'equilibre est celui pour lequel la quantite offerte est egale a la quantite demandee."
          },
          {
            id: "ses_mar_02",
            question: "Qu'est-ce qu'un monopole ?",
            options: [
              "Plusieurs vendeurs et un acheteur",
              "Un seul vendeur face a de nombreux acheteurs",
              "De nombreux vendeurs et acheteurs",
              "Deux vendeurs sur le marche"
            ],
            answer: 1,
            explanation: "Un monopole est une structure de marche avec un seul offreur face a de nombreux demandeurs."
          },
          {
            id: "ses_mar_03",
            question: "Qu'est-ce qu'une externalite negative ?",
            options: [
              "Un benefice pour des tiers non parties a l'echange",
              "Un cout impose a des tiers sans compensation",
              "Une taxe sur les exportations",
              "Une baisse du prix de marche"
            ],
            answer: 1,
            explanation: "Une externalite negative est un cout subi par des agents exterieurs a la transaction, comme la pollution."
          }
        ]
      },
      sociologie: {
        label: "Sociologie",
        questions: [
          {
            id: "ses_soc_01",
            question: "Qui a introduit le concept de fait social ?",
            options: ["Max Weber", "Karl Marx", "Emile Durkheim", "Pierre Bourdieu"],
            answer: 2,
            explanation: "Durkheim definit le fait social comme une maniere de faire exterieure et contraignante pour l'individu."
          },
          {
            id: "ses_soc_02",
            question: "Qu'est-ce que la mobilite sociale ?",
            options: [
              "Le deplacement geographique d'une personne",
              "Le changement de position sociale entre generations",
              "L'augmentation du salaire",
              "Le changement d'employeur"
            ],
            answer: 1,
            explanation: "La mobilite sociale designe le changement de position dans la hierarchie sociale, entre generations ou au cours d'une vie."
          },
          {
            id: "ses_soc_03",
            question: "Qu'est-ce que le capital social selon Bourdieu ?",
            options: [
              "L'argent en banque",
              "L'ensemble des relations sociales qu'un individu peut mobiliser",
              "Le diplome obtenu",
              "Le patrimoine immobilier"
            ],
            answer: 1,
            explanation: "Le capital social designe l'ensemble des ressources liees au reseau de relations qu'un individu peut mobiliser."
          }
        ]
      },
      macroeconomie: {
        label: "Macroeconomie",
        questions: [
          {
            id: "ses_mac_01",
            question: "Que mesure le PIB ?",
            options: [
              "Le bonheur moyen de la population",
              "La valeur totale des biens et services produits dans un pays",
              "Le revenu des menages",
              "Le niveau des exportations"
            ],
            answer: 1,
            explanation: "Le PIB mesure la valeur ajoutee totale produite sur le territoire national sur une periode donnee."
          },
          {
            id: "ses_mac_02",
            question: "Qu'est-ce que l'inflation ?",
            options: [
              "La baisse du chomage",
              "La hausse generale et durable des prix",
              "La croissance du PIB",
              "La baisse des taux d'interet"
            ],
            answer: 1,
            explanation: "L'inflation est la hausse generalisee et continue du niveau des prix entrainant une perte de pouvoir d'achat."
          }
        ]
      }
    }
  },

  SMP: {
    label: "Sciences Mathematiques et Physique",
    icon: "SMP",
    themes: {
      mecanique: {
        label: "Mecanique",
        questions: [
          {
            id: "smp_mec_01",
            question: "Quelle est l'unite de la force ?",
            options: ["Joule", "Watt", "Newton", "Pascal"],
            answer: 2,
            explanation: "La force se mesure en Newton. 1 N = 1 kg fois m/s2."
          },
          {
            id: "smp_mec_02",
            question: "Quelle est la vitesse de la lumiere dans le vide ?",
            options: [
              "300 000 km/s",
              "150 000 km/s",
              "30 000 km/s",
              "3 000 000 km/s"
            ],
            answer: 0,
            explanation: "La vitesse de la lumiere est c = 3 fois 10 puissance 8 m/s soit 300 000 km/s."
          },
          {
            id: "smp_mec_03",
            question: "Que dit la deuxieme loi de Newton ?",
            options: [
              "Tout corps au repos reste au repos",
              "La force est egale a la masse fois l'acceleration",
              "A chaque action correspond une reaction egale et opposee",
              "L'energie se conserve"
            ],
            answer: 1,
            explanation: "La deuxieme loi de Newton : F = m fois a, la force est egale a la masse multipliee par l'acceleration."
          }
        ]
      },
      mathematiques: {
        label: "Mathematiques",
        questions: [
          {
            id: "smp_mat_01",
            question: "Quelle est la derivee de f(x) = x2 ?",
            options: ["x", "2x", "2x2", "x/2"],
            answer: 1,
            explanation: "La derivee de xn est n fois x puissance n-1. Donc la derivee de x2 est 2x."
          },
          {
            id: "smp_mat_02",
            question: "Quelle est la valeur de log base 10 de 1000 ?",
            options: ["2", "3", "4", "10"],
            answer: 1,
            explanation: "log(1000) = log(10 puissance 3) = 3."
          },
          {
            id: "smp_mat_03",
            question: "Dans un triangle rectangle, que dit le theoreme de Pythagore ?",
            options: [
              "a + b = c",
              "a2 + b2 = c2",
              "a fois b = c2",
              "a2 - b2 = c"
            ],
            answer: 1,
            explanation: "Dans un triangle rectangle, le carre de l'hypotenuse est egal a la somme des carres des deux autres cotes."
          }
        ]
      },
      chimie: {
        label: "Chimie",
        questions: [
          {
            id: "smp_chi_01",
            question: "Quel est le symbole chimique de l'or ?",
            options: ["Go", "Or", "Au", "Ag"],
            answer: 2,
            explanation: "Le symbole de l'or est Au, du latin Aurum."
          },
          {
            id: "smp_chi_02",
            question: "Quel est le pH d'une solution neutre a 25 degres ?",
            options: ["0", "7", "14", "1"],
            answer: 1,
            explanation: "A 25 degres, une solution neutre a un pH de 7."
          },
          {
            id: "smp_chi_03",
            question: "Combien d'electrons peut contenir la couche K ?",
            options: ["2", "8", "18", "32"],
            answer: 0,
            explanation: "La couche K peut contenir au maximum 2 electrons selon la formule 2n2."
          }
        ]
      }
    }
  },

  LLA: {
    label: "Langues, Litterature et Arts",
    icon: "LLA",
    themes: {
      litterature: {
        label: "Litterature francaise",
        questions: [
          {
            id: "lla_lit_01",
            question: "Qui a ecrit Les Miserables ?",
            options: [
              "Gustave Flaubert",
              "Victor Hugo",
              "Emile Zola",
              "Honore de Balzac"
            ],
            answer: 1,
            explanation: "Victor Hugo a publie Les Miserables en 1862."
          },
          {
            id: "lla_lit_02",
            question: "A quel mouvement appartient Baudelaire ?",
            options: [
              "Romantisme",
              "Naturalisme",
              "Symbolisme",
              "Classicisme"
            ],
            answer: 2,
            explanation: "Baudelaire est precurseur du symbolisme avec Les Fleurs du Mal publie en 1857."
          },
          {
            id: "lla_lit_03",
            question: "Qu'est-ce qu'une metaphore ?",
            options: [
              "Une comparaison avec comme ou tel",
              "Une figure de style sans outil comparatif etablissant une equivalence",
              "Une repetition de sons",
              "Une question sans reponse"
            ],
            answer: 1,
            explanation: "La metaphore etablit une comparaison implicite sans terme comparatif."
          }
        ]
      },
      langues: {
        label: "Langues vivantes",
        questions: [
          {
            id: "lla_lng_01",
            question: "Comment dit-on je voudrais un cafe en anglais ?",
            options: [
              "I want a coffee",
              "I would like a coffee please",
              "Give me a coffee",
              "I need a coffee"
            ],
            answer: 1,
            explanation: "I would like est la forme polie pour exprimer un souhait en anglais."
          },
          {
            id: "lla_lng_02",
            question: "Quelle est la langue officielle du Bresil ?",
            options: ["Espagnol", "Francais", "Portugais", "Anglais"],
            answer: 2,
            explanation: "Le Bresil est le seul pays d'Amerique du Sud dont la langue officielle est le portugais."
          },
          {
            id: "lla_lng_03",
            question: "Que signifie ubiquitous en anglais ?",
            options: ["Rare", "Dangereux", "Present partout", "Ancien"],
            answer: 2,
            explanation: "Ubiquitous signifie present partout, omnipresent en anglais."
          }
        ]
      },
      arts: {
        label: "Histoire des arts",
        questions: [
          {
            id: "lla_art_01",
            question: "Qui a peint la Joconde ?",
            options: [
              "Michel-Ange",
              "Raphael",
              "Leonard de Vinci",
              "Botticelli"
            ],
            answer: 2,
            explanation: "Leonard de Vinci a peint la Joconde entre 1503 et 1519."
          },
          {
            id: "lla_art_02",
            question: "A quel siecle appartient l'impressionnisme ?",
            options: [
              "XVIIe siecle",
              "XVIIIe siecle",
              "XIXe siecle",
              "XXe siecle"
            ],
            answer: 2,
            explanation: "L'impressionnisme est ne en France dans la seconde moitie du XIXe siecle."
          },
          {
            id: "lla_art_03",
            question: "Qui a compose la Symphonie du Nouveau Monde ?",
            options: ["Beethoven", "Mozart", "Dvorak", "Brahms"],
            answer: 2,
            explanation: "Antonin Dvorak a compose la 9e Symphonie Du Nouveau Monde en 1893."
          }
        ]
      }
    }
  }
};