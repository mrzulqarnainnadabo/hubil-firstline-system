import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * FirstLine Diagnostic payload — kept in sync with client/src/config/diagnostic.ts
 * FUTURE: Forward validated payloads to Notion using NOTION_PROPERTY_MAP.
 */
const DiagnosticSchema = z.object({
  businessType: z.string().min(1),
  discoveryChannel: z.string().min(1),
  customerFrustration: z.string().min(1),
  readinessWindow: z.string().min(1),
  fullName: z.string().min(1).max(120),
  businessName: z.string().min(1).max(160),
  whatsappNumber: z.string().min(7).max(32),
  source: z.string().default("FirstLine Business Presence Diagnostic"),
  submittedAt: z.string().datetime().optional(),
});

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "32kb" }));

  // Health check for uptime monitors / load balancers
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "hubil-firstline-system",
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Accept a completed FirstLine diagnostic.
   * Currently logs a structured record and returns a confirmation.
   * When NOTION_API_KEY + NOTION_DATABASE_ID are present, this route
   * can be extended to create a page in the Hubil Clients database.
   */
  app.post("/api/diagnostic", (req, res) => {
    const parsed = DiagnosticSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: "Invalid diagnostic payload",
        details: parsed.error.flatten(),
      });
    }

    const record = {
      ...parsed.data,
      submittedAt: parsed.data.submittedAt ?? new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      ip: req.headers["x-forwarded-for"] ?? req.socket.remoteAddress,
    };

    // Structured log — visible in hosting platform logs (Vercel, Railway, etc.)
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

    // FUTURE INTEGRATION POINT:
    // if (process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID) {
    //   await createNotionClientPage(record);
    // }

    return res.status(201).json({
      ok: true,
      message: "Diagnostic received. A Hubil systems specialist will review it.",
      reference: record.submittedAt,
    });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Client-side routing fallback
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`FirstLine server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
