/**
 * Hubil FirstLine — positioning & contact
 * Dual-track: institutions and serious brands. Outcomes only. No prices.
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
    "A short diagnostic that maps where work is hardest — and points to the practical next step.",
  availabilityNote:
    "Diagnostic first · Human review · Discovery only when there is fit",

  corePromise:
    "We build systems and create value — we do not just give advice.",

  whoThisIsFor:
    "Institutions, structured companies, programmes, and serious brands that need operating clarity — not another slide deck.",

  valuePillars: [
    {
      title: "Clear diagnosis",
      copy: "Short questions. A usable brief so the first human reply is informed.",
    },
    {
      title: "Systems, not noise",
      copy: "Matched to the dominant gap — brand, delivery, coordination, digital, or access.",
    },
    {
      title: "Thoughtful speed",
      copy: "Structured record. Specialist review. No auto-pitch. No invented prices.",
    },
  ] as const,

  systems: [
    {
      code: "01",
      name: "Brand & reputation",
      bestFor: "When being seen or trusted is the friction.",
      solves: "Weak presence, unclear positioning, credibility gaps.",
      includes: [
        "Positioning and narrative",
        "Reputation and proof assets",
        "Public systems that match the real work",
      ],
    },
    {
      code: "02",
      name: "Delivery & operating system",
      bestFor: "When work does not finish on time or to standard.",
      solves: "Missed deadlines, unclear ownership, weak handover.",
      includes: [
        "Delivery rhythm",
        "Task and project structure",
        "Simple operating cadence",
      ],
    },
    {
      code: "03",
      name: "Coordination & institutional systems",
      bestFor: "When teams or partners do not align.",
      solves: "Fragmented information, approval bottlenecks.",
      includes: [
        "Decision architecture",
        "Cross-team operating design",
        "Reporting and signal systems",
      ],
    },
    {
      code: "04",
      name: "Practical AI & digital",
      bestFor: "When tools or AI are underused or chaotic.",
      solves: "Scattered tools, no digital backbone.",
      includes: [
        "Practical digital setup",
        "Light AI workflows",
        "Information hygiene",
      ],
    },
    {
      code: "05",
      name: "Access & partnerships",
      bestFor: "When the right institutions are hard to reach.",
      solves: "Closed doors, weak institutional relations.",
      includes: [
        "Access track design",
        "Partnership readiness",
        "Relationship systems",
      ],
    },
    {
      code: "06",
      name: "Community systems",
      bestFor: "Youth, civic, and community programmes.",
      solves: "Ad-hoc programmes, no durable operating layer.",
      includes: [
        "Community operating systems",
        "Civic signal design",
        "Programme delivery structure",
      ],
    },
  ] as const,

  howWeWork: [
    "Short diagnostic — under a few minutes.",
    "Internal brief reviewed by Hubil.",
    "Human first message — no prices, no guarantees.",
    "Discovery only when there is clear fit.",
    "Systems installed with discipline.",
  ] as const,

  whyHubil:
    "Hubil Group designs real operating systems — strategy, structure, growth. We install what lasts.",

  primaryWhatsApp: "2348036984766",
  primaryWhatsAppDisplay: "+234 803 698 4766",
  primaryWhatsAppUrl: "https://wa.me/2348036984766",
  secondaryPhoneDisplay: "+234 814 209 1143",
  email: "mrzulqarnainnadabo@gmail.com",

  systemsDashboardUrl: "https://www.notion.so/3c25db88ef4681758f60eb443e969f9b",

  privacyNote:
    "Your answers go only to Hubil Group. We do not sell or share your data. A specialist reviews and continues only if there is fit.",

  images: {
    hubilLogo: "/hubil-logo.png",
    foundationMark: "/hubil-logo.png",
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
