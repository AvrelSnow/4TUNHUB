/**
 * English dictionary — the SOURCE of truth for copy shape.
 * `type Dictionary = typeof en` drives every other locale, so a
 * missing/renamed key in another language is a compile error.
 */

const en = {
  meta: {
    title: "4TUN Hub — Engineering Ecosystem",
    description:
      "4TUN Hub is an engineering ecosystem in Douala, Cameroon — mechanical design, FEA simulation, renewable-energy consulting, technical training, and engineering research, founded by Donfack Fortune.",
  },

  a11y: {
    skipToContent: "Skip to content",
  },

  /** Display labels for every route, keyed by sitemap node key. */
  routes: {
    home: "Home",
    products: "Products",
    services: "Services",
    academy: "Academy",
    research: "Research",
    projects: "Projects",
    about: "About",
    solutions: "Solutions",
    resources: "Resources",
    community: "Community",
    blog: "Blog",
    store: "Store",
    careers: "Careers",
    contact: "Contact",
  } as Record<string, string>,

  nav: {
    workWithUs: "Work with us",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primary: "Primary",
    mobile: "Mobile",
    language: "Language",
  },

  home: {
    eyebrow: "Engineering ecosystem · Douala, Cameroon",
    title: "Engineering knowledge, built into real solutions.",
    subtitle:
      "4TUN Hub brings engineering services, education, research and products together in one ecosystem — grounded in real practice, from Douala outward.",
    primaryCta: "Work with us",
    secondaryCta: "Explore services",
    learnMore: "Learn more",

    trust: {
      label: "Built on real engineering",
      stats: [
        { value: "319B", unit: "FCFA", label: "rail modernization programme" },
        { value: "560+", unit: "km", label: "of track being modernized" },
        { value: "6+", unit: "", label: "engineering projects delivered" },
        { value: "2", unit: "", label: "universities taught at" },
      ],
    },

    doEyebrow: "What we do",
    doTitle: "Four ways the ecosystem creates value.",
    doIntro:
      "Each is a working part of 4TUN Hub today — not a promise. Explore the one you need.",

    pillars: {
      products: "Software and AI tools we're building — things you use or buy.",
      services:
        "Mechanical design, FEA simulation and renewable-energy systems for companies and teams.",
      academy:
        "Technical training, CAD and SolidWorks workshops, and professional development.",
      research: "Renewable energy, sustainability, and applied R&D from the field.",
      projects: "Real engineering case studies — the proof behind the ecosystem.",
      about: "The organization and the founder behind 4TUN Hub.",
    } as Record<string, string>,

    proof: {
      eyebrow: "Proof",
      title: "Engineering that shipped, not slideware.",
      intro:
        "A few of the projects behind 4TUN Hub — designed, simulated and built.",
      viewAll: "See all projects",
    },

    founder: {
      eyebrow: "The founder",
      line: "4TUN Hub is founded by Donfack Fortune — mechanical engineer, energy specialist and educator, currently engineering Cameroon's railway future at CAMRAIL.",
      cta: "Read his story",
    },

    outlook: {
      eyebrow: "On the way",
      title: "The ecosystem keeps growing.",
      intro:
        "New parts of 4TUN Hub open as they're ready — no redesign, just more value.",
      items: [
        { key: "resources", title: "Resources", desc: "E-books, templates and engineering references." },
        { key: "community", title: "Community", desc: "A place for engineers and students to build together. The group is already open." },
        { key: "store", title: "Store", desc: "Paid courses, tools and digital goods — sold in context." },
      ],
    },

    heroCaption: "CFD · pressure distribution",

    conversion: {
      title: "Have an engineering problem worth solving?",
      subtitle:
        "Start a project with 4TUN Hub — from mechanical design and simulation to energy systems and training.",
      primaryCta: "Start a project",
      secondaryCta: "Explore services",
    },
  },

  projects: {
    eyebrow: "Projects",
    title: "Engineering that shipped.",
    intro:
      "Real machines and real analysis — designed, simulated and built. Each one states the problem, the approach and what came out of it.",
    filterLabel: "Filter by category",
    filterAll: "All",
    categories: {
      simulation: "Simulation-driven",
      sustainability: "Sustainability",
      mechanical: "Mechanical design",
      electronics: "Electronics",
      "user-centered": "User-centred",
    } as Record<string, string>,
    detail: {
      problem: "The problem",
      approach: "The approach",
      results: "The result",
      tools: "Tools",
      year: "Year",
      category: "Category",
      back: "All projects",
      ctaTitle: "Have a similar problem?",
      ctaBody: "Tell us what you're building — we'll tell you how we'd approach it.",
      cta: "Discuss a project",
      visualNote: "Project photography coming soon",
      illustrativeNote: "Illustrative reference — the design work is CAD models and FEA/CFD analysis.",
      zoom: "View full size",
      close: "Close",
      portfolio: "See more on the founder's portfolio",
    },
    items: {
      "fsae-race-car": {
        title: "Formula FSAE car design",
        outcome:
          "A complete Formula SAE vehicle taken from concept to simulation — eight sub-systems, solo, in full compliance with the competition rules.",
        problem:
          "Design a competition-ready Formula SAE car from scratch, meeting the full FSAE rulebook — as an independent solo project, with limited funding that ruled out physical fabrication.",
        approach:
          "Worked through eight sub-systems as independent modules — FSAE-rules compliance, chassis, crash analysis, aerodynamics, suspension, powertrain, braking and steering — modelling each in SolidWorks and validating structure, safety and flow with FEA and CFD rather than physical prototypes.",
        results:
          "A complete engineering design record for a competition-ready vehicle: every major system modelled, analysed and regulation-checked in simulation with professional rigour. Fabrication is the next step once funded.",
      },
      "banana-pseudostem-shredder": {
        title: "Banana-pseudostem shredding machine",
        outcome:
          "A belt-driven mono-disc shredder that turns banana-harvest waste into usable biomass — designed for Cameroonian conditions and lab-validated on real pseudostem.",
        problem:
          "Cameroon is a leading banana producer, yet the fibrous pseudostem left after harvest is routinely burned or dumped — lost biomass and needless waste. The shredding equipment on offer is either imported at high cost or built for conditions that don't match local realities. What was needed was a machine designed from the ground up to be built with locally available materials and tooling.",
        approach:
          "I supervised the project alongside Dr. Betene Achille at the University of Douala, guiding students from constraint analysis to prototype. We chose a mono-disc, belt-driven architecture for simplified construction, flexible power transmission, a compact footprint and low maintenance, then sized it rigorously — shaft dimensioning, blade geometry, bearing selection and frame rigidity — to handle real pseudostem.",
        results:
          "The machine was validated in laboratory trials that confirmed its shredding effectiveness on actual pseudostem, and fully documented — bill of materials, A2 drawings and kinematic scheme — for local manufacture and replication. It proved that high-impact agricultural machinery doesn't need industrial tools or imported parts, only rigorous engineering applied to accessible means.",
      },
      "locomotive-braking-analysis": {
        title: "Reverse engineering of train braking systems",
        outcome:
          "Brake triangles reproduced locally for CC2200 and CC3300-AC locomotives at CAMRAIL — reverse-engineered from worn originals.",
        problem:
          "The CC2200 and CC3300-AC are veteran locomotives in CAMRAIL's fleet, and original spare parts are no longer on the market — every failed brake triangle became a maintenance crisis. A team of four was tasked with reproducing two functional units from locally available materials and tooling, matching the originals closely enough to drop straight into service, while transitioning from SMAW to MIG-MAG welding for higher structural standards.",
        approach:
          "My responsibility was every detailed 2D drawing and 3D model — holding dimensions and tolerances within manufacturable limits while guaranteeing compatibility with the original interfaces. For the CC3300 we used bent-and-cut UPN profiles with end caps to reach the right mass and diameter; for the CC3300-AC, rectangular iron bars machined into circular forms. Throughout, traditional reverse engineering — calipers, tapes, geometric analysis, tolerance verification — iterating closely with the machinists so what was drawn was actually buildable with the machines on hand.",
        results:
          "Both brake triangles were manufactured, assembled and validated — the CC3300-AC unit completed the full Douala–Yaoundé route under real operating conditions. The lasting lesson was about the limits of design-office thinking: tolerances that assumed unavailable workshop capabilities cost rework, and consulting the manufacturer before finalising dimensions resolved it fast. The designer and the manufacturer aren't opponents in a tolerance negotiation — they're collaborators on the same problem.",
      },
      "motorised-wheelbarrow": {
        title: "Motorised wheelbarrow",
        outcome:
          "A motorised wheelbarrow built by hand in three weeks — reconditioned e-scooter drive, comfortable for users from 1.5 m to 1.9 m.",
        problem:
          "On Cameroon's building sites and farms, a manual wheelbarrow demands heavy, sustained effort — it tires workers fast and excludes anyone with less upper-body strength. The brief: a motorised wheelbarrow that's easy and comfortable to use across heights from 1.5 m to 1.9 m, on a tight budget, and with no 3D modelling or simulation tools available.",
        approach:
          "Purely hands-on engineering — welding, cutting and assembling the frame from measurement and iteration, with no CAD or FEA to fall back on; every decision made physically and corrected in the workshop. A three-week sourcing hunt landed a reconditioned e-scooter motor with a pre-mounted 35–40 cm wheel, ideal for the height range. When a collaborator, Badou, flagged that shorter users were poorly served and an adjustable mechanism blew the budget, the fix was to enlarge the wheel diameter — raising the whole frame just enough. A constraint became a design principle.",
        results:
          "Completed in three weeks and validated as comfortable for men from 1.75–1.90 m and women from 1.50–1.90 m, the motor cutting operator effort and extending working time well beyond a manual barrow. The real lesson was about tool scope: a CAD-and-simulation route would have added four to six weeks here for no proportional gain. The right tool is the one the job actually needs.",
      },
      "pedal-power-charger": {
        title: "Pedal-power mobile phone charger",
        outcome:
          "A human-powered charging station for energy-scarce environments — FEA-validated weldment frame, sized for the 5th to 95th anthropometric percentile.",
        problem:
          "Frequent power cuts at the University of Douala regularly left students unable to charge their phones — part of a wider reality of unreliable electricity across Cameroon. As project leader I set a team of three at HTTTC a hard goal: design and build a human-powered charger in three weeks for the Science & Engineering Festival, on a tight budget, with no prior weldment or FEA experience, and comfortable for users from the 5th to the 95th percentile.",
        approach:
          "We worked to Design-for-Manufacturing and an Empathize–Define–Ideate–Prototype–Test loop; I taught myself advanced SolidWorks weldment and FEA in a week to hold the deadline. Most of the effort went into the frame — a double-groove pulley transmission and all the electronics packaged inside the structure. When FEA exposed stress concentrations at critical joints above 800 N, I added strategic gusset reinforcements against fatigue, and chose hollow steel tubing for its strength-to-weight ratio.",
        results:
          "A working prototype presented at the HTTTC Festival, proving human-powered charging as a viable answer for energy-scarce settings. The simulation-driven approach caught structural weaknesses before fabrication and cut costly physical iterations. It's also where a principle stuck: designing for anthropometric diversity isn't a constraint — it's the measure of a design's real-world value.",
      },
      "beans-unwrapping-machine": {
        title: "Beans unwrapping machine",
        outcome:
          "An automated double-groove-pulley machine for small farmers — portable, locally maintainable, and built to 85%+ yield with minimal operator effort.",
        problem:
          "During a visit to Maroua in northern Cameroon, I watched farmers unwrap beans entirely by hand — slow, punishing work that throttled their output. Machinery to do it was either unavailable locally or unaffordable for small and medium producers. Any real solution had to suit rural Central Africa: limited materials, no specialist maintenance, portability across dispersed communities — while still hitting 85%+ yield, cutting operator effort and meeting health-and-safety requirements on a tight budget.",
        approach:
          "I built competing prototype configurations before committing, choosing the final design on material availability and manufacturability. Variable-dimension blades at 120° intervals with 5 cm spacing were tuned — rotation speed against motor torque — to unwrap beans without breaking them, with a double-groove pulley partitioning drive between motor, shaft and fan. When the specified 1.1 kW motor proved unavailable, I adapted the design to an alternative while holding every performance target, and balanced steel thickness against machine weight for portability.",
        results:
          "A machine that meets its performance targets and can genuinely be built and maintained where it's needed. Working with Nepitimbaye, Grace and Tatsinda drove home that engineering in constrained environments has to absorb real-world unpredictability — and that setting teammates up through patient onboarding beats shouldering every task alone.",
      },
    } as Record<
      string,
      { title: string; outcome: string; problem: string; approach: string; results: string }
    >,

    galleryTitle: "Technical documentation",
    galleries: {
      "fsae-race-car": ["CFD pressure field — illustrative"],
      "banana-pseudostem-shredder": [
        "A2 technical drawing — component dimensions and assembly",
        "Laboratory trial results — shredded pseudostem output",
        "Kinematic scheme of the power transmission",
        "Shredding principle diagram",
        "Pendulum weight test — impact-energy measurement",
        "FAST functional analysis diagram",
        "Blade locking mechanism — detail view",
        "Main shaft — dimensioned drawing",
        "Front plate — component drawing",
        "Machine frame — structural design",
        "Shredding blade — geometry and dimensions",
        "Blade box — folded plate component",
        "Blade box — back plate component",
        "Complete bill of materials",
      ],
      "locomotive-braking-analysis": [
        "The assembled brake triangle",
        "Manufactured braking shoes (CC2200)",
        "Reverse-engineered drawings (CC2200)",
      ],
      "motorised-wheelbarrow": [
        "Complete 2D assembly drawing",
        "Wheel, shaft and drive-organ assembly",
        "Chassis assembly drawing",
        "Motor assembly — exploded view",
        "3D model — full assembly",
        "3D model — detail view",
        "Motor components — view 2",
        "Motor components — view 1",
      ],
      "pedal-power-charger": [
        "Power-transmission calculations and gear-ratio optimisation",
        "Electrical circuit diagram and component layout",
        "Full CAD assembly",
        "Frame structural design",
        "Exploded view — all components",
        "Simplified CAD model prepared for FEA",
        "Load conditions applied to the frame in FEA",
        "Support structure — critical load-bearing components",
        "Von Mises stress under 800 N loading",
        "Support structure — alternate perspective",
        "Built prototype — view 1",
        "Built prototype — view 2",
        "Built prototype — view 3",
        "Rear mount assembly",
        "Force analysis of the pedal mechanism",
      ],
      "beans-unwrapping-machine": [
        "Explanation drawing — component layout and assembly",
        "Explanation drawing — power transmission and shaft",
        "Kinematic scheme of the drive",
        "Kinematic scheme — component legend",
        "Complete 2D frame assembly drawing",
        "Complete 2D shaft assembly drawing",
        "3D CAD assembly — alternate perspective",
        "3D CAD assembly — perspective view",
        "Shaft 3D CAD assembly — alternate perspective",
        "Performance testing and validation results",
      ],
    } as Record<string, string[]>,
  },

  services: {
    eyebrow: "Engineering Services",
    title: "Engineering that gets built, not just drawn.",
    subtitle:
      "Mechanical design, simulation and reverse engineering for companies, teams and entrepreneurs — grounded in what can actually be manufactured and maintained, across Cameroon and beyond.",
    primaryCta: "Request a consultation",
    secondaryCta: "See the work",

    offeringsEyebrow: "What we do",
    offeringsTitle: "Four ways we turn a brief into hardware.",
    offeringsIntro:
      "Each service ends in something real — a machine, an analysis, a set of manufacturing drawings.",
    proofLabel: "See the project",

    offerings: {
      "mechanical-design": {
        title: "Mechanical design & fabrication",
        outcome:
          "From a brief to a machine that can actually be built and maintained locally — full 2D and 3D drawings, part sizing and material selection.",
        who: "For companies and entrepreneurs who need custom equipment designed for real, on-the-ground conditions.",
      },
      simulation: {
        title: "FEA & simulation",
        outcome:
          "We test strength, stress and airflow in software and catch failure points before anything is cut — FEA (finite-element analysis) means validating a design on screen, not on the workshop floor.",
        who: "For teams who want confidence in a design before committing budget to fabrication.",
      },
      "reverse-engineering": {
        title: "Reverse engineering",
        outcome:
          "We rebuild accurate drawings and models of parts that no longer have documentation or spares, so they can be re-made locally.",
        who: "For operators keeping ageing equipment running when the original parts are off the market.",
      },
      "energy-consulting": {
        title: "Renewable energy & consulting",
        outcome:
          "Energy-systems analysis and engineering guidance for sustainable, off-grid-friendly solutions.",
        who: "For organisations working on renewable energy and sustainability in energy-scarce settings.",
      },
    } as Record<string, { title: string; outcome: string; who: string }>,

    process: {
      eyebrow: "How we work",
      title: "A clear path from brief to delivery.",
      steps: [
        {
          title: "Discover",
          desc: "We map the real problem and its constraints — budget, materials, and who will build and maintain the result.",
        },
        {
          title: "Design",
          desc: "Concepts first, then detailed 2D and 3D drawings with part sizing and material choices.",
        },
        {
          title: "Validate",
          desc: "Simulation and analysis to confirm the design holds up — before anything is fabricated.",
        },
        {
          title: "Deliver",
          desc: "Manufacturing-ready documentation, iterated with the people actually building it.",
        },
      ],
    },

    proof: {
      eyebrow: "Proof",
      title: "Services, shipped as real projects.",
      intro: "Every offering here has already produced something real.",
      cta: "Browse all projects",
    },

    models: {
      eyebrow: "Ways to engage",
      title: "How we can work together.",
      items: [
        { title: "Freelance", desc: "Ongoing design and simulation support, remote or on-site." },
        { title: "Project", desc: "A defined deliverable — a machine, an analysis, a documentation set — scoped end to end." },
        { title: "Advisory", desc: "Technical review and guidance on your own engineering work." },
      ],
    },

    cta: {
      title: "Have something that needs engineering?",
      subtitle:
        "Tell us what you're building. We'll tell you how we'd approach it — and what it takes.",
      primary: "Request a consultation",
      secondary: "See the projects",
    },
  },

  contact: {
    eyebrow: "Contact",
    title: "Let's talk about what you're building.",
    subtitle:
      "Whether it's a machine to design, a part to reverse-engineer, an analysis to run, or a class to teach — tell us the essentials and we'll come back with how we'd approach it.",
    slaBadge: "Replies within 48 hours",

    form: {
      heading: "Send a message",
      name: { label: "Your name", placeholder: "Jane Doe" },
      email: { label: "Email", placeholder: "you@company.com" },
      topic: {
        label: "What's this about?",
        placeholder: "Choose a topic",
        options: {
          services: "Engineering services",
          simulation: "Simulation & FEA",
          energy: "Renewable energy",
          training: "Training & education",
          research: "Research collaboration",
          other: "Something else",
        } as Record<string, string>,
      },
      message: {
        label: "Message",
        placeholder: "Tell us what you're working on, the context, and any constraints — budget, timeline, materials.",
        hint: "A few sentences is plenty. The more concrete, the better we can help.",
      },
      submit: "Send message",
      submitting: "Sending…",
      // Error codes returned by the server action, mapped to copy here.
      errors: {
        required: "This field is required.",
        emailInvalid: "Enter a valid email address.",
        topicRequired: "Please choose a topic.",
        messageTooShort: "Please add a little more detail.",
        messageTooLong: "That's a bit too long — please shorten it.",
        rateLimited: "Too many messages from this connection. Please wait a moment and try again.",
        failed: "Something went wrong sending your message. Please try again, or email us directly.",
      } as Record<string, string>,
    },

    success: {
      title: "Message sent.",
      body: "Thanks for reaching out — we'll get back to you within 48 hours. For anything urgent, email works fastest.",
      again: "Send another message",
    },

    channels: {
      eyebrow: "Direct channels",
      title: "Or reach us directly.",
      intro: "Prefer email or a quick message? Use whichever is easiest.",
      email: "Email",
      whatsapp: "WhatsApp community",
      whatsappNote: "Open group — engineers, students and makers.",
      linkedin: "LinkedIn",
      location: "Based in",
    },
  },

  about: {
    eyebrow: "About 4TUN Hub",
    title: "An engineering ecosystem, built from real practice.",
    lead: "4TUN Hub exists to bring engineering services, education, research and products together in one place — and to make world-class engineering practical in the Cameroonian and wider African context.",
    missionEyebrow: "Mission",
    mission:
      "To turn engineering knowledge into solutions that can actually be built, maintained and taught where they're needed most.",
    visionEyebrow: "Vision",
    vision:
      "To become a recognisable engineering hub — the first place engineers, students and companies think of for engineering knowledge, services and collaboration across Cameroon and beyond.",
    principlesEyebrow: "What we stand for",
    principlesTitle: "Principles behind the work.",
    principles: [
      { title: "Built for reality", desc: "Designed for local materials, budgets and the people who maintain the result — not an idealised workshop." },
      { title: "Proof over promises", desc: "Every claim is backed by a real project, a real number, a real outcome." },
      { title: "Knowledge that spreads", desc: "Engineering only compounds when it's taught — so teaching is part of the mission, not an afterthought." },
    ],
    founderEyebrow: "The founder",
    founderTitle: "The engineer behind the ecosystem.",
    founderCta: "See the full portfolio",
  },

  founderPage: {
    back: "About",
    contactCta: "Work with Donfack",
    resumeCta: "Download résumé",
    sections: {
      experience: "Experience",
      education: "Education",
      portfolio: "Portfolio",
      skills: "Skills & tools",
      certifications: "Certifications",
      awards: "Awards & honours",
      connect: "Connect",
    },
    portfolioIntro: "The engineering projects behind 4TUN Hub — each documented as a full case study.",
    skillGroups: { software: "Software", technical: "Technical", workshop: "Workshop" },
    viewProject: "View case study",
  },

  community: {
    join: "Join the WhatsApp community",
    note: "Open group · engineers, students and makers",
    live: "Live now",
  },

  stub: {
    badge: "In progress",
    beingBuilt: "This part of the ecosystem is being built.",
    intro:
      "It's part of the 4TUN Hub roadmap and opens as soon as it's ready. In the meantime, let's talk about your project.",
    whatsComing: "What's coming here",
    workWithUs: "Work with us",
    backHome: "Back to home",
  },

  footer: {
    trustEyebrow: "The engineering behind 4TUN Hub",
    founderLine:
      "Founded by Donfack Fortune — a mechanical engineer working across Cameroon's railway, energy and engineering-education sectors.",
    meetFounder: "Meet the founder →",
    affiliations: "Affiliations",
    affiliationsNote: "Founder affiliations — not corporate partnerships.",
    blurb:
      "An engineering ecosystem — services, education, research and products, built for engineers, students and companies.",
    groups: {
      ecosystem: "Ecosystem",
      company: "Company",
      resources: "Resources",
    },
    rights: "All rights reserved.",
    motto: "Engineering · Education · Innovation",
  },

  notFound: {
    eyebrow: "404 · Not found",
    title: "This drawing isn't in the archive.",
    body: "The page you're looking for doesn't exist or has moved. The ecosystem map below will get you back on track.",
    backHome: "Back to home",
    report: "Report a broken link",
  },

  error: {
    eyebrow: "Error · Something failed",
    title: "A component didn't hold.",
    body: "Something went wrong on our side — not yours. Try again; if it persists, tell us and we'll fix it.",
    tryAgain: "Try again",
    backHome: "Back to home",
  },
};

export type Dictionary = typeof en;
export default en;
