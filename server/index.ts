import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  DiagnosticSchema,
  createNotionClientPage,
  generateBrief,
  type DiagnosticRecord,
} from "../api/lib/diagnostic.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "hubil-firstline-system",
      notionConfigured: Boolean(
        process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID,
      ),
      timestamp: new Date().toISOString(),
    });
  });

  app.post("/api/diagnostic", async (req, res) => {
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
  });

  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    const publicDir = path.join(__dirname, "public");
    app.use(express.static(publicDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(publicDir, "index.html"));
    });
  }

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, () => {
    console.log(`FirstLine server running on http://localhost:${port}/`);
    if (process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID) {
      console.log("Notion Hubil Clients integration: enabled");
    } else {
      console.log(
        "Notion Hubil Clients integration: disabled (set NOTION_API_KEY + NOTION_DATABASE_ID)",
      );
    }
  });
}

startServer().catch(console.error);
