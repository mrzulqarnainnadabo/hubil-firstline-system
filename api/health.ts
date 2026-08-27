import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: "ok",
    service: "hubil-firstline-system",
    runtime: "vercel-serverless",
    notionConfigured: Boolean(
      process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID,
    ),
    timestamp: new Date().toISOString(),
  });
}
