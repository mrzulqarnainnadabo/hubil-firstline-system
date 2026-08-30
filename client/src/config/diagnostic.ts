/**
 * FirstLine Diagnostic — Dual-track prospect model
 * --------------------------------------------------------------------------
 * One public diagnostic for institutions and serious brands.
 * Maps to Hubil Clients Notion database.
 * Database: https://www.notion.so/86a2b54bbdf247b2831923cb6590aa82
 */

export const DIAGNOSTIC_SOURCE = "FirstLine Diagnostic";

export type DiagnosticResponse = {
  orgType: string;
  statedOutcome: string;
  dominantGap: string;
  scale: string;
  horizon: string;
  role: string;
  fullName: string;
  contact: string;
  orgName: string;
  heardAbout: string;
  source: typeof DIAGNOSTIC_SOURCE;
  submittedAt?: string;
};

export const emptyDiagnosticResponse: DiagnosticResponse = {
  orgType: "",
  statedOutcome: "",
  dominantGap: "",
  scale: "",
  horizon: "",
  role: "",
  fullName: "",
  contact: "",
  orgName: "",
  heardAbout: "",
  source: DIAGNOSTIC_SOURCE,
};

export const diagnosticQuestions = {
  orgType: {
    record: "01",
    eyebrow: "What you are building",
    title: "What are you building or running?",
    helper:
      "Choose the closest fit. This helps us match the right tone and track — nothing is ranked higher than anything else.",
    options: [
      "A government or public institution",
      "A company or organisation with a team",
      "A brand or business I’m growing",
      "A community, youth, or civic programme",
      "Something else",
    ],
  },
  dominantGap: {
    record: "02",
    eyebrow: "Where it feels hardest",
    title: "Where does the work feel hardest right now?",
    helper:
      "Pick the primary friction. You can clarify later — this is not a test.",
    options: [
      "Being seen, trusted, or taken seriously",
      "Getting work finished on time and to standard",
      "Keeping people, information, and decisions organised",
      "Using data, digital tools, or AI properly",
      "Reaching the right partners, institutions, or decision-makers",
      "Coordinating across teams, departments, or partners",
      "Something else",
    ],
  },
  scale: {
    record: "03",
    eyebrow: "Scale of the effort",
    title: "How big is the effort roughly?",
    helper: "A light signal so we do not over- or under-recommend.",
    options: [
      "Just me or a very small team",
      "A structured team or department",
      "A multi-unit organisation or programme",
      "Still figuring out the shape",
    ],
  },
  horizon: {
    record: "04",
    eyebrow: "Timing",
    title: "When do you need real progress?",
    helper: "There is no wrong answer. It shapes urgency, not priority of care.",
    options: [
      "In the next few months",
      "This year",
      "Over the next 2–3 years",
    ],
  },
  role: {
    record: "05",
    eyebrow: "Your role",
    title: "What is your role?",
    helper: "So we know how to speak with you.",
    options: [
      "I make the final decisions",
      "I strongly influence the decisions",
      "I help carry out the work",
      "I’m exploring for someone else",
    ],
  },
} as const;

/** Recommended track from dominant gap */
export const GAP_TO_TRACK: Record<string, string> = {
  "Being seen, trusted, or taken seriously": "Brand & reputation system",
  "Getting work finished on time and to standard": "Delivery & operating system",
  "Keeping people, information, and decisions organised":
    "Simple operating system",
  "Using data, digital tools, or AI properly": "Practical AI & digital setup",
  "Reaching the right partners, institutions, or decision-makers":
    "Access & partnership track",
  "Coordinating across teams, departments, or partners":
    "Coordination & institutional systems",
  "Something else": "Short strategy check first",
};

export const HUBIL_CLIENTS_DATABASE_ID =
  "86a2b54b-bdf2-47b2-8319-23cb6590aa82";
