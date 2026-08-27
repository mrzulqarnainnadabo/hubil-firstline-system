/**
 * Shared diagnostic schema + Notion page creator.
 * Used by both Express (local) and Vercel serverless functions.
 */
import { z } from "zod";
import { Client } from "@notionhq/client";

export const DiagnosticSchema = z.object({
  businessType: z.string().min(1),
  discoveryChannel: z.string().min(1),
  customerFrustration: z.string().min(1),
  readinessWindow: z.string().min(1),
  fullName: z.string().min(1).max(120),
  businessName: z.string().min(1).max(160),
  whatsappNumber: z.string().min(7).max(32),
  source: z.string().default("FirstLine Business Presence Diagnostic"),
  submittedAt: z.string().datetime().optional(),
});

export type DiagnosticRecord = z.infer<typeof DiagnosticSchema> & {
  submittedAt: string;
  receivedAt: string;
};

/** Normalize form values to match Hubil Clients select options. */
export function mapBusinessType(value: string): string {
  const map: Record<string, string> = {
    Fashion: "Fashion",
    Services: "Services",
    "Food & Hospitality": "Food",
    "Trade & Retail": "Trade",
    Other: "Other",
  };
  return map[value] ?? "Other";
}

export function mapCustomerChannel(value: string): string {
  const allowed = [
    "WhatsApp only",
    "Instagram",
    "Physical location",
    "Website",
    "Combination",
    "Other",
  ];
  return allowed.includes(value) ? value : "Other";
}

export function mapFrustration(value: string): string {
  const allowed = [
    "Lost messages",
    "Looking unprofessional",
    "No follow-up system",
    "Hard for customers to find me",
    "Other",
  ];
  return allowed.includes(value) ? value : "Other";
}

export function mapReadiness(value: string): string {
  const allowed = ["Ready now", "Exploring", "Just researching"];
  return allowed.includes(value) ? value : "Exploring";
}

/**
 * Create a page in the Hubil Clients Notion database.
 * Requires NOTION_API_KEY and NOTION_DATABASE_ID.
 */
export async function createNotionClientPage(
  record: DiagnosticRecord,
): Promise<{ pageId: string; url: string } | null> {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    return null;
  }

  const notion = new Client({ auth: apiKey });

  const notes = [
    `Submitted via FirstLine Diagnostic at ${record.submittedAt}`,
    `Business type (raw): ${record.businessType}`,
    `Customer access: ${record.discoveryChannel}`,
    `Frustration: ${record.customerFrustration}`,
    `Readiness: ${record.readinessWindow}`,
  ].join("\n");

  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: record.businessName } }],
      },
      "Contact Person": {
        rich_text: [{ text: { content: record.fullName } }],
      },
      Phone: {
        phone_number: record.whatsappNumber,
      },
      WhatsApp: {
        rich_text: [{ text: { content: record.whatsappNumber } }],
      },
      "Business Type": {
        select: { name: mapBusinessType(record.businessType) },
      },
      "Customer Channels": {
        multi_select: [{ name: mapCustomerChannel(record.discoveryChannel) }],
      },
      "Biggest Frustration": {
        select: { name: mapFrustration(record.customerFrustration) },
      },
      Readiness: {
        select: { name: mapReadiness(record.readinessWindow) },
      },
      "Diagnostic Source": {
        select: { name: "FirstLine Diagnostic" },
      },
      Status: {
        select: { name: "Lead" },
      },
      Source: {
        select: { name: "Direct" },
      },
      Package: {
        select: { name: "Not Yet Decided" },
      },
      "Raw Diagnostic Notes": {
        rich_text: [{ text: { content: notes.slice(0, 1900) } }],
      },
    },
  });

  const pageId = response.id;
  const url =
    "url" in response && typeof response.url === "string"
      ? response.url
      : `https://www.notion.so/${pageId.replace(/-/g, "")}`;

  return { pageId, url };
}
