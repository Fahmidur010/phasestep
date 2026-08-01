---
description: Generate step-by-step execution plan for a build phase
argument-hint: [phase-id]
---

Generate the **execution plan** for **Build Phase $ARGUMENTS** and write it to:

**[`{{PHASE_PLANS_DIR}}/phase-$ARGUMENTS.md`](../../{{PHASE_PLANS_DIR}}/phase-$ARGUMENTS.md)**

Use a filesystem-safe filename (e.g. `phase-6a.md`).

## Before writing

1. Read [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}}) — Phase $ARGUMENTS section only
2. Read [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}}) — matching product behavior
3. Read [`{{USER_FLOW}}`](../../{{USER_FLOW}}) — interaction map (if present / accepted)
4. Read [`{{DECISIONS}}`](../../{{DECISIONS}}) — list **decision gates** for this phase
5. Read [`{{PROGRESS}}`](../../{{PROGRESS}}) — confirm prior phases complete unless Owner overrides
6. Read [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}}) — project conventions
7. If [`{{PROJECT_MAP}}`](../../{{PROJECT_MAP}}) Status is `current`, use its modules/hubs/seams to orient Files / scope (context only). If stale and the phase touches structure → `/map-project refresh` first. Skip if empty.
8. Scan the codebase for patterns relevant to this phase
9. Read [`.cursor/commands/README.md`](./README.md) — step workflow
10. Read [`{{CONSTITUTION}}`](../../{{CONSTITUTION}}) if unclear on gates

## Clarify STOP (before writing the plan)

After the reads above, **do not write** `phase-$ARGUMENTS.md` yet. Scan product, user flow, decisions, and BUILD_PLAN Phase $ARGUMENTS for **ambiguities that would change the plan** if answered differently (actors, happy/error paths, scope edges, blocker TBDs, conflicting docs, missing acceptance criteria).

**Skip the STOP** (write the plan immediately) only when:
- No material ambiguities for this phase, **or**
- Owner already answered the open questions in **this chat** (apply those answers; note them under Decision gates / Prerequisites)

Otherwise present a short list (prefer **3–7** items; cap at **10**). Each item: one clear question + why it blocks a good plan + your recommended default if Owner says “use defaults.”

```markdown
**Clarify before plan** — Phase $ARGUMENTS
| # | Ambiguity | Why it matters for this plan | Suggested default |
|---|-----------|------------------------------|-------------------|
| 1 | … | … | … |
```

Then **STOP** — numbered Owner gate (reply with the number alone is enough):

```text
Clarify before plan — Phase $ARGUMENTS:
1. Answer the questions (reply inline or as "1a: … 2a: …") → then write the phase plan
2. Use suggested defaults for all → then write the phase plan (record defaults in the plan)
3. Answer some, defaults for the rest → then write the phase plan
4. Abort planning — Owner will update product/flow/decisions first
```

Rules:
- **Docs only** after this gate — still no application code
- Record Owner answers / defaults in the phase plan (**Decision gates** and/or a short **Clarify answers** section)
- If option **4**, do **not** write `phase-$ARGUMENTS.md`
- Do **not** invent product behavior to avoid asking; prefer a short STOP over a wrong plan

## Plan quality checklist (before / with the written plan)

After Clarify is resolved (or skipped), draft the phase plan, then run this checklist on the **plan draft** against product/flow (docs only — **not** Behavior delta WHEN/THEN; those are filled at `/build-phase`).

```markdown
**Plan quality checklist** — Phase $ARGUMENTS
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
1. Revise the plan draft (and clarify more if needed) → then write phase-$ARGUMENTS.md
2. Write anyway — record gaps under Plan quality checklist in the file
3. Abort planning
```

**If all pass or only minor gaps** → write `phase-$ARGUMENTS.md` including the checklist section (Status `pass` / `gap` with notes). Do not invent a STOP for minor gaps alone.

## Guardrails

- **Do not write application code** — planning only
- **Do not start the next phase** — plan only Phase $ARGUMENTS
- Follow phase order in `{{BUILD_PLAN}}`
- If decision gates are **blockers**, list them prominently (and surface them in Clarify STOP when they block planning)
- Support **build → intent (Behavior delta) → verify** per step; leave a **Behavior delta** placeholder under each step

## Output file structure

```markdown
# Phase $ARGUMENTS — [Title from BUILD_PLAN]

**Generated:** [date]
**Status:** planned
**Source:** BUILD_PLAN Phase $ARGUMENTS

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

### Step 1 — [title]
- **Status:** pending | built | verified
- **Task:** …
- **Files:** …
- **Done when:** …
- **Behavior delta:** _(filled by /build-phase — each SHALL with ≥1 WHEN/THEN scenario)_
- **Trace:** _(filled by /build-phase — SHALL → Scenario → WHEN → THEN → Verify #)_
- **Step verification** (for `/verify-phase $ARGUMENTS 1`):
  1. **Steps:** … → **Expected:** … _(align Expected with Behavior delta THEN / Trace after build; use Verify # ids)_

(Continue for all steps. Prefer small Owner-verifiable steps.)

## Schema / data / migrations (if applicable)
- …

## Routes / APIs / entry points (if applicable)
| Entry | Purpose | Guard | Step |

## UI / surfaces (if applicable)
| Surface | Purpose | Step |

## Seed / test data
- …

## Build verification
- [ ] `{{BUILD_COMMAND}}` passes after each step build

## Step progress tracker
| Step | Title | Built | Owner verified |
|------|-------|-------|----------------|

## Verification rollup (optional)
Cross-step smoke only — do not duplicate every step item.

## Audit checkpoints
Items for `/audit-phase $ARGUMENTS` after all steps verified.

## Files checklist
| Action | Path | Step |
```

## After writing

1. Ensure `{{PHASE_PLANS_DIR}}/` exists
2. Write `phase-$ARGUMENTS.md`
3. Tell Owner: path, clarify answers applied (or skipped), open gates, next = **`/build-phase $ARGUMENTS 1`**
4. Remind: intent + verify per step; audits only after all steps pass

Do **not** implement code in this command.
