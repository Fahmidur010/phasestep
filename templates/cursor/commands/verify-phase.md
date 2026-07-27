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

## Playwright — detect before evidence

When this step touches a **web UI** surface:

1. Check [`{{STACK_CATALOG}}`](../../{{STACK_CATALOG}}) `verification` + `detectInstalled` and `{{PROGRESS}}` Stack enrichment log.
2. **Installed / accepted** → use **Playwright evidence** below.
3. **Not configured** → run **Mid-flight offer** below (once per build phase unless Owner already declined).

## Mid-flight Playwright offer (when UI + not configured)

Use when Playwright was skipped at `/setup` Stage 4 or never installed, and this step needs browser verification.

Before writing the checklist, check `{{PROGRESS}}` for:

```text
Playwright mid-flight: declined — build phase PHASE
```

If that line exists → **do not offer again**. Note “Playwright not configured — Owner UAT only” and continue.

Otherwise **STOP once** (do **not** install silently):

```text
Playwright is not configured for this project, but this step has a web UI.
1. Install now — playwright-cli (+ recommended companions from catalog) | optional MCP
2. Continue Owner-only UAT — this step only (may offer again on a later UI step in this phase)
3. Don't ask again for build phase PHASE — quiet for the rest of this delivery phase (verify + build audit)
```

- **Install now** → present the same catalog recipes as `/setup` Stage 4 section C (+ `playwright-best-practices` if `recommendedWith` matches). Apply only what Owner selects. Record in Stack enrichment log. Then continue this command with Playwright evidence.
- **Continue Owner-only** → proceed with manual checklist for **this step only**. Later UI steps in the same phase may offer again.
- **Don't ask again for build phase PHASE** → append to `{{PROGRESS}}`: `Playwright mid-flight: declined — build phase PHASE` (date). No further mid-flight offers for this build phase (including Mode A `/audit-phase`). Proceed Owner-only.

Never auto-install. Never block verification if Owner chooses 2 or 3.

## Playwright evidence (optional — strengthens UAT; does not replace Owner)

When Playwright is available (setup accept, mid-flight install, or already in `package.json` / MCP config):

1. Prefer **`playwright-cli`** (token-efficient). Use MCP only if the Owner installed it and prefers exploratory sessions.
2. Add an **Automated evidence** subsection under the checklist:
   - Commands the agent (or Owner) can run, e.g. open app URL → exercise the ADDED/CHANGED behavior → snapshot / screenshot on fail
   - Map each critical checklist item to a concrete CLI action when possible
3. Report outcomes as **Evidence: pass | fail | not run** next to those items. Owner still marks Pass/Fail for UAT judgment.
4. If a companion skill such as **playwright-best-practices** was installed into the project → follow that skill’s guidance when designing evidence steps (stable locators, waits, isolation). Do not invent a parallel best-practices doc from memory.
5. Playwright **adds proof**; it never auto-accepts intent or skips the Owner gate.

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
