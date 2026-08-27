# FirstLine — Hubil Group Business Presence System

> A high-status, mobile-first business presence diagnostic for serious Nigerian brands.

**FirstLine Business Presence Diagnostic** is a polished front-line assessment experience designed to help Hubil Group qualify businesses before proposing a customer-facing presence system. Rather than operating as a generic lead form, it collects a focused diagnostic record of the business context, customer access, operational friction, readiness, and contact details.

[![CI](https://github.com/mrzulqarnainnadabo/hubil-firstline-system/actions/workflows/ci.yml/badge.svg)](https://github.com/mrzulqarnainnadabo/hubil-firstline-system/actions/workflows/ci.yml)

## Purpose

The system is built for business owners who want to look established, stay reachable, and create a more intentional customer journey. It is suitable for fashion, food and hospitality, trade and retail, professional services, and other growing Nigerian brands.

| Capability | What it provides |
| --- | --- |
| **Diagnostic-first entry** | A five-step assessment that qualifies fit before contact becomes the primary route. |
| **Premium mobile experience** | Responsive, fast-loading editorial interface built around the screens customers use most. |
| **Structured prospect record** | Typed schema mapped to the live **Hubil Clients** Notion database. |
| **Live submission endpoint** | `POST /api/diagnostic` validates, logs, and optionally creates a Notion lead. |
| **Operational contact routes** | Secondary WhatsApp, phone, and email support in a clear FirstLine operational panel. |
| **Easy client adaptation** | Central configuration files for brand details, imagery, messaging, and contact routes. |

## Primary contact

For Hubil Group and FirstLine enquiries, use **+234 803 698 4766** on WhatsApp: [https://wa.me/2348036984766](https://wa.me/2348036984766).

## Project structure

```text
client/
  src/
    components/DiagnosticFlow.tsx  # Five-step diagnostic + API submit
    config/site.ts                 # Hubil/FirstLine identity and contact details
    config/diagnostic.ts           # Data model + live Notion property map
    pages/Home.tsx                 # Landing experience
api/
  diagnostic.ts                    # Vercel serverless POST /api/diagnostic
  health.ts                        # Vercel serverless GET /api/health
  lib/diagnostic.ts                # Shared schema + Notion helper
server/
  index.ts                         # Express (local / non-Vercel hosts)
vercel.json                        # Static + serverless routing
```

## Customizing for a client

| File | Change here |
| --- | --- |
| `client/src/config/site.ts` | Company name, positioning, contact routes, email, images, leadership. |
| `client/src/config/diagnostic.ts` | Diagnostic choices and Notion property map. |

## Local development

```bash
pnpm install
cp .env.example .env   # add Notion secrets if testing the integration
pnpm dev
```

Production checks:

```bash
pnpm check
pnpm build
pnpm start
```

### API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check; reports whether Notion is configured |
| `POST` | `/api/diagnostic` | Submit a completed diagnostic (creates Hubil Clients page when configured) |

## Deploy on Vercel (recommended)

The project is ready for Vercel:

1. In the [Vercel dashboard](https://vercel.com) create a new project and import **mrzulqarnainnadabo/hubil-firstline-system** (or reconnect the Git link if a project already exists).
2. Framework preset can stay **Other**. `vercel.json` already sets build/install/output.
3. Add environment variables:

```env
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=86a2b54bbdf247b2831923cb6590aa82
```

4. Deploy. Every push to `main` will auto-deploy.
5. Verify `https://your-app.vercel.app/api/health` returns `"notionConfigured": true` after the secrets are set.

Serverless handlers live in `/api`. The Express server in `server/` remains available for local production-style runs or non-Vercel hosts.

## Notion → Hubil Clients

The live database is **Hubil Clients**:
https://www.notion.so/86a2b54bbdf247b2831923cb6590aa82

| Diagnostic field | Notion property |
| --- | --- |
| Business name | **Name** (title) |
| Contact name | **Contact Person** |
| WhatsApp number | **Phone** + **WhatsApp** |
| Business type | **Business Type** (normalized) |
| Customer access | **Customer Channels** |
| Frustration | **Biggest Frustration** |
| Readiness | **Readiness** |
| — | **Diagnostic Source** = FirstLine Diagnostic |
| — | **Status** = Lead |

### Enable on your host

1. Create an internal integration at [notion.so/my-integrations](https://www.notion.so/my-integrations).
2. Open **Hubil Clients** → ⋯ → Add connections → select your integration.
3. Set on the deployment environment (Vercel → Settings → Environment Variables):

```env
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=86a2b54bbdf247b2831923cb6590aa82
```

Without these variables the API still accepts diagnostics and logs them; Notion writes are skipped.

## Brand stewardship

FirstLine is a **Hubil Group System**. The experience should remain calm, selective, and operationally credible: it is designed to assess readiness, not chase attention.

---

Powered by Hubil Group Systems · MIT License
