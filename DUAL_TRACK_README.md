# Dual-track FirstLine — build package

This branch is the intended cutover for dual-track FirstLine.

Full file set is staged in the operator sandbox at:
`/home/workdir/artifacts/firstline-build/`

Files ready:
- client/src/config/diagnostic.ts
- client/src/config/site.ts
- client/src/components/DiagnosticFlow.tsx
- client/src/pages/Home.tsx
- api/lib/diagnostic.ts
- api/diagnostic.ts

Main remains production-green on the previous small-business diagnostic until atomic merge.

## What ships
1. Dual-track sorter (institutions + serious brands)
2. 7-step plain-English diagnostic
3. Rules-based AI Brief in Notion Raw Diagnostic Notes
4. Upmarket landing + systems map
5. No prices, human-approve first message

Operator: Zulqarnain / Hubil Group
