---
name: build-phase
description: Implement one step (or next unfinished step) of a named build phase
argument-hint: [phase-slug] [step?]
---

> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.

Implement **one step** of a **named build phase** for this project (Phasestep).

## Resolve phase id

`$ARGUMENTS` is `PHASE_RAW` optionally followed by `STEP` (e.g. `auth`, `auth 1`, legacy `1 2`).

1. Prefer a **slug** from [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) (e.g. `auth`).
2. **Soft compat:** if PHASE_RAW is a positive integer `N` → use existing `phase-N.md` if present; else map order position `N` in BUILD_PLAN to its slug; else STOP for slug.
3. Resolve **title** from BUILD_PLAN. Plan file: `phase-<id>.md`.
4. **STEP** = second token if present — always a **positive integer**. If omitted: build the **next unfinished** step (first not `verified`). Do **not** build the entire phase.
5. Only build all remaining steps if Owner explicitly says so.

Below, **PHASE** = resolved id. Show **PHASE — Title** in chat / Phase health.

## Required: phase plan

**Primary checklist:** [`docs/phase-plans/phase-PHASE.md`](docs/phase-plans/)

If missing, **stop** — tell Owner to run **`/plan-phase PHASE`** first (progressive or classic).

## Progressive step capture (wire step into the plan)

When the phase **Mode** is `progressive`, **or** the target step is missing / TBD / empty Task:

1. Take the Owner’s description of this step from **this chat** (and any STEP arg context). If unclear → ask once what Step STEP should accomplish (done-when observable).
2. **Before coding**, write/update in `phase-PHASE.md`:
   - `### Step STEP — [short title]`
   - Status `pending` → then `built` after implement
   - **Task**, **Files** (best effort), **Done when**
   - Placeholders for Behavior delta / Trace / Step verification
   - Row in **Step progress tracker**; append **Files checklist** / **Audit checkpoints** as paths become clear
3. Set phase plan **Status** to `in_progress` (keep **Mode:** `progressive` until complete).
4. Then implement that step only — same Behavior delta / Trace / intent gate as classic.

Do **not** invent later steps. Owner starts the next with `/build-phase PHASE <n+1>` (or bare `/build-phase PHASE` for next unfinished).

Classic mode with a fully written step → skip capture; use the existing step text.

## Step playback STOP (before coding)

**When:** progressive step capture ran for this STEP, **or** classic step Task / Done when is missing / TBD / too vague to implement without guessing.

**Skip when:** Owner’s message in this chat already states Goal, Done-when, and Out of scope clearly (or they already chose Proceed for this STEP in this chat).

**Before Pre-build consistency / application code**, restate in chat:

```markdown
**Step playback** — Phase PHASE Step STEP
- **Goal:** …
- **Done when:** … (observable)
- **Out of scope:** …
- **Files likely:** … (best effort)
```

Then **STOP** once:

```text
Step playback:
1. Proceed — implement this step
2. Edit — Owner will correct Goal / Done-when / Out of scope (then restate and STOP again)
```

- **1** → write/update Task / Done when / Files in `phase-PHASE.md` if they changed during playback, then continue Before coding / Pre-build consistency.
- **2** → wait for Owner edits; do not code yet.

## Before coding

1. Read **`phase-PHASE.md`** — target step (after Progressive step capture if it ran; after Step playback if it ran)
2. Confirm prior steps are **verified** (or Owner allows skip). If previous is `built`/unverified, **stop** and tell Owner to **`/verify-phase PHASE <prev>`**. Progressive: Step 1 has no prior.
3. Read [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) — **Phase: PHASE** (reference)
4. Read [`docs/product.md`](docs/product.md)
5. Read [`docs/USER_FLOW.md`](docs/USER_FLOW.md) if present
6. Read [`docs/decisions.md`](docs/decisions.md) — stop on blockers
7. Read [`docs/PROGRESS.md`](docs/PROGRESS.md) — prior phases + **Phase health (resume)** if present
8. Read [`docs/architecture.md`](docs/architecture.md)
9. For UI steps: if [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) exists, follow it
10. If [`docs/PROJECT_MAP.md`](docs/PROJECT_MAP.md) Status is `current`, use modules/hubs/seams as context for Files / seams. If stale and this step touches structure → prefer `/map-project refresh` first (agent aid; no Owner gate). Skip if empty/unused.
11. **Mid-phase side-work** (Owner chat polish while on this step): follow **Mid-phase side-work** in [`refine-phase`](./refine-phase.md) — absorb local asks into this step’s plan + Behavior delta / Trace (no new command); if too large → Side-work size STOP; then continue per Owner. Later `/verify-phase` / audits use the updated artifacts.
12. If Owner chat asks to change a **core principle** or behavior that **cascades to other features/phases** → **do not code yet**. Follow the **Cross-cutting STOP** in [`refine-phase`](./refine-phase.md) (decision → product/flow sync → re-scope), then return to this step with an updated plan/delta. Local step work only after that gate (or Owner picks scoped/defer).
13. Run **Pre-build consistency** (below) before writing application code.

## Pre-build consistency (fail-soft)

Quick cross-check for **this step** only: phase plan step (task / done-when / files) ↔ [`docs/product.md`](docs/product.md) ↔ [`docs/USER_FLOW.md`](docs/USER_FLOW.md) (if present) ↔ BUILD_PLAN Phase PHASE ↔ [`docs/PROJECT_MAP.md`](docs/PROJECT_MAP.md) when Status is `current`.

Look for: contradictions, missing product/flow coverage for the done-when, files/paths that conflict with accepted architecture or map hubs, clarify answers ignored, blocker decisions still open that this step assumes resolved.

Present a short table (or `No material inconsistencies.`):

```markdown
**Pre-build consistency** — Phase PHASE Step STEP
| Severity | Finding | Docs involved | Suggested fix |
|----------|---------|---------------|---------------|
| blocking | … | … | … |
| soft | … | … | … |
```

**Severity:**
- **blocking** — implementing now would violate accepted product/flow, ignore a blocker decision, or clearly contradict the phase plan done-when (for progressive steps just captured from Owner, treat the new done-when as the plan truth unless it fights product/flow)
- **soft** — stale map, minor naming drift, incomplete map seams, advisory gaps — note and continue

**If any blocking rows** → **do not code yet.** STOP:

```text
Pre-build consistency — blocking issues:
1. Fix docs / re-plan (`/plan-phase PHASE` or product/flow/decisions sync) → then re-run /build-phase
2. Owner override — proceed anyway (record override + risks in the step Behavior delta Risks)
3. Abort this build
```

**If only soft (or none)** → show the table (or the clean line), then proceed to implement. Do not invent a STOP for soft-only findings.

## Implementation rules

- Minimize scope to the step’s done-when (plus **absorbed** mid-phase side-work recorded in the plan/delta) — **smallest change** that meets done-when; one verifiable unit this turn
- Match existing project patterns
- Do **not** commit unless Owner asks — standard path is `/pr-step update` (invoke authorizes git writes), not an implicit commit after build
- Do **not** silently cascade principle changes across features during a single step build
- Do **not** leave Owner chat refinements as chat-only — update plan + delta/Trace when behavior or files change

## Execute

1. Set phase plan **Status** to `in_progress` if needed
2. Implement only that step; set step **Status** to `built`
3. Check **Step progress tracker** → Built
4. Write/replace that step’s **Behavior delta** — **required**

## Behavior delta (required)

After code + build check, write a short intent diff for **this step**. Persist under the step in the phase plan **and** show it in chat.

```markdown
**Behavior delta** (post-build — Owner reviews before `/verify-phase`):
- **Intent status:** pending_owner_review
- **ADDED:**
  - The system SHALL …
    - **Scenario:** [short title]
      - WHEN …
      - THEN …
      - AND … (optional)
- **CHANGED:**
  - The system SHALL … (was: …)
    - **Scenario:** …
      - WHEN …
      - THEN …
- **REMOVED:**
  - The system no longer … (or `none`)
- **UNCHANGED (explicit non-goals for this step):**
  - …
- **Risks / edge cases to watch in verification:**
  - …
```

Rules:
- 1–4 requirements per step; **each ADDED/CHANGED SHALL has ≥1 scenario** with **WHEN** (trigger) and **THEN** (observable outcome). Optional **AND** for extra outcomes.
- Context may live in WHEN or the phase plan — no required GIVEN block.
- Product behavior language; align with product spec + done-when; surface unintended adds; not proof of correct code.
- **Before the intent gate:** if any ADDED/CHANGED `SHALL` lacks a scenario → **STOP** and complete the delta (do not offer Accept/Reject yet).
- After the delta is complete, write the **Trace** table (below) under the same step — required before the intent gate.

## Trace (SHALL → WHEN/THEN → verify)

Persist under the step in the phase plan (after Behavior delta) **and** show in chat. One row per scenario (ADDED/CHANGED; include REMOVED scenarios if present).

```markdown
**Trace** — Phase PHASE Step STEP
| # | Kind | SHALL (short) | Scenario | WHEN (short) | THEN (Expected) | Verify # |
|---|------|---------------|----------|--------------|-----------------|----------|
| 1 | ADDED | … | … | … | … | V1 |
| 2 | CHANGED | … | … | … | … | V2 |
```

Rules:
- **THEN (Expected)** must match what `/verify-phase` will put in checklist **Expected**
- **Verify #** = checklist item id the Owner will run (`V1`, `V2`, …) — same ids `/verify-phase` must use
- Do **not** change WHEN/THEN scenario rules; this table only traces them
- If Trace is missing or a scenario has no row → **STOP** and complete Trace before the intent gate

## After implementation

1. Run `npm run build` — fix until pass
2. Update [`docs/PROGRESS.md`](docs/PROGRESS.md) — mark phase in progress; **overwrite Phase health (resume)**:

```text
Phase: PHASE — (title)
Step: STEP — (title)
Status: awaiting-intent
Verified steps: (prior verified step ids this phase, or none)
Open rejects / fails: none
Evidence: none
Next: after Accept → /verify-phase PHASE STEP
Updated: YYYY-MM-DD
```

   On intent **1. Accept** (same session): set `Status: awaiting-verify` and `Next: /verify-phase PHASE STEP`. On **2. Reject**: set `Status: refining`, note the reject, `Next: /refine-phase PHASE STEP`.
3. Short summary: what built, how to try, what’s out of scope
4. **Lead with Behavior delta** + **Trace** table
5. **STOP** — Intent gate (Owner replies with a number):

```text
Behavior delta ready:
1. Accept → /verify-phase PHASE STEP
2. Reject → /refine-phase PHASE STEP (or chat notes), then re-review delta
```

6. Do not suggest `/audit-phase` or `/complete-phase` until all steps verified

Do not start the next step until Owner confirms verification passed (or explicitly continues).
