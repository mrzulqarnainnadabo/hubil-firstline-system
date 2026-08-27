/**
 * Hubil FirstLine — Client Customization Console
 * --------------------------------------------------------------------------
 * FUTURE CLIENT SETUP: This is the main file to edit when adapting the system.
 * Change the values below before launch; the page updates automatically.
 */

export const SITE = {
  // CUSTOMIZE: Business identity
  companyName: "Hubil Group",
  systemName: "FirstLine",
  systemDescriptor: "Business Presence & Client Growth Diagnostic",
  managingDirector: "Ambassador Zulqarnain Yusuf Nadabo",

  // CUSTOMIZE: Business messaging — framed as a financial / growth problem-solver
  eyebrow: "Built for Nigerian business owners who want more serious clients",
  headline: "Stop losing customers. Start looking ready for the ones who pay.",
  tagline:
    "FirstLine helps you diagnose where money and clients are leaking — weak presence, missed messages, and no clear path from interest to payment — then continues the conversation with you on WhatsApp.",
  availabilityNote:
    "Assessment first · WhatsApp follow-up is how we work with you",

  // Value pillars (used on the landing page)
  valuePillars: [
    {
      title: "Protect the money already coming in",
      copy: "Missed chats, unclear offers, and a weak first impression cost real revenue every week.",
    },
    {
      title: "Become easier to find and trust",
      copy: "Search, Instagram, TikTok, Facebook, and X only convert when your business looks established and reachable.",
    },
    {
      title: "Continue on WhatsApp, not another form",
      copy: "After the diagnostic, Hubil picks up the conversation on WhatsApp with your answers already in hand.",
    },
  ] as const,

  // CUSTOMIZE: Primary contact routes — use country code without + or spaces for WhatsApp.
  primaryWhatsApp: "2348036984766",
  primaryWhatsAppDisplay: "+234 803 698 4766",
  primaryWhatsAppUrl: "https://wa.me/2348036984766",
  secondaryPhoneDisplay: "+234 814 209 1143",
  email: "mrzulqarnainnadabo@gmail.com",

  // CUSTOMIZE: Keep this line when deploying Hubil-built client sites.
  systemsDashboardUrl: "https://www.notion.so/3c25db88ef4681758f60eb443e969f9b",

  // Privacy / trust line shown near the form
  privacyNote:
    "Your answers go only to Hubil Group. We do not sell or share your data. A specialist reviews the record and continues with you on WhatsApp if there is a fit.",

  // CUSTOMIZE: Replace all image paths together if a client has their own visual library.
  images: {
    hubilLogo: "/hubil-logo.jpg",
    foundationMark: "/hubil-logo.jpg",
    hero: "/manus-storage/hubil-hero-marketplace_55e4d25d.jpg",
    about: "/manus-storage/hubil-about-craft_9ceaad21.jpg",
    serviceDetail: "/manus-storage/hubil-service-detail_f45ba0e4.jpg",
  },
} as const;

/** Default WhatsApp opener when no diagnostic context is available. */
export const PRIMARY_WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Hubil Group — I just completed the FirstLine diagnostic and I want to continue from here. I need help looking more established and bringing in better clients.",
);

/** Build a WhatsApp deep-link that carries the owner's diagnostic context. */
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
    "Hello Hubil Group — I just completed the FirstLine Business Presence Diagnostic.",
    "",
    `Name: ${payload.fullName}`,
    `Business: ${payload.businessName}`,
    `Type: ${payload.businessType}`,
    `How customers find me: ${payload.discoveryChannel}`,
    `Biggest friction: ${payload.customerFrustration}`,
    `Readiness: ${payload.readinessWindow}`,
    `My WhatsApp: ${payload.whatsappNumber}`,
    "",
    "I want to continue here and talk about how to stop losing customers and attract better ones.",
  ];
  return `https://wa.me/${SITE.primaryWhatsApp}?text=${encodeURIComponent(lines.join("\n"))}`;
}
