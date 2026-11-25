---
description: Generate or refresh the agent project map (navigation aid — not Owner-gated)
argument-hint: [refresh?]
---

Build or refresh [`{{PROJECT_MAP}}`](../../{{PROJECT_MAP}}) — a **short structural map** so agents navigate this repo without blind grepping.

**Audience:** agents (not a user-facing doc).  
**Authority:** context only. Never override accepted `{{PRODUCT_SPEC}}`, `{{USER_FLOW}}`, `{{ARCHITECTURE}}`, or `{{AUDIT_PLAN}}`.  
**Owner gate:** none — create and use freely. If the Owner later corrects the map, apply their notes.

`$ARGUMENTS` may include `refresh` (or structure clearly drifted) → rewrite even if Status is `current`.

## Stale vs current

Treat the map as **stale** when major modules/hubs/entrypoints changed since **Last mapped**, when audit/architecture work contradicts it, or when the agent would otherwise re-grep widely to orient. On stale → refresh this command (no Owner gate).

## When to run

- Mid-project `/setup` (document what exists)
- Before `/audit-project` when the codebase is non-trivial
- After several delivery phases when structure has grown opaque
- Whenever an agent would otherwise need a wide repo search to orient

**Skip** on tiny greenfield scaffolds with almost no code — product + architecture are enough until structure exists.

## How to build the map

1. Scan without inventing product behavior:
   - App entrypoints, package manifests, route/API tables, main `src`/`lib`/`app` trees
   - Existing `{{ARCHITECTURE}}` / `{{USER_FLOW}}` / `{{BUILD_PLAN}}` if present (cross-check, do not copy blindly)
   - Ignore noise: `node_modules`, `dist`, `.git`, `.phasestep/archived-workflow/`, lockfile-only churn
2. Cluster into **modules / communities** by feature or architecture seam.
3. List **core hubs** (auth, data, shared UI, gateway, etc.).
4. Propose **seams** usable as audit-phase or remaining-work candidates.
5. Label every claim **extracted** or **heuristic**. Prefer extracted. Mark overall **Confidence**.
6. Keep it short — orientation page, not a full file inventory.

## Write

1. Create or overwrite `{{PROJECT_MAP}}` using the stub shape (Entrypoints, Modules, Core hubs, Seams, Out of scope, Open questions).
2. Set **Status:** `current`, **Last mapped:** today.
3. If little structure exists → Status `empty`, note why, and stop without inventing modules.
4. Do **not** modify application code. Do **not** STOP for Owner Accept.

## After

If this command was invoked **from** `/setup` or `/audit-project`, continue that parent flow in-session (no extra Owner STOP).

If the Owner invoked `/map-project` **alone**, **STOP — Next actions** (numbered; run on pick):

```text
Project map updated.
1. Continue setup — /setup
2. Start audit plan — /audit-project
3. Done for now
```
