import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";

function authorized(req: VercelRequest) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && req.headers.authorization === `Bearer ${secret}`;
}

function text(properties: Record<string, any>, name: string) {
  const p = properties[name];
  if (!p) return "";
  if (p.type === "title") return (p.title ?? []).map((x: any) => x.plain_text ?? "").join("");
  if (p.type === "rich_text") return (p.rich_text ?? []).map((x: any) => x.plain_text ?? "").join("");
  if (p.type === "select") return p.select?.name ?? "";
  if (p.type === "email") return p.email ?? "";
  if (p.type === "phone_number") return p.phone_number ?? "";
  return "";
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });
  if (!authorized(req)) return res.status(401).json({ ok: false, error: "Unauthorized" });
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    return res.status(503).json({ ok: false, error: "Notion is not configured" });
  }

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

  const seen = new Map<string, string[]>();
  const issues: Array<Record<string, any>> = [];
  for (const page of pages) {
    const props = page.properties as Record<string, any>;
    const name = text(props, "Name") || "Unnamed client";
    const email = text(props, "Email");
    const phone = text(props, "Phone") || text(props, "WhatsApp");
    const key = normalize(email || phone);
    if (key) seen.set(key, [...(seen.get(key) ?? []), name]);

    const missing: string[] = [];
    if (!email && !phone) missing.push("contact channel");
    if (!text(props, "Next Action")) missing.push("next action");
    if (!text(props, "Priority")) missing.push("priority");
    if (!text(props, "Automation State")) missing.push("automation state");
    if (missing.length) issues.push({ type: "incomplete", name, missing, pageId: page.id, url: page.url });
  }

  for (const [key, names] of seen) {
    if (names.length > 1) issues.push({ type: "possible-duplicate", key, names });
  }

  return res.status(200).json({
    ok: true,
    scanned: pages.length,
    issueCount: issues.length,
    incomplete: issues.filter((i) => i.type === "incomplete").length,
    possibleDuplicates: issues.filter((i) => i.type === "possible-duplicate").length,
    issues,
    generatedAt: new Date().toISOString(),
  });
}
