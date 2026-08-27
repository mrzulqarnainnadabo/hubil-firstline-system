import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  DiagnosticSchema,
  createNotionClientPage,
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
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

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
