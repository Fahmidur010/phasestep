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

- **Missing** → **STOP**: tell Owner to run `/build-phase PHASE STEP` to produce the delta (with scenarios).
- **Present but any ADDED/CHANGED `SHALL` lacks a WHEN/THEN scenario** → **STOP**: complete the delta via `/build-phase` or `/refine-phase` before verify.
- `pending_owner_review` → remind to accept or reject (reject → `/refine-phase`) before treating UAT as final
- If Owner already accepted in chat, proceed; on verify pass set **Intent status: accepted**

Include a short **Intent reminder** (3–6 bullets) from ADDED/CHANGED/REMOVED **and** list each **Scenario** title with its **THEN** outcome.

## Scenarios → checklist

After reading the Behavior delta:

1. For **each** scenario under ADDED/CHANGED (and REMOVED if present), add or update a checklist item whose **Expected** matches the scenario’s **THEN** (and **AND** lines if they are separate observable checks).
2. Keep the phase plan **Step verification** block as the primary structure; **merge** scenario THEN outcomes — do not duplicate conflicting expectations. If plan and delta disagree → **STOP** and ask Owner which is correct before verify.
3. **Steps** column = what the Owner does (from WHEN, made concrete: URLs, buttons, roles, test data).
4. At least one checklist item per scenario; happy path + material edge cases from **Risks** when relevant.

## Evidence by surface (before Playwright)

Decide the step’s surface from Behavior delta / product / stack:

| Surface | Evidence path |
|---------|----------------|
| **Web UI** (browser-rendered) | Playwright sections below (detect → mid-flight → evidence) |
| **Flutter / React Native** | **Native evidence** — never Playwright mid-flight |
| **Backend / CLI / API-only** | **Backend tool evidence** — never Playwright |

### Native evidence (Flutter / React Native)

1. Check [`{{STACK_CATALOG}}`](../../{{STACK_CATALOG}}) `verification` for `flutter-analyzer-evidence` / `react-native-device-evidence` and `{{PROGRESS}}` enrichment log.
2. Add checklist items the Owner can run on a device/simulator plus agent-runnable tools:
   - Flutter: `flutter analyze`, `flutter test` (and `buildCommand` if set)
   - React Native: project typecheck/lint/tests + `buildCommand` (e.g. `tsc`, Expo lint) — do not invent Detox/Maestro installs unless Owner asks
3. Report **Evidence: pass | fail | not run** (tool) next to items; Owner marks Pass/Fail for device UAT judgment.
4. If verification was skipped at setup → proceed with Owner/device UAT + `buildCommand` only. Do **not** offer Playwright.

### Backend tool evidence (API / CLI / no browser UI)

1. Prefer catalog `backend-tool-evidence` + project `buildCommand`.
2. Checklist: build/lint/test commands + Owner checks against API/CLI contracts from the Behavior delta.
3. Optional HTTP smoke (curl/script) **only** if Owner wants it — never invent a browser path.
4. If the product actually has a web UI on a stack like Laravel → use the **Web UI** / Playwright path instead.

## Playwright — detect before evidence

When this step touches a **web UI** surface (not Flutter/RN native, not backend-only):

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
- **Don't ask again for build phase PHASE** → append to `{{PROGRESS}}`: `Playwright mid-flight: declined — build phase PHASE` (date). No further mid-flight offers for this build phase (including `/audit-phase`). Proceed Owner-only.

Never auto-install. Never block verification if Owner chooses 2 or 3.

## Playwright evidence (optional — strengthens UAT; does not replace Owner)

When Playwright is available (setup accept, mid-flight install, or already in `package.json` / MCP config):

1. Prefer **`playwright-cli`** (token-efficient). Use MCP only if the Owner installed it and prefers exploratory sessions.
2. Add an **Automated evidence** subsection under the checklist:
   - Commands the agent (or Owner) can run, e.g. open app URL → exercise each Behavior delta **scenario** (WHEN action → observe THEN outcome) → snapshot / screenshot on fail
   - Map each critical checklist item to a concrete CLI action when possible
3. Report outcomes as **Evidence: pass | fail | not run** next to those items. Owner still marks Pass/Fail for UAT judgment.
4. If a companion skill such as **playwright-best-practices** was installed into the project → follow that skill’s guidance when designing evidence steps (stable locators, waits, isolation). Do not invent a parallel best-practices doc from memory.
5. Playwright **adds proof**; it never auto-accepts intent or skips the Owner gate.

## Output format

### Setup
- How to run the app / target environment
- Test accounts / fixtures from the phase plan
- Entry points for **this step only**
- Playwright available? yes (cli / mcp) | no | n/a (native/backend)

### Intent reminder
- …

### Checklist (numbered)
Each item: **Steps** → **Expected** → Pass / Fail (Owner fills in) → Evidence (manual | playwright-cli | mcp | flutter-analyze | rn-tool | buildCommand | none)

Keep short; call out regression risks to earlier verified steps only when relevant.

### Automated evidence (if Playwright available)
- Commands run
- Results (pass/fail) tied to checklist item numbers

## End message

- Confirm intent accepted before treating verification as final
- **STOP** once Owner has filled the checklist — reply with a number:

```text
Step verification result:
1. Pass — mark step verified + delta accepted → /build-phase PHASE <next>
2. Fail — /refine-phase PHASE STEP then re-verify
```

- When **all** steps verified: optional `/audit-ds` (if present) then `/audit-phase`
- Do not suggest `/complete-phase` until audits are clean
