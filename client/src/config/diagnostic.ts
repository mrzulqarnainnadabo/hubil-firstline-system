/**
 * FirstLine Business Presence Diagnostic — Prospect Data Model
 * --------------------------------------------------------------------------
 * FUTURE NOTION INTEGRATION: Keep these keys stable. They map directly to
 * the recommended Hubil Clients database properties below.
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
    helper: "Choose the category that is closest to the business you are building today.",
    options: ["Fashion", "Services", "Food & Hospitality", "Trade & Retail", "Other"],
  },
  discoveryChannel: {
    record: "02",
    eyebrow: "Customer access",
    title: "How do most customers find you and place orders?",
    helper: "This helps us understand the current route between interest and action.",
    options: ["WhatsApp only", "Instagram", "Physical location", "Website", "Combination"],
  },
  customerFrustration: {
    record: "03",
    eyebrow: "Operational pressure",
    title: "What is the biggest daily frustration when dealing with customers?",
    helper: "Select the issue that most affects confidence, speed, or customer experience.",
    options: ["Lost messages", "Looking unprofessional", "No follow-up system", "Hard for customers to find me", "Other"],
  },
  readinessWindow: {
    record: "04",
    eyebrow: "Readiness signal",
    title: "How ready are you to install a proper business presence system in the next 14–30 days?",
    helper: "There is no wrong answer. It helps us recommend the right next step, if there is one.",
    options: ["Ready now", "Exploring", "Just researching"],
  },
} as const;

/**
 * FUTURE NOTION INTEGRATION: Suggested property names and types for the
 * Hubil Clients database. A backend route can forward DiagnosticResponse
 * fields to Notion using this mapping, without changing the form interface.
 */
export const NOTION_PROPERTY_MAP = {
  fullName: { property: "Contact Name", type: "title" },
  businessName: { property: "Business Name", type: "rich_text" },
  whatsappNumber: { property: "WhatsApp Number", type: "phone_number" },
  businessType: { property: "Business Type", type: "select" },
  discoveryChannel: { property: "Customer Access", type: "select" },
  customerFrustration: { property: "Primary Frustration", type: "select" },
  readinessWindow: { property: "Readiness Window", type: "select" },
  source: { property: "Lead Source", type: "select" },
  submittedAt: { property: "Diagnostic Submitted", type: "date" },
} as const;
