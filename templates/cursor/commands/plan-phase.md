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
3. Read [`{{DECISIONS}}`](../../{{DECISIONS}}) — list **decision gates** for this phase
4. Read [`{{PROGRESS}}`](../../{{PROGRESS}}) — confirm prior phases complete unless Owner overrides
5. Read [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}}) — project conventions
6. Scan the codebase for patterns relevant to this phase
7. Read [`.cursor/commands/README.md`](./README.md) — step workflow
8. Read [`{{CONSTITUTION}}`](../../{{CONSTITUTION}}) if unclear on gates

## Guardrails

- **Do not write application code** — planning only
- **Do not start the next phase** — plan only Phase $ARGUMENTS
- Follow phase order in `{{BUILD_PLAN}}`
- If decision gates are **blockers**, list them prominently
- Support **build → intent (Behavior delta) → verify** per step; leave a **Behavior delta** placeholder under each step

## Output file structure

```markdown
# Phase $ARGUMENTS — [Title from BUILD_PLAN]

**Generated:** [date]
**Status:** planned
**Source:** BUILD_PLAN Phase $ARGUMENTS

---

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
- **Behavior delta:** _(filled by /build-phase)_
- **Step verification** (for `/verify-phase $ARGUMENTS 1`):
  1. **Steps:** … → **Expected:** …

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
3. Tell Owner: path, open gates, next = **`/build-phase $ARGUMENTS 1`**
4. Remind: intent + verify per step; audits only after all steps pass

Do **not** implement code in this command.
