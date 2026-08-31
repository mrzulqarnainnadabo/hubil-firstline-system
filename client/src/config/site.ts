/**
 * Hubil FirstLine — positioning & contact
 * --------------------------------------------------------------------------
 * Dual-track diagnostic front door: institutions and serious brands.
 * Outcomes only. No prices on this surface.
 */

export const SITE = {
  companyName: "Hubil Group",
  systemName: "FirstLine",
  systemDescriptor: "Institutional & Brand Systems Diagnostic",
  managingDirector: "Ambassador Zulqarnain Yusuf Nadabo",
  taglineBrand: "Strategy. Structure. Growth.",

  eyebrow: "For institutions and serious brands that need clarity before action",
  headline: "See the friction clearly. Then install the right system.",
  tagline:
    "FirstLine is a short diagnostic that maps where work is hardest — visibility, delivery, coordination, digital tools, or access — and points to the practical next step. We continue the conversation with context already in hand.",
  availabilityNote:
    "Diagnostic first · Human review · Discovery only when there is fit",

  corePromise:
    "We build systems and create value — we do not just give advice. The same discipline used for institutional and civic operating systems is applied to your organisation or brand.",

  whoThisIsFor:
    "Government and public institutions, structured companies, development programmes, serious brands, and growing businesses that need operating clarity — not another slide deck.",

  valuePillars: [
    {
      title: "Clear diagnosis first",
      copy: "Short, plain-English questions. No judgment. A usable internal brief for Hubil so the first human reply is already informed.",
    },
    {
      title: "Systems, not noise",
      copy: "Brand & reputation, delivery, operating systems, practical AI, access & partnerships, community systems — matched to the dominant gap.",
    },
    {
      title: "Speed of thoughtful response",
      copy: "Your answers create a structured record. A specialist reviews and continues with you — high-status, no auto-pitch, no invented prices.",
    },
  ] as const,

  systems: [
    {
      code: "01",
      name: "Brand & reputation",
      bestFor: "When being seen, trusted, or taken seriously is the friction.",
      solves: "Weak presence, unclear positioning, institutional credibility gaps.",
      includes: [
        "Positioning and narrative structure",
        "Reputation and proof assets",
        "Public-facing systems that match the real work",
      ],
    },
    {
      code: "02",
      name: "Delivery & operating system",
      bestFor: "When work does not finish on time or to standard.",
      solves: "Missed deadlines, unclear ownership, weak handover.",
      includes: [
        "Delivery rhythm and accountability",
        "Task and project structure",
        "Simple operating cadence",
      ],
    },
    {
      code: "03",
      name: "Coordination & institutional systems",
      bestFor: "When teams, departments, or partners do not align.",
      solves: "Fragmented information, approval bottlenecks, weak cross-unit flow.",
      includes: [
        "Information and decision architecture",
        "Cross-team operating design",
        "Reporting and signal systems",
      ],
    },
    {
      code: "04",
      name: "Practical AI & digital",
      bestFor: "When data, tools, or AI are underused or chaotic.",
      solves: "Scattered tools, no digital backbone, missed leverage from AI.",
      includes: [
        "Practical digital setup",
        "Light AI workflows that stick",
        "Data and information hygiene",
      ],
    },
    {
      code: "05",
      name: "Access & partnerships",
      bestFor: "When the right institutions or partners are hard to reach.",
      solves: "Closed doors, weak institutional relations, unclear approach.",
      includes: [
        "Access track design",
        "Partnership readiness",
        "Institutional relationship systems",
      ],
    },
    {
      code: "06",
      name: "Community systems",
      bestFor: "Youth, civic, and community programmes that need real structure.",
      solves: "Ad-hoc programmes, weak signal, no durable operating layer.",
      includes: [
        "Community and youth operating systems",
        "Civic signal and capacity design",
        "Programme delivery structure",
      ],
    },
  ] as const,

  howWeWork: [
    "Short diagnostic — honest answers, under a few minutes.",
    "Internal brief generated and reviewed by Hubil.",
    "Human first message — high-status, no prices, no guarantees.",
    "Discovery only when there is clear fit.",
    "Systems installed and handed over with discipline.",
  ] as const,

  whyHubil:
    "Hubil Group designs real operating systems — strategy, structure, growth. Proof includes institutional and civic systems work (ISEYC-related Digital Operations Centre, Civic Signal, programme architecture). We install what lasts.",

  primaryWhatsApp: "2348036984766",
  primaryWhatsAppDisplay: "+234 803 698 4766",
  primaryWhatsAppUrl: "https://wa.me/2348036984766",
  secondaryPhoneDisplay: "+234 814 209 1143",
  email: "mrzulqarnainnadabo@gmail.com",

  systemsDashboardUrl: "https://www.notion.so/3c25db88ef4681758f60eb443e969f9b",

  privacyNote:
    "Your answers go only to Hubil Group. We do not sell or share your data. A specialist reviews the record and continues with you only if there is a fit.",

  images: {
    hubilLogo: "/hubil-logo.png",
    foundationMark: "/hubil-logo.png",
    // No external hero/service images — keep the surface clean and self-contained
    hero: "",
    about: "",
    serviceDetail: "",
  },
} as const;

export const PRIMARY_WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Hubil Group — I completed the FirstLine diagnostic. I would like a short discovery about the right next system for what we are building.",
);

export function buildWhatsAppContinueUrl(payload: {
  fullName: string;
  orgName: string;
  orgType: string;
  dominantGap: string;
  horizon: string;
  role: string;
  contact: string;
}): string {
  const lines = [
    "Hello Hubil Group — I completed the FirstLine diagnostic.",
    "",
    `Name: ${payload.fullName}`,
    `Organisation / brand: ${payload.orgName || "—"}`,
    `Type: ${payload.orgType}`,
    `Where it feels hardest: ${payload.dominantGap}`,
    `Horizon: ${payload.horizon}`,
    `Role: ${payload.role}`,
    `Contact: ${payload.contact}`,
    "",
    "Please review and tell me the practical next step.",
  ];
  return `https://wa.me/${SITE.primaryWhatsApp}?text=${encodeURIComponent(lines.join("\n"))}`;
}
