# FirstLine — Hubil Group Business Presence System

> A high-status, mobile-first business presence diagnostic for serious Nigerian brands.

**FirstLine Business Presence Diagnostic** is a front-line assessment experience designed to help Hubil Group qualify businesses before proposing a customer-facing presence system. It is now also the first layer of an operating system: every diagnostic is classified, given a next action, scheduled for review, and surfaced when attention is required.

## Operating model

```text
Diagnostic → Brief → Priority → Next Action → Human approval → Discovery → Proposal → Delivery
                                  ↑                                      ↓
                                  └──────── Scheduled autopilot ─────────┘
```

FirstLine is deliberately **automation-first but human-controlled**. It can classify prospects, create the internal brief, schedule the next action, detect overdue work, and notify the operator. It does not silently send client-facing sales messages.

| Capability | What it provides |
| --- | --- |
| **Diagnostic-first entry** | A focused assessment that qualifies fit before contact becomes the primary route. |
| **Diagnostic intelligence** | Rules-based priority, recommended track, first move, and draft first message. |
| **Operational memory** | Every new lead gets an automation state, next action, and follow-up date in Hubil Clients. |
| **Scheduled autopilot** | A weekday Vercel Cron checks active opportunities and marks overdue work for attention. |
| **Operations summary** | `GET /api/ops/summary` returns pipeline counts and the current attention queue. |
| **Human gate** | Client-facing first messages remain draft-only until a human approves them. |

## Project structure

```text
client/
  src/
    components/DiagnosticFlow.tsx
    config/site.ts
    config/diagnostic.ts
    pages/Home.tsx
api/
  diagnostic.ts                    # POST /api/diagnostic
  health.ts                        # GET /api/health
  ops/summary.ts                   # GET /api/ops/summary
  cron/firstline-autopilot.ts      # scheduled triage / follow-up engine
  lib/diagnostic.ts                # schema + brief + Notion write
  lib/notify.ts                    # high-priority founder alerts
server/
  index.ts
vercel.json                        # static + serverless + cron routing
```

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check; reports whether Notion is configured |
| `POST` | `/api/diagnostic` | Validates a diagnostic, generates a brief, and creates a Notion client record |
| `GET` | `/api/ops/summary` | Returns pipeline totals and the attention queue |
| `GET/POST` | `/api/cron/firstline-autopilot` | Scheduled triage; marks due work and optionally sends an internal webhook |

## Automation states

The **Hubil Clients** database now contains:

- **Needs review** — record requires classification or manual inspection.
- **Ready for human** — a next action and draft message are prepared.
- **Waiting for reply** — outbound action has happened and the system is waiting.
- **Follow-up due** — the system detected overdue work.
- **Parked** — deliberately paused; the autopilot leaves it alone.
- **Active** — delivery is underway; the autopilot leaves it alone.

New FirstLine diagnostics start at **Ready for human**, with a follow-up date based on priority: High = 1 business day, Medium = 3, Watch = 7.

## Environment variables

```env
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=86a2b54bbdf247b2831923cb6590aa82
CRON_SECRET=optional-secret-for-manual-cron-calls
FIRSTLINE_AUTOPILOT_WEBHOOK_URL=optional-internal-notification-webhook
```

The cron runs on weekdays at 07:00 UTC. If `CRON_SECRET` is set, manual requests to the cron and operations summary endpoints must use `Authorization: Bearer <secret>`.

## Safety boundary

FirstLine can operate without continuous supervision, but **client-facing outbound remains human-approved**. This is intentional: automation handles memory, classification, scheduling, and attention; a human remains the approval gate for external communication until a stronger consent-based outbound layer is added.

## Deploy on Vercel

Pushes to `main` auto-deploy when the repository is connected to Vercel. Verify `/api/health` after deployment and confirm the Notion integration has access to **Hubil Clients**.

---

Powered by Hubil Group Systems · MIT License
