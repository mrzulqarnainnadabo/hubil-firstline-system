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
| **Structured prospect record** | A typed response schema and documented Notion-property map for future Hubil Clients database integration. |
| **Live submission endpoint** | `POST /api/diagnostic` validates and logs every completed assessment (ready for Notion). |
| **Operational contact routes** | Secondary WhatsApp, phone, and email support presented in a clear FirstLine operational panel. |
| **Easy client adaptation** | Central configuration files for core brand details, imagery, messaging, and contact routes. |

## Primary contact

For Hubil Group and FirstLine enquiries, use **+234 803 698 4766** on WhatsApp: [https://wa.me/2348036984766](https://wa.me/2348036984766).

## Project structure

```text
client/
  src/
    components/DiagnosticFlow.tsx  # Five-step diagnostic interface + API submit
    config/site.ts                 # Primary Hubil/FirstLine identity and contact details
    config/diagnostic.ts           # Diagnostic data model and future Notion property mapping
    pages/Home.tsx                 # FirstLine landing experience
    index.css                      # Shared visual system and motion rules
server/
  index.ts                         # Express server, /api/health, /api/diagnostic
shared/
  const.ts
```

## Customizing for a client

Start with these two files:

| File | Change here |
| --- | --- |
| `client/src/config/site.ts` | Company name, positioning, contact routes, email, image paths, dashboard link, and leadership details. |
| `client/src/config/diagnostic.ts` | Diagnostic choices, data schema, and the future Hubil Clients Notion property map. |

The relevant source files include `CUSTOMIZE` and `FUTURE INTEGRATION` comments to support straightforward handovers.

## Local development

This repository uses React, TypeScript, Vite, Tailwind CSS, Express, and Zod.

```bash
pnpm install
cp .env.example .env   # optional
pnpm dev
```

Run production checks before deployment:

```bash
pnpm check
pnpm build
pnpm start
```

### API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health check |
| `POST` | `/api/diagnostic` | Submit a completed diagnostic (JSON body matching `DiagnosticResponse`) |

## Future Notion connection

The diagnostic flow posts a typed `DiagnosticResponse` to the server. When a secure backend integration is enabled, set:

```env
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...
```

The recommended property names and types are defined in `client/src/config/diagnostic.ts` as `NOTION_PROPERTY_MAP`.

## Brand stewardship

FirstLine is a **Hubil Group System**. The experience should remain calm, selective, and operationally credible: it is designed to assess readiness, not chase attention.

---

Powered by Hubil Group Systems · MIT License
