/**
 * Hubil FirstLine — Client Customization Console
 * --------------------------------------------------------------------------
 * FirstLine is the diagnostic front door into Hubil Small Business Operating Systems.
 * Packages (Foundation → Growth → Operating System) are described by outcomes only — no prices on this surface.
 */

export const SITE = {
  companyName: "Hubil Group",
  systemName: "FirstLine",
  systemDescriptor: "Small Business Operating Systems Diagnostic",
  managingDirector: "Ambassador Zulqarnain Yusuf Nadabo",

  eyebrow: "For Nigerian brands tired of leaking customers and looking smaller than they are",
  headline: "Install the systems serious businesses use — starting with an honest diagnosis.",
  tagline:
    "FirstLine finds where you are invisible, where messages are lost, and where money leaks. Then we continue on WhatsApp and map the right operating system for your brand.",
  availabilityNote:
    "Diagnostic first · Discovery on WhatsApp · Systems installed after fit is clear",

  corePromise:
    "We do not sell random digital services. We install the essential systems a small brand needs so customers can find you, buy from you, and come back — while you stay in control.",

  whoThisIsFor:
    "Small and growing Nigerian brands, traders, service providers, and founders running on scattered WhatsApp chats, lost customer details, and a presence that understates the real business.",

  valuePillars: [
    {
      title: "Look professional and be findable",
      copy: "Documentation, Google Business Profile, a clean mobile front door, and WhatsApp that actually converts interest into contact.",
    },
    {
      title: "Capture every customer",
      copy: "Stop losing people in chats. Log inquiries, automate first response, and keep a simple record of who bought and who needs follow-up.",
    },
    {
      title: "Stop leaking money",
      copy: "Turn daily chaos into a lightweight operating system — website, database, automations, and handover so you are not abandoned after delivery.",
    },
  ] as const,

  /** Outcomes only — mirrors the service menu without prices. */
  systems: [
    {
      code: "01",
      name: "Foundation",
      bestFor: "New or early brands that need to look real and be findable.",
      solves:
        "Looking unserious, being invisible on Google, having no professional front door.",
      includes: [
        "Business documentation pack (profile, offer sheet, simple terms)",
        "Google Business Profile setup and optimization",
        "Clean, mobile-first website",
        "WhatsApp click-to-chat + basic auto-greeting",
        "Google Maps visibility and basic NAP consistency",
        "Handover training",
      ],
    },
    {
      code: "02",
      name: "Growth",
      bestFor: "Brands already selling but drowning in WhatsApp and losing customers.",
      solves:
        "Lost messages, forgotten customers, no follow-up system, running the business from memory.",
      includes: [
        "Everything in Foundation",
        "Simple customer and order database",
        "Professional chatbot / auto-responder for FAQs",
        "Basic automation: inquiry → notify you + log in database",
        "Simple admin view for leads and orders",
        "Notion workspace starter for assets and SOPs",
        "Handover + light support window",
      ],
    },
    {
      code: "03",
      name: "Operating System",
      bestFor: "Serious small brands ready to professionalize and prepare for scale.",
      solves: "The entire daily chaos of running a small brand without systems.",
      includes: [
        "Everything in Growth",
        "Full mini operating system (website + database + chatbot + automations)",
        "Custom workflow for your sales process",
        "Lightweight internal dashboard",
        "Document and knowledge system structure",
        "Team access setup if you have help",
        "Extended support + optimization review",
      ],
    },
  ] as const,

  howWeWork: [
    "Short discovery (15–20 minutes) — how you sell today and where the leaks are.",
    "Clear proposal with exact deliverables and timeline.",
    "Build and configure using modern, reliable tools.",
    "Handover training so you or your assistant can run the system.",
    "Light support window so you are not abandoned after delivery.",
  ] as const,

  whyHubil:
    "Hubil Group is led by an institutional architect who designs real operating systems — not just websites. The same discipline used for multi-tier governance and community systems is applied to your small business. Structure that lasts, not temporary fixes.",

  primaryWhatsApp: "2348036984766",
  primaryWhatsAppDisplay: "+234 803 698 4766",
  primaryWhatsAppUrl: "https://wa.me/2348036984766",
  secondaryPhoneDisplay: "+234 814 209 1143",
  email: "mrzulqarnainnadabo@gmail.com",

  systemsDashboardUrl: "https://www.notion.so/3c25db88ef4681758f60eb443e969f9b",

  privacyNote:
    "Your answers go only to Hubil Group. We do not sell or share your data. A specialist reviews the record and continues with you on WhatsApp if there is a fit.",

  images: {
    hubilLogo: "/hubil-logo.svg",
    foundationMark: "/hubil-logo.svg",
    hero: "/manus-storage/hubil-hero-marketplace_55e4d25d.jpg",
    about: "/manus-storage/hubil-about-craft_9ceaad21.jpg",
    serviceDetail: "/manus-storage/hubil-service-detail_f45ba0e4.jpg",
  },
} as const;

export const PRIMARY_WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Hubil Group — I completed the FirstLine diagnostic. I want a short discovery about which operating system fits my business (Foundation, Growth, or full Operating System).",
);

export function buildWhatsAppContinueUrl(payload: {
  fullName: string;
  businessName: string;
  businessType: string;
  discoveryChannel: string;
  customerFrustration: string;
  readinessWindow: string;
  whatsappNumber: string;
}): string {
  const lines = [
    "Hello Hubil Group — I completed the FirstLine Small Business Operating Systems Diagnostic.",
    "",
    `Name: ${payload.fullName}`,
    `Business: ${payload.businessName}`,
    `Type: ${payload.businessType}`,
    `How customers find me: ${payload.discoveryChannel}`,
    `Biggest leak / friction: ${payload.customerFrustration}`,
    `Readiness: ${payload.readinessWindow}`,
    `My WhatsApp: ${payload.whatsappNumber}`,
    "",
    "Please review and tell me honestly which system fits — Foundation, Growth, or Operating System — and what we should do next.",
  ];
  return `https://wa.me/${SITE.primaryWhatsApp}?text=${encodeURIComponent(lines.join("\n"))}`;
}
