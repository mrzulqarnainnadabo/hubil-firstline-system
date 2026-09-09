import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

type Action = "ready" | "waiting" | "due" | "park" | "snooze";

function authorized(req: VercelRequest) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && req.headers.authorization === `Bearer ${secret}`;
}

function datePlusBusinessDays(days: number) {
  const date = new Date();
  let remaining = days;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return date.toISOString().slice(0, 10);
}

function richText(content: string) {
  return { rich_text: [{ text: { content: content.slice(0, 1900) } }] };
}

function select(name: string) {
  return { select: { name } };
}

function date(start: string | null) {
  return { date: start ? { start } : null };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  if (!authorized(req)) return res.status(401).json({ ok: false, error: "Unauthorized" });
  if (!process.env.NOTION_API_KEY || !DATABASE_ID) {
    return res.status(503).json({ ok: false, error: "Notion is not configured" });
  }

  const pageId = String(req.body?.pageId ?? "").trim();
  const action = String(req.body?.action ?? "").trim() as Action;
  if (!pageId || !["ready", "waiting", "due", "park", "snooze"].includes(action)) {
    return res.status(400).json({ ok: false, error: "pageId and a valid action are required" });
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const page = await notion.pages.retrieve({ page_id: pageId });
  if (page.object !== "page") return res.status(404).json({ ok: false, error: "Client record not found" });

  const today = new Date().toISOString().slice(0, 10);
  const updates: Record<string, any> = { "Last Automation Run": date(today) };

  switch (action) {
    case "ready":
      updates["Automation State"] = select("Ready for human");
      updates["Next Action"] = richText("Review and approve the prepared client-facing message.");
      updates["Follow-up Due"] = date(today);
      break;
    case "waiting":
      updates["Automation State"] = select("Waiting for reply");
      updates["Next Action"] = richText("Wait for the client's response; review again if the follow-up date passes.");
      updates["Follow-up Due"] = date(datePlusBusinessDays(3));
      break;
    case "due":
      updates["Automation State"] = select("Follow-up due");
      updates["Next Action"] = richText("Review the client record and decide the next client-facing step.");
      updates["Follow-up Due"] = date(today);
      break;
    case "park":
      updates["Automation State"] = select("Parked");
      updates["Next Action"] = richText("Record parked by operator. No automated follow-up will run while parked.");
      updates["Follow-up Due"] = date(null);
      break;
    case "snooze":
      updates["Automation State"] = select("Waiting for reply");
      updates["Next Action"] = richText("Follow up after the scheduled cooling-off period.");
      updates["Follow-up Due"] = date(datePlusBusinessDays(7));
      break;
  }

  await notion.pages.update({ page_id: pageId, properties: updates as any });
  return res.status(200).json({ ok: true, pageId, action, updatedAt: new Date().toISOString() });
}
