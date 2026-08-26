import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { Client } from "@notionhq/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * FirstLine Diagnostic payload — kept in sync with client/src/config/diagnostic.ts
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

type DiagnosticRecord = z.infer<typeof DiagnosticSchema> & {
  submittedAt: string;
  receivedAt: string;
};

/** Normalize form values to match Hubil Clients select options. */
function mapBusinessType(value: string): string {
  const map: Record<string, string> = {
    Fashion: "Fashion",
    Services: "Services",
    "Food & Hospitality": "Food",
    "Trade & Retail": "Trade",
    Other: "Other",
  };
  return map[value] ?? "Other";
}

function mapCustomerChannel(value: string): string {
  const allowed = [
    "WhatsApp only",
    "Instagram",
    "Physical location",
    "Website",
    "Combination",
    "Other",
  ];
  return allowed.includes(value) ? value : "Other";
}

function mapFrustration(value: string): string {
  const allowed = [
    "Lost messages",
    "Looking unprofessional",
    "No follow-up system",
    "Hard for customers to find me",
    "Other",
  ];
  return allowed.includes(value) ? value : "Other";
}

function mapReadiness(value: string): string {
  const allowed = ["Ready now", "Exploring", "Just researching"];
  return allowed.includes(value) ? value : "Exploring";
}

/**
 * Create a page in the Hubil Clients Notion database.
 * Requires NOTION_API_KEY and NOTION_DATABASE_ID (Hubil Clients).
 */
async function createNotionClientPage(
  record: DiagnosticRecord,
): Promise<{ pageId: string; url: string } | null> {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    return null;
  }

  const notion = new Client({ auth: apiKey });

  const notes = [
    `Submitted via FirstLine Diagnostic at ${record.submittedAt}`,
    `Business type (raw): ${record.businessType}`,
    `Customer access: ${record.discoveryChannel}`,
    `Frustration: ${record.customerFrustration}`,
    `Readiness: ${record.readinessWindow}`,
  ].join("\n");

  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: record.businessName } }],
      },
      "Contact Person": {
        rich_text: [{ text: { content: record.fullName } }],
      },
      Phone: {
        phone_number: record.whatsappNumber,
      },
      WhatsApp: {
        rich_text: [{ text: { content: record.whatsappNumber } }],
      },
      "Business Type": {
        select: { name: mapBusinessType(record.businessType) },
      },
      "Customer Channels": {
        multi_select: [{ name: mapCustomerChannel(record.discoveryChannel) }],
      },
      "Biggest Frustration": {
        select: { name: mapFrustration(record.customerFrustration) },
      },
      Readiness: {
        select: { name: mapReadiness(record.readinessWindow) },
      },
      "Diagnostic Source": {
        select: { name: "FirstLine Diagnostic" },
      },
      Status: {
        select: { name: "Lead" },
      },
      Source: {
        select: { name: "Direct" },
      },
      Package: {
        select: { name: "Not Yet Decided" },
      },
      "Raw Diagnostic Notes": {
        rich_text: [{ text: { content: notes.slice(0, 1900) } }],
      },
    },
  });

  const pageId = response.id;
  const url =
    "url" in response && typeof response.url === "string"
      ? response.url
      : `https://www.notion.so/${pageId.replace(/-/g, "")}`;

  return { pageId, url };
}

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
      // Do not fail the user-facing request if Notion is misconfigured.
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
