// quizSVT.js — Branche SVT
export const QUIZ_SVT = {

  "Biologie": [
{ q: "L'ADN est composé de :", choices: ["Acides aminés", "Nucléotides", "Acides
gras", "Glucose"], answer: 1, note: "L'ADN est un polynucléotide (base azotée +
désoxyribose + phosphate)." },
{ q: "Les bases azotées de l'ADN sont :", choices: ["Adénine, Uracile, Guanine,
Cytosine", "Adénine, Thymine, Guanine, Cytosine (A-T et G-C)", "Adénine,
Thymine, Uracile, Cytosine", "Guanine, Uracile, Thymine, Adénine"], answer: 1,
note: "ADN : 4 bases — A, T, G, C. Paires complémentaires : A-T (2 liaisons H) et G-
C (3 liaisons H)." },
{ q: "Dans l'ARN, la thymine est remplacée par :", choices: ["L'adénine", "L'uracile
(U)", "La guanine", "La cytosine"], answer: 1, note: "ARN : l'uracile (U) remplace la
thymine (T). Bases ARN : A, U, G, C." },
{ q: "La réplication de l'ADN est dite semi-conservative car :", choices: ["Chaque
cellule fille reçoit deux nouveaux brins", "Chaque brin sert de matrice pour un
nouveau brin", "L'ADN est détruit puis recréé", "Les deux brins sont identiques"],
answer: 1, note: "Semi-conservative : molécule fille = 1 brin ancien + 1 brin
nouveau." },
{ q: "La transcription produit :", choices: ["Des protéines directement", "De
l'ARNm à partir de l'ADN (dans le noyau)", "Des ribosomes", "Du glucose"], answer:
1, note: "Transcription : ADN → ARNm. Se déroule dans le noyau." },
{ q: "La traduction (synthèse protéique) se fait sur :", choices: ["Les
mitochondries", "Les chromosomes", "Les ribosomes", "Le noyau"], answer: 2, note:
"Les ribosomes décodent l'ARNm et assemblent les acides aminés en protéines." },
{ q: "Un codon est une séquence de :", choices: ["2 nucléotides", "3 nucléotides",
"4 nucléotides", "5 nucléotides"], answer: 1, note: "Un codon = 3 bases azotées de
l'ARNm codant pour un acide aminé spécifique." },
{ q: "Une mutation est :", choices: ["Un changement d'environnement", "Une
modification permanente de la séquence d'ADN", "Une variation du phénotype sans
changement génétique", "Un croisement entre espèces"], answer: 1, note: "Mutation =
altération permanente de la séquence d'ADN (substitution, délétion, insertion)." },
{ q: "Lors du croisement Aa × Aa, la proportion du phénotype dominant est :",
choices: ["1/4", "1/2", "3/4", "4/4"], answer: 2, note: "Aa×Aa → 1AA + 2Aa + 1aa →
3/4 phénotype dominant, 1/4 récessif." },
{ q: "La méiose produit :", choices: ["2 cellules diploïdes identiques", "4 cellules
haploïdes génétiquement différentes", "2 cellules haploïdes", "4 cellules diploïdes
différentes"], answer: 1, note: "Méiose : 4 cellules haploïdes (n) par brassage
génétique (crossing-over + ségrégation)." },
{ q: "Le crossing-over se produit lors de :", choices: ["La mitose", "La prophase I
de la méiose", "La phase S", "La télophase II"], answer: 1, note: "Le crossing-over en
prophase I échange des segments entre chromosomes homologues." },
{ q: "La mitose aboutit à :", choices: ["2 cellules haploïdes différentes", "4 cellules
haploïdes identiques", "2 cellules diploïdes identiques à la cellule mère", "4 cellules
diploïdes différentes"], answer: 2, note: "Mitose = division conforme : 2 cellules filles
diploïdes identiques à la mère." },
{ q: "La cellule somatique humaine contient :", choices: ["23 chromosomes", "46
chromosomes (23 paires)", "48 chromosomes", "22 chromosomes"], answer: 1, note:
"Cellules somatiques : 2n = 46 chromosomes (23 paires homologues)." },
{ q: "Un gamète humain contient :", choices: ["46 chromosomes", "23
chromosomes", "48 chromosomes", "22 chromosomes"], answer: 1, note: "Gamètes

haploïdes : n = 23 chromosomes." },
{ q: "L'hémophilie est une maladie génétique :", choices: ["Autosomique
dominante", "Liée au chromosome X (récessive)", "Liée au chromosome Y",
"Autosomique récessive uniquement"], answer: 1, note: "Hémophilie : gène porté par
le chromosome X (Xh). Un homme Xh Y est hémophile." },
{ q: "La drépanocytose est causée par :", choices: ["Une infection virale", "Une
mutation du gène de l'hémoglobine (HbS)", "Un manque de vitamine", "Une carence
en fer"], answer: 1, note: "Drépanocytose : mutation ponctuelle Glu→Val sur la
chaîne β de l'hémoglobine." },
{ q: "La trisomie 21 est causée par :", choices: ["Une mutation ponctuelle", "La
présence de 3 chromosomes 21 (2n=47)", "Une délétion chromosomique", "Un
virus"], answer: 1, note: "Trisomie 21 : non-disjonction méiotique → 3 copies du
chromosome 21." },
{ q: "Le phénotype est :", choices: ["L'ensemble des allèles d'un individu",
"L'expression observable du génotype et de l'environnement", "Uniquement la couleur
des yeux", "L'ensemble des chromosomes"], answer: 1, note: "Phénotype = caractères
observables résultant de l'expression du génotype dans un environnement donné." },
{ q: "Deux allèles codominants s'expriment :", choices: ["L'un masquant l'autre",
"Tous les deux simultanément chez l'hétérozygote", "Uniquement chez les
hétérozygotes", "Jamais ensemble"], answer: 1, note: "Codominance : les deux allèles
s'expriment simultanément. Ex: groupe AB." },
{ q: "Les virus sont des agents :", choices: ["Cellulaires avec noyau", "Acellulaires,
parasites intracellulaires obligatoires", "Bactéries de grande taille", "Champignons
microscopiques"], answer: 1, note: "Virus : acellulaires — matériel génétique (ADN
ou ARN) + capside protéique." },
{ q: "Le VIH détruit principalement :", choices: ["Les globules rouges", "Les
lymphocytes T4 (CD4+)", "Les plaquettes", "Les neurones"], answer: 1, note: "VIH
→ destruction des lymphocytes T4 (CD4+) → effondrement de l'immunité → SIDA."
## },
{ q: "La vaccination stimule :", choices: ["L'immunité innée non spécifique", "La
mémoire immunitaire adaptative", "La production de globules rouges", "La synthèse
de vitamines"], answer: 1, note: "Vaccination : crée une mémoire immunitaire
(lymphocytes B mémoires + anticorps) contre un agent pathogène." },
{ q: "Un anticorps est produit par :", choices: ["Les lymphocytes T", "Les
plasmocytes (lymphocytes B différenciés)", "Les macrophages", "Les neutrophiles"],
answer: 1, note: "Les plasmocytes (lymphocytes B activés) produisent des anticorps
spécifiques d'un antigène." },
{ q: "La phagocytose est réalisée par :", choices: ["Les lymphocytes B", "Les
macrophages et neutrophiles", "Les globules rouges", "Les plaquettes"], answer: 1,
note: "Phagocytose : macrophages et neutrophiles englobent et détruisent les agents
pathogènes." },
{ q: "L'insuline est produite par :", choices: ["Le foie", "Les cellules bêta du
pancréas (îlots de Langerhans)", "Les reins", "Les surrénales"], answer: 1, note:
"L'insuline est sécrétée par les cellules β des îlots de Langerhans du pancréas." },
{ q: "Le glucagon :", choices: ["Abaisse la glycémie", "Augmente la glycémie
(glycogénolyse hépatique)", "Régule la pression artérielle", "Contrôle la
température"], answer: 1, note: "Glucagon (cellules α du pancréas) → glycogénolyse
dans le foie → augmentation de la glycémie." },
{ q: "Le système nerveux central (SNC) est composé de :", choices: ["Nerfs
périphériques uniquement", "Encéphale + moelle épinière", "Nerfs crâniens +

spinaux", "Muscles et organes sensoriels"], answer: 1, note: "SNC = encéphale
(cerveau, cervelet, tronc cérébral) + moelle épinière." },
{ q: "L'influx nerveux est transmis d'un neurone à l'autre via :", choices: ["Les
dendrites directement", "La synapse (neuromédiateurs)", "Les mitochondries",
"L'ADN"], answer: 1, note: "À la synapse, les neuromédiateurs (acétylcholine,
dopamine...) transmettent l'influx nerveux." },
{ q: "La glande thyroïde produit :", choices: ["L'insuline", "La thyroxine (T3, T4)
régulant le métabolisme", "L'adrénaline", "Le glucagon"], answer: 1, note: "La
thyroïde produit la thyroxine (T3, T4) qui régule le métabolisme basal et la
croissance." },
{ q: "La stratigraphie étudie :", choices: ["Les êtres vivants actuels", "Les couches
(strates) géologiques et leur succession chronologique", "Les volcans", "Les
tremblements de terre"], answer: 1, note: "Stratigraphie : étude des strates pour
reconstituer l'histoire de la Terre." },
{ q: "Le principe de superposition dit que :", choices: ["La couche la plus récente
est en dessous", "Dans une série non perturbée, les couches les plus anciennes sont en
bas", "Toutes les couches ont le même âge", "Les couches se forment horizontalement
uniquement"], answer: 1, note: "Principe de superposition (Sténon) : les couches les
plus anciennes sont en bas." },
{ q: "Un fossile est :", choices: ["Un animal vivant menacé", "Les restes ou traces
d'un organisme du passé conservés dans une roche", "Un minéral rare", "Une
empreinte récente"], answer: 1, note: "Fossile = restes, empreintes ou traces
d'organismes anciens conservés dans les roches sédimentaires." },
{ q: "Les fossiles guides permettent de :", choices: ["Reconstituer le régime
alimentaire des dinosaures", "Dater les couches géologiques et corréler des strates
distantes", "Mesurer la profondeur des océans", "Connaître le climat actuel"], answer:
1, note: "Fossiles guides : espèces à courte durée d'existence et grande distribution →
datation des strates." },
{ q: "La paléontologie étudie :", choices: ["Les roches volcaniques", "Les fossiles
et la vie passée sur Terre", "Les tremblements de terre", "Les couches géologiques
uniquement"], answer: 1, note: "Paléontologie = étude des êtres vivants fossiles pour
comprendre l'évolution de la vie." },
{ q: "Les roches sédimentaires se forment par :", choices: ["La solidification du
magma", "L'accumulation et la lithification de sédiments", "La métamorphose sous
haute pression", "La fusion de roches existantes"], answer: 1, note: "Roches
sédimentaires (calcaire, grès, argile) : sédiments déposés → compaction →
lithification." },
{ q: "La théorie de la dérive des continents (Wegener) propose que :", choices:
["Les continents sont fixes", "Les continents actuels proviennent d'un supercontinent
(Pangée) fragmenté", "Les océans se forment par évaporation", "Les montagnes se
forment par compression de l'air"], answer: 1, note: "Wegener (1912) : la Pangée s'est
fragmentée il y a ~200 Ma pour former les continents actuels." },
{ q: "La tectonique des plaques explique :", choices: ["Uniquement les
tremblements de terre", "Les volcans, séismes, formation des montagnes et dérive des
continents", "Uniquement la formation des océans", "La météorologie"], answer: 1,
note: "Tectonique des plaques : mouvements des plaques lithosphériques → toute la
géologie dynamique." },
{ q: "La photosynthèse est réalisée par :", choices: ["Les animaux", "Les végétaux,
algues et certaines bactéries (organismes autotrophes)", "Les champignons", "Les
virus"], answer: 1, note: "Photosynthèse : 6CO₂ + 6H₂O + lumière → C H ₂O  +

6O₂ (autotrophes chlorophylliens)." },
{ q: "La respiration cellulaire aérobie produit :", choices: ["Uniquement du CO₂",
"De l'énergie (ATP) + CO₂ + H₂O à partir de glucose et O₂", "Uniquement de l'eau",
"Du glucose à partir de CO₂"], answer: 1, note: "Respiration aérobie : C H ₂O  +
## 6O₂ → 6CO₂ + 6H₂O + ~38 ATP." },
{ q: "Un écosystème est composé de :", choices: ["La biocénose uniquement", "Le
biotope uniquement", "La biocénose + le biotope", "Les producteurs uniquement"],
answer: 2, note: "Écosystème = biocénose (êtres vivants) + biotope (environnement
physique)." },
{ q: "Les décomposeurs sont :", choices: ["Les herbivores", "Les champignons et
bactéries dégradant la matière organique morte", "Les plantes carnivores", "Les
virus"], answer: 1, note: "Les décomposeurs (bactéries, champignons) minéralisent la
matière organique → recyclage des éléments." },
{ q: "La biodiversité désigne :", choices: ["Uniquement le nombre d'espèces", "La
variété des formes de vie : génétique, spécifique et écosystémique", "Uniquement les
espèces menacées", "La diversité des plantes uniquement"], answer: 1, note:
"Biodiversité : 3 niveaux — génétique (variabilité des gènes), spécifique (espèces),
écosystémique (habitats)." },
{ q: "La déforestation en Haïti entraîne :", choices: ["Une augmentation de la
biodiversité", "L'érosion des sols, inondations et perte de biodiversité", "Une
amélioration du climat", "Une augmentation des ressources en eau"], answer: 1, note:
"Déforestation haïtienne (~98% déboisée) → érosion → glissements → inondations
→ perte de biodiversité." },
{ q: "L'ADN est localisé principalement dans :", choices: ["Le cytoplasme", "Le
noyau (+ mitochondries et chloroplastes en faible quantité)", "Les ribosomes", "La
membrane plasmique"], answer: 1, note: "ADN nucléaire : dans le noyau
(chromosomes). ADN mitochondrial et chloroplastique en faible quantité." },
{ q: "La PCR permet de :", choices: ["Synthétiser des protéines in vitro",
"Amplifier des fragments spécifiques d'ADN", "Séquencer des protéines", "Cultiver
des bactéries en milieu acide"], answer: 1, note: "PCR : amplifie exponentiellement
des fragments d'ADN spécifiques → essentiel en diagnostic génétique." },
{ q: "L'électrophorèse sur gel sépare les molécules selon :", choices: ["Leur
couleur", "Leur taille et leur charge électrique", "Leur masse en grammes", "Leur
point de fusion"], answer: 1, note: "Électrophorèse : les fragments d'ADN migrent
selon leur taille — les plus courts migrent plus loin." },
{ q: "Le génie génétique consiste à :", choices: ["Étudier uniquement les gènes",
"Modifier et manipuler le matériel génétique des organismes", "Classer les espèces",
"Observer les chromosomes"], answer: 1, note: "Génie génétique : manipulation du
génome (OGM, thérapie génique, insuline recombinante...)." },
{ q: "L'immunité adaptative se caractérise par :", choices: ["Une réponse rapide et
non spécifique", "La spécificité et la mémoire immunitaire", "L'absence de
lymphocytes", "Une réponse identique à chaque infection"], answer: 1, note:
"Immunité adaptative : spécifique à un antigène, implique lymphocytes B (anticorps)
et T, avec mémoire." },
{ q: "Le facteur Rh est :", choices: ["Un anticorps plasmatique", "Un antigène
(protéine D) sur les GR des personnes Rh+", "Une enzyme sanguine", "Un sucre
sanguin"], answer: 1, note: "Rh+ : présence de l'antigène D sur les GR. Important lors
des transfusions et grossesses." },
{ q: "L'osmose est le mouvement de :", choices: ["Solutés à travers une membrane

perméable", "L'eau à travers une membrane semi-perméable du milieu hypotonique
vers hypertonique", "Protéines dans le cytoplasme", "Ions par transport actif"],
answer: 1, note: "Osmose : diffusion passive de l'eau vers la solution plus concentrée
à travers une membrane semi-perméable." },
{ q: "La mitochondrie est le siège de :", choices: ["La photosynthèse", "La
respiration aérobie (cycle de Krebs + phosphorylation oxydative)", "La réplication de
l'ADN", "La synthèse des lipides"], answer: 1, note: "La mitochondrie produit la
majorité de l'ATP cellulaire via la respiration aérobie." },
{ q: "Le chloroplaste est le siège de :", choices: ["La respiration cellulaire", "La
photosynthèse (phase claire + cycle de Calvin)", "La mitose", "La synthèse des
protéines"], answer: 1, note: "Le chloroplaste réalise la photosynthèse : phase claire
(thylakoïdes) + cycle de Calvin (stroma)." },
{ q: "La nutrition minérale des plantes se fait par :", choices: ["La photosynthèse
uniquement", "L'absorption d'eau et sels minéraux par les racines", "La respiration
foliaire", "La transpiration"], answer: 1, note: "Nutrition minérale : absorption d'eau et
ions (N, P, K...) par les poils absorbants des racines." },
{ q: "L'évolution selon Darwin est fondée sur :", choices: ["La création divine", "La
sélection naturelle + variation héréditaire + surproduction d'individus", "Les
mutations uniquement", "La volonté des organismes de s'adapter"], answer: 1, note:
"Darwinisme : variation + hérédité + sélection naturelle (survie des plus aptes) =
évolution." },
{ q: "Les roches magmatiques se forment par :", choices: ["L'accumulation de
sédiments", "La solidification du magma (lave refroidie)", "La métamorphose",
"L'érosion"], answer: 1, note: "Roches magmatiques (granite, basalte) :
refroidissement du magma. Extrusive (lave) ou intrusive (profond)." },
{ q: "Un séisme est causé par :", choices: ["Des explosions volcaniques
uniquement", "La rupture de roches et libération d'énergie le long d'une faille",
"L'érosion côtière", "Le mouvement des océans"], answer: 1, note: "Séisme : rupture
soudaine de roches sous contrainte le long d'une faille → ondes sismiques." },
{ q: "L'effet de serre naturel est causé par :", choices: ["La pollution industrielle",
"Des gaz atmosphériques (CO₂, H₂O, CH₄) retenant la chaleur solaire", "L'ozone
uniquement", "Les rayons UV"], answer: 1, note: "Effet de serre naturel : CO₂, vapeur
d'eau, méthane → maintien de la Terre à ~15°C." },
{ q: "La chaîne alimentaire représente :", choices: ["Une liste de prédateurs", "Un
transfert d'énergie : producteurs → consommateurs primaires → secondaires →
décomposeurs", "Une classification des espèces", "Un réseau de parasites"], answer:
1, note: "Chaîne alimentaire : transfert de matière et d'énergie entre les niveaux
trophiques." },
{ q: "Le caryotype humain comprend :", choices: ["44 autosomes + 2 chromosomes
sexuels (total 46)", "46 autosomes + 2 chromosomes sexuels", "23 paires uniquement
d'autosomes", "44 chromosomes uniquement"], answer: 0, note: "Caryotype humain :
44 autosomes + 2 chromosomes sexuels (XX femme, XY homme) = 46 au total." },
{ q: "La femme a pour formule chromosomique sexuelle :", choices: ["XY", "XX",
"X0", "YY"], answer: 1, note: "Femme : XX. Homme : XY. Les chromosomes
sexuels déterminent le sexe génétique." },
{ q: "L'hémoglobine :", choices: ["Produit des anticorps", "Transporte l'oxygène
(O₂) dans le sang", "Régule la glycémie", "Dégrade les glucides"], answer: 1, note:
"L'hémoglobine (Hb) dans les globules rouges fixe l'O₂ dans les poumons et le libère
dans les tissus." },
{ q: "La réaction inflammatoire présente comme signes cardinaux :", choices:

["Fièvre, nausée, vertiges, perte de conscience", "Rougeur, chaleur, gonflement,
douleur", "Pâleur, refroidissement, douleur, gonflement", "Fatigue, insomnie, douleur,
fièvre"], answer: 1, note: "Inflammation : rougeur (rubor), chaleur (calor), gonflement
(tumor), douleur (dolor) — réponse immunitaire innée." },
{ q: "La gestion durable des ressources naturelles consiste à :", choices: ["Exploiter
au maximum les ressources actuelles", "Utiliser les ressources en préservant leur
capacité de renouvellement pour les générations futures", "Interdire toute utilisation",
"Privatiser toutes les ressources"], answer: 1, note: "Gestion durable : exploiter sans
compromettre la disponibilité pour les générations futures." },
{ q: "Le système ABO détermine les groupes sanguins par :", choices: ["Des
protéines du plasma", "Des antigènes (glycoprotéines) à la surface des globules
rouges", "Des anticorps plasmatiques uniquement", "Des enzymes sanguines"],
answer: 1, note: "Système ABO : antigènes A et/ou B sur les GR → groupes A, B, AB,
## O." },
{ q: "La synthèse protéique (traduction) produit :", choices: ["De l'ARN", "Des
glucides", "Des lipides", "Des protéines (chaînes d'acides aminés)"], answer: 3, note:
"Traduction : les ribosomes décodent les codons de l'ARNm → assemblage d'acides
aminés → protéine." },
{ q: "La phylogénie (classification phylogénétique) est basée sur :", choices: ["La
forme extérieure uniquement", "Les relations évolutives (ancêtres communs)", "La
taille des organismes", "L'habitat"], answer: 1, note: "Phylogénie : classification basée
sur les liens de parenté évolutifs (ancêtres communs) → arbre du vivant." },
{ q: "La cellule procaryote (bactérie) se distingue par :", choices: ["La présence de
ribosomes", "L'absence de noyau délimité par une membrane", "La présence de
mitochondries", "La présence de chloroplastes"], answer: 1, note: "Les bactéries sont
des procaryotes : pas de noyau délimité, pas d'organites membranaires." },
{ q: "L'appareil de Golgi a pour fonction :", choices: ["Produire de l'énergie", "Trier
et distribuer les protéines vers leur destination", "Répliquer l'ADN", "Effectuer la
photosynthèse"], answer: 1, note: "L'appareil de Golgi trie, modifie et dirige les
protéines vers leur destination (sécrétion, membrane...)." },
{ q: "Les lysosomes contiennent :", choices: ["De l'ADN", "Des enzymes digestives
hydrolytiques", "De la chlorophylle", "Des ribosomes"], answer: 1, note: "Les
lysosomes contiennent des enzymes hydrolytiques pour digérer les déchets cellulaires
## (autophagie)." },
{ q: "La reproduction sexuée permet :", choices: ["Une descendance génétiquement
identique", "Une plus grande variabilité génétique", "Une reproduction plus rapide",
"L'absence de mutation"], answer: 1, note: "Reproduction sexuée (méiose +
fécondation) = brassage génétique → grande diversité génétique." },
{ q: "L'ADN mitochondrial est hérité :", choices: ["Du père uniquement", "De la
mère uniquement", "Des deux parents", "Aléatoirement"], answer: 1, note: "L'ADN
mitochondrial est hérité exclusivement de la mère (transmission maternelle)." },
{ q: "Le réflexe médullaire :", choices: ["Implique le cerveau", "Court-circuite le
cerveau (stimulus → moelle → réponse musculaire)", "Est toujours conscient",
"Implique uniquement les nerfs périphériques"], answer: 1, note: "Réflexe médullaire
(ex: rotulien) : arc réflexe ne passant pas par le cerveau." },
{ q: "L'adrénaline est produite par :", choices: ["Le pancréas", "Les glandes
surrénales (médullosurrénale)", "La thyroïde", "L'hypophyse"], answer: 1, note:
"L'adrénaline est sécrétée par la médullosurrénale en situation de stress ou de danger."
## },
{ q: "L'érosion est le processus par lequel :", choices: ["Les roches se forment",

"Les roches sont détruites et transportées par l'eau, le vent, la glace", "Les minéraux
cristallisent", "Les fossiles se forment"], answer: 1, note: "Érosion : désagrégation et
transport des roches par les agents (eau, vent, glace, gravité)." },
{ q: "La régulation de la glycémie fait intervenir :", choices: ["L'insuline et le
glucagon (régulation antagoniste)", "L'adrénaline uniquement", "La thyroxine", "Le
cortisol uniquement"], answer: 0, note: "Régulation glycémie : insuline (baisse) et
glucagon (hausse) — hormones antagonistes du pancréas." },
{ q: "Le foie joue un rôle central dans :", choices: ["La production d'insuline
uniquement", "La détoxification, production de bile, stockage du glycogène et
synthèse des protéines plasmatiques", "La filtration du sang uniquement", "La
production de globules rouges uniquement"], answer: 1, note: "Le foie : organe
multifonctionnel — détoxification, bile, glycogène, protéines plasmatiques,
métabolisme." },
{ q: "La transpiration stomatique chez les plantes se fait via :", choices: ["La tige",
"Les stomates des feuilles", "Les racines", "Les fleurs"], answer: 1, note:
"Transpiration stomatique : perte d'eau vapeur par les stomates → moteur de la
montée de sève." },
{ q: "Les enzymes sont des :", choices: ["Lipides catalyseurs", "Protéines
catalyseurs accélérant les réactions biochimiques", "Glucides régulateurs", "ARN
messagers"], answer: 1, note: "Les enzymes sont des protéines (ou ARN = ribozymes)
qui catalysent les réactions biochimiques." },
{ q: "Le cancer est caractérisé par :", choices: ["Une division cellulaire normale
mais accélérée", "Une prolifération incontrôlée de cellules anormales", "Une mort
cellulaire excessive", "Un manque de mutation"], answer: 1, note: "Cancer =
prolifération incontrôlée de cellules anormales (division sans régulation)." },
{ q: "La vaccination a permis d'éliminer ou réduire drastiquement :", choices: ["Le
sida", "La variole (éliminée en 1980), la poliomyélite, la rougeole", "Le paludisme",
"Les maladies cardiaques"], answer: 1, note: "La vaccination a éliminé la variole
(1980) et réduit massivement la poliomyélite et la rougeole." },
{ q: "La symbiose est une relation entre deux organismes qui est :", choices:
["Bénéfique pour l'un, neutre pour l'autre", "Bénéfique pour les deux partenaires
(mutualisme)", "Nuisible pour les deux", "Bénéfique pour l'un, nuisible pour l'autre"],
answer: 1, note: "Symbiose/mutualisme = relation bénéfique pour les deux. Ex:
lichens, légumineuses/Rhizobium." },
{ q: "Le cycle de l'eau comprend :", choices: ["Uniquement l'évaporation",
"Évaporation, condensation, précipitation et ruissellement/infiltration", "Uniquement
les précipitations", "Uniquement le ruissellement"], answer: 1, note: "Cycle
hydrologique : évaporation → condensation (nuages) → précipitations →
ruissellement → évaporation." },
{ q: "L'antigène est :", choices: ["Un anticorps produit par l'organisme", "Une
substance étrangère déclenchant une réponse immunitaire", "Un globule blanc", "Une
cellule cancéreuse"], answer: 1, note: "Antigène = molécule étrangère (protéine virale,
bactérienne) reconnue par le système immunitaire." },
{ q: "Le principe de conservation de la biodiversité est important car :", choices:
["Elle n'a pas d'utilité pratique", "Elle est source de médicaments, d'alimentation et
maintient l'équilibre des écosystèmes", "Elle concerne uniquement les espèces rares",
"Elle est uniquement esthétique"], answer: 1, note: "Biodiversité : source de
médicaments (25% viennent de plantes), alimentation, équilibre écosystémique." },
## ],

  "Géologie": [
    { q: "Les roches magmatiques se forment par :", choices: ["L'accumulation de sédiments compactés", "La solidification du magma (refroidissement de la lave ou du magma en profondeur)", "La transformation de roches sous haute pression", "L'érosion et le dépôt de particules"], answer: 1, note: "Roches ignées : intrusives (granite — refroidissement lent, grands cristaux) ou extrusives (basalte — refroidissement rapide, petits cristaux)." },
    { q: "Le granite est une roche magmatique :", choices: ["Extrusive (lave refroidie en surface)", "Intrusive (magma refroidi lentement en profondeur)", "Sédimentaire calcaire", "Métamorphique"], answer: 1, note: "Granite : intrusive à gros cristaux (quartz, feldspath, mica). Refroidissement lent → grands cristaux visibles à l'œil nu." },
    { q: "Le basalte est une roche magmatique :", choices: ["Intrusive à gros cristaux", "Extrusive (lave refroidie rapidement en surface) — compose le fond des océans", "Sédimentaire organique", "Métamorphique foliée"], answer: 1, note: "Basalte : extrusive à fins cristaux. Refroidissement rapide de la lave. Roche la plus abondante de la lithosphère océanique." },
    { q: "Les roches sédimentaires se forment par :", choices: ["Solidification du magma", "Accumulation, compaction et cimentation de sédiments (débris de roches, organismes)", "Transformation sous haute pression et température", "Cristallisation à haute température"], answer: 1, note: "Roches sédimentaires : calcaire, grès, argile. Formées en couches (strates) dans l'eau ou à l'air. Contiennent souvent des fossiles." },
    { q: "Le calcaire est une roche sédimentaire :", choices: ["Détritique (fragments de roches)", "Biochimique (accumulation de coquilles calcaires d'organismes marins)", "Magmatique extrusive", "Métamorphique"], answer: 1, note: "Calcaire (CaCO₃) : biochimique, issu de squelettes d'organismes marins. Très répandu en Haïti — utilisé dans la construction et cimenterie." },
    { q: "Les roches métamorphiques résultent de :", choices: ["L'érosion de roches existantes", "La transformation de roches préexistantes à l'état solide sous haute pression et/ou température", "La solidification du magma en profondeur", "L'accumulation de sédiments organiques"], answer: 1, note: "Métamorphisme : transformation sans fusion. Calcaire → marbre, granite → gneiss, argile → schiste." },
    { q: "Le marbre est une roche métamorphique issue de :", choices: ["L'argile sous haute pression", "La transformation du calcaire sous haute pression et température", "La solidification du magma", "L'accumulation de sédiments marins"], answer: 1, note: "Marbre = métamorphisme du calcaire (CaCO₃). Haïti possède des gisements de marbre (pierre marbrière) — ressource valorisable." },
    { q: "Les deux grands types de volcans sont :", choices: ["Actifs et éteints", "Effusifs (lave fluide, peu explosifs) et explosifs (lave visqueuse, très dangereux)", "Marins et terrestres uniquement", "Jeunes et anciens"], answer: 1, note: "Effusifs (Hawaii, Piton de la Fournaise) : lave basaltique fluide → coulées. Explosifs (Soufrière, Pelée) : lave acide et visqueuse → explosions violentes, nuées ardentes." },
    { q: "Un séisme est causé par :", choices: ["L'éruption volcanique uniquement", "La rupture soudaine de roches sous contrainte tectonique le long d'une faille, libérant de l'énergie (ondes sismiques)", "L'érosion des côtes", "Le mouvement des océans"], answer: 1, note: "Séisme : rupture en profondeur (foyer/hypocentre) → ondes sismiques → secousses en surface (épicentre)." },
    { q: "L'échelle de Richter mesure :", choices: ["L'intensité ressentie par la population", "La magnitude (énergie libérée) d'un séisme — échelle logarithmique", "La durée d'un séisme", "La profondeur du foyer"], answer: 1, note: "Magnitude (Richter) : chaque point = 32× plus d'énergie. Séisme haïtien du 12/01/2010 = magnitude 7,0 → catastrophe majeure." },
    { q: "Haïti est particulièrement exposée aux séismes car :", choices: ["Le sol haïtien est très mou", "Elle est à la frontière des plaques caribéenne et nord-américaine — faille Enriquillo active", "Les volcans créent des séismes constants", "L'érosion fragilise les sols"], answer: 1, note: "Faille Enriquillo-Plantain Garden (transformante) : frontière Caraïbe/Amérique du Nord traverse Haïti → forte sismicité. Séisme 12/01/2010 : ~220 000 morts." },
    { q: "La stratigraphie est la science qui étudie :", choices: ["La structure chimique des roches", "Les couches (strates) géologiques et leur succession chronologique", "Les minéraux uniquement", "Les fossiles exclusivement"], answer: 1, note: "Stratigraphie : étude des strates pour reconstituer l'histoire géologique. Permet de dater les formations et corréler des sites éloignés." },
    { q: "Le principe de superposition (Sténon, 1669) dit que :", choices: ["Les couches les plus récentes sont en bas", "Dans une série non perturbée, les couches les plus anciennes sont en bas, les plus récentes en haut", "Toutes les couches ont le même âge", "La couche la plus épaisse est la plus ancienne"], answer: 1, note: "Principe fondamental de stratigraphie. Base de la datation relative des strates géologiques." },
    { q: "Un fossile stratigraphique (fossile guide) se caractérise par :", choices: ["Une longue durée d'existence et distribution limitée", "Une courte durée d'existence géologique et une large distribution — permet de dater les strates", "Un habitat uniquement aquatique", "Une grande taille"], answer: 1, note: "Fossile guide : espèce éteinte à existence brève (~1 Ma) et distribution mondiale → outil de datation relative des strates. Ex: Ammonites (Mésozoïque)." },
    { q: "La paléontologie est :", choices: ["L'étude des roches uniquement", "La science des êtres vivants du passé à travers l'étude des fossiles — histoire de la vie sur Terre", "L'étude des minéraux", "L'étude des séismes"], answer: 1, note: "Paléontologie : fossiles → morphologie, comportement, environnement des organismes anciens → reconstitution de l'histoire de la vie." },
    { q: "La pédologie est la science qui étudie :", choices: ["Les roches magmatiques", "Les sols — leur formation (pédogenèse), composition, types et propriétés", "Les fossiles", "Les eaux souterraines"], answer: 1, note: "Pédologie : formation du sol par altération de la roche mère + matière organique. Horizons A (humus), B (minéraux), C (roche altérée)." },
    { q: "L'érosion des sols en Haïti est aggravée principalement par :", choices: ["L'excès de pluie uniquement", "La déforestation massive (~98% déboisée) qui prive le sol de sa couverture végétale protectrice", "Les séismes exclusivement", "Le surpâturage uniquement"], answer: 1, note: "Érosion haïtienne : déforestation → sol nu → pluies tropicales intenses → érosion hydrique → désertification. Haïti perd ~36 millions de tonnes de sol/an." },
    { q: "Une nappe phréatique est :", choices: ["Un lac en surface", "Une accumulation d'eau souterraine dans les roches perméables (aquifère) — réservoir d'eau souterrain", "Un fleuve souterrain visible", "Un lac artificiel"], answer: 1, note: "Nappe phréatique : eau infiltrée stockée dans les pores/fissures des roches perméables. Source essentielle d'eau potable en Haïti (zones rurales)." },
    { q: "Les minerais métalliques présents en Haïti comprennent :", choices: ["Uniquement du pétrole", "Du cuivre et de l'or (nord, région Morne Bossa) et de la bauxite (historiquement — Miragoane)", "Uniquement du charbon", "Du fer et de l'aluminium uniquement"], answer: 1, note: "Haïti : gisements d'or et cuivre (nord, Morne Bossa — exploré par Newmont), bauxite (Miragoane — exploitée jusqu'aux années 1980). Sous-exploités. Programme MENFP." },
    { q: "Les minerais non métalliques présents en Haïti incluent :", choices: ["Le diamant et le rubis", "Le calcaire (marbre), l'argile, le sel gemme, le lignite", "L'uranium et le titane", "Le platine et le lithium"], answer: 1, note: "Haïti : calcaire abondant (construction/ciment), marbre, argile, sel gemme, lignite. Programme MENFP : géologie économique haïtienne." },
    { q: "La crise Crétacé-Tertiaire (K-Pg, ~66 Ma) est marquée par :", choices: ["L'apparition des dinosaures", "La disparition massive de ~75% des espèces dont les dinosaures non-aviaires — impact météoritique + volcanisme", "L'émergence des mammifères uniquement", "Une glaciation majeure"], answer: 1, note: "Crise K-Pg : impact de Chicxulub (Mexique) + trapps du Deccan → disparition de 75% des espèces. Fin des dinosaures, début de l'ère des mammifères." },
    { q: "La géomorphologie étudie :", choices: ["La composition chimique des roches", "Les formes du relief terrestre (montagnes, vallées, côtes) et les processus qui les créent", "Les minéraux uniquement", "Les volcans exclusivement"], answer: 1, note: "Géomorphologie : érosion, dépôt, tectonique → formes du relief. Haïti : relief montagneux (~70%) → fortes contraintes géomorphologiques." },
    { q: "La géomorphologie marine étudie :", choices: ["Les vagues uniquement", "Les formes du relief des fonds marins et des côtes — plateaux continentaux, dorsales, fosses océaniques", "Les tempêtes tropicales", "La pollution marine"], answer: 1, note: "Géomorphologie marine : plateaux continentaux, pentes, fosses (~11 000 m), dorsales médio-océaniques, plaines abyssales. Côtier : falaises, plages, deltas." },
    { q: "L'hydrogéologie étudie :", choices: ["Les océans et les mers", "Les eaux souterraines — présence, mouvement, qualité et exploitation des aquifères", "Les rivières uniquement", "Les glaciers"], answer: 1, note: "Hydrogéologie : eau souterraine dans les aquifères — captage de sources, forages, protection des nappes. Essentielle pour l'alimentation en eau d'Haïti." },
    { q: "La datation radiométrique permet de :", choices: ["Dater les strates par leur position relative", "Calculer l'âge absolu des roches à partir de la désintégration d'isotopes radioactifs (C14, K-Ar, U-Pb)", "Dater les fossiles par morphologie", "Estimer l'âge par la couleur des roches"], answer: 1, note: "Radiométrie : C14 (<50 000 ans), K-Ar et U-Pb (roches anciennes, milliards d'années). Donne des âges absolus en millions d'années." },
    { q: "L'hominisation désigne :", choices: ["La domestication des animaux", "Le processus évolutif conduisant de nos ancêtres primates à Homo sapiens — sur ~7 millions d'années", "L'émergence des dinosaures", "La colonisation de nouveaux continents uniquement"], answer: 1, note: "Hominisation : Australopithèques → Homo habilis → Homo erectus → Homo sapiens. Émergence en Afrique subsaharienne." },
    { q: "La tectonique des plaques explique :", choices: ["Uniquement les tremblements de terre", "Les volcans, séismes, formation des montagnes, dérive des continents — mouvements des plaques lithosphériques", "Uniquement la formation des océans", "La météorologie"], answer: 1, note: "Tectonique des plaques : la lithosphère divisée en plaques rigides sur l'asthénosphère. Frontières = zones de volcans, séismes, orogénèse (formation des montagnes)." },
    { q: "Les changements climatiques actuels affectent la géologie haïtienne en :", choices: ["Stabilisant les pentes", "Intensifiant les précipitations extrêmes → érosion accélérée, glissements de terrain et inondations plus fréquents", "Réduisant l'érosion côtière", "Favorisant la formation de nouveaux sols fertiles"], answer: 1, note: "Changements climatiques + déforestation haïtienne → précipitations intenses + sol nu → érosion catastrophique. Haïti : pays parmi les plus vulnérables au monde." },
  ],

  "Chimie": [
{ q: "La formule générale des alcanes est :", choices: ["C H₂ ", "C H₂  ₂",
"C H₂  ₂", "C H "], answer: 1, note: "Alcanes : C H₂  ₂. Hydrocarbures
saturés (liaisons simples). Ex: méthane CH₄, éthane C₂H ." },
{ q: "La formule générale des alcènes (une double liaison C=C) est :", choices:
["C H₂  ₂", "C H₂ ", "C H₂  ₂", "C H "], answer: 1, note: "Alcènes :
C H₂ . Une double liaison C=C. Ex: éthylène C₂H₄, propylène C₃H ." },
{ q: "La formule générale des alcynes (une triple liaison C≡C) est :", choices:
["C H₂  ₂", "C H₂ ", "C H₂  ₂", "C H "], answer: 2, note: "Alcynes :
C H₂  ₂. Une triple liaison C≡C. Ex: acétylène C₂H₂." },
{ q: "La combustion complète d'un hydrocarbure produit :", choices: ["CO et H₂",
"CO₂ + H₂O", "C et H₂O", "CO et H₂O"], answer: 1, note: "Combustion complète :
hydrocarbure + O₂ → CO₂ + H₂O. Ex: CH₄ + 2O₂ → CO₂ + 2H₂O." },
{ q: "La formule brute du benzène est :", choices: ["C H ₂", "C H ", "C H ₄",
"C H  "], answer: 1, note: "Benzène : C H  — molécule cyclique aromatique
avec liaisons délocalisées." },

{ q: "Un alcool primaire possède le groupe :", choices: ["-COOH", "-CHO", "-
CH₂OH", "-C=O"], answer: 2, note: "Alcool primaire : groupe -CH₂OH (la fonction -
OH est sur un carbone lié à 1 seul autre C)." },
{ q: "Un aldéhyde possède le groupe fonctionnel :", choices: ["-COOH", "-CHO
(en bout de chaîne)", "-C=O entre deux C", "-OH"], answer: 1, note: "Aldéhyde :
groupe -CHO en bout de chaîne. Ex: méthanal HCHO (formol), éthanal CH₃CHO." },
{ q: "Une cétone possède le groupe fonctionnel :", choices: ["-COOH", "-CHO", "-
C=O entre deux carbones", "-NH₂"], answer: 2, note: "Cétone : groupe carbonyle -
C(=O)- entre deux carbones. Ex: acétone CH₃COCH₃." },
{ q: "Un acide carboxylique possède le groupe :", choices: ["-COOH", "-CHO", "-
COO-", "-OH"], answer: 0, note: "Acide carboxylique : -COOH. Ex: acide acétique
CH₃COOH (vinaigre)." },
{ q: "La fonction ester est caractérisée par le groupe :", choices: ["-OH", "-COOH",
"-COO-", "-CHO"], answer: 2, note: "Ester : -COO-. Ex: CH₃COOC₂H  (acétate
d'éthyle). Odeur fruitée, parfums, solvants." },
{ q: "L'estérification est une réaction :", choices: ["Totale et rapide", "Lente, limitée
et réversible (↔ hydrolyse)", "Totale et irréversible", "Instantanée"], answer: 1, note:
"Estérification : acide carboxylique + alcool ⇌ ester + eau. Réaction lente et
incomplète." },
{ q: "La saponification est la réaction d'un ester avec :", choices: ["Un acide", "Une
base forte (NaOH) → savon + alcool", "Un alcool", "L'eau seule"], answer: 1, note:
"Saponification (totale et irréversible) : ester + NaOH → sel d'acide carboxylique
(savon) + alcool." },
{ q: "L'acide acétique (éthanoïque) a pour formule :", choices: ["CH₃OH",
"CH₃COOH", "C₂H OH", "HCOOH"], answer: 1, note: "Acide acétique :
CH₃COOH. Composant principal du vinaigre (~5% d'acide acétique)." },
{ q: "L'éthanol a pour formule :", choices: ["CH₄O", "C₂H OH", "C₃H OH",
"CH₃COOH"], answer: 1, note: "Éthanol : C₂H OH. Alcool présent dans les boissons
alcoolisées, antiseptique, carburant." },
{ q: "Une pile électrochimique convertit :", choices: ["L'énergie électrique en
énergie chimique", "L'énergie chimique en énergie électrique", "La chaleur en
électricité", "La lumière en électricité"], answer: 1, note: "Pile électrochimique :
réaction d'oxydoréduction spontanée → courant électrique." },
{ q: "Dans une pile, l'anode est :", choices: ["L'électrode positive (réduction)",
"L'électrode négative (oxydation)", "L'électrolyte", "Le pont salin"], answer: 1, note:
"Anode = électrode négative dans une pile : siège de l'oxydation (perte d'électrons)."
## },
{ q: "Dans une pile, la cathode est :", choices: ["L'électrode négative", "L'électrode
positive (réduction)", "Le pont salin", "L'électrolyte"], answer: 1, note: "Cathode =
électrode positive dans une pile : siège de la réduction (gain d'électrons)." },
{ q: "Dans une pile Daniell (Zn/Cu), le zinc :", choices: ["Se réduit", "S'oxyde : Zn
→ Zn²  + 2e ", "Reste inchangé", "Se dépose sur la cathode"], answer: 1, note: "Pile
Daniell : Zn s'oxyde (anode) → Zn²  + 2e . Cu²  se réduit (cathode) → Cu." },
{ q: "L'électrolyse est le processus qui :", choices: ["Produit du courant à partir de
réactions spontanées", "Utilise un courant électrique pour forcer une réaction
chimique non spontanée", "Stocke l'énergie chimique", "Sépare les molécules par
distillation"], answer: 1, note: "Électrolyse : courant électrique imposé → réaction
non spontanée (Ex: électrolyse de l'eau)." },

{ q: "Lors de l'électrolyse de l'eau, à la cathode se forme :", choices: ["De l'oxygène
O₂", "Du dihydrogène H₂ (réduction : 4H  + 4e  → 2H₂)", "Du sel", "Du sodium"],
answer: 1, note: "Électrolyse de l'eau : cathode → H₂ (réduction). Anode → O₂
(oxydation). Rapport H₂:O₂ = 2:1." },
{ q: "Dans une réaction rédox, l'oxydant :", choices: ["Perd des électrons", "Gagne
des électrons (se réduit)", "Perd des protons", "Gagne des protons"], answer: 1, note:
"Oxydant = accepteur d'électrons (se réduit). Réducteur = donneur d'électrons
(s'oxyde). OILRIG." },
{ q: "Le pH est défini par :", choices: ["pH = [H ]", "pH = -log[H ]", "pH =
log[H ]", "pH = [OH ]"], answer: 1, note: "pH = -log[H ]. Plus le pH est bas, plus
la solution est acide." },
{ q: "Le pH d'une solution neutre à 25°C est :", choices: ["0", "7", "14", "4"],
answer: 1, note: "L'eau pure à 25°C : pH = 7 (neutre). pH < 7 = acide, pH > 7 =
basique." },
{ q: "Le pH d'une solution d'HCl à 0,01 mol/L est :", choices: ["1", "2", "7", "12"],
answer: 1, note: "HCl acide fort (dissociation totale) : [H ] = 10 ² mol/L → pH = 2."
## },
{ q: "Le pH d'une solution de NaOH à 0,01 mol/L est :", choices: ["2", "7", "12",
"14"], answer: 2, note: "NaOH base forte : [OH ] = 10 ² → pOH = 2 → pH = 14 - 2
## = 12." },
{ q: "Un acide fort se dissocie dans l'eau :", choices: ["Partiellement", "Totalement
→ [H ] = Cacide", "Jamais", "Seulement à haute T"], answer: 1, note: "Acides forts
(HCl, HNO₃, H₂SO₄) : dissociation totale → [H ] = concentration initiale." },
{ q: "Un acide faible se dissocie dans l'eau :", choices: ["Totalement",
"Partiellement (Ka < 1) → [H ] < Cacide", "Jamais", "Complètement en milieu
basique"], answer: 1, note: "Acides faibles (CH₃COOH, HF, H₂CO₃) : dissociation
partielle → Ka = [H ][A ]/[HA]." },
{ q: "La neutralisation entre HCl et NaOH donne :", choices: ["NaCl + H₂O₂",
"NaCl + H₂O", "NaOH + Cl₂", "Na₂O + HCl"], answer: 1, note: "Neutralisation : HCl
+ NaOH → NaCl + H₂O. pH = 7 pour acide fort + base forte équimolaires." },
{ q: "Une solution tampon résiste aux variations de :", choices: ["Température",
"pH lors d'ajout d'acide ou de base", "Concentration en soluté", "Pression"], answer:
1, note: "Solution tampon : mélange acide faible/base conjuguée → stabilise le pH
(ex: sang pH ≈ 7,4)." },
{ q: "Le principe de Le Chatelier dit que :", choices: ["L'équilibre est détruit si on le
perturbe", "Le système évolue dans le sens qui s'oppose à la perturbation", "Le
système accélère", "Rien ne change"], answer: 1, note: "Le Chatelier : si on perturbe
un équilibre, le système réagit pour minimiser la perturbation." },
{ q: "Le numéro atomique Z représente :", choices: ["Le nombre de neutrons", "Le
nombre de protons (= nombre d'électrons dans l'atome neutre)", "La masse atomique",
"Le nombre d'électrons de valence"], answer: 1, note: "Z = nombre de protons dans le
noyau. Z détermine l'élément chimique." },
{ q: "Le nombre de masse A représente :", choices: ["Z + électrons", "Z + N
(protons + neutrons = nucléons)", "Uniquement les protons", "La masse en
grammes"], answer: 1, note: "A = Z + N. Les nucléons sont les protons + neutrons du
noyau." },
{ q: "Des isotopes sont des atomes du même élément avec :", choices: ["Le même
nombre de neutrons", "Le même Z mais N différent (donc A différent)", "Des
propriétés chimiques différentes", "Des masses identiques"], answer: 1, note:

"Isotopes : même Z (même élément), mais N et A différents. Ex: ¹²C et ¹⁴C." },
{ q: "La liaison covalente est formée par :", choices: ["Transfert d'électrons", "Mise
en commun d'une paire d'électrons entre deux atomes", "Attraction ionique", "Partage
de protons"], answer: 1, note: "Liaison covalente : partage d'électrons (paire liante).
Ex: H-H, C-H, O-H." },
{ q: "La liaison ionique se forme entre :", choices: ["Deux non-métaux", "Un métal
et un non-métal (transfert d'électrons → ions opposés)", "Deux métaux", "Deux
molécules polaires"], answer: 1, note: "Liaison ionique : métal (cède e  → cation) +
non-métal (gagne e  → anion). Ex: NaCl." },
{ q: "La règle de l'octet stipule que les atomes tendent à avoir :", choices: ["8
protons", "8 électrons sur leur couche externe", "8 neutrons", "8 liaisons"], answer: 1,
note: "Règle de l'octet : stabilité maximale avec 8 électrons sur la couche externe
(sauf H et He : 2)." },
{ q: "L'électronégativité mesure :", choices: ["La capacité à perdre des électrons",
"La tendance à attirer les électrons d'une liaison covalente vers soi", "La charge de
l'ion", "La vitesse de réaction"], answer: 1, note: "Électronégativité (Pauling) : F est le
plus électronégatif (χ = 4,0)." },
{ q: "La géométrie de la molécule H₂O est :", choices: ["Linéaire", "Tétraédrique",
"Coudée (~104,5°) due aux 2 paires libres sur O", "Trigonale plane"], answer: 2, note:
"H₂O : géométrie coudée due aux 2 paires d'électrons libres sur l'oxygène (VSEPR)."
## },
{ q: "La géométrie du CO₂ est :", choices: ["Coudée", "Linéaire (O=C=O, 180°) car
pas de paires libres sur C", "Tétraédrique", "Pyramidale"], answer: 1, note: "CO₂ est
linéaire : 2 doubles liaisons C=O, pas de paires libres sur C → angle de 180°." },
{ q: "La liaison hydrogène se forme entre :", choices: ["Deux molécules non
polaires", "H lié à F, O ou N et un atome électronégatif d'une autre molécule", "Deux
métaux", "Un métal et un non-métal"], answer: 1, note: "Liaison H (intermoléculaire)
: H-F...F, H-O...O, H-N...N. Responsable des propriétés de l'eau." },
{ q: "La masse molaire du CO₂ (C=12, O=16 g/mol) est :", choices: ["28 g/mol",
"44 g/mol", "32 g/mol", "56 g/mol"], answer: 1, note: "M(CO₂) = 12 + 2×16 = 44
g/mol." },
{ q: "La constante d'Avogadro NA vaut :", choices: ["6,02×10²³ mol ¹", "6,02×10²¹
mol ¹", "6,67×10 ¹¹", "1,6×10 ¹ "], answer: 0, note: "NA = 6,022×10²³ mol ¹ :
nombre d'entités dans une mole." },
{ q: "La concentration molaire C est :", choices: ["C = n × V", "C = n / V (mol/L)",
"C = V / n", "C = m / V"], answer: 1, note: "C = n/V (mol/L). n = moles de soluté, V =
volume de solution en litres." },
{ q: "La loi de conservation de la masse (Lavoisier) dit que :", choices: ["La masse
peut être créée", "La masse totale des réactifs = masse totale des produits", "La masse
diminue", "L'énergie est conservée mais pas la masse"], answer: 1, note: "Lavoisier :
'Rien ne se perd, rien ne se crée, tout se transforme.' Conservation de la masse." },
{ q: "Un catalyseur accélère une réaction chimique en :", choices: ["Augmentant
l'énergie d'activation", "Diminuant l'énergie d'activation (sans être consommé)",
"Modifiant l'équilibre", "Consommant les réactifs"], answer: 1, note: "Catalyseur :
abaisse l'énergie d'activation → augmente la vitesse de réaction." },
{ q: "Le pont salin dans une pile sert à :", choices: ["Produire du courant", "Assurer
la neutralité électrique des solutions (migration des ions)", "Oxyder les métaux",
"Réduire la résistance interne"], answer: 1, note: "Pont salin : permet la circulation
des ions entre les demi-cellules → neutralité électrique maintenue." },

{ q: "Le nombre d'oxydation du carbone dans CO₂ est :", choices: ["+2", "+4", "-4",
"0"], answer: 1, note: "CO₂ : O a -2, donc 2×(-2) + n.o.(C) = 0 → n.o.(C) = +4." },
{ q: "La formule de l'acide chlorhydrique est :", choices: ["H₂SO₄", "HNO₃",
"HCl", "H₃PO₄"], answer: 2, note: "Acide chlorhydrique (HCl) : acide fort. Présent
dans le suc gastrique." },
{ q: "La formule de l'acide sulfurique est :", choices: ["HCl", "HNO₃", "H₂SO₄",
"H₃PO₄"], answer: 2, note: "Acide sulfurique H₂SO₄ : acide fort diprotique, très
corrosif, utilisé en accumulateurs." },
{ q: "La réaction entre un métal actif et un acide fort produit :", choices: ["Du
CO₂", "Du H₂ (dihydrogène) + un sel", "De l'O₂", "Du N₂"], answer: 1, note: "Métal
actif + acide fort → sel + H₂. Ex: Zn + 2HCl → ZnCl₂ + H₂." },
{ q: "Les glucides fournissent lors de leur combustion métabolique :", choices: ["9
kcal/g", "4 kcal/g", "7 kcal/g", "2 kcal/g"], answer: 1, note: "Glucides et protéines : 4
kcal/g. Lipides : 9 kcal/g." },
{ q: "La formule de l'eau oxygénée est :", choices: ["H₂O", "H₂O₂", "HO",
"H₃O "], answer: 1, note: "H₂O₂ : agent oxydant et antiseptique. Se décompose en
## H₂O + O₂." },
{ q: "Un polyester est formé par :", choices: ["Addition de monomères avec double
liaison", "Condensation répétée entre acides dicarboxyliques et diols", "Hydrolyse
d'esters", "Oxydation d'alcools"], answer: 1, note: "Polyester : polymère de
condensation. Ex: PET (bouteilles plastiques)." },
{ q: "Le glucose a pour formule :", choices: ["C H ₂O ", "C ₂H₂₂O  ",
"C H  O ", "C H  O "], answer: 0, note: "Glucose : C H ₂O  (hexose
aldose). Principale source d'énergie cellulaire." },
{ q: "Les lipides sont caractérisés par leur :", choices: ["Solubilité dans l'eau",
"Insolubilité dans l'eau mais solubilité dans les solvants organiques", "Présence
d'acides aminés", "Structure nucléotidique"], answer: 1, note: "Lipides (graisses,
huiles, cires) : hydrophobes, solubles dans hexane/éther." },
{ q: "La distillation fractionnée du pétrole sépare les hydrocarbures selon :",
choices: ["Leur masse", "Leur point d'ébullition", "Leur couleur", "Leur solubilité
dans l'eau"], answer: 1, note: "Distillation fractionnée : séparation selon les points
d'ébullition → gaz, essence, kérosène, gazole, fioul." },
{ q: "La sublimation est le passage direct de l'état :", choices: ["Liquide → gaz",
"Solide → gaz (sans passer par l'état liquide)", "Gaz → solide", "Liquide → solide"],
answer: 1, note: "Sublimation : passage direct solide → gaz. Ex: glace carbonique
(CO₂ solide), iode." },
{ q: "L'acide acétique est un acide :", choices: ["Fort", "Faible (Ka ≈ 1,8×10 ⁵)",
"Neutre", "Fort uniquement en solution diluée"], answer: 1, note: "CH₃COOH est un
acide carboxylique faible (dissociation partielle dans l'eau)." },
{ q: "La loi de Hess dit que l'enthalpie d'une réaction :", choices: ["Dépend du
chemin réactionnel", "Ne dépend que des états initial et final (pas du chemin)", "Est
toujours nulle", "Augmente toujours avec T"], answer: 1, note: "Loi de Hess : ΔH est
une fonction d'état → ΔH = Σ(ΔHf produits) - Σ(ΔHf réactifs)." },
{ q: "Les halogènes (groupe VII) forment des ions :", choices: ["M ", "M² ",
"M  (gagnent 1 e )", "M² "], answer: 2, note: "Halogènes (F, Cl, Br, I) : 7 e  de
valence, gagnent 1 e  → ion X ." },
{ q: "La formule de NaOH est :", choices: ["NaHCO₃", "NaOH", "Na₂CO₃",
"NaCl"], answer: 1, note: "Hydroxyde de sodium (soude caustique) : NaOH (base

forte)." },
{ q: "Un polymère est formé par :", choices: ["Une seule molécule", "La répétition
d'unités monomères", "La cristallisation", "La distillation"], answer: 1, note:
"Polymère = enchaînement répété de monomères." },
{ q: "L'électrodéposition utilise l'électrolyse pour :", choices: ["Décomposer les
métaux", "Déposer un métal sur une surface (chromage, dorure, nickelage)",
"Produire du courant", "Refroidir des métaux"], answer: 1, note: "Galvanoplastie :
dépôt électrolytique d'un métal sur une surface." },
{ q: "La règle de Markovnikov lors de l'addition HX sur un alcène dit que :",
choices: ["H va sur le C le plus substitué", "H va sur le C le moins substitué (portant
le plus d'H)", "X va sur le C le moins substitué", "L'addition est aléatoire"], answer: 1,
note: "Markovnikov : H se fixe sur le C portant déjà le plus d'hydrogènes (C le moins
substitué)." },
{ q: "La liaison amine est caractérisée par le groupe :", choices: ["-NO₂", "-NH₂", "-
CN", "-SH"], answer: 1, note: "Amine : groupe -NH₂ (ex: méthylamine CH₃NH₂).
Propriétés basiques." },
{ q: "L'enthalpie de réaction ΔH < 0 indique une réaction :", choices:
["Endothermique", "Exothermique", "Neutre", "Irréversible"], answer: 1, note: "ΔH <
0 : réaction exothermique (dégage de la chaleur). ΔH > 0 : endothermique." },
{ q: "Le tableau périodique classe les éléments selon :", choices: ["Leur masse
uniquement", "Leur numéro atomique Z croissant et leurs propriétés chimiques
périodiques", "Leur couleur", "Leur état physique à 25°C"], answer: 1, note: "Tableau
périodique (Mendeleïev) : classement par Z croissant en périodes (lignes) et groupes
## (colonnes)." },
{ q: "Les acides aminés sont les monomères des :", choices: ["Glucides", "Lipides",
"Protéines", "Acides nucléiques"], answer: 2, note: "Les protéines sont des polymères
d'acides aminés liés par des liaisons peptidiques." },
{ q: "La formule de l'acide nitrique est :", choices: ["HCl", "HNO₃", "H₂SO₄",
"H₃PO₄"], answer: 1, note: "Acide nitrique : HNO₃ (acide fort oxydant)." },
{ q: "La formule de l'hydroxyde de potassium (potasse) est :", choices: ["KOH",
"NaOH", "Ca(OH)₂", "Mg(OH)₂"], answer: 0, note: "Potasse : KOH (base forte)." },
{ q: "L'indicateur coloré change de couleur selon :", choices: ["La température",
"Le pH de la solution", "La concentration en sel", "La pression"], answer: 1, note:
"Indicateurs colorés (BBT, phénolphtaléine) changent de couleur à des pH précis." },
{ q: "Le carbone asymétrique est lié à :", choices: ["4 atomes identiques", "4
groupes différents", "2 doubles liaisons", "Un atome H seulement"], answer: 1, note:
"Carbone asymétrique : C lié à 4 substituants différents → énantiomères
## (stéréoisomérie)." },
{ q: "La configuration électronique du sodium (Z=11) est :", choices:
["1s²2s²2p 3s¹", "1s²2s²2p⁵", "1s²2s²2p 3s²", "1s²2s 2p¹"], answer: 0, note: "Na
(Z=11) : 1s²2s²2p 3s¹ — 1 électron de valence (groupe I)." },
{ q: "La phénolphtaléine est :", choices: ["Rouge en milieu acide", "Incolore en
milieu acide et rose en milieu basique", "Bleue en milieu acide", "Jaune en milieu
neutre"], answer: 1, note: "Phénolphtaléine : incolore si pH < 8,2 ; rose à fuchsia si
pH > 8,2." },
{ q: "Les métaux alcalins (groupe I) forment des ions :", choices: ["M² ", "M ",
"M  (perdent 1 e )", "M³ "], answer: 2, note: "Métaux alcalins (Li, Na, K, Rb, Cs) :
1 e  de valence → perdent 1 e  → ion M ." },
{ q: "Le fer se corrode (rouille) en présence de :", choices: ["CO₂ uniquement", "O₂

et H₂O", "N₂", "Lumière uniquement"], answer: 1, note: "Corrosion (rouille) du fer :
4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃ → Fe₂O₃·nH₂O." },
{ q: "Le craquage des hydrocarbures :", choices: ["Les unit entre eux", "Fragmente
les grandes molécules en molécules plus petites par chaleur", "Les oxyde", "Les
hydrogène"], answer: 1, note: "Craquage : fractionnement thermique ou catalytique
des longues chaînes pétrolières." },
{ q: "La concentration molaire d'une solution saline NaCl : si n = 0,5 mol et V =
0,25 L, alors C = :", choices: ["0,125 mol/L", "2 mol/L", "1 mol/L", "0,5 mol/L"],
answer: 1, note: "C = n/V = 0,5/0,25 = 2 mol/L." },
{ q: "La réaction de saponification des triglycérides (corps gras) par NaOH produit
:", choices: ["Des esters + eau", "Du savon (sels d'acides gras) + glycérol", "Des
acides gras libres + eau", "Des alcools + acides"], answer: 1, note: "Saponification des
corps gras : triglycérides + 3 NaOH → 3 savon (acide gras sodé) + glycérol." },
{ q: "Les halogènes sont dans :", choices: ["Groupe I", "Groupe II", "Groupe VII
(17)", "Groupe 0 (18)"], answer: 2, note: "Les halogènes (F, Cl, Br, I, At) sont dans le
groupe 17 (VIIA)." },
## ],
};
