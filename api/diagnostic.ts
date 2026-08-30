import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  DiagnosticSchema,
  createNotionClientPage,
  generateBrief,
  type DiagnosticRecord,
} from "./lib/diagnostic.js";
import { notifyFounderIfHigh } from "./lib/notify.js";

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
    orgName: parsed.data.orgName ?? "",
    heardAbout: parsed.data.heardAbout ?? "",
    submittedAt: parsed.data.submittedAt ?? new Date().toISOString(),
    receivedAt: new Date().toISOString(),
  };

  const brief = generateBrief(record);

  console.log(
    JSON.stringify({
      event: "firstline.diagnostic.received",
      orgType: record.orgType,
      dominantGap: record.dominantGap,
      horizon: record.horizon,
      role: record.role,
      track: brief.track,
      priority: brief.priority,
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
          track: brief.track,
          status: "Briefed",
        }),
      );
    }
  } catch (err) {
    console.error(
      JSON.stringify({
        event: "firstline.diagnostic.notion_error",
        message: err instanceof Error ? err.message : String(err),
        orgType: record.orgType,
      }),
    );
  }

  // High only — never blocks the client response
  try {
    await notifyFounderIfHigh({
      priority: brief.priority,
      track: brief.track,
      orgType: record.orgType,
      fullName: record.fullName,
      contact: record.contact,
      orgName: record.orgName,
      dominantGap: record.dominantGap,
      notionUrl: notionPage?.url,
    });
  } catch (err) {
    console.error(
      JSON.stringify({
        event: "firstline.notify.error",
        message: err instanceof Error ? err.message : String(err),
      }),
    );
  }

  return res.status(201).json({
    ok: true,
    message:
      "Diagnostic received. A Hubil specialist will review the brief and continue with you if there is a fit.",
    reference: record.submittedAt,
    track: brief.track,
    priority: brief.priority,
    notion: notionPage
      ? { created: true, pageId: notionPage.pageId }
      : { created: false },
  });
}
