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
  systemDescriptor: "Business Presence Diagnostic",
  managingDirector: "Ambassador Zulqarnain Yusuf Nadabo",

  // CUSTOMIZE: Business messaging
  eyebrow: "Built for serious Nigerian brands",
  headline: "Look established. Stay reachable. Keep moving.",
  tagline:
    "A credible, always-on business presence that turns first impressions into real customer conversations.",
  availabilityNote: "Diagnostic-first entry · WhatsApp support remains available",

  // CUSTOMIZE: Primary contact routes — use country code without + or spaces for WhatsApp.
  primaryWhatsApp: "2348036984766",
  primaryWhatsAppDisplay: "+234 803 698 4766",
  primaryWhatsAppUrl: "https://wa.me/2348036984766",
  secondaryPhoneDisplay: "+234 814 209 1143",
  email: "mrzulqarnainnadabo@gmail.com",

  // CUSTOMIZE: Keep this line when deploying Hubil-built client sites.
  systemsDashboardUrl: "https://www.notion.so/3c25db88ef4681758f60eb443e969f9b",

  // CUSTOMIZE: Replace all image paths together if a client has their own visual library.
  images: {
    hubilLogo: "/manus-storage/hubil-group-logo_e17b4241.jpg",
    foundationMark: "/manus-storage/hubil-foundation-symbol_940f00b8.png",
    hero: "/manus-storage/hubil-hero-marketplace_55e4d25d.jpg",
    about: "/manus-storage/hubil-about-craft_9ceaad21.jpg",
    serviceDetail: "/manus-storage/hubil-service-detail_f45ba0e4.jpg",
  },
} as const;

export const PRIMARY_WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Hubil Group, I would like to learn more about the Hubil FirstLine Business Presence System.",
);
