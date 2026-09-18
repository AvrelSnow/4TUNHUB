/**
 * CAMRAIL — the founder's flagship experience, migrated from
 * donfackfortune.com/Camrail.html. Lives under the About section at
 * /about/founder/camrail. Bilingual via Loc { en, fr }.
 */
import type { Loc } from "./founder";

const IMG = "/images/camrail";

export const camrail = {
  eyebrow: { en: "Professional experience · Former senior role", fr: "Expérience professionnelle · Ancien poste senior" } as Loc,
  title: { en: "Senior Mechanical Engineer at CAMRAIL", fr: "Ingénieur mécanicien senior à CAMRAIL" } as Loc,
  intro: {
    en: "Contributed to the operation and modernisation of Cameroon's 1,010 km national rail network — from locomotive compressor systems to structural brake-support design validated through FEA.",
    fr: "A contribué à l'exploitation et à la modernisation du réseau ferré national camerounais de 1 010 km — des systèmes de compresseurs de locomotives à la conception de supports de frein validés par FEA.",
  } as Loc,
  portrait: `${IMG}/portrait.webp`,
  portraitCaption: { en: "FIG. 03 — On site · CAMRAIL workshop, Douala", fr: "FIG. 03 — Sur site · Atelier CAMRAIL, Douala" } as Loc,

  stats: [
    { value: "1,010 km", label: { en: "Rail network", fr: "Réseau ferré" } as Loc },
    { value: "319B FCFA", label: { en: "Modernisation plan", fr: "Plan de modernisation" } as Loc },
    { value: "5,500+", label: { en: "Jobs supported", fr: "Emplois soutenus" } as Loc },
  ],

  overviewEyebrow: { en: "Overview", fr: "Vue d'ensemble" } as Loc,
  overviewTitle: {
    en: "Engineering at the edge of real-world constraints",
    fr: "L'ingénierie à la limite des contraintes réelles",
  } as Loc,
  overview: [
    {
      en: "At CAMRAIL I worked as a mechanical engineer and 3D modeller, contributing to compressor test-bench optimisation and the development of train braking systems. The test bench was a build-to-spec project; the braking systems followed a full development process — multiple iterations, system integration and the adaptation of new technologies.",
      fr: "À CAMRAIL, j'ai travaillé comme ingénieur mécanicien et modeleur 3D, contribuant à l'optimisation du banc d'essai des compresseurs et au développement des systèmes de freinage. Le banc d'essai était un projet sur cahier des charges ; les systèmes de freinage ont suivi un processus complet — itérations multiples, intégration système et adaptation de nouvelles technologies.",
    } as Loc,
    {
      en: "The work demanded technical rigour, problem-solving and close teamwork at the edge of practical engineering constraints — pushing existing limits while guaranteeing safety, reliability and performance. Knowing it directly supports train drivers and the millions of Cameroonians who rely on these trains every day is a source of deep professional pride.",
      fr: "Ce travail exigeait rigueur technique, résolution de problèmes et étroite collaboration, à la limite des contraintes pratiques — repousser les limites existantes tout en garantissant sécurité, fiabilité et performance. Savoir que cela soutient directement les conducteurs et les millions de Camerounais qui dépendent chaque jour de ces trains est une fierté professionnelle profonde.",
    } as Loc,
  ],

  caseStudiesEyebrow: { en: "Case studies", fr: "Études de cas" } as Loc,
  caseStudiesTitle: { en: "Engineering challenges & solutions", fr: "Défis d'ingénierie & solutions" } as Loc,

  cases: [
    {
      n: "01",
      title: { en: "Compressor test-bench optimisation", fr: "Optimisation du banc d'essai des compresseurs" } as Loc,
      blocks: [
        {
          label: { en: "The problem", fr: "Le problème" } as Loc,
          body: {
            en: "Optimising and reconfiguring the mechanical and pneumatic systems of ageing intercity locomotives — BB1100, CC2200, CC3300 and CC3300-AC — amid rolling-stock and spare-part shortages. While preparing locomotives for operational validation, we uncovered incompatibilities in the compressor test bench, a crucial tool for preventive and corrective maintenance. The compressor ensures air compression and oil circulation for braking, control and auxiliary systems, yet the existing bench could only test BB1100 and CC2200 units — other models needed fragmented testing across separate locations, costing time, traceability and reliability.",
            fr: "Optimiser et reconfigurer les systèmes mécaniques et pneumatiques de locomotives interurbaines vieillissantes — BB1100, CC2200, CC3300 et CC3300-AC — dans un contexte de pénurie de matériel roulant et de pièces. En préparant les locomotives à la validation opérationnelle, nous avons découvert des incompatibilités sur le banc d'essai des compresseurs, outil clé de la maintenance préventive et corrective. Le compresseur assure la compression d'air et la circulation d'huile pour le freinage, la commande et les systèmes auxiliaires ; or le banc existant ne testait que les BB1100 et CC2200 — les autres modèles imposaient des essais fragmentés en plusieurs lieux, au prix du temps, de la traçabilité et de la fiabilité.",
          } as Loc,
        },
        {
          label: { en: "The approach", fr: "La démarche" } as Loc,
          body: {
            en: "I defined and implemented a new testing methodology to turn the bench into a versatile, modular, universal system able to run pressurised-air, water and oil tests across compressor types. Three parallel workstreams: a full 3D model of the bench (frame, mounting interfaces, testing zones) accommodating units from compact BB1100 to larger CC3300; a low-cost modular frame built for multi-compressor compatibility, easy assembly and enough rigidity to limit test vibration; and a functional analysis of vibration, air/fluid-jet forces and compressor–structure interactions to prevent instability or failure during testing.",
            fr: "J'ai défini et mis en œuvre une nouvelle méthodologie d'essai pour transformer le banc en un système polyvalent, modulaire et universel, capable d'essais air comprimé, eau et huile pour plusieurs types de compresseurs. Trois chantiers parallèles : un modèle 3D complet du banc (bâti, interfaces de montage, zones d'essai) accueillant des unités du compact BB1100 au plus grand CC3300 ; un bâti modulaire économique compatible multi-compresseurs, facile à assembler et assez rigide pour limiter les vibrations d'essai ; et une analyse fonctionnelle des vibrations, des efforts des jets d'air/fluide et des interactions compresseur–structure pour éviter instabilité ou défaillance en essai.",
          } as Loc,
        },
        {
          label: { en: "Additional scope", fr: "Périmètre complémentaire" } as Loc,
          body: {
            en: "Beyond the bench, I tackled recurrent radiator overheating — driven by ageing components, unavailable original parts and locally-made alternatives disrupting airflow. I analysed ventilation impacts, proposed pneumatic-system modifications, integrated additional radiator ventilation, and ensured the changes didn't interfere with other mechanical or pneumatic systems.",
            fr: "Au-delà du banc, j'ai traité la surchauffe récurrente des radiateurs — liée au vieillissement, à l'indisponibilité des pièces d'origine et à des alternatives locales perturbant l'écoulement d'air. J'ai analysé les impacts de ventilation, proposé des modifications pneumatiques, intégré une ventilation de radiateur supplémentaire et veillé à ne pas perturber les autres systèmes.",
          } as Loc,
        },
      ],
    },
    {
      n: "02",
      title: { en: "Brake support design", fr: "Conception du support de frein" } as Loc,
      blocks: [
        {
          label: { en: "The problem", fr: "Le problème" } as Loc,
          body: {
            en: "A technical contributor on the brake-support design and adaptation for BB1100 and CC3300 locomotives, where original components were no longer available. In these pneumatic systems, compressed air at 3.8 bar actuates cylinders that press brake shoes against the wheel. I found three fundamental failure modes in the existing support: excessive mechanical play from worn axles and pivots, fatigue of suspension springs, and corrosion weakening structural integrity — manifesting as longer stopping distances and the risk of catastrophic failure under load.",
            fr: "Contributeur technique sur la conception et l'adaptation du support de frein des locomotives BB1100 et CC3300, dont les composants d'origine n'étaient plus disponibles. Dans ces systèmes pneumatiques, l'air comprimé à 3,8 bar actionne des cylindres qui plaquent les sabots contre la roue. J'ai identifié trois modes de défaillance : jeu mécanique excessif dû à l'usure des axes et pivots, fatigue des ressorts de suspension et corrosion affaiblissant la structure — se traduisant par des distances d'arrêt allongées et un risque de rupture catastrophique sous charge.",
          } as Loc,
        },
        {
          label: { en: "The approach", fr: "La démarche" } as Loc,
          body: {
            en: "Rather than jump to conclusions, I started with one question — what are we actually observing? Dimensional measurements confirmed pivot play exceeding spec by 300%. I gathered insight from engineers who knew these systems intimately and built a fault tree around the most probable mechanisms. Then, using SOLIDWORKS for 3D modelling and ANSYS for FEA, I designed an optimised support: S235JR structural steel for yield strength, weldability and fatigue resistance; gusset reinforcements at critical load paths to eliminate weld-joint stress concentrations; and a manufacturing route of precision cutting, fixture-assisted alignment, qualified MIG welding, post-weld grinding and protective coating.",
            fr: "Plutôt que de conclure hâtivement, j'ai commencé par une question — qu'observons-nous réellement ? Les mesures ont confirmé un jeu aux pivots dépassant la spécification de 300 %. J'ai recueilli l'expertise des ingénieurs connaissant intimement ces systèmes et construit un arbre de défaillances autour des mécanismes les plus probables. Puis, avec SOLIDWORKS pour la modélisation 3D et ANSYS pour la FEA, j'ai conçu un support optimisé : acier de construction S235JR pour la limite d'élasticité, la soudabilité et la tenue en fatigue ; goussets de renfort aux chemins d'effort critiques pour supprimer les concentrations de contraintes aux soudures ; et une gamme de fabrication — découpe de précision, alignement sur gabarit, soudage MIG qualifié, meulage post-soudure et revêtement protecteur.",
          } as Loc,
        },
        {
          label: { en: "The result", fr: "Le résultat" } as Loc,
          body: {
            en: "Structural analysis validated the design with adequate safety margins and a predicted service life beyond typical overhaul intervals. Assembly followed a systematic protocol — pressure testing, static load testing to 150% of design braking force, and dynamic testing under simulated braking cycles. The outcome: fewer maintenance interventions, tighter mechanical tolerances and better braking response, longer component life, and higher structural safety factors. The real lesson was the method — observe carefully, analyse systematically, validate thoroughly, and always respect the expertise of those who work the equipment every day.",
            fr: "L'analyse structurelle a validé la conception avec des marges de sécurité suffisantes et une durée de vie prévue au-delà des intervalles de révision habituels. L'assemblage a suivi un protocole systématique — essais en pression, essai statique à 150 % de l'effort de freinage nominal et essais dynamiques sous cycles de freinage simulés. Résultat : moins d'interventions de maintenance, des tolérances plus serrées et une meilleure réponse au freinage, une durée de vie accrue et des coefficients de sécurité plus élevés. La vraie leçon fut la méthode — observer avec soin, analyser méthodiquement, valider rigoureusement, et toujours respecter l'expertise de ceux qui manient l'équipement chaque jour.",
          } as Loc,
        },
      ],
    },
  ],

  galleryEyebrow: { en: "Gallery", fr: "Galerie" } as Loc,
  galleryTitle: { en: "Engineering in the field", fr: "L'ingénierie sur le terrain" } as Loc,
  gallery: [
    { img: `${IMG}/brake-support.webp`, caption: { en: "Brake support — BB1100 & CC3300-AC, full view", fr: "Support de frein — BB1100 & CC3300-AC, vue complète" } as Loc },
    { img: `${IMG}/intercity-trains.webp`, caption: { en: "CAMRAIL intercity trains", fr: "Trains interurbains CAMRAIL" } as Loc },
    { img: `${IMG}/cc3300ac-compressors.webp`, caption: { en: "CC3300-AC compressors", fr: "Compresseurs CC3300-AC" } as Loc },
    { img: `${IMG}/cc2500-compressors.webp`, caption: { en: "CC2500 compressors", fr: "Compresseurs CC2500" } as Loc },
    { img: `${IMG}/test-bench.webp`, caption: { en: "The compressor test bench", fr: "Le banc d'essai des compresseurs" } as Loc },
    { img: `${IMG}/bench-before.webp`, caption: { en: "Test bench — before optimisation", fr: "Banc d'essai — avant optimisation" } as Loc },
    { img: `${IMG}/train-wagons.webp`, caption: { en: "Intercity train wagons", fr: "Wagons de train interurbain" } as Loc },
  ],

  ctaTitle: { en: "Interested in this kind of engineering?", fr: "Ce type d'ingénierie vous intéresse ?" } as Loc,
  ctaBody: {
    en: "Available for mechanical engineering consulting, FEA simulation and industrial systems analysis.",
    fr: "Disponible pour du conseil en ingénierie mécanique, de la simulation FEA et de l'analyse de systèmes industriels.",
  } as Loc,
};
