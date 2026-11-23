---
name: plan-phase
description: Plan a named build phase (full ahead or progressive — steps filled as you build)
argument-hint: [phase-slug]
---

> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.

Open or write the **execution plan** for one **named build phase** at `docs/phase-plans/phase-<id>.md`.

Supports **classic** (all steps planned now) and **progressive** (thin plan now; each `/build-phase <slug> N` records that step as the Owner describes it — common for new features after earlier phases).

## Resolve phase id

`$ARGUMENTS` is **PHASE_RAW** (one token — prefer kebab-case slug, e.g. `ssl-commerce`).

1. Normalize to a **slug** (lowercase kebab-case). Soft compat: integer `N` → existing `phase-N.md` or BUILD_PLAN order → slug; else STOP for slug.
2. If BUILD_PLAN already has this slug → resolve **title** from `## Phase: <id> — <Title>` or order line.
3. If BUILD_PLAN has **no** matching phase → **New phase STOP** (do not invent silently):

```text
Phase slug PHASE is not in BUILD_PLAN yet:
1. Add it — title: … (suggest from slug); sketch in/out of scope → append Phase order + ## Phase: PHASE — Title → then continue
2. Abort — use a different existing slug
```

- **1** → update [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) (Owner Accept implied by choosing 1); mark progress if useful; continue.  
- **2** → stop.

4. **Plan file:** [`docs/phase-plans/phase-<id>.md`](docs/phase-plans/phase-<id>.md)
5. Show **`<id> — <Title>`** in chat. **Steps stay numeric.**

Below, **PHASE** = resolved **id**.

## Before writing

1. Read [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) — section **Phase: PHASE** (or legacy Phase PHASE) only
2. Read [`docs/product.md`](docs/product.md) — matching product behavior
3. Read [`docs/USER_FLOW.md`](docs/USER_FLOW.md) — interaction map (if present / accepted)
4. Read [`docs/decisions.md`](docs/decisions.md) — list **decision gates** for this phase
5. Read [`docs/PROGRESS.md`](docs/PROGRESS.md) — confirm prior phases complete unless Owner overrides
6. Read [`docs/architecture.md`](docs/architecture.md) — project conventions
7. If [`docs/PROJECT_MAP.md`](docs/PROJECT_MAP.md) Status is `current`, use its modules/hubs/seams to orient Files / scope (context only). If stale and the phase touches structure → `/map-project refresh` first. Skip if empty.
8. Scan the codebase for patterns relevant to this phase
9. Read [`.cursor/commands/README.md`](./README.md) — step workflow
10. Read [`docs/PHASESTEP.md`](docs/PHASESTEP.md) if unclear on gates

## Planning mode STOP

Before Clarify / write, **STOP** once (skip if Owner already chose in this chat):

```text
How to plan PHASE — Title:
1. Full plan now — draft all steps ahead (classic)
2. Progressive — thin plan now; each /build-phase PHASE N records that step from Owner’s description
```

- **1** → classic path (Clarify + Plan quality + full Implementation steps).  
- **2** → **Progressive path** below (lighter Clarify; thin file; Status `progressive`).

## Progressive path (mode 2)

Owner will discover steps one at a time. **Docs only** here — no application code.

1. Light Clarify only if scope/title/product conflict is blocking (else skip).
2. Write `phase-PHASE.md` with:
   - **Status:** `planned` (lifecycle; moves to `in_progress` / `complete` with builds)
   - **Mode:** `progressive`
   - Scope boundaries (best-effort in/out)
   - Empty or placeholder **Implementation steps** (do **not** invent a full step list)
   - Step progress tracker ready for rows filled at build time
   - Audit checkpoints / Files checklist stubs (filled as steps land)
3. Soft Plan quality: note `progressive — steps filled at /build-phase`; do not require complete step coverage.
4. Tell Owner next: **`/build-phase PHASE 1`** and describe what step 1 should do in chat. Then verify → `/build-phase PHASE 2` … When happy → `/audit-ds PHASE` → `/audit-phase PHASE` → `/complete-phase PHASE`.

Skip the classic Clarify / full Plan quality STOPs when mode is progressive unless something is blocking.

## Clarify STOP (before writing the plan) — classic mode 1 only

After the reads above, **do not write** `phase-PHASE.md` yet. Scan product, user flow, decisions, and BUILD_PLAN for this phase for **ambiguities that would change the plan** if answered differently (actors, happy/error paths, scope edges, blocker TBDs, conflicting docs, missing acceptance criteria).

**Skip the STOP** (write the plan immediately) only when:
- No material ambiguities for this phase, **or**
- Owner already answered the open questions in **this chat** (apply those answers; note them under Decision gates / Prerequisites)

Otherwise present a short list (prefer **3–7** items; cap at **10**). Each item: one clear question + why it blocks a good plan + your recommended default if Owner says “use defaults.”

```markdown
**Clarify before plan** — PHASE — Title
| # | Ambiguity | Why it matters for this plan | Suggested default |
|---|-----------|------------------------------|-------------------|
| 1 | … | … | … |
```

Then **STOP** — numbered Owner gate (reply with the number alone is enough):

```text
Clarify before plan — PHASE — Title:
1. Answer the questions (reply inline or as "1a: … 2a: …") → then write the phase plan
2. Use suggested defaults for all → then write the phase plan (record defaults in the plan)
3. Answer some, defaults for the rest → then write the phase plan
4. Abort planning — Owner will update product/flow/decisions first
```

Rules:
- **Docs only** after this gate — still no application code
- Record Owner answers / defaults in the phase plan (**Decision gates** and/or a short **Clarify answers** section)
- If option **4**, do **not** write `phase-PHASE.md`
- Do **not** invent product behavior to avoid asking; prefer a short STOP over a wrong plan

## Plan quality checklist (before / with the written plan) — classic mode 1

After Clarify is resolved (or skipped), draft the phase plan, then run this checklist on the **plan draft** against product/flow (docs only — **not** Behavior delta WHEN/THEN; those are filled at `/build-phase`).

```markdown
**Plan quality checklist** — PHASE — Title
| Check | Status | Note |
|-------|--------|------|
| Steps are Owner-verifiable (done-when is observable) | pass / gap | … |
| Actors / who clear for this phase | pass / gap | … |
| Happy path covered | pass / gap | … |
| Error / empty / cancel paths covered or explicit N/A | pass / gap | … |
| Ambiguous terms avoided in done-when | pass / gap | … |
| In/out of scope stated | pass / gap | … |
| No step depends on unresolved blocker decisions | pass / gap | … |
```

**If critical gaps** (e.g. every done-when is mushy, or a step needs a blocker decision) → **STOP** before writing the file:

```text
Plan quality checklist — gaps:
1. Revise the plan draft (and clarify more if needed) → then write phase-PHASE.md
2. Write anyway — record gaps under Plan quality checklist in the file
3. Abort planning
```

**If all pass or only minor gaps** → write `phase-PHASE.md` including the checklist section (Status `pass` / `gap` with notes). Do not invent a STOP for minor gaps alone.

## Guardrails

- **Do not write application code** — planning only
- **Do not start building** here — next is `/build-phase PHASE 1` (or next step)
- New phases may be appended to `docs/BUILD_PLAN.md` via New phase STOP (Owner choice **1**)
- Progressive mode is first-class — do not force a fake full step list
- If decision gates are **blockers**, list them prominently (classic Clarify; progressive only if blocking)
- Support **build → intent (Behavior delta) → verify** per step

## Output file structure

```markdown
# PHASE — Title

**Generated:** [date]
**Status:** planned | in_progress | complete _(lifecycle)_
**Mode:** classic | progressive _(how steps are authored — progressive keeps Mode until complete)_
**Id:** PHASE
**Source:** BUILD_PLAN Phase: PHASE

---

## Clarify answers
| # | Question | Owner answer / default used |
|---|----------|-------------------------------|
| … | … | … |

_(Omit this section only when Clarify STOP was skipped — no material ambiguities.)_

## Plan quality checklist
| Check | Status | Note |
|-------|--------|------|
| Steps Owner-verifiable | pass / gap | … |
| Actors clear | pass / gap | … |
| Happy path | pass / gap | … |
| Error / empty / cancel | pass / gap | … |
| Ambiguous terms | pass / gap | … |
| In/out of scope | pass / gap | … |
| No blocker-decision dependency | pass / gap | … |

## Prerequisites
- [ ] Prior phase(s) complete in progress doc
- [ ] Decision gates resolved (see below)

## Scope boundaries
### In scope
- …
### Out of scope
- …

## Decision gates
| ID | Question | Status | Notes |
|----|----------|--------|-------|

## Implementation steps

_(Classic: list all steps. Progressive: leave empty or “Steps added at /build-phase as Owner describes them.”)_

### Step 1 — [title]
- **Status:** pending | built | verified
- **Task:** …
- **Files:** …
- **Done when:** …
- **Behavior delta:** _(filled by /build-phase — each SHALL with ≥1 WHEN/THEN scenario)_
- **Trace:** _(filled by /build-phase — SHALL → Scenario → WHEN → THEN → Verify #)_
- **Step verification** (for `/verify-phase PHASE 1`):
  1. **Steps:** … → **Expected:** … _(align Expected with Behavior delta THEN / Trace after build; use Verify # ids)_

(Continue for all steps in classic mode. **Step numbers stay integers.**)

## Schema / data / migrations (if applicable)
- …

## Routes / APIs / entry points (if applicable)
| Entry | Purpose | Guard | Step |

## UI / surfaces (if applicable)
| Surface | Purpose | Step |

## Seed / test data
- …

## Build verification
- [ ] `npm run build` passes after each step build

## Step progress tracker
| Step | Title | Built | Owner verified |
|------|-------|-------|----------------|

## Verification rollup (optional)
Cross-step smoke only — do not duplicate every step item.

## Audit checkpoints
Items for `/audit-phase PHASE` after all steps verified.

## Files checklist
| Action | Path | Step |
```

## After writing

1. Ensure `docs/phase-plans/` exists
2. Write `phase-PHASE.md`
3. Tell Owner: path, **PHASE — Title**, mode (classic | progressive), next = **`/build-phase PHASE 1`**
4. Progressive reminder: describe each step in chat when building; plan grows; when done → `/audit-ds PHASE` → `/audit-phase PHASE` → `/complete-phase PHASE`
5. Classic reminder: intent + verify per step; audits only after all steps pass

Do **not** implement code in this command.
