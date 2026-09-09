import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";

const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const MAX_SCAN = 2000;
const COOLDOWN_DAYS = 7;

function text(properties: Record<string, any>, name: string): string {
  const p = properties[name];
  if (!p) return "";
  if (p.type === "title") return (p.title ?? []).map((x: any) => x.plain_text ?? "").join("").trim();
  if (p.type === "rich_text") return (p.rich_text ?? []).map((x: any) => x.plain_text ?? "").join("").trim();
  if (p.type === "select") return p.select?.name ?? "";
  if (p.type === "email") return p.email ?? "";
  if (p.type === "phone_number") return p.phone_number ?? "";
  return "";
}

function date(properties: Record<string, any>, name: string): string {
  return properties[name]?.date?.start ?? "";
}

function daysSince(value: string): number | null {
  if (!value) return null;
  const ms = Date.now() - new Date(value.includes("T") ? value : `${value}T00:00:00Z`).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

function authorized(req: VercelRequest) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && req.headers.authorization === `Bearer ${secret}`;
}

function contactable(email: string, whatsapp: string, phone: string) {
  return Boolean(email || whatsapp || phone);
}

function chooseChannel(email: string, whatsapp: string, phone: string): "email" | "whatsapp" | "phone" | "manual" {
  if (email) return "email";
  if (whatsapp) return "whatsapp";
  if (phone) return "phone";
  return "manual";
}

function draft(name: string, contact: string, status: string, nextAction: string) {
  const greeting = contact || name || "there";
  if (status === "Proposal") {
    return `Hello ${greeting}, I’m following up on the proposal and wanted to check whether you’ve had a chance to review it. If there are questions or changes needed, I’m happy to help with the next step.`;
  }
  if (status === "Discovery") {
    return `Hello ${greeting}, I’m checking in on our discovery conversation. I’d like to make sure we have what we need to move the work forward. ${nextAction || "Please let me know the best next step from your side."}`;
  }
  if (status === "Briefed") {
    return `Hello ${greeting}, thank you for taking the time to share your business context with us. We’ve reviewed the information and would like to continue the conversation around the next practical step. Please let me know when would be convenient for you.`;
  }
  return `Hello ${greeting}, I wanted to reconnect regarding our previous conversation. If this is still a priority for you, let me know and we can agree on the next practical step.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  if (!authorized(req)) return res.status(401).json({ ok: false, error: "Unauthorized" });
  if (!process.env.NOTION_API_KEY || !DATABASE_ID) return res.status(503).json({ ok: false, error: "Notion is not configured" });

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const pages: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await notion.databases.query({ database_id: DATABASE_ID, page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) });
    pages.push(...result.results.filter((p: any) => p.object === "page"));
    cursor = result.has_more ? result.next_cursor ?? undefined : undefined;
  } while (cursor && pages.length < MAX_SCAN);

  const now = new Date();
  const cutoff = now.getTime() - COOLDOWN_DAYS * 86_400_000;
  const candidates: any[] = [];
  const excluded: Record<string, number> = { no_contact: 0, recent_contact: 0, parked: 0, active: 0, delivered: 0, missing_stage: 0 };

  for (const page of pages) {
    const p = page.properties as Record<string, any>;
    const name = text(p, "Name") || "Unnamed client";
    const contact = text(p, "Contact Person");
    const status = text(p, "Status");
    const state = text(p, "Automation State");
    const priority = text(p, "Priority");
    const nextAction = text(p, "Next Action");
    const email = text(p, "Email");
    const whatsapp = text(p, "WhatsApp");
    const phone = text(p, "Phone");
    const lastRun = date(p, "Last Automation Run");
    const followUp = date(p, "Follow-up Due");

    if (!status) { excluded.missing_stage += 1; continue; }
    if (state === "Parked") { excluded.parked += 1; continue; }
    if (state === "Active") { excluded.active += 1; continue; }
    if (["Delivered", "Support"].includes(status)) { excluded.delivered += 1; continue; }
    if (!contactable(email, whatsapp, phone)) { excluded.no_contact += 1; continue; }

    const lastMs = lastRun ? new Date(`${lastRun}T00:00:00Z`).getTime() : 0;
    if (lastMs && lastMs >= cutoff) { excluded.recent_contact += 1; continue; }

    const overdue = followUp ? followUp <= now.toISOString().slice(0, 10) : false;
    const stageEligible = ["Lead", "Briefed", "Discovery", "Proposal"].includes(status);
    if (!stageEligible) continue;

    const channel = chooseChannel(email, whatsapp, phone);
    candidates.push({
      id: page.id,
      url: page.url,
      name,
      contactPerson: contact,
      status,
      priority,
      channel,
      contact: channel === "email" ? email : channel === "whatsapp" ? whatsapp : phone,
      nextAction,
      overdue,
      daysSinceAutomation: daysSince(lastRun),
      reason: overdue ? "Follow-up is due" : state === "Follow-up due" ? "Marked for follow-up" : "Eligible for proactive follow-up",
      draft: draft(name, contact, status, nextAction),
      requiresHumanApproval: true,
    });
  }

  const priorityRank: Record<string, number> = { High: 0, Medium: 1, Watch: 2 };
  candidates.sort((a, b) => (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9) || Number(b.overdue) - Number(a.overdue) || a.name.localeCompare(b.name));

  const byChannel = candidates.reduce((acc, item) => { acc[item.channel] = (acc[item.channel] ?? 0) + 1; return acc; }, {} as Record<string, number>);
  return res.status(200).json({
    ok: true,
    mission: "safe-outreach-plan",
    generatedAt: now.toISOString(),
    scanned: pages.length,
    candidates: candidates.length,
    byChannel,
    exclusions: excluded,
    safety: {
      cooldownDays: COOLDOWN_DAYS,
      humanApprovalRequired: true,
      sendsPerformed: 0,
      phoneNumbersAreNotTreatedAsWhatsAppConsent: true,
      parkedAndActiveExcluded: true,
      deliveredClientsExcluded: true,
    },
    items: candidates.slice(0, 100),
  });
}
