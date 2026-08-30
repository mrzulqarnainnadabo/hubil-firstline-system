/**
 * FirstLine Business Presence Diagnostic — Prospect Data Model
 * --------------------------------------------------------------------------
 * Maps to the live Hubil Clients Notion database.
 * Database: https://www.notion.so/86a2b54bbdf247b2831923cb6590aa82
 */

export const DIAGNOSTIC_SOURCE = "FirstLine Business Presence Diagnostic";

export type DiagnosticResponse = {
  businessType: string;
  discoveryChannel: string;
  customerFrustration: string;
  readinessWindow: string;
  fullName: string;
  businessName: string;
  whatsappNumber: string;
  source: typeof DIAGNOSTIC_SOURCE;
  submittedAt?: string;
};

export const emptyDiagnosticResponse: DiagnosticResponse = {
  businessType: "",
  discoveryChannel: "",
  customerFrustration: "",
  readinessWindow: "",
  fullName: "",
  businessName: "",
  whatsappNumber: "",
  source: DIAGNOSTIC_SOURCE,
};

export const diagnosticQuestions = {
  businessType: {
    record: "01",
    eyebrow: "Business profile",
    title: "What kind of serious business are you building?",
    helper:
      "Choose the closest category. This helps us match the right client channels and operating system for how you actually sell.",
    options: [
      "Professional / service business",
      "Fashion or beauty brand",
      "Food, catering or hospitality",
      "Trade, retail or wholesale",
      "Tech, digital or creative",
      "Other serious small brand",
    ],
  },
  discoveryChannel: {
    record: "02",
    eyebrow: "Where clients find you",
    title: "How do most paying customers currently find you?",
    helper:
      "Think about the path that actually brings money — WhatsApp, Instagram, TikTok, Facebook, Google, walk-ins, or a mix.",
    options: [
      "WhatsApp only",
      "Instagram",
      "Physical location",
      "Website",
      "Combination",
    ],
  },
  customerFrustration: {
    record: "03",
    eyebrow: "Where money leaks",
    title: "What costs you the most customers or revenue right now?",
    helper:
      "Be honest. This is the friction we use to design a practical next step — not a sales pitch.",
    options: [
      "Lost messages",
      "Looking unprofessional",
      "No follow-up system",
      "Hard for customers to find me",
      "Other",
    ],
  },
  readinessWindow: {
    record: "04",
    eyebrow: "Readiness to fix it",
    title:
      "How ready are you to install a clearer presence and client system in the next 14–30 days?",
    helper:
      "There is no wrong answer. It tells us whether to move now or map a lighter first step.",
    options: ["Ready now", "Exploring", "Just researching"],
  },
} as const;

/**
 * Live Hubil Clients property map.
 * Server normalizes select values to Hubil Clients options.
 */
export const NOTION_PROPERTY_MAP = {
  businessName: { property: "Name", type: "title" },
  fullName: { property: "Contact Person", type: "rich_text" },
  whatsappNumber: { property: "Phone", type: "phone_number" },
  whatsappText: { property: "WhatsApp", type: "rich_text" },
  businessType: { property: "Business Type", type: "select" },
  discoveryChannel: { property: "Customer Channels", type: "multi_select" },
  customerFrustration: { property: "Biggest Frustration", type: "select" },
  readinessWindow: { property: "Readiness", type: "select" },
  diagnosticSource: { property: "Diagnostic Source", type: "select" },
  status: { property: "Status", type: "select" },
  rawNotes: { property: "Raw Diagnostic Notes", type: "rich_text" },
} as const;

export const HUBIL_CLIENTS_DATABASE_ID =
  "86a2b54b-bdf2-47b2-8319-23cb6590aa82";
