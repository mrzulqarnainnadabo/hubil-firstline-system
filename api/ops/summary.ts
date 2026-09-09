import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";

function textProperty(properties: Record<string, any>, name: string): string {
  const p = properties[name];
  if (!p) return "";
  if (p.type === "title") return (p.title ?? []).map((x: any) => x.plain_text ?? "").join("");
  if (p.type === "rich_text") return (p.rich_text ?? []).map((x: any) => x.plain_text ?? "").join("");
  if (p.type === "select") return p.select?.name ?? "";
  return "";
}

function authorized(req: VercelRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.authorization === `Bearer ${secret}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });
  if (!authorized(req)) return res.status(401).json({ ok: false, error: "Unauthorized" });
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    return res.status(503).json({ ok: false, error: "Notion is not configured" });
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const result = await notion.databases.query({ database_id: process.env.NOTION_DATABASE_ID, page_size: 100 });
  const rows = result.results.filter((p: any) => p.object === "page").map((p: any) => {
    const props = p.properties as Record<string, any>;
    return {
      id: p.id,
      url: p.url,
      name: textProperty(props, "Name"),
      status: textProperty(props, "Status"),
      priority: textProperty(props, "Priority"),
      automationState: textProperty(props, "Automation State"),
      nextAction: textProperty(props, "Next Action"),
      track: textProperty(props, "Recommended Track"),
    };
  });

  const count = (fn: (r: any) => boolean) => rows.filter(fn).length;
  return res.status(200).json({
    ok: true,
    totals: {
      all: rows.length,
      new: count((r) => r.status === "Lead" || r.status === "Briefed"),
      discovery: count((r) => r.status === "Discovery"),
      proposals: count((r) => r.status === "Proposal"),
      active: count((r) => r.status === "Active"),
      highPriority: count((r) => r.priority === "High"),
      needsAttention: count((r) => r.automationState === "Needs review" || r.automationState === "Follow-up due"),
      waiting: count((r) => r.automationState === "Waiting for reply"),
    },
    attention: rows
      .filter((r) => ["Needs review", "Follow-up due", "Ready for human"].includes(r.automationState))
      .sort((a, b) => (a.priority === "High" ? -1 : 0) - (b.priority === "High" ? -1 : 0))
      .slice(0, 20),
    generatedAt: new Date().toISOString(),
  });
}
