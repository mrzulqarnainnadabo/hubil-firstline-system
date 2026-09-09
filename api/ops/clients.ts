import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";

function textProperty(properties: Record<string, any>, name: string): string {
  const p = properties[name];
  if (!p) return "";
  if (p.type === "title") return (p.title ?? []).map((x: any) => x.plain_text ?? "").join("");
  if (p.type === "rich_text") return (p.rich_text ?? []).map((x: any) => x.plain_text ?? "").join("");
  if (p.type === "select") return p.select?.name ?? "";
  if (p.type === "email") return p.email ?? "";
  if (p.type === "phone_number") return p.phone_number ?? "";
  if (p.type === "url") return p.url ?? "";
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

  const q = String(req.query.q ?? "").trim().toLowerCase();
  const status = String(req.query.status ?? "").trim();
  const priority = String(req.query.priority ?? "").trim();
  const automationState = String(req.query.automationState ?? "").trim();
  const limit = Math.min(Math.max(Number(req.query.limit ?? 50) || 50, 1), 100);

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const pages: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    pages.push(...result.results.filter((p: any) => p.object === "page"));
    cursor = result.has_more ? result.next_cursor ?? undefined : undefined;
  } while (cursor && pages.length < 2000);

  const clients = pages.map((page: any) => {
    const props = page.properties as Record<string, any>;
    const name = textProperty(props, "Name");
    return {
      id: page.id,
      url: page.url,
      name,
      contactPerson: textProperty(props, "Contact Person"),
      status: textProperty(props, "Status"),
      priority: textProperty(props, "Priority"),
      automationState: textProperty(props, "Automation State"),
      nextAction: textProperty(props, "Next Action"),
      followUpDue: props["Follow-up Due"]?.date?.start ?? "",
      track: textProperty(props, "Recommended Track"),
      orgType: textProperty(props, "Org Type"),
      dominantGap: textProperty(props, "Dominant Gap"),
      phone: textProperty(props, "Phone"),
      email: textProperty(props, "Email"),
      whatsapp: textProperty(props, "WhatsApp"),
      updatedAt: page.last_edited_time,
    };
  });

  const filtered = clients
    .filter((client) => !status || client.status === status)
    .filter((client) => !priority || client.priority === priority)
    .filter((client) => !automationState || client.automationState === automationState)
    .filter((client) => {
      if (!q) return true;
      return [client.name, client.contactPerson, client.email, client.phone, client.whatsapp, client.status, client.track, client.orgType, client.dominantGap]
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .sort((a, b) => {
      if (q) {
        const aq = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bq = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        if (aq !== bq) return aq - bq;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, limit);

  return res.status(200).json({ ok: true, query: q, total: filtered.length, clients: filtered, generatedAt: new Date().toISOString() });
}
