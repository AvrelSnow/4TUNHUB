/**
 * Site-wide constants — identity, canonical URL, and the facts
 * search engines are told about the organization (JSON-LD).
 */

export const SITE_URL = "https://4tunhub.com";

export const SITE_NAME = "4TUN Hub";

/** Where the forms deliver and visitors write. Move to hello@4tunhub.com once forwarding is set up. */
export const CONTACT_EMAIL = "4tunhub@gmail.com";
export const SITE_LOCATION = "Dschang, Cameroon";

/** The live 4TUN Hub community — an open WhatsApp group. */
export const WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/IGhDw4IiqJ0LfM4v8hNXpg?mode=gi_t";

/** Founder LinkedIn — the org's direct professional channel for now. */
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/donfack-fortune-476904231";

/** The REM — Renewable Energy Mall & Engineering Review. Episodes are
 * published on Medium; the newsletter itself runs on LinkedIn. */
export const MEDIUM_URL = "https://donfackfortune.medium.com";

/** The channel: LS-DYNA and CAE tutorials. Following it is a condition of a Cohort 0 seat. */
export const YOUTUBE_URL = "https://www.youtube.com/@4TUNHUB";

/** Public CAD models & assemblies from real projects. */
export const GRABCAD_URL = "https://grabcad.com/donfack.fortune-1";

export const SITE_DESCRIPTION =
  "4TUNHub is an engineering ecosystem in Cameroon — mechanical design, FEA simulation, renewable-energy consulting, technical training, and engineering research, founded by Donfack Fortune.";

export const SITE_KEYWORDS = [
  "mechanical engineering Cameroon,Africa and abroad",
  "engineering services Cameroon,Africa and abroad",
  "SolidWorks training Cameroon,Africa and abroad",
  "FEA simulation consultant",
  "renewable energy Cameroon,Africa and abroad",
  "engineering education Cameroon,Africa and abroad",
  "CAD design services",
  "4TUNHub",
  "Donfack Fortune",
];

/** Organization + WebSite schema graph — rendered as JSON-LD in the root layout. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    organizationNode(),
  ],
};

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/4tunhub-logo.svg`,
    description: SITE_DESCRIPTION,
    email: CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dschang",
      addressCountry: "CM",
    },
    founder: {
      "@type": "Person",
      name: "Donfack Fortune",
      jobTitle: "Mechanical Engineer · Energy Specialist · Technical Educator",
      description:
        "Former senior engineer at CAMRAIL, lecturer at Institut Universitaire de la cote, renewable-energy analyst, and founder of 4TUNHub.",
    },
    knowsAbout: [
      "Mechanical Engineering",
      "Finite Element Analysis",
      "SolidWorks,Ansys,Autocad,Matlab",
      "Renewable Energy Systems",
      "Railway Engineering",
      "Engineering Education",
    ],
  };
}
