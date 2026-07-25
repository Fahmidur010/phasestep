---
description: Manual verification checklist for one phase step (owner)
argument-hint: [phase] [step?]
---

Prepare the **manual verification checklist** for one **step**. **Do not write or change code.**

## Parse arguments

`$ARGUMENTS` is `PHASE` optionally followed by `STEP`.

- If **STEP** omitted: show built vs verified; checklist for latest built/unverified step (or ask)

## Required

Read [`{{PHASE_PLANS_DIR}}/phase-PHASE.md`](../../{{PHASE_PLANS_DIR}}/)

If missing → Owner should run `/plan-phase PHASE` first.

**Primary checklist:** that step’s **Step verification** block.

## Intent gate

Read the step’s **Behavior delta**.

- Missing → note intent review skipped; still provide checklist
- `pending_owner_review` → remind to accept or reject (reject → `/refine-phase`) before treating UAT as final
- If Owner already accepted in chat, proceed; on verify pass set **Intent status: accepted**

Include a short **Intent reminder** (3–6 bullets) from ADDED/CHANGED/REMOVED.

## Read first

- Phase plan step (verification + delta + seed/test notes)
- [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}})

## Output format

### Setup
- How to run the app / target environment
- Test accounts / fixtures from the phase plan
- Entry points for **this step only**

### Intent reminder
- …

### Checklist (numbered)
Each item: **Steps** → **Expected** → Pass / Fail (Owner fills in)

Keep short; call out regression risks to earlier verified steps only when relevant.

## End message

- Confirm intent accepted before treating verification as final
- On **pass:** mark step `verified` + delta `accepted` → `/build-phase PHASE <next>`
- On **fail:** `/refine-phase PHASE STEP` then re-verify
- When **all** steps verified: optional `/audit-ds-phase` (if present) then `/audit-phase`
- Do not suggest `/complete-phase` until audits are clean
