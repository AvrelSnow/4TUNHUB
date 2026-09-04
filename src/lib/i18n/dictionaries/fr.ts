/**
 * French dictionary — manual, professional translation (no machine
 * translation). Typed against `Dictionary`, so it must stay complete
 * and structurally identical to the English source.
 */
import type { Dictionary } from "./en";

const fr: Dictionary = {
  meta: {
    title: "4TUN Hub — Écosystème d'ingénierie",
    description:
      "4TUN Hub est un écosystème d'ingénierie à Douala, au Cameroun — conception mécanique, simulation par éléments finis, conseil en énergies renouvelables, formation technique et recherche en ingénierie, fondé par Donfack Fortune.",
  },

  a11y: {
    skipToContent: "Aller au contenu",
  },

  routes: {
    home: "Accueil",
    products: "Produits",
    services: "Services",
    academy: "Académie",
    research: "Recherche",
    projects: "Projets",
    about: "À propos",
    solutions: "Solutions",
    resources: "Ressources",
    community: "Communauté",
    blog: "Blog",
    store: "Boutique",
    careers: "Carrières",
    contact: "Contact",
  },

  nav: {
    workWithUs: "Travailler avec nous",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    primary: "Principale",
    mobile: "Mobile",
    language: "Langue",
  },

  home: {
    eyebrow: "Écosystème d'ingénierie · Douala, Cameroun",
    title: "Le savoir en ingénierie, transformé en solutions concrètes.",
    titleLead: "Le savoir en ingénierie, transformé en ",
    titleAccent: "solutions concrètes.",
    subtitle:
      "4TUN Hub réunit services d'ingénierie, formation, recherche et produits au sein d'un même écosystème — ancré dans la pratique réelle, depuis Douala et au-delà.",
    primaryCta: "Travailler avec nous",
    secondaryCta: "Découvrir les services",
    learnMore: "En savoir plus",

    trust: {
      label: "Bâti sur de l'ingénierie réelle",
      stats: [
        { value: "319 Md", unit: "FCFA", label: "programme de modernisation ferroviaire" },
        { value: "560+", unit: "km", label: "de voie en cours de modernisation" },
        { value: "6+", unit: "", label: "projets d'ingénierie livrés" },
        { value: "2", unit: "", label: "universités où il enseigne" },
      ],
    },

    doEyebrow: "Ce que nous faisons",
    doTitle: "Quatre façons dont l'écosystème crée de la valeur.",
    doIntro:
      "Chacune est un pan actif de 4TUN Hub aujourd'hui — pas une promesse. Explorez celle qu'il vous faut.",

    pillars: {
      products:
        "Logiciels et outils d'IA en cours de développement — à utiliser ou à acquérir.",
      services:
        "Conception mécanique, simulation par éléments finis et systèmes d'énergie renouvelable pour les entreprises et les équipes.",
      academy:
        "Formation technique, ateliers CAO et SolidWorks, et développement professionnel.",
      research: "Énergies renouvelables, durabilité et R&D appliquée, issues du terrain.",
      projects:
        "Études de cas d'ingénierie réelles — la preuve derrière l'écosystème.",
      about: "L'organisation et le fondateur derrière 4TUN Hub.",
    },

    proof: {
      eyebrow: "Preuve",
      title: "De l'ingénierie livrée, pas des diapositives.",
      intro:
        "Quelques-uns des projets derrière 4TUN Hub — conçus, simulés et construits.",
      viewAll: "Voir tous les projets",
    },

    founder: {
      eyebrow: "Le fondateur",
      line: "4TUN Hub est fondé par Donfack Fortune — ingénieur mécanicien, spécialiste de l'énergie et enseignant, qui bâtit aujourd'hui l'avenir ferroviaire du Cameroun chez CAMRAIL.",
      cta: "Lire son parcours",
    },

    outlook: {
      eyebrow: "À venir",
      title: "L'écosystème ne cesse de grandir.",
      intro:
        "De nouveaux pans de 4TUN Hub s'ouvrent dès qu'ils sont prêts — sans refonte, juste plus de valeur.",
      items: [
        { key: "resources", title: "Ressources", desc: "E-books, modèles et références d'ingénierie." },
        { key: "community", title: "Communauté", desc: "Un espace où ingénieurs et étudiants construisent ensemble. Le groupe est déjà ouvert." },
        { key: "store", title: "Boutique", desc: "Cours, outils et produits numériques payants — vendus en contexte." },
      ],
    },

    heroCaption: "CFD · répartition de pression",

    conversion: {
      title: "Un problème d'ingénierie qui mérite d'être résolu ?",
      subtitle:
        "Lancez un projet avec 4TUN Hub — de la conception mécanique et la simulation aux systèmes énergétiques et à la formation.",
      primaryCta: "Lancer un projet",
      secondaryCta: "Découvrir les services",
    },
  },

  projects: {
    eyebrow: "Projets",
    title: "De l'ingénierie livrée.",
    intro:
      "Des machines et des analyses réelles — conçues, simulées et construites. Chaque projet expose le problème, la démarche et le résultat obtenu.",
    filterLabel: "Filtrer par catégorie",
    filterAll: "Tous",
    categories: {
      simulation: "Pilotée par la simulation",
      sustainability: "Durabilité",
      mechanical: "Conception mécanique",
      electronics: "Électronique",
      "user-centered": "Centrée sur l'usage",
    },
    detail: {
      problem: "Le problème",
      approach: "La démarche",
      results: "Le résultat",
      tools: "Outils",
      year: "Année",
      category: "Catégorie",
      back: "Tous les projets",
      ctaTitle: "Un problème similaire ?",
      ctaBody: "Dites-nous ce que vous construisez — nous vous dirons comment nous l'aborderions.",
      cta: "Discuter d'un projet",
      visualNote: "Photographies du projet à venir",
      illustrativeNote: "Illustration de référence — le travail de conception est en CAO et en analyse FEA/CFD.",
      zoom: "Voir en grand",
      close: "Fermer",
      portfolio: "Voir plus sur le portfolio du fondateur",
    },
    items: {
      "fsae-race-car": {
        title: "Conception d'une voiture Formule FSAE",
        outcome:
          "Une voiture Formule SAE complète menée du concept à la simulation — huit sous-systèmes, en solo, en pleine conformité avec le règlement de la compétition.",
        problem:
          "Concevoir de A à Z une voiture Formule SAE prête à concourir, respectant l'intégralité du règlement FSAE — en projet solo indépendant, avec un financement limité excluant toute fabrication physique.",
        approach:
          "Traitement de huit sous-systèmes en modules indépendants — conformité au règlement FSAE, châssis, analyse de crash, aérodynamique, suspension, groupe motopropulseur, freinage et direction — chacun modélisé sous SolidWorks et validé en structure, sécurité et écoulement par FEA et CFD plutôt que par prototypes physiques.",
        results:
          "Un dossier d'ingénierie complet pour un véhicule prêt à concourir : chaque système majeur modélisé, analysé et vérifié vis-à-vis du règlement, en simulation et avec une rigueur professionnelle. La fabrication est l'étape suivante, une fois financée.",
      },
      "banana-pseudostem-shredder": {
        title: "Broyeur de pseudo-tronc de bananier",
        outcome:
          "Un broyeur mono-disque à entraînement par courroie qui transforme les déchets de récolte du bananier en biomasse utilisable — conçu pour le contexte camerounais et validé en laboratoire sur du pseudo-tronc réel.",
        problem:
          "Le Cameroun est un grand producteur de bananes, mais le pseudo-tronc fibreux laissé après récolte est le plus souvent brûlé ou jeté — une biomasse perdue et un gaspillage inutile. Les équipements de broyage disponibles sont soit importés à coût élevé, soit conçus pour des conditions étrangères aux réalités locales. Il fallait une machine pensée dès l'origine pour être construite avec des matériaux et un outillage disponibles sur place.",
        approach:
          "J'ai encadré le projet aux côtés du Dr Betene Achille à l'Université de Douala, guidant les étudiants de l'analyse des contraintes jusqu'au prototype. Nous avons retenu une architecture mono-disque à courroie pour sa construction simplifiée, sa transmission souple, son encombrement réduit et sa faible maintenance, puis l'avons dimensionnée rigoureusement — arbre, géométrie des lames, choix des roulements et rigidité du châssis — pour traiter du pseudo-tronc réel.",
        results:
          "La machine a été validée par des essais en laboratoire confirmant son efficacité de broyage sur du pseudo-tronc réel, et entièrement documentée — nomenclature, plans A2 et schéma cinématique — en vue d'une fabrication et d'une reproduction locales. Elle a prouvé qu'une machine agricole à fort impact n'exige ni outillage industriel ni pièces importées, seulement une ingénierie rigoureuse appliquée à des moyens accessibles.",
      },
      "locomotive-braking-analysis": {
        title: "Rétro-ingénierie de systèmes de freinage ferroviaire",
        outcome:
          "Triangles de frein reproduits localement pour les locomotives CC2200 et CC3300-AC chez CAMRAIL — rétro-conçus à partir d'originaux usés.",
        problem:
          "Les CC2200 et CC3300-AC sont des locomotives vétérans du parc de CAMRAIL, et leurs pièces d'origine ne sont plus sur le marché — chaque triangle de frein défaillant devenait une crise de maintenance. Une équipe de quatre devait reproduire deux unités fonctionnelles à partir de matériaux et d'outillages disponibles localement, suffisamment fidèles aux originaux pour s'intégrer directement en service, tout en passant du soudage SMAW au soudage MIG-MAG pour des exigences structurelles plus élevées.",
        approach:
          "Ma responsabilité : l'ensemble des plans 2D et modèles 3D détaillés — maintenir cotes et tolérances dans les limites du fabricable tout en garantissant la compatibilité avec les interfaces d'origine. Pour le CC3300, profilés UPN pliés et coupés avec embouts pour atteindre la masse et le diamètre voulus ; pour le CC3300-AC, barres de fer rectangulaires usinées en formes circulaires. Tout du long, rétro-ingénierie traditionnelle — pieds à coulisse, mètres, analyse géométrique, vérification des tolérances — en itérant étroitement avec les usineurs pour que ce qui était dessiné soit réellement réalisable avec les machines disponibles.",
        results:
          "Les deux triangles de frein ont été fabriqués, assemblés et validés — l'unité CC3300-AC a parcouru l'intégralité de l'itinéraire Douala–Yaoundé via Eséka en conditions réelles d'exploitation. La leçon durable a porté sur les limites de la pensée du bureau d'études : des tolérances supposant des capacités d'atelier indisponibles ont coûté des reprises, et consulter le fabricant avant de figer les cotes a tout résolu rapidement. Le concepteur et le fabricant ne sont pas des adversaires dans une négociation de tolérances — ce sont des collaborateurs sur le même problème.",
      },
      "motorised-wheelbarrow": {
        title: "Brouette motorisée",
        outcome:
          "Une brouette motorisée construite à la main en trois semaines — moteur de trottinette électrique reconditionné, confortable pour des utilisateurs de 1,5 m à 1,9 m.",
        problem:
          "Sur les chantiers et dans les exploitations agricoles au Cameroun, une brouette manuelle exige un effort lourd et soutenu — elle fatigue vite et exclut quiconque dispose de moins de force dans le haut du corps. Le cahier des charges : une brouette motorisée facile et confortable pour des tailles de 1,5 m à 1,9 m, à budget serré et sans aucun outil de modélisation 3D ni de simulation.",
        approach:
          "De l'ingénierie purement manuelle — soudure, découpe et assemblage du châssis à la mesure et par itérations, sans CAO ni FEA en secours ; chaque décision prise physiquement et corrigée à l'atelier. Trois semaines de recherche ont permis de trouver un moteur de trottinette électrique reconditionné avec roue pré-montée de 35–40 cm, idéal pour la plage de tailles. Lorsqu'un collaborateur, Badou, a signalé que les utilisateurs plus petits étaient mal servis et qu'un mécanisme réglable dépassait le budget, la solution a été d'augmenter le diamètre de la roue — rehaussant tout le châssis juste ce qu'il fallait. Une contrainte est devenue un principe de conception.",
        results:
          "Achevée en trois semaines et validée comme confortable pour des hommes de 1,75–1,90 m et des femmes de 1,50–1,90 m, avec un moteur qui réduit l'effort de l'opérateur et prolonge nettement la durée de travail par rapport à une brouette manuelle. La vraie leçon a porté sur l'échelle des outils : une approche CAO-et-simulation aurait ajouté quatre à six semaines ici, sans gain proportionné. Le bon outil est celui dont le travail a réellement besoin.",
      },
      "pedal-power-charger": {
        title: "Chargeur de téléphone à pédales",
        outcome:
          "Une station de recharge à énergie humaine pour les milieux à faible accès à l'électricité — châssis mécano-soudé validé par FEA, dimensionné du 5ᵉ au 95ᵉ percentile anthropométrique.",
        problem:
          "Les coupures fréquentes à l'Université de Douala empêchaient régulièrement les étudiants de recharger leur téléphone — le reflet d'une électricité peu fiable partout au Cameroun. En tant que chef de projet, j'ai fixé à une équipe de trois à l'HTTTC un objectif exigeant : concevoir et construire un chargeur à énergie humaine en trois semaines pour le Festival Sciences & Ingénierie, à budget serré, sans expérience préalable en mécano-soudure ni en FEA, et confortable du 5ᵉ au 95ᵉ percentile.",
        approach:
          "Nous avons travaillé selon le Design-for-Manufacturing et une boucle Empathize–Define–Ideate–Prototype–Test ; j'ai appris seul, en une semaine, la mécano-soudure avancée sous SolidWorks et la FEA pour tenir le délai. L'essentiel de l'effort a porté sur le châssis — une transmission par poulie à double gorge et toute l'électronique intégrée dans la structure. Lorsque la FEA a révélé des concentrations de contraintes aux jonctions critiques au-delà de 800 N, j'ai ajouté des goussets de renfort stratégiques contre la fatigue, et retenu du tube acier creux pour son rapport résistance/poids.",
        results:
          "Un prototype fonctionnel présenté au Festival de l'HTTTC, prouvant la recharge à énergie humaine comme réponse viable en milieu à faible accès énergétique. L'approche pilotée par la simulation a détecté les faiblesses structurelles avant fabrication et réduit les itérations physiques coûteuses. C'est aussi là qu'un principe s'est ancré : concevoir pour la diversité anthropométrique n'est pas une contrainte — c'est la mesure de la valeur réelle d'une conception.",
      },
      "beans-unwrapping-machine": {
        title: "Machine à décortiquer les haricots",
        outcome:
          "Une machine automatisée à poulie double gorge pour petits agriculteurs — portable, entretenable localement et conçue pour un rendement de plus de 85 % avec un effort minimal.",
        problem:
          "Lors d'une visite à Maroua, dans le nord du Cameroun, j'ai vu des agriculteurs décortiquer les haricots entièrement à la main — un travail lent et éprouvant qui bridait leur production. Les machines pour le faire étaient soit indisponibles localement, soit inabordables pour les petites et moyennes exploitations. Toute vraie solution devait convenir à l'Afrique centrale rurale : matériaux limités, pas de maintenance spécialisée, portabilité entre communautés dispersées — tout en atteignant plus de 85 % de rendement, en réduisant l'effort et en respectant l'hygiène et la sécurité, à budget serré.",
        approach:
          "J'ai construit des configurations de prototype concurrentes avant de trancher, en choisissant la conception finale selon la disponibilité des matériaux et la fabricabilité. Des lames à dimensions variables à intervalles de 120° et 5 cm d'espacement ont été réglées — vitesse de rotation contre couple moteur — pour décortiquer sans casser les grains, avec une poulie double gorge répartissant l'entraînement entre moteur, arbre et ventilateur. Le moteur de 1,1 kW prévu étant indisponible, j'ai adapté la conception à un modèle alternatif sans céder sur les objectifs, et équilibré l'épaisseur d'acier face au poids pour la portabilité.",
        results:
          "Une machine qui atteint ses objectifs de performance et peut réellement être construite et entretenue là où elle est nécessaire. Travailler avec Nepitimbaye, Grace et Tatsinda m'a montré que l'ingénierie en milieu contraint doit absorber l'imprévu — et que préparer ses coéquipiers par un accompagnement patient vaut mieux que tout porter seul.",
      },
    },

    galleryTitle: "Documentation technique",
    galleries: {
      "fsae-race-car": ["Champ de pression CFD — illustratif"],
      "banana-pseudostem-shredder": [
        "Plan technique A2 — cotes et assemblage des composants",
        "Résultats des essais en laboratoire — pseudo-tronc broyé",
        "Schéma cinématique de la transmission de puissance",
        "Diagramme du principe de broyage",
        "Essai au pendule pesant — mesure de l'énergie d'impact",
        "Diagramme d'analyse fonctionnelle FAST",
        "Mécanisme de verrouillage de la lame — détail",
        "Arbre principal — plan coté",
        "Plaque avant — plan de la pièce",
        "Châssis de la machine — conception structurelle",
        "Lame de broyage — géométrie et dimensions",
        "Boîte à lames — tôle pliée",
        "Boîte à lames — plaque arrière",
        "Nomenclature complète",
      ],
      "locomotive-braking-analysis": [
        "Le triangle de frein assemblé",
        "Sabots de frein fabriqués (CC2200)",
        "Plans rétro-conçus (CC2200)",
      ],
      "motorised-wheelbarrow": [
        "Plan d'assemblage 2D complet",
        "Ensemble roue, arbre et organe d'entraînement",
        "Plan d'assemblage du châssis",
        "Ensemble moteur — vue éclatée",
        "Modèle 3D — assemblage complet",
        "Modèle 3D — vue de détail",
        "Composants du moteur — vue 2",
        "Composants du moteur — vue 1",
      ],
      "pedal-power-charger": [
        "Calculs de transmission et optimisation du rapport de démultiplication",
        "Schéma du circuit électrique et implantation des composants",
        "Assemblage CAO complet",
        "Conception structurelle du châssis",
        "Vue éclatée — tous les composants",
        "Modèle CAO simplifié préparé pour la FEA",
        "Conditions de charge appliquées au châssis en FEA",
        "Structure de support — composants porteurs critiques",
        "Contrainte de von Mises sous charge de 800 N",
        "Structure de support — autre perspective",
        "Prototype construit — vue 1",
        "Prototype construit — vue 2",
        "Prototype construit — vue 3",
        "Ensemble de montage arrière",
        "Analyse des efforts du mécanisme de pédalage",
      ],
      "beans-unwrapping-machine": [
        "Plan explicatif — implantation et assemblage des composants",
        "Plan explicatif — transmission de puissance et arbre",
        "Schéma cinématique de l'entraînement",
        "Schéma cinématique — légende des composants",
        "Plan d'assemblage 2D complet du châssis",
        "Plan d'assemblage 2D complet de l'arbre",
        "Assemblage CAO 3D — autre perspective",
        "Assemblage CAO 3D — vue en perspective",
        "Assemblage CAO 3D de l'arbre — autre perspective",
        "Résultats des tests de performance et de validation",
      ],
    },
  },

  services: {
    eyebrow: "Services d'ingénierie",
    title: "De l'ingénierie qui se construit, pas seulement qui se dessine.",
    subtitle:
      "Conception mécanique, simulation et rétro-ingénierie pour les entreprises, les équipes et les entrepreneurs — ancrées dans ce qui peut réellement être fabriqué et entretenu, au Cameroun et au-delà.",
    primaryCta: "Demander une consultation",
    secondaryCta: "Voir les réalisations",

    offeringsEyebrow: "Ce que nous faisons",
    offeringsTitle: "Quatre façons de transformer un cahier des charges en matériel.",
    offeringsIntro:
      "Chaque service aboutit à quelque chose de concret — une machine, une analyse, un jeu de plans de fabrication.",
    proofLabel: "Voir le projet",

    offerings: {
      "mechanical-design": {
        title: "Conception mécanique & fabrication",
        outcome:
          "D'un cahier des charges à une machine réellement constructible et entretenable localement — plans 2D et 3D complets, dimensionnement des pièces et choix des matériaux.",
        who: "Pour les entreprises et entrepreneurs qui ont besoin d'équipements sur mesure conçus pour des conditions de terrain réelles.",
      },
      simulation: {
        title: "FEA & simulation",
        outcome:
          "Nous testons résistance, contraintes et écoulement d'air par logiciel et détectons les points de rupture avant toute découpe — la FEA (analyse par éléments finis) valide une conception à l'écran, pas à l'atelier.",
        who: "Pour les équipes qui veulent avoir confiance en une conception avant d'engager le budget de fabrication.",
      },
      "reverse-engineering": {
        title: "Rétro-ingénierie",
        outcome:
          "Nous reconstituons des plans et modèles fidèles de pièces sans documentation ni pièces de rechange, afin de pouvoir les refabriquer localement.",
        who: "Pour les exploitants qui maintiennent en service des équipements vieillissants quand les pièces d'origine ne sont plus sur le marché.",
      },
      "energy-consulting": {
        title: "Énergie renouvelable & conseil",
        outcome:
          "Analyse des systèmes énergétiques et accompagnement en ingénierie pour des solutions durables, adaptées au hors-réseau.",
        who: "Pour les organisations œuvrant dans les énergies renouvelables et la durabilité en contexte de pénurie énergétique.",
      },
    } as Record<string, { title: string; outcome: string; who: string }>,

    process: {
      eyebrow: "Notre méthode",
      title: "Un chemin clair, du cahier des charges à la livraison.",
      steps: [
        {
          title: "Comprendre",
          desc: "Nous cartographions le vrai problème et ses contraintes — budget, matériaux, et qui construira et entretiendra le résultat.",
        },
        {
          title: "Concevoir",
          desc: "D'abord les concepts, puis des plans 2D et 3D détaillés avec dimensionnement des pièces et choix des matériaux.",
        },
        {
          title: "Valider",
          desc: "Simulation et analyse pour confirmer que la conception tient — avant toute fabrication.",
        },
        {
          title: "Livrer",
          desc: "Une documentation prête pour la fabrication, itérée avec ceux qui la construisent réellement.",
        },
      ],
    },

    proof: {
      eyebrow: "Preuve",
      title: "Des services livrés sous forme de projets réels.",
      intro: "Chaque offre ici a déjà produit quelque chose de concret.",
      cta: "Parcourir tous les projets",
    },

    models: {
      eyebrow: "Modes de collaboration",
      title: "Comment travailler ensemble.",
      items: [
        { title: "Freelance", desc: "Appui continu en conception et simulation, à distance ou sur site." },
        { title: "Projet", desc: "Un livrable défini — une machine, une analyse, un jeu de documents — cadré de bout en bout." },
        { title: "Conseil", desc: "Revue technique et accompagnement sur vos propres travaux d'ingénierie." },
      ],
    },

    cta: {
      title: "Un besoin qui demande de l'ingénierie ?",
      subtitle:
        "Dites-nous ce que vous construisez. Nous vous dirons comment nous l'aborderions — et ce qu'il faut pour y arriver.",
      primary: "Demander une consultation",
      secondary: "Voir les projets",
    },
  },

  contact: {
    eyebrow: "Contact",
    title: "Parlons de ce que vous construisez.",
    subtitle:
      "Une machine à concevoir, une pièce à rétro-concevoir, une analyse à mener ou un cours à donner — donnez-nous l'essentiel et nous reviendrons vers vous avec notre approche.",
    slaBadge: "Réponse sous 48 heures",

    form: {
      heading: "Envoyer un message",
      name: { label: "Votre nom", placeholder: "Jean Dupont" },
      email: { label: "E-mail", placeholder: "vous@entreprise.com" },
      topic: {
        label: "De quoi s'agit-il ?",
        placeholder: "Choisissez un sujet",
        options: {
          services: "Services d'ingénierie",
          simulation: "Simulation & FEA",
          energy: "Énergie renouvelable",
          training: "Formation & éducation",
          research: "Collaboration de recherche",
          other: "Autre chose",
        } as Record<string, string>,
      },
      message: {
        label: "Message",
        placeholder: "Décrivez votre projet, son contexte et les contraintes — budget, délais, matériaux.",
        hint: "Quelques phrases suffisent. Plus c'est concret, mieux nous pouvons aider.",
      },
      submit: "Envoyer le message",
      submitting: "Envoi…",
      errors: {
        required: "Ce champ est obligatoire.",
        emailInvalid: "Saisissez une adresse e-mail valide.",
        topicRequired: "Veuillez choisir un sujet.",
        messageTooShort: "Veuillez ajouter un peu plus de détails.",
        messageTooLong: "C'est un peu trop long — veuillez raccourcir.",
        rateLimited: "Trop de messages depuis cette connexion. Patientez un instant et réessayez.",
        failed: "L'envoi de votre message a échoué. Réessayez, ou écrivez-nous directement.",
      } as Record<string, string>,
    },

    success: {
      title: "Message envoyé.",
      body: "Merci de nous avoir contactés — nous reviendrons vers vous sous 48 heures. Pour toute urgence, l'e-mail reste le plus rapide.",
      again: "Envoyer un autre message",
    },

    channels: {
      eyebrow: "Canaux directs",
      title: "Ou contactez-nous directement.",
      intro: "Vous préférez l'e-mail ou un message rapide ? Utilisez ce qui vous convient le mieux.",
      email: "E-mail",
      whatsapp: "Communauté WhatsApp",
      whatsappNote: "Groupe ouvert — ingénieurs, étudiants et créateurs.",
      linkedin: "LinkedIn",
      location: "Basé à",
    },
  },

  about: {
    eyebrow: "À propos de 4TUN Hub",
    title: "Un écosystème d'ingénierie, bâti sur la pratique réelle.",
    lead: "4TUN Hub réunit services d'ingénierie, formation, recherche et produits en un seul lieu — et rend une ingénierie de haut niveau concrète dans le contexte camerounais et africain au sens large.",
    missionEyebrow: "Mission",
    mission:
      "Transformer le savoir en ingénierie en solutions réellement constructibles, entretenables et transmissibles là où on en a le plus besoin.",
    visionEyebrow: "Vision",
    vision:
      "Devenir un pôle d'ingénierie de référence — le premier réflexe des ingénieurs, étudiants et entreprises pour le savoir, les services et la collaboration en ingénierie, au Cameroun et au-delà.",
    principlesEyebrow: "Nos convictions",
    principlesTitle: "Les principes derrière le travail.",
    principles: [
      { title: "Pensé pour le réel", desc: "Conçu pour les matériaux, les budgets et les personnes qui entretiennent le résultat — pas pour un atelier idéalisé." },
      { title: "La preuve avant les promesses", desc: "Chaque affirmation s'appuie sur un projet réel, un chiffre réel, un résultat réel." },
      { title: "Un savoir qui se diffuse", desc: "L'ingénierie ne se démultiplie que lorsqu'elle s'enseigne — la formation fait donc partie de la mission." },
    ],
    founderEyebrow: "Le fondateur",
    founderTitle: "L'ingénieur derrière l'écosystème.",
    founderCta: "Voir le portfolio complet",
  },

  founderPage: {
    back: "À propos",
    contactCta: "Travailler avec Donfack",
    resumeCta: "Télécharger le CV",
    sections: {
      experience: "Expérience",
      education: "Formation",
      portfolio: "Portfolio",
      skills: "Compétences & outils",
      certifications: "Certifications",
      awards: "Prix & distinctions",
      connect: "Contact",
    },
    portfolioIntro: "Les projets d'ingénierie derrière 4TUN Hub — chacun documenté sous forme d'étude de cas complète.",
    skillGroups: { software: "Logiciels", technical: "Technique", workshop: "Atelier" },
    viewProject: "Voir l'étude de cas",
  },

  community: {
    // Micro-copie partagée — aussi utilisée par la page d'accueil et le gabarit de route.
    join: "Rejoindre la communauté WhatsApp",
    note: "Groupe ouvert · ingénieurs, étudiants et créateurs",
    live: "En ligne",

    eyebrow: "Communauté · En ligne",
    title: "Ingénieurs, étudiants et créateurs — déjà à l'œuvre ensemble.",
    subtitle:
      "4TUN Hub n'est pas qu'un studio. C'est une communauté grandissante, au Cameroun et au-delà — un groupe WhatsApp ouvert, une infolettre d'ingénierie suivie par 3 200 lecteurs et un groupe d'utilisateurs SolidWorks. Chacun y est le bienvenu.",
    primaryCta: "Rejoindre la communauté WhatsApp",
    secondaryCta: "Suivre sur LinkedIn",

    channelsEyebrow: "Où l'on se retrouve",
    channelsTitle: "Comment nous rejoindre.",
    channelsIntro: "Choisissez l'espace qui vous convient — tous sont actifs aujourd'hui.",
    channels: {
      whatsapp: {
        title: "Communauté WhatsApp",
        desc: "Le point de rencontre au quotidien — questions, retours, entraide sur les projets et annonces. Un groupe ouvert aux ingénieurs, étudiants et créateurs.",
        action: "Rejoindre le groupe",
      },
      rem: {
        title: "L'infolettre The REM",
        desc: "Renewable Energy Mall & Engineering Review — analyses d'énergie et d'ingénierie fondées sur les premiers principes, lues par plus de 3 200 ingénieurs et décideurs.",
        action: "Lire The REM",
      },
      linkedin: {
        title: "LinkedIn",
        desc: "Suivez le fondateur pour des comptes rendus de projets, des analyses d'ingénierie et l'actualité de la communauté.",
        action: "Suivre sur LinkedIn",
      },
    } as Record<string, { title: string; desc: string; action: string }>,

    whoEyebrow: "Qui en fait partie",
    whoTitle: "Une communauté ancrée dans la pratique réelle.",
    whoBody:
      "Des étudiants qui affûtent leurs compétences en CAO et en simulation, des ingénieurs en exercice qui échangent, et des créateurs qui transforment leurs idées en machines — tous au même endroit, depuis Douala et bien au-delà.",
    whoStats: [
      { value: "3 200+", label: "lecteurs de l'infolettre The REM" },
      { value: "300+", label: "au sein du groupe SolidWorks de Douala" },
      { value: "Ouvert", label: "groupe WhatsApp, gratuit" },
    ],

    ethosEyebrow: "Comment ça marche",
    ethosTitle: "Quelques principes simples.",
    ethos: [
      { title: "De la vraie aide, du vrai travail", desc: "Partagez ce que vous concevez et recevez des retours d'ingénierie concrets — pas des encouragements vagues." },
      { title: "Chacun transmet", desc: "La communauté se renforce quand chacun partage ce qu'il sait. Demandez librement, répondez généreusement." },
      { title: "Le respect d'abord", desc: "Étudiants, professionnels et amateurs partagent l'espace. Gardons-le accueillant et pertinent." },
    ],

    cta: {
      title: "Venez construire avec nous.",
      subtitle:
        "Le groupe est ouvert et actif. Rejoignez la conversation et présentez ce sur quoi vous travaillez.",
      primary: "Rejoindre la communauté WhatsApp",
      secondary: "Nous écrire directement",
    },
  },

  academy: {
    eyebrow: "4TUN Hub Academy",
    title: "Apprendre une ingénierie qui se concrétise.",
    subtitle:
      "Une formation pratique en CAO, simulation et systèmes énergétiques — enseignée à partir de projets réellement livrés, pour les ingénieurs et les étudiants au Cameroun et au-delà.",
    primaryCta: "Rejoindre la liste d'attente",
    secondaryCta: "Rencontrer le formateur",

    catalogEyebrow: "Catalogue",
    catalogTitle: "Des parcours immédiatement applicables.",
    catalogIntro:
      "Chaque parcours est pratique et aboutit à une compétence démontrable — une pièce modélisée, une conception validée, un composant reconstruit — pas seulement une vidéo regardée.",
    levelLabel: "Niveau",
    formatLabel: "Format",
    proofLabel: "Voir l'application",
    levels: {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
      "all-levels": "Tous niveaux",
    } as Record<string, string>,
    formats: {
      online: "En ligne",
      "in-person": "En présentiel",
      hybrid: "En ligne + présentiel",
      workshop: "Atelier pratique",
    } as Record<string, string>,
    courses: {
      "solidworks-cad": {
        title: "SolidWorks & fondamentaux de la CAO",
        outcome:
          "Modéliser des pièces et des assemblages et produire des plans de fabrication propres — la compétence centrale derrière chaque machine du portfolio.",
        who: "Pour les étudiants et jeunes ingénieurs qui débutent en conception mécanique.",
      },
      "fea-simulation": {
        title: "FEA & validation de conception",
        outcome:
          "Réaliser des analyses par éléments finis pour tester la résistance et les contraintes, et repérer les points de rupture à l'écran avant toute découpe.",
        who: "Pour les concepteurs qui veulent valider une pièce avant de s'engager dans la fabrication.",
      },
      "reverse-engineering": {
        title: "Rétro-ingénierie & fabrication",
        outcome:
          "Reconstituer des plans précis de pièces sans documentation, et les amener vers une conception constructible localement.",
        who: "Pour les techniciens et ingénieurs qui maintiennent des équipements sans pièces de rechange.",
      },
      "energy-systems": {
        title: "Systèmes d'énergie renouvelable",
        outcome:
          "Dimensionner et analyser des systèmes solaires et hors réseau pour des conditions réelles de pénurie d'énergie.",
        who: "Pour les ingénieurs et entrepreneurs travaillant sur l'énergie hors réseau et durable.",
      },
    } as Record<string, { title: string; outcome: string; who: string }>,

    formatsEyebrow: "Comment vous apprenez",
    formatsTitle: "Conçu selon la façon dont les ingénieurs apprennent vraiment.",
    formatsList: [
      {
        title: "Cours en ligne",
        desc: "Des modules à votre rythme avec de vrais exercices réalisés dans des logiciels de CAO et de simulation.",
      },
      {
        title: "Ateliers en direct",
        desc: "Des séances pratiques par projet — en présentiel quand c'est possible, à distance sinon.",
      },
      {
        title: "Mentorat en cohorte",
        desc: "De petits groupes guidés d'un cahier des charges jusqu'à un livrable d'ingénierie présentable.",
      },
    ],

    instructorEyebrow: "Qui enseigne",
    instructorTitle: "Enseigné par un ingénieur en exercice et éducateur accrédité.",
    instructorBody:
      "Chaque parcours est animé par Donfack Fortune — ingénieur mécanicien et éducateur accrédité par l'État, qui a touché plus de 300 étudiants et anime le groupe SolidWorks de Douala. Vous apprenez les méthodes derrière de vrais projets livrés, pas des abstractions de manuel.",
    instructorCta: "Rencontrer le fondateur",

    cta: {
      title: "Soyez dans la prochaine cohorte.",
      subtitle:
        "L'Academy ouvre par étapes. Rejoignez la liste d'attente et nous vous contacterons dès qu'un parcours démarre.",
      primary: "Rejoindre la liste d'attente",
      secondary: "Voir les projets",
    },
  },

  research: {
    eyebrow: "Recherche & R&D",
    title: "Une recherche à finalité industrielle.",
    subtitle:
      "Une recherche appliquée en énergies renouvelables, durabilité et systèmes industriels — ancrée dans les réalités d'infrastructure d'Afrique de l'Ouest et centrale, pas dans des abstractions.",
    primaryCta: "Collaborer sur un projet de recherche",
    secondaryCta: "Voir les projets",

    focusEyebrow: "Axes de recherche",
    focusTitle: "Là où nous concentrons le travail.",
    focusIntro:
      "Trois fronts où la recherche en ingénierie change ce qui est réellement construit et utilisé.",
    whyLabel: "Pourquoi c'est important",
    doingLabel: "Ce que nous faisons",
    proofLabel: "Voir les travaux liés",
    areas: {
      "renewable-energy": {
        title: "Énergie renouvelable & hors réseau",
        why: "En Afrique de l'Ouest et centrale, une électricité peu fiable et hors réseau conditionne chaque décision d'ingénierie. Bien concevoir les systèmes énergétiques fait la différence entre une conception qui marche sur le papier et une qui marche sur le terrain.",
        doing: "Analyse technique des systèmes solaires, de stockage et hors réseau — traduite en éclairages utiles aux politiques via la newsletter The REM.",
      },
      "sustainable-machinery": {
        title: "Machines agricoles durables",
        why: "Les déchets post-récolte et le coût des équipements importés freinent les petits producteurs. Des machines constructibles localement transforment les déchets en valeur et l'effort en production.",
        doing: "Concevoir et valider en laboratoire des machines — comme le broyeur de pseudo-troncs de bananier — construites avec des matériaux et outils disponibles localement.",
      },
      "industrial-rd": {
        title: "R&D industrielle & rétro-ingénierie",
        why: "Les équipements industriels vieillissants tombent en panne quand les pièces disparaissent du marché. Reproduire les pièces localement maintient les infrastructures critiques en service.",
        doing: "Rétro-concevoir et re-fabriquer des composants — comme les triangles de frein de locomotives à CAMRAIL — aux tolérances d'origine.",
      },
    } as Record<string, { title: string; why: string; doing: string }>,

    pubEyebrow: "Publications",
    pubTitle: "The REM — Renewable Energy Mall & Engineering Review.",
    pubBody:
      "Une newsletter suivie par plus de 3 200 ingénieurs et décideurs, qui traduit la recherche technique sur l'énergie en éclairages pour l'Afrique de l'Ouest et centrale. Des analyses détaillées, fondées sur les premiers principes, publiées régulièrement.",
    pubReadRem: "Lire The REM sur Medium",
    pubFollow: "Suivre la newsletter sur LinkedIn",

    initiativesEyebrow: "Initiatives",
    initiativesTitle: "Une recherche qui quitte le papier.",
    initiativesBody:
      "Les résultats reviennent directement dans les services, les machines et les cours de 4TUN Hub — la recherche se justifie par des livrables réels, pas seulement par des publications.",

    cta: {
      title: "Un problème de recherche qui mérite d'être résolu ?",
      subtitle:
        "Nous collaborons avec des chercheurs, des partenaires et l'industrie sur des travaux d'énergie et de durabilité. Dites-nous sur quoi vous travaillez.",
      primary: "Collaborer sur un projet de recherche",
      secondary: "Voir les projets",
    },
  },

  products: {
    eyebrow: "Produits",
    title: "Les logiciels que 4TUN Hub construit.",
    subtitle:
      "Des outils d'ingénierie et d'éducation pour les réalités africaines — en développement actif. Rien ici n'est vendu avant d'être prêt ; voici la feuille de route, présentée honnêtement.",
    primaryCta: "Rejoindre la liste d'attente",
    secondaryCta: "Nous parler",

    cardsEyebrow: "En préparation",
    cardsTitle: "Trois produits, présentés honnêtement.",
    cardsIntro:
      "Chacun résout un problème que nous avons rencontré de première main. Le stade de développement est indiqué clairement — concept, planifié ou en développement.",
    statusLabel: "Statut",
    problemLabel: "Le problème",
    whoLabel: "Pour qui",
    statuses: {
      "in-development": "En développement",
      planned: "Planifié",
      concept: "Concept",
    } as Record<string, string>,
    items: {
      "edu-assistant": {
        title: "Assistant éducatif du Cameroun",
        desc: "Un tuteur IA conçu autour du programme camerounais — qui explique, interroge et guide les élèves dans leur propre contexte d'examen.",
        problem:
          "Les élèves préparant le GCE O- et A-Level ont rarement accès à un tutorat abordable et adapté au programme en sciences et en ingénierie.",
        who: "Pour les élèves camerounais du secondaire et du pré-universitaire.",
      },
      "digital-twin": {
        title: "Plateforme de jumeau numérique",
        desc: "Des outils de jumeau numérique 3D pour les installations et les équipements — apportant une vision de niveau simulation aux opérations quotidiennes.",
        problem:
          "Les exploitants industriels manquent d'outils abordables pour modéliser, surveiller et planifier la maintenance de leurs équipements et installations.",
        who: "Pour les exploitants industriels et d'infrastructures.",
      },
      "mech-ai": {
        title: "Assistant IA en mécanique",
        desc: "Un copilote IA pour la conception mécanique, la FEA et les calculs d'ingénierie.",
        problem:
          "Les ingénieurs mécaniciens passent des heures sur des dimensionnements, calculs et configurations FEA répétitifs qu'un assistant spécialisé pourrait accélérer.",
        who: "Pour les concepteurs mécaniques et les ingénieurs en simulation.",
      },
    } as Record<string, { title: string; desc: string; problem: string; who: string }>,

    roadmapEyebrow: "Comment nous livrons",
    roadmapTitle: "Construit à découvert, publié une fois prêt.",
    roadmapBody:
      "De nouveaux outils s'intègrent à ce pilier sans refonte — 4TUN Hub est conçu comme un écosystème extensible. Nous préférons livrer un produit qui fonctionne que trois qui ne fonctionnent pas.",

    detail: {
      status: "Statut",
      backToProducts: "Tous les produits",
      waitlist: "Rejoindre la liste d'attente",
      body: "Ce produit figure sur la feuille de route de 4TUN Hub. Rejoignez la liste d'attente et nous vous contacterons dès qu'il y aura quelque chose de concret à essayer.",
    },

    cta: {
      title: "Vous voulez un accès anticipé ?",
      subtitle:
        "Rejoignez la liste d'attente et aidez à décider ce que nous construisons en premier. Nous ne vous écrirons que lorsqu'il y aura quelque chose de concret à essayer.",
      primary: "Rejoindre la liste d'attente",
      secondary: "Nous parler",
    },
  },

  resources: {
    eyebrow: "Ressources",
    title: "Des ressources d'ingénierie, gratuites et concrètes.",
    subtitle:
      "Références, modèles CAO, études de cas et publications issus du travail réel de 4TUN Hub — certaines disponibles dès aujourd'hui, d'autres à venir. Pensées pour être utiles, pas verrouillées.",
    primaryCta: "Lire The REM",
    secondaryCta: "Rejoindre la communauté",

    availableEyebrow: "Disponibles maintenant",
    availableTitle: "Commencez par ce qui est déjà ouvert.",
    availableIntro: "Du matériel réel et publié, utilisable dès aujourd'hui — sans inscription.",
    plannedEyebrow: "À venir",
    plannedTitle: "En préparation.",
    plannedIntro:
      "Des ressources en production. Rejoignez la communauté et nous les partagerons dès qu'elles seront prêtes.",
    availableBadge: "Disponible",
    plannedBadge: "En cours",
    open: "Ouvrir",
    kinds: {
      publication: "Publication",
      cad: "Modèles CAO",
      "case-studies": "Études de cas",
      ebook: "E-book",
      template: "Modèles",
      reference: "Référence",
    } as Record<string, string>,
    items: {
      rem: {
        title: "L'infolettre The REM",
        desc: "Renewable Energy Mall & Engineering Review — analyses d'énergie et d'ingénierie fondées sur les premiers principes, lues par plus de 3 200 ingénieurs et décideurs.",
      },
      grabcad: {
        title: "Modèles CAO sur GrabCAD",
        desc: "Modèles 3D et assemblages publics issus de projets réels — libres de téléchargement, d'étude et de réutilisation.",
      },
      "case-studies": {
        title: "Études de cas des projets",
        desc: "Six projets d'ingénierie entièrement documentés — problème, approche, résultats, plans et analyses. Une véritable bibliothèque de référence.",
      },
      ebooks: {
        title: "E-books et guides d'ingénierie",
        desc: "Des guides pratiques sur la CAO, la simulation par éléments finis et la conception pour la fabrication — tirés de travaux livrés.",
      },
      templates: {
        title: "Modèles CAO et de calcul",
        desc: "Modèles de plans réutilisables, feuilles de dimensionnement et check-lists pour accélérer le travail de conception réel.",
      },
      references: {
        title: "Fiches de référence d'ingénierie",
        desc: "Du matériel de référence rapide pour les calculs mécaniques et de systèmes énergétiques courants.",
      },
    } as Record<string, { title: string; desc: string }>,

    commerceNote: {
      eyebrow: "Gratuit et payant",
      title: "La plupart des ressources sont gratuites. Certaines seront payantes.",
      body: "À mesure qu'arrivent des cours, e-books et boîtes à outils plus poussés, quelques-uns seront payants — toujours vendus en contexte, là où vous les trouvez. Aucun paywall séparé à franchir.",
      cta: "Voir comment fonctionne la boutique",
    },

    cta: {
      title: "Vous voulez la prochaine ressource en avant-première ?",
      subtitle:
        "Rejoignez la communauté et nous partagerons les nouvelles ressources — gratuites et payantes — dès leur publication.",
      primary: "Rejoindre la communauté",
      secondary: "Lire The REM",
    },
  },

  store: {
    eyebrow: "Boutique",
    title: "Le commerce, vendu là où c'est logique.",
    subtitle:
      "4TUN Hub n'a pas de boutique séparée. Quand quelque chose est en vente — un cours, un e-book, un outil — vous l'achetez là où vous le trouvez. Cette page réunit simplement tout ce qui est achetable en une seule vue.",
    primaryCta: "Explorer l'écosystème",
    secondaryCta: "Être prévenu",

    emptyEyebrow: "État actuel",
    emptyTitle: "Rien n'est encore en vente — et c'est volontaire.",
    emptyBody:
      "Nous n'afficherons rien ici tant que ce ne sera pas réellement prêt et digne d'être payé. Dès que le premier cours, e-book ou outil sera lancé, il apparaîtra dans son pilier et dans cette vue, automatiquement.",

    contextEyebrow: "Où vit le commerce",
    contextTitle: "Acheter en contexte.",
    contextIntro:
      "Chaque article achetable est vendu au sein du pilier auquel il appartient — pas de silo de paiement séparé.",
    context: {
      academy: { title: "Academy", desc: "Cours et ateliers payants — achetés aux côtés des parcours gratuits." },
      resources: { title: "Ressources", desc: "E-books, modèles et boîtes à outils — certains gratuits, d'autres payants." },
      products: { title: "Produits", desc: "Licences logicielles et abonnements dès que les outils seront lancés." },
    } as Record<string, { title: string; desc: string }>,
    explore: "Explorer",

    // Quand le catalogue se remplira, ces libellés décriront la grille en vente.
    catalogEyebrow: "En vente maintenant",
    catalogTitle: "Disponible à l'achat.",
    priceFrom: "À partir de",

    cta: {
      title: "Vous voulez savoir dès qu'un article sort ?",
      subtitle:
        "Rejoignez la communauté ou écrivez-nous — nous vous préviendrons dès qu'il y aura quelque chose qui vaut la peine d'être acheté.",
      primary: "Rejoindre la communauté",
      secondary: "Nous contacter",
    },
  },

  blog: {
    eyebrow: "Publications",
    title: "La réflexion derrière l'ingénierie.",
    subtitle:
      "Analyses sur l'énergie, la simulation et les systèmes industriels en Afrique de l'Ouest et centrale — écrites à partir de projets livrés, pas de communiqués.",
    primaryCta: "Lire The REM",
    secondaryCta: "Travailler avec nous",

    emptyEyebrow: "État actuel",
    emptyTitle: "Rien n'est republié ici pour l'instant — et c'est délibéré.",
    emptyBody:
      "Ces textes ont déjà un lectorat ailleurs, et une copie appauvrie ici concurrencerait l'original dans les moteurs de recherche au lieu de le servir. Les articles paraîtront sur cette page lorsqu'ils seront écrits pour elle, l'original restant toujours crédité comme source canonique.",

    hubEyebrow: "Où paraissent les textes",
    hubTitle: "Deux publications, toutes deux actives.",
    hubIntro:
      "Tant que cette page ne porte pas ses propres articles, voici les publications réelles — et non l'annonce de publications à venir.",
    publications: {
      rem: {
        title: "The REM",
        desc: "Renewable Energy Mall & Engineering Review. Analyses de fond sur le solaire, le stockage et les systèmes hors réseau, traduites pour les ingénieurs et les décideurs.",
        cta: "Suivre sur LinkedIn",
      },
      medium: {
        title: "Medium",
        desc: "Essais techniques plus longs sur la simulation, la conception mécanique et l'enseignement de l'ingénierie.",
        cta: "Lire sur Medium",
      },
    } as Record<string, { title: string; desc: string; cta: string }>,
    readers: "lecteurs",

    // Utilisé lorsque l'index portera de vrais articles.
    indexEyebrow: "Derniers",
    indexTitle: "Publications récentes.",
    readMore: "Lire",
    minRead: "min de lecture",
    originallyOn: "Publié à l'origine sur",
    sources: {
      native: "4TUN Hub",
      medium: "Medium",
      rem: "The REM",
    } as Record<string, string>,

    cta: {
      title: "Envie d'appliquer cette analyse à votre problème ?",
      subtitle:
        "Ces textes naissent de projets réels. Si l'un d'eux ressemble au vôtre, engageons la conversation.",
      primary: "Travailler avec nous",
      secondary: "Voir les réalisations",
    },
  },

  /**
   * Prose de chaque article, indexée par slug. Vide tant qu'aucun article
   * réel n'existe — les faits structurels vivent dans lib/blog.ts, les
   * mots ici, et TypeScript maintient EN et FR alignés.
   */
  blogPosts: {} as Record<string, { title: string; excerpt: string }>,

  stub: {
    badge: "En cours",
    beingBuilt: "Cette partie de l'écosystème est en construction.",
    intro:
      "Elle fait partie de la feuille de route de 4TUN Hub et ouvrira dès qu'elle sera prête. En attendant, parlons de votre projet.",
    whatsComing: "Ce qui arrive ici",
    workWithUs: "Travailler avec nous",
    backHome: "Retour à l'accueil",
  },

  footer: {
    trustEyebrow: "L'ingénierie derrière 4TUN Hub",
    founderLine:
      "Fondé par Donfack Fortune — ingénieur mécanicien actif dans les secteurs ferroviaire, énergétique et de la formation en ingénierie au Cameroun.",
    meetFounder: "Découvrir le fondateur →",
    affiliations: "Affiliations",
    affiliationsNote: "Affiliations du fondateur — et non des partenariats d'entreprise.",
    blurb:
      "Un écosystème d'ingénierie — services, formation, recherche et produits, conçu pour les ingénieurs, les étudiants et les entreprises.",
    groups: {
      ecosystem: "Écosystème",
      company: "Entreprise",
      resources: "Ressources",
    },
    rights: "Tous droits réservés.",
    motto: "Ingénierie · Formation · Innovation",
  },

  notFound: {
    eyebrow: "404 · Introuvable",
    title: "Ce plan ne figure pas dans les archives.",
    body: "La page que vous cherchez n'existe pas ou a été déplacée. La carte de l'écosystème ci-dessous vous remettra sur la bonne voie.",
    backHome: "Retour à l'accueil",
    report: "Signaler un lien brisé",
  },

  error: {
    eyebrow: "Erreur · Une défaillance est survenue",
    title: "Un composant a cédé.",
    body: "Quelque chose s'est mal passé de notre côté — pas du vôtre. Réessayez ; si le problème persiste, dites-le-nous et nous le corrigerons.",
    tryAgain: "Réessayer",
    backHome: "Retour à l'accueil",
  },
};

export default fr;
