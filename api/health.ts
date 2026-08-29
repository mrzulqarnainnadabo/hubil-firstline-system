import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const hasKey = Boolean(process.env.NOTION_API_KEY);
  const hasDb = Boolean(process.env.NOTION_DATABASE_ID);
  const notionConfigured = hasKey && hasDb;

  res.status(200).json({
    status: "ok",
    service: "hubil-firstline-system",
    notionConfigured,
    checks: {
      NOTION_API_KEY: hasKey ? "present" : "missing",
      NOTION_DATABASE_ID: hasDb ? "present" : "missing",
    },
    hint: notionConfigured
      ? "Notion writes enabled. New diagnostics will create Hubil Clients pages."
      : "Add NOTION_API_KEY and NOTION_DATABASE_ID (86a2b54bbdf247b2831923cb6590aa82) in Vercel → Settings → Environment Variables, then Redeploy.",
    timestamp: new Date().toISOString(),
  });
}
