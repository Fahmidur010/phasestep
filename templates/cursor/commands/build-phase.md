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
5. Read [`{{USER_FLOW}}`](../../{{USER_FLOW}}) if present
6. Read [`{{DECISIONS}}`](../../{{DECISIONS}}) — stop on blockers
7. Read [`{{PROGRESS}}`](../../{{PROGRESS}}) — prior phases
8. Read [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}})
9. For UI steps: if [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) exists, follow it
10. If Owner chat asks to change a **core principle** or behavior that **cascades to other features/phases** → **do not code yet**. Follow the **Cross-cutting STOP** in [`refine-phase`](./refine-phase.md) (decision → product/flow sync → re-scope), then return to this step with an updated plan/delta. Local step work only after that gate (or Owner picks scoped/defer).

## Implementation rules

- Minimize scope to the step’s done-when
- Match existing project patterns
- Do **not** commit unless Owner asks — standard path is `/pr-step` (Owner-gated), not an implicit commit after build
- Do **not** silently cascade principle changes across features during a single step build

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

## After implementation

1. Run `{{BUILD_COMMAND}}` — fix until pass
2. Update [`{{PROGRESS}}`](../../{{PROGRESS}}) — mark phase in progress
3. Short summary: what built, how to try, what’s out of scope
4. **Lead with Behavior delta**
5. **STOP** — Intent gate (Owner replies with a number):

```text
Behavior delta ready:
1. Accept → /verify-phase PHASE STEP
2. Reject → /refine-phase PHASE STEP (or chat notes), then re-review delta
```

6. Do not suggest `/audit-phase` or `/complete-phase` until all steps verified

Do not start the next step until Owner confirms verification passed (or explicitly continues).
