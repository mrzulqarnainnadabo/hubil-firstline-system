import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

function isAuthorized(req: VercelRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const auth = req.headers.authorization;
  return auth === `Bearer ${secret}`;
}

function textProperty(properties: Record<string, any>, name: string): string {
  const p = properties[name];
  if (!p) return "";
  if (p.type === "title") return (p.title ?? []).map((x: any) => x.plain_text ?? "").join("");
  if (p.type === "rich_text") return (p.rich_text ?? []).map((x: any) => x.plain_text ?? "").join("");
  if (p.type === "select") return p.select?.name ?? "";
  return "";
}

function dateProperty(properties: Record<string, any>, name: string): string | null {
  return properties[name]?.date?.start ?? null;
}

function daysSince(date: string): number {
  const then = new Date(`${date}T00:00:00Z`).getTime();
  return Math.floor((Date.now() - then) / 86_400_000);
}

function dueDateOffset(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function richText(content: string) {
  return { rich_text: [{ text: { content: content.slice(0, 1900) } }] };
}

function select(name: string) {
  return { select: { name } };
}

function date(start: string) {
  return { date: { start } };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!isAuthorized(req)) return res.status(401).json({ ok: false, error: "Unauthorized" });
  if (!process.env.NOTION_API_KEY || !DATABASE_ID) {
    return res.status(503).json({ ok: false, error: "Notion automation is not configured" });
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const today = new Date().toISOString().slice(0, 10);
  const result = await notion.databases.query({
    database_id: DATABASE_ID,
    page_size: 100,
    filter: {
      or: [
        { property: "Status", select: { equals: "Briefed" } },
        { property: "Status", select: { equals: "Discovery" } },
        { property: "Status", select: { equals: "Proposal" } },
      ],
    },
  });

  let reviewed = 0;
  let due = 0;
  let reminders = 0;
  const actions: Array<Record<string, string>> = [];

  for (const page of result.results) {
    if (page.object !== "page") continue;
    reviewed += 1;
    const properties = page.properties as Record<string, any>;
    const name = textProperty(properties, "Name") || "Unnamed client";
    const status = textProperty(properties, "Status");
    const state = textProperty(properties, "Automation State");
    const priority = textProperty(properties, "Priority");
    const nextAction = textProperty(properties, "Next Action");
    const followUp = dateProperty(properties, "Follow-up Due");
    const lastRun = dateProperty(properties, "Last Automation Run");

    // A human can park or activate a record. The autopilot respects those decisions.
    if (state === "Parked" || state === "Active") continue;

    const created = properties["Date Added"]?.created_time;
    const age = created ? daysSince(created) : 0;
    const overdue = followUp ? followUp <= today : false;
    const stale = !followUp && age >= (priority === "High" ? 1 : priority === "Medium" ? 3 : 7);

    if (!overdue && !stale) continue;

    due += 1;
    const next = nextAction || (status === "Briefed"
      ? "Review the diagnostic brief and approve the first human message."
      : "Review the opportunity and decide the next client-facing step.");

    await notion.pages.update({
      page_id: page.id,
      properties: {
        "Automation State": select("Follow-up due"),
        "Next Action": richText(next),
        "Follow-up Due": date(today),
        "Last Automation Run": date(today),
      } as any,
    });

    actions.push({ name, status, priority, action: next, pageId: page.id });

    // Only send one reminder per calendar day per record.
    if (lastRun !== today) {
      reminders += 1;
      const webhook = process.env.FIRSTLINE_AUTOPILOT_WEBHOOK_URL;
      if (webhook) {
        try {
          await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "firstline.follow_up_due",
              client: name,
              status,
              priority,
              action: next,
              pageId: page.id,
            }),
          });
        } catch (error) {
          console.error("firstline.autopilot.webhook_error", error);
        }
      }
    }
  }

  console.log(JSON.stringify({ event: "firstline.autopilot.completed", reviewed, due, reminders, at: new Date().toISOString() }));
  return res.status(200).json({ ok: true, reviewed, due, reminders, actions, ranAt: new Date().toISOString() });
}
