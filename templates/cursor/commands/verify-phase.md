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
- [`{{STACK_CATALOG}}`](../../{{STACK_CATALOG}}) `verification` lane — only if this step has a **browser UI** surface

## Playwright evidence (optional — strengthens UAT; does not replace Owner)

When the step’s Behavior delta / verification touches a **web UI**, and Playwright was accepted in setup (or is already installed — see catalog `detectInstalled`):

1. Prefer **`playwright-cli`** (token-efficient). Use MCP only if the Owner installed it and prefers exploratory sessions.
2. Add an **Automated evidence** subsection under the checklist:
   - Commands the agent (or Owner) can run, e.g. open app URL → exercise the ADDED/CHANGED behavior → snapshot / screenshot on fail
   - Map each critical checklist item to a concrete CLI action when possible
3. Report outcomes as **Evidence: pass | fail | not run** next to those items. Owner still marks Pass/Fail for UAT judgment.
4. If Playwright is **not** installed → do **not** install silently. Note “Playwright not configured — Owner UAT only” and optionally point to `/setup` Stage 4 verification lane or catalog recipes.
5. If Playwright **is** available and a companion skill such as **playwright-best-practices** was installed into the project → follow that skill’s guidance when designing evidence steps (stable locators, waits, isolation). Do not invent a parallel best-practices doc from memory.
6. Playwright **adds proof**; it never auto-accepts intent or skips the Owner gate.

## Output format

### Setup
- How to run the app / target environment
- Test accounts / fixtures from the phase plan
- Entry points for **this step only**
- Playwright available? yes (cli / mcp) | no

### Intent reminder
- …

### Checklist (numbered)
Each item: **Steps** → **Expected** → Pass / Fail (Owner fills in) → Evidence (manual | playwright-cli | mcp | none)

Keep short; call out regression risks to earlier verified steps only when relevant.

### Automated evidence (if Playwright available)
- Commands run
- Results (pass/fail) tied to checklist item numbers

## End message

- Confirm intent accepted before treating verification as final
- On **pass:** mark step `verified` + delta `accepted` → `/build-phase PHASE <next>`
- On **fail:** `/refine-phase PHASE STEP` then re-verify
- When **all** steps verified: optional `/audit-ds-phase` (if present) then `/audit-phase`
- Do not suggest `/complete-phase` until audits are clean
