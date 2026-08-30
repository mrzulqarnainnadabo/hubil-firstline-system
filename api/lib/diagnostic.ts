/**
 * Dual-track diagnostic schema + Notion + rules-based Brief.
 */
import { z } from "zod";
import { Client } from "@notionhq/client";

export const DiagnosticSchema = z.object({
  orgType: z.string().min(1),
  statedOutcome: z.string().min(1).max(800),
  dominantGap: z.string().min(1),
  scale: z.string().min(1),
  horizon: z.string().min(1),
  role: z.string().min(1),
  fullName: z.string().min(1).max(120),
  contact: z.string().min(5).max(120),
  orgName: z.string().max(200).optional().default(""),
  heardAbout: z.string().max(200).optional().default(""),
  source: z.string().default("FirstLine Diagnostic"),
  submittedAt: z.string().datetime().optional(),
});

export type DiagnosticRecord = z.infer<typeof DiagnosticSchema> & {
  submittedAt: string;
  receivedAt: string;
};

const GAP_TO_TRACK: Record<string, string> = {
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

/** Map form answers → Notion select option names (exact match required). */
const ORG_TYPE_TO_NOTION: Record<string, string> = {
  "A government or public institution": "Government / public institution",
  "A company or organisation with a team": "Company / organisation",
  "A brand or business I'm growing": "Brand / business",
  "A community, youth, or civic programme": "Community / civic programme",
  "Something else": "Other",
};

const GAP_TO_NOTION: Record<string, string> = {
  "Being seen, trusted, or taken seriously": "Being seen or trusted",
  "Getting work finished on time and to standard": "Delivery on time / standard",
  "Keeping people, information, and decisions organised":
    "People / info / decisions organised",
  "Using data, digital tools, or AI properly": "Data / digital / AI",
  "Reaching the right partners, institutions, or decision-makers":
    "Access to partners / institutions",
  "Coordinating across teams, departments, or partners":
    "Coordination across units",
  "Something else": "Other",
};

const HORIZON_TO_NOTION: Record<string, string> = {
  "In the next few months": "Next few months",
  "This year": "This year",
  "Over the next 2–3 years": "2–3 years",
};

const ROLE_TO_NOTION: Record<string, string> = {
  "I make the final decisions": "Final decisions",
  "I strongly influence the decisions": "Strongly influences",
  "I help carry out the work": "Carries out the work",
  "I'm exploring for someone else": "Exploring for someone else",
};

const READINESS_FROM_HORIZON: Record<string, string> = {
  "In the next few months": "Ready now",
  "This year": "Exploring",
  "Over the next 2–3 years": "Just researching",
};

export function generateBrief(record: DiagnosticRecord): {
  track: string;
  briefText: string;
  firstMove: string;
  draftMessage: string;
  priority: "High" | "Medium" | "Watch";
} {
  const track = GAP_TO_TRACK[record.dominantGap] ?? "Short strategy check first";
  const institutional =
    /government|public institution|organisation|community|civic/i.test(
      record.orgType,
    );
  const decisionMaker = /final decisions|strongly influence/i.test(record.role);
  const urgent = /few months/i.test(record.horizon);

  let priority: "High" | "Medium" | "Watch" = "Medium";
  if (decisionMaker && (urgent || institutional)) priority = "High";
  else if (/exploring/i.test(record.role)) priority = "Watch";

  let firstMove = "Short discovery to lock primary gap and first install.";
  if (track === "Short strategy check first")
    firstMove =
      "15-min discovery to clarify dominant gap and 12-month outcome.";
  else if (track.includes("Brand"))
    firstMove =
      "Request current public materials; schedule short positioning check.";
  else if (track.includes("Delivery") || track.includes("Simple operating"))
    firstMove =
      "Ask for delivery rhythm or organogram; propose lightweight operating map.";
  else if (track.includes("AI") || track.includes("digital"))
    firstMove =
      "Ask which tools and data are in use; propose practical digital/AI first step.";
  else if (track.includes("Access"))
    firstMove = "Clarify target institutions/partners; map access track.";
  else if (track.includes("Coordination"))
    firstMove =
      "Request picture of units and decision flow; design coordination layer.";
  else if (track.includes("Community"))
    firstMove = "Clarify programme scope; map community systems track.";
  if (urgent) firstMove += " Prioritise response within 1 business day.";

  const name = record.fullName.split(" ")[0] || record.fullName;
  const outcome = record.statedOutcome.slice(0, 200);
  const ell = record.statedOutcome.length > 200 ? "…" : "";
  const draftMessage = institutional
    ? `Dear ${name},\n\nThank you for completing the FirstLine diagnostic. We have reviewed your answers.\n\nYou described the main focus for the next 12 months as: "${outcome}${ell}"\n\nThe primary friction appears to sit around: ${record.dominantGap.toLowerCase()}.\n\nIf useful, we can hold a short discovery call to map a practical next system — without obligation. Reply here or on WhatsApp when you are ready.\n\nRegards,\nHubil Group\nAmbassador Zulqarnain Yusuf Nadabo`
    : `Hello ${name},\n\nThank you for completing the FirstLine diagnostic. Your answers are with us.\n\nMain 12-month aim: "${outcome}${ell}"\n\nWhere it feels hardest: ${record.dominantGap.toLowerCase()}.\n\nWe can do a short discovery to clarify the right next step — no pitch, no prices until fit is clear. Reply when you are ready.\n\nHubil Group`;

  const briefText = [
    "=== FIRSTLINE AI DIAGNOSTIC BRIEF (draft-only) ===",
    "",
    "1. PROFILE",
    `   Org type: ${record.orgType}`,
    `   Scale: ${record.scale}`,
    `   Role: ${record.role}`,
    `   Horizon: ${record.horizon}`,
    `   Contact: ${record.fullName} · ${record.contact}`,
    `   Org / brand: ${record.orgName || "—"}`,
    `   Heard about: ${record.heardAbout || "—"}`,
    `   Priority: ${priority}`,
    "",
    "2. STATED OUTCOME",
    `   "${record.statedOutcome}"`,
    "",
    "3. DOMINANT GAP",
    `   ${record.dominantGap}`,
    "",
    "4. RECOMMENDED TRACK",
    `   ${track}`,
    "",
    "5. FIRST MOVE (internal)",
    `   ${firstMove}`,
    "",
    "6. DRAFT FIRST MESSAGE (approve before send)",
    "---",
    draftMessage,
    "---",
    "",
    "Rules: No prices. No guarantees. Human approves first outbound.",
    `Generated at: ${record.submittedAt}`,
  ].join("\n");

  return { track, briefText, firstMove, draftMessage, priority };
}

function rt(content: string) {
  return { rich_text: [{ text: { content: content.slice(0, 1900) } }] };
}

function sel(name: string) {
  return { select: { name } };
}

export async function createNotionClientPage(
  record: DiagnosticRecord,
): Promise<{ pageId: string; url: string } | null> {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!apiKey || !databaseId) return null;

  const notion = new Client({ auth: apiKey });
  const { track, briefText, priority } = generateBrief(record);
  const titleName =
    record.orgName?.trim() ||
    `${record.fullName} — ${record.orgType.slice(0, 40)}`;
  const contact = record.contact.trim();
  const looksLikePhone = /^[\d+\s\-()]{7,}$/.test(contact.replace(/\s/g, ""));

  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: titleName.slice(0, 100) } }] },
    "Contact Person": rt(record.fullName),
    "Diagnostic Source": sel("FirstLine Diagnostic"),
    Status: sel("Lead"),
    Source: sel("Direct"),
    Package: sel("Not Yet Decided"),
    "Raw Diagnostic Notes": rt(briefText),
    "Stated Outcome": rt(record.statedOutcome),
    Priority: sel(priority),
    "Recommended Track": sel(track),
  };

  const orgNotion = ORG_TYPE_TO_NOTION[record.orgType];
  if (orgNotion) properties["Org Type"] = sel(orgNotion);

  const gapNotion = GAP_TO_NOTION[record.dominantGap];
  if (gapNotion) properties["Dominant Gap"] = sel(gapNotion);

  const horizonNotion = HORIZON_TO_NOTION[record.horizon];
  if (horizonNotion) properties.Horizon = sel(horizonNotion);

  const roleNotion = ROLE_TO_NOTION[record.role];
  if (roleNotion) properties.Role = sel(roleNotion);

  const readiness = READINESS_FROM_HORIZON[record.horizon];
  if (readiness) properties.Readiness = sel(readiness);

  if (record.heardAbout?.trim()) {
    properties["Heard About"] = rt(record.heardAbout);
  }

  if (looksLikePhone) {
    properties.Phone = { phone_number: contact };
    properties.WhatsApp = rt(contact);
  } else if (contact.includes("@")) {
    properties.Email = { email: contact };
    properties.WhatsApp = rt(contact);
  } else {
    properties.WhatsApp = rt(contact);
  }

  // Legacy Business Type: soft map so old views still have a value
  const legacyType: Record<string, string> = {
    "A government or public institution": "Other",
    "A company or organisation with a team": "Services",
    "A brand or business I'm growing": "Other",
    "A community, youth, or civic programme": "Other",
    "Something else": "Other",
  };
  properties["Business Type"] = sel(legacyType[record.orgType] ?? "Other");

  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: properties as Parameters<
      typeof notion.pages.create
    >[0]["properties"],
  });

  const pageId = response.id;
  const url =
    "url" in response && typeof response.url === "string"
      ? response.url
      : `https://www.notion.so/${pageId.replace(/-/g, "")}`;

  console.log(
    JSON.stringify({
      event: "firstline.brief.generated",
      track,
      priority,
      orgType: record.orgType,
      pageId,
    }),
  );

  return { pageId, url };
}
