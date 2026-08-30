import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  DiagnosticSchema,
  createNotionClientPage,
  type DiagnosticRecord,
} from "./lib/diagnostic.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const parsed = DiagnosticSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Invalid diagnostic payload",
      details: parsed.error.flatten(),
    });
  }

  const record: DiagnosticRecord = {
    ...parsed.data,
    submittedAt: parsed.data.submittedAt ?? new Date().toISOString(),
    receivedAt: new Date().toISOString(),
  };

  console.log(
    JSON.stringify({
      event: "firstline.diagnostic.received",
      businessName: record.businessName,
      businessType: record.businessType,
      readinessWindow: record.readinessWindow,
      source: record.source,
      submittedAt: record.submittedAt,
    }),
  );

  let notionPage: { pageId: string; url: string } | null = null;

  try {
    notionPage = await createNotionClientPage(record);
    if (notionPage) {
      console.log(
        JSON.stringify({
          event: "firstline.diagnostic.notion_created",
          pageId: notionPage.pageId,
          url: notionPage.url,
          businessName: record.businessName,
        }),
      );
    }
  } catch (err) {
    console.error(
      JSON.stringify({
        event: "firstline.diagnostic.notion_error",
        message: err instanceof Error ? err.message : String(err),
        businessName: record.businessName,
      }),
    );
  }

  return res.status(201).json({
    ok: true,
    message: "Diagnostic received. A Hubil systems specialist will review it.",
    reference: record.submittedAt,
    notion: notionPage
      ? { created: true, pageId: notionPage.pageId }
      : { created: false },
  });
}
