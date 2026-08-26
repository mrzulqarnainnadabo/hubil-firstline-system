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
    title: "What best describes your business right now?",
    helper:
      "Choose the category that is closest to the business you are building today.",
    options: [
      "Fashion",
      "Services",
      "Food & Hospitality",
      "Trade & Retail",
      "Other",
    ],
  },
  discoveryChannel: {
    record: "02",
    eyebrow: "Customer access",
    title: "How do most customers find you and place orders?",
    helper:
      "This helps us understand the current route between interest and action.",
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
    eyebrow: "Operational pressure",
    title:
      "What is the biggest daily frustration when dealing with customers?",
    helper:
      "Select the issue that most affects confidence, speed, or customer experience.",
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
    eyebrow: "Readiness signal",
    title:
      "How ready are you to install a proper business presence system in the next 14–30 days?",
    helper:
      "There is no wrong answer. It helps us recommend the right next step, if there is one.",
    options: ["Ready now", "Exploring", "Just researching"],
  },
} as const;

/**
 * Live Hubil Clients property map (database 86a2b54b-bdf2-47b2-8319-23cb6590aa82).
 * Server normalizes select values (e.g. "Food & Hospitality" → "Food").
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

/** Hubil Clients database ID — set as NOTION_DATABASE_ID in production. */
export const HUBIL_CLIENTS_DATABASE_ID =
  "86a2b54b-bdf2-47b2-8319-23cb6590aa82";
