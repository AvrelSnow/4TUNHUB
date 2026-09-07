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

  /**
   * The ground control. `options` are rendered through `.readout`, which
   * uppercases them — so they are written in sentence case here and read
   * as mono labels on the page.
   */
  theme: {
    label: "Theme",
    options: {
      auto: "Auto",
      light: "Day",
      dark: "Night",
    },
    next: "Switch to",
    autoHint: "Follows your local clock — the day sheet from 06:00, the night ground from 18:00.",
  },

  home: {
    eyebrow: "Engineering ecosystem · Douala, Cameroon",
    title: "Engineering knowledge, built into real solutions.",
    titleLead: "Engineering knowledge, built into ",
    titleAccent: "real solutions.",
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
    // Shared micro-copy — also used by the home outlook + route placeholder.
    join: "Join the WhatsApp community",
    note: "Open group · engineers, students and makers",
    live: "Live now",

    eyebrow: "Community · Live now",
    title: "Engineers, students and makers — already building together.",
    subtitle:
      "4TUN Hub isn't only a studio. It's a growing community across Cameroon and beyond — an open WhatsApp group, a 3,200-reader engineering newsletter and a SolidWorks user group. Everyone's welcome.",
    primaryCta: "Join the WhatsApp community",
    secondaryCta: "Follow on LinkedIn",

    channelsEyebrow: "Where we gather",
    channelsTitle: "Ways to plug in.",
    channelsIntro: "Pick the space that fits — every one of them is active today.",
    channels: {
      whatsapp: {
        title: "WhatsApp community",
        desc: "The day-to-day hub — questions, feedback, project help and announcements. An open group for engineers, students and makers.",
        action: "Join the group",
      },
      rem: {
        title: "The REM newsletter",
        desc: "Renewable Energy Mall & Engineering Review — first-principles energy and engineering analysis, read by 3,200+ engineers and policymakers.",
        action: "Read The REM",
      },
      linkedin: {
        title: "LinkedIn",
        desc: "Follow the founder for project write-ups, engineering insight and community updates.",
        action: "Follow on LinkedIn",
      },
    } as Record<string, { title: string; desc: string; action: string }>,

    whoEyebrow: "Who's here",
    whoTitle: "A community grounded in real practice.",
    whoBody:
      "Students sharpening CAD and simulation skills, working engineers comparing notes, and makers turning ideas into hardware — all in one place, from Douala outward.",
    whoStats: [
      { value: "3,200+", label: "readers of The REM newsletter" },
      { value: "300+", label: "in the Douala SolidWorks user group" },
      { value: "Open", label: "WhatsApp group, free to join" },
    ],

    ethosEyebrow: "How it works",
    ethosTitle: "A few simple principles.",
    ethos: [
      { title: "Real help, real work", desc: "Share what you're building and get concrete engineering feedback — not vague encouragement." },
      { title: "Everyone teaches", desc: "The community compounds when people pass on what they know. Ask freely, answer generously." },
      { title: "Respect first", desc: "Students, professionals and hobbyists share the space. Keep it welcoming and on-topic." },
    ],

    cta: {
      title: "Come build with us.",
      subtitle:
        "The group is open and active. Join the conversation and introduce what you're working on.",
      primary: "Join the WhatsApp community",
      secondary: "Reach out directly",
    },
  },

  academy: {
    eyebrow: "4TUN Hub Academy",
    title: "Learn engineering that actually ships.",
    subtitle:
      "Practical training in CAD, simulation and energy systems — taught from real delivered projects, built for engineers and students across Cameroon and beyond.",
    primaryCta: "Join the waitlist",
    secondaryCta: "Meet the instructor",

    catalogEyebrow: "Catalog",
    catalogTitle: "Tracks you can put to work immediately.",
    catalogIntro:
      "Every track is hands-on and ends in a skill you can show — a part modelled, a design validated, a component rebuilt — not just a video watched.",
    levelLabel: "Level",
    formatLabel: "Format",
    proofLabel: "See it applied",
    levels: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      "all-levels": "All levels",
    } as Record<string, string>,
    formats: {
      online: "Online",
      "in-person": "In person",
      hybrid: "Online + in person",
      workshop: "Hands-on workshop",
    } as Record<string, string>,
    courses: {
      "solidworks-cad": {
        title: "SolidWorks & CAD fundamentals",
        outcome:
          "Model parts and assemblies and produce clean manufacturing drawings — the core skill behind every machine in the portfolio.",
        who: "For students and junior engineers starting out in mechanical design.",
      },
      "fea-simulation": {
        title: "FEA & design validation",
        outcome:
          "Run finite-element analysis to test strength and stress, and catch failure points on screen before anything is cut.",
        who: "For designers who want confidence in a part before committing to fabrication.",
      },
      "reverse-engineering": {
        title: "Reverse engineering & fabrication",
        outcome:
          "Rebuild accurate drawings of parts that have no documentation, and take them to a design that can be built locally.",
        who: "For technicians and engineers keeping equipment running without spares.",
      },
      "energy-systems": {
        title: "Renewable energy systems",
        outcome:
          "Size and analyse solar and off-grid systems for real, energy-scarce conditions.",
        who: "For engineers and entrepreneurs working on off-grid and sustainable energy.",
      },
    } as Record<string, { title: string; outcome: string; who: string }>,

    formatsEyebrow: "How you learn",
    formatsTitle: "Built around how engineers actually learn.",
    formatsList: [
      {
        title: "Online courses",
        desc: "Self-paced modules with real exercises you complete in CAD and simulation software.",
      },
      {
        title: "Live workshops",
        desc: "Hands-on, project-based sessions — in person where possible, remote where not.",
      },
      {
        title: "Cohort mentoring",
        desc: "Small groups guided from a brief to a finished, presentable engineering deliverable.",
      },
    ],

    instructorEyebrow: "Who teaches",
    instructorTitle: "Taught by a working engineer and accredited educator.",
    instructorBody:
      "Every track is led by Donfack Fortune — a mechanical engineer and state-accredited educator who has reached 300+ students and leads the Douala SolidWorks user group. You learn the methods behind real delivered projects, not textbook abstractions.",
    instructorCta: "Meet the founder",

    cta: {
      title: "Be first into the next cohort.",
      subtitle:
        "The Academy is opening in stages. Join the waitlist and we'll reach out as each track goes live.",
      primary: "Join the waitlist",
      secondary: "See the projects",
    },
  },

  research: {
    eyebrow: "Research & R&D",
    title: "Research with industrial purpose.",
    subtitle:
      "Applied engineering research in renewable energy, sustainability and industrial systems — grounded in West and Central African infrastructure realities, not abstractions.",
    primaryCta: "Collaborate on research",
    secondaryCta: "See the projects",

    focusEyebrow: "Focus areas",
    focusTitle: "Where we put the work.",
    focusIntro:
      "Three fronts where engineering research changes what actually gets built and used.",
    whyLabel: "Why it matters",
    doingLabel: "What we're doing",
    proofLabel: "See related work",
    areas: {
      "renewable-energy": {
        title: "Renewable & off-grid energy",
        why: "Across West and Central Africa, unreliable and off-grid power shapes every engineering decision. Getting energy systems right is the difference between a design that works on paper and one that works in the field.",
        doing: "Technical analysis of solar, storage and off-grid systems — translated into policy-relevant insight through The REM newsletter.",
      },
      "sustainable-machinery": {
        title: "Sustainable agricultural machinery",
        why: "Post-harvest waste and unaffordable imported equipment hold back small producers. Locally buildable machines turn waste into value and effort into output.",
        doing: "Designing and lab-validating machines — like the banana-pseudostem shredder — built from locally available materials and tooling.",
      },
      "industrial-rd": {
        title: "Industrial R&D & reverse engineering",
        why: "Ageing industrial equipment fails when spares leave the market. Reproducing parts locally keeps critical infrastructure running.",
        doing: "Reverse-engineering and re-manufacturing components — like locomotive brake triangles at CAMRAIL — to original tolerances.",
      },
    } as Record<string, { title: string; why: string; doing: string }>,

    pubEyebrow: "Publications",
    pubTitle: "The REM — Renewable Energy Mall & Engineering Review.",
    pubBody:
      "A newsletter read by 3,200+ engineers and policymakers, translating technical energy research into insight for West and Central Africa. Detailed, first-principles analysis, published regularly.",
    pubReadRem: "Read The REM on Medium",
    pubFollow: "Follow the newsletter on LinkedIn",

    initiativesEyebrow: "Initiatives",
    initiativesTitle: "Research that leaves the page.",
    initiativesBody:
      "Findings feed straight back into 4TUN Hub's services, machines and courses — so research earns its keep in real deliverables, not just publications.",

    cta: {
      title: "Have a research problem worth solving?",
      subtitle:
        "We collaborate with researchers, partners and industry on energy and sustainability work. Tell us what you're working on.",
      primary: "Collaborate on research",
      secondary: "See the projects",
    },
  },

  products: {
    eyebrow: "Products",
    title: "The software 4TUN Hub is building.",
    subtitle:
      "Engineering and education tools for African realities — in active development. Nothing here is sold before it's ready; this is the roadmap, honestly staged.",
    primaryCta: "Join the waitlist",
    secondaryCta: "Talk to us",

    cardsEyebrow: "In the pipeline",
    cardsTitle: "Three products, honestly staged.",
    cardsIntro:
      "Each one solves a problem we've hit first-hand. The build stage is stated plainly — concept, planned, or in development.",
    statusLabel: "Status",
    problemLabel: "The problem",
    whoLabel: "Who it's for",
    statuses: {
      "in-development": "In development",
      planned: "Planned",
      concept: "Concept",
    } as Record<string, string>,
    items: {
      "edu-assistant": {
        title: "Cameroon Educational Assistant",
        desc: "An AI tutor built around the Cameroonian curriculum — explaining, quizzing and guiding students in their own exam context.",
        problem:
          "Students preparing for the GCE O- and A-Levels rarely have access to affordable, curriculum-specific tutoring in science and engineering subjects.",
        who: "For Cameroonian secondary and pre-university students.",
      },
      "digital-twin": {
        title: "Digital Twin Platform",
        desc: "3D digital-twin tooling for facilities and equipment — bringing simulation-grade insight to day-to-day operations.",
        problem:
          "Industrial operators lack affordable tools to model, monitor and plan maintenance for their equipment and facilities.",
        who: "For industrial and infrastructure operators.",
      },
      "mech-ai": {
        title: "Mechanical AI Assistant",
        desc: "An AI copilot for mechanical design, FEA and engineering calculations.",
        problem:
          "Mechanical engineers spend hours on repetitive sizing, calculations and FEA setup that a domain-aware assistant could accelerate.",
        who: "For mechanical designers and simulation engineers.",
      },
    } as Record<string, { title: string; desc: string; problem: string; who: string }>,

    roadmapEyebrow: "How we ship",
    roadmapTitle: "Built in the open, released when ready.",
    roadmapBody:
      "New tools slot into this pillar without a redesign — 4TUN Hub is built as an expandable ecosystem. We'd rather ship one product that works than three that don't.",

    detail: {
      status: "Status",
      backToProducts: "All products",
      waitlist: "Join the waitlist",
      body: "This product is on the 4TUN Hub roadmap. Join the waitlist and we'll reach out the moment there's something real to try.",
    },

    cta: {
      title: "Want early access?",
      subtitle:
        "Join the waitlist and help shape what we build first. We'll only email you when there's something real to try.",
      primary: "Join the waitlist",
      secondary: "Talk to us",
    },
  },

  resources: {
    eyebrow: "Resources",
    title: "Engineering resources, free and practical.",
    subtitle:
      "References, CAD models, case studies and publications from real 4TUN Hub work — some available today, more on the way. Built to be useful, not gated.",
    primaryCta: "Read The REM",
    secondaryCta: "Join the community",

    availableEyebrow: "Available now",
    availableTitle: "Start with what's already open.",
    availableIntro: "Real, published material you can use today — no sign-up wall.",
    plannedEyebrow: "On the way",
    plannedTitle: "In preparation.",
    plannedIntro:
      "Resources in production. Join the community and we'll share them as they land.",
    availableBadge: "Available",
    plannedBadge: "In progress",
    open: "Open",
    kinds: {
      publication: "Publication",
      cad: "CAD models",
      "case-studies": "Case studies",
      ebook: "E-book",
      template: "Templates",
      reference: "Reference",
    } as Record<string, string>,
    items: {
      rem: {
        title: "The REM newsletter",
        desc: "Renewable Energy Mall & Engineering Review — first-principles energy and engineering analysis, read by 3,200+ engineers and policymakers.",
      },
      grabcad: {
        title: "CAD models on GrabCAD",
        desc: "Public 3D models and assemblies from real projects — free to download, study and reuse.",
      },
      "case-studies": {
        title: "Project case studies",
        desc: "Six fully documented engineering projects — problem, approach, results, drawings and analysis. A working reference library.",
      },
      ebooks: {
        title: "Engineering e-books & guides",
        desc: "Practical guides on CAD, FEA and design-for-manufacture — distilled from delivered work.",
      },
      templates: {
        title: "CAD & calculation templates",
        desc: "Reusable drawing templates, sizing sheets and checklists to speed up real design work.",
      },
      references: {
        title: "Engineering reference sheets",
        desc: "Quick-reference material for common mechanical and energy-system calculations.",
      },
    } as Record<string, { title: string; desc: string }>,

    commerceNote: {
      eyebrow: "Free and paid",
      title: "Most resources are free. Some will be paid.",
      body: "As deeper courses, e-books and toolkits arrive, a few will be paid — always sold in context, right where you find them. There's no separate paywall to navigate.",
      cta: "See how the store works",
    },

    cta: {
      title: "Want the next resource first?",
      subtitle:
        "Join the community and we'll share new resources — free and paid — as they're published.",
      primary: "Join the community",
      secondary: "Read The REM",
    },
  },

  store: {
    eyebrow: "Store",
    title: "Commerce, sold where it makes sense.",
    subtitle:
      "4TUN Hub has no separate shop. When something's for sale — a course, an e-book, a tool — you buy it right where you find it. This page simply gathers everything purchasable in one view.",
    primaryCta: "Explore the ecosystem",
    secondaryCta: "Get notified",

    // The gauge label on the empty panel. Names the quantity being measured,
    // so the store, blog and careers zeros read as three different readings
    // rather than one template printed three times.
    emptyReadout: "0 items listed",
    emptyEyebrow: "Current status",
    emptyTitle: "Nothing's on sale yet — and that's deliberate.",
    emptyBody:
      "We won't list anything here until it's genuinely ready and worth paying for. The moment the first course, e-book or tool ships, it appears in its pillar and in this view automatically.",

    contextEyebrow: "Where commerce lives",
    contextTitle: "Buy things in context.",
    contextIntro:
      "Each purchasable item is sold inside the pillar it belongs to — no separate checkout silo.",
    context: {
      academy: { title: "Academy", desc: "Paid courses and workshops — bought alongside the free tracks." },
      resources: { title: "Resources", desc: "E-books, templates and toolkits — some free, some paid." },
      products: { title: "Products", desc: "Software licences and subscriptions when the tools ship." },
    } as Record<string, { title: string; desc: string }>,
    explore: "Explore",

    // When the catalog fills, these label the live grid.
    catalogEyebrow: "For sale now",
    catalogTitle: "Available to buy.",
    priceFrom: "From",

    cta: {
      title: "Want to know when something ships?",
      subtitle:
        "Join the community or drop us a line — we'll tell you the moment there's something worth buying.",
      primary: "Join the community",
      secondary: "Get in touch",
    },
  },

  blog: {
    eyebrow: "Writing",
    title: "The thinking behind the engineering.",
    subtitle:
      "Analysis of energy, simulation and industrial systems in West and Central Africa — written from delivered work, not from press releases.",
    primaryCta: "Read The REM",
    secondaryCta: "Work with us",

    emptyReadout: "0 posts published",
    emptyEyebrow: "Current status",
    emptyTitle: "Nothing is republished here yet — and that is deliberate.",
    emptyBody:
      "The writing already has an audience elsewhere, and a thin copy of it here would compete with the original in search rather than help it. Articles will appear on this page when they are written for it, with the original always credited as the canonical source.",

    hubEyebrow: "Where the writing lives",
    hubTitle: "Two places, both active.",
    hubIntro:
      "Until this page carries its own articles, these are the real publications — not announcements of future ones.",
    publications: {
      rem: {
        title: "The REM",
        desc: "Renewable Energy Mall & Engineering Review. First-principles analysis of solar, storage and off-grid systems, translated into insight for engineers and policymakers.",
        cta: "Follow on LinkedIn",
      },
      medium: {
        title: "Medium",
        desc: "Longer technical essays on simulation, mechanical design and engineering education.",
        cta: "Read on Medium",
      },
    } as Record<string, { title: string; desc: string; cta: string }>,
    readers: "readers",

    // Used once the index carries real articles.
    indexEyebrow: "Latest",
    indexTitle: "Recent writing.",
    readMore: "Read",
    minRead: "min read",
    originallyOn: "Originally published on",
    sources: {
      native: "4TUN Hub",
      medium: "Medium",
      rem: "The REM",
    } as Record<string, string>,

    cta: {
      title: "Want this analysis applied to your problem?",
      subtitle:
        "The writing comes out of real projects. If one of them looks like yours, start a conversation.",
      primary: "Work with us",
      secondary: "See the work",
    },
  },

  /**
   * Per-post prose, keyed by slug. Empty until a real article exists —
   * the structural facts live in lib/blog.ts, the words live here, and
   * TypeScript keeps EN and FR in step.
   */
  blogPosts: {} as Record<string, { title: string; excerpt: string }>,

  careers: {
    eyebrow: "Careers",
    title: "No one works here yet.",
    subtitle:
      "4TUN Hub is founder-led and pre-revenue. There is no salary to offer, so there is nothing to apply for — and inventing openings to look larger would waste the time of the people least able to spare it. So here is the real position, and the three doors that are genuinely open.",
    primaryCta: "Join the community",
    secondaryCta: "Propose a collaboration",

    emptyReadout: "0 roles open",
    emptyEyebrow: "Open positions",
    emptyTitle: "Zero — and that is the honest number.",
    emptyBody:
      "When the consulting and academy work can pay a second person properly, the first role appears here with its scope, its location and its pay range stated in the advert itself. Until then this page stays empty rather than collecting applications against a job that does not exist.",

    // Used the moment a real role is posted.
    rolesEyebrow: "Open now",
    rolesTitle: "Roles we are hiring for.",
    apply: "Read the role",
    posted: "Posted",
    kinds: {
      engineering: "Engineering",
      education: "Education",
      research: "Research",
      operations: "Operations",
    } as Record<string, string>,
    commitments: {
      "full-time": "Full-time",
      "part-time": "Part-time",
      contract: "Contract",
      internship: "Internship",
    } as Record<string, string>,

    /**
     * Per-role prose, keyed by the slug in lib/careers.ts. Empty because
     * `roles` is empty — but it exists so a role CANNOT be posted without
     * a title and a summary written in both languages. The index used to
     * render the raw slug, which would have shipped the first real advert
     * as "simulation-engineer" in EN and in FR alike.
     */
    roles: {} as Record<string, { title: string; summary: string }>,

    principlesEyebrow: "The terms, set in advance",
    principlesTitle: "How hiring will work when it starts.",
    principlesIntro:
      "Written down now, while there is nothing to be gained by writing them — which is the only moment such commitments are worth anything.",
    principles: {
      paid: {
        title: "Paid, always",
        desc: "No unpaid internships, no work traded for exposure, no equity offered in place of a wage. If a task is worth doing it carries a rate, agreed in writing before it starts.",
      },
      proof: {
        title: "Proof over credentials",
        desc: "A model you can open, a simulation you can defend, a class you have actually taught — these weigh more here than a certificate. The founder's own case is built from delivered work, and yours will be read the same way.",
      },
      local: {
        title: "Cameroonian first, remote by default",
        desc: "Hiring starts where the ecosystem already is. The work runs remotely today and will keep running that way, so location limits nobody inside the country.",
      },
      open: {
        title: "The scope is public",
        desc: "Every advert will state the responsibilities, who you report to and the pay range, up front. A role that cannot be described plainly is not ready to be filled.",
      },
    } as Record<string, { title: string; desc: string }>,

    entryEyebrow: "Open today",
    entryTitle: "Three doors, all of them real.",
    entryIntro:
      "None of these is a waiting list. Each one is a live surface you can walk into this week, and each is how the first team will actually be found.",
    entry: {
      community: {
        title: "The community",
        desc: "An open WhatsApp group of engineers and students — no application, no gatekeeping. Most of what 4TUN Hub becomes will come from the people already in it.",
        cta: "Join on WhatsApp",
      },
      academy: {
        title: "The Academy",
        desc: "Train with us. The workshops are how most people meet this ecosystem, and the ones who go deepest are the ones who get the first call when a role does open.",
        cta: "See the training",
      },
      collaborate: {
        title: "A brief of your own",
        desc: "A project, a paper or a piece of teaching you want to build together — bring it. Collaboration is how a first team gets found, not a CV inbox.",
        cta: "Start a conversation",
      },
    } as Record<string, { title: string; desc: string; cta: string }>,
    live: "Open now",

    cta: {
      title: "Want to know when the first role opens?",
      subtitle:
        "Tell us what you do and what you want to build. When there is finally a job to post, the people who wrote first are the people we write to.",
      primary: "Get in touch",
      secondary: "See the work",
    },
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
