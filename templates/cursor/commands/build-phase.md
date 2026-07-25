---
description: Implement one step (or next unfinished step) of a build phase
argument-hint: [phase] [step?]
---

Implement **one step** of **Build Phase** for this project (Phasestep).

## Parse arguments

`$ARGUMENTS` is `PHASE` optionally followed by `STEP` (e.g. `4`, `4 1`, `4 2`).

- **PHASE** = first token
- **STEP** = second token if present
- If **STEP** is omitted: build the **next unfinished** step (first not `verified`). Do **not** build the entire phase.
- Only build all remaining steps if Owner explicitly says so.

## Required: phase plan

**Primary checklist:** [`{{PHASE_PLANS_DIR}}/phase-PHASE.md`](../../{{PHASE_PLANS_DIR}}/)

If missing, **stop** — tell Owner to run **`/plan-phase PHASE`** first.

## Before coding

1. Read **`phase-PHASE.md`** — only the target step
2. Confirm prior steps are **verified** (or Owner allows skip). If previous is `built`/unverified, **stop** and tell Owner to **`/verify-phase PHASE <prev>`**
3. Read [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}}) — Phase PHASE (reference)
4. Read [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}})
5. Read [`{{DECISIONS}}`](../../{{DECISIONS}}) — stop on blockers
6. Read [`{{PROGRESS}}`](../../{{PROGRESS}}) — prior phases
7. Read [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}})
8. For UI steps: if [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) exists, follow it

## Implementation rules

- Minimize scope to the step’s done-when
- Match existing project patterns
- Do **not** commit unless Owner asks

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
- **CHANGED:**
  - The system SHALL … (was: …)
- **REMOVED:**
  - The system no longer … (or `none`)
- **UNCHANGED (explicit non-goals for this step):**
  - …
- **Risks / edge cases to watch in verification:**
  - …
```

Rules: product behavior language; 3–12 bullets; align with product spec + done-when; surface unintended adds; not proof of correct code.

## After implementation

1. Run `{{BUILD_COMMAND}}` — fix until pass
2. Update [`{{PROGRESS}}`](../../{{PROGRESS}}) — mark phase in progress
3. Short summary: what built, how to try, what’s out of scope
4. **Lead with Behavior delta**
5. Intent gate:
   - **Accept** → `/verify-phase PHASE STEP`
   - **Reject** → `/refine-phase PHASE STEP` (or chat notes), then re-review delta
6. Do not suggest `/audit-phase` or `/complete-phase` until all steps verified

Do not start the next step until Owner confirms verification passed (or explicitly continues).
