---
name: verify-phase
description: Manual verification checklist for one step of a named build phase
argument-hint: [phase-slug] [step?]
---

> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.

Prepare the **manual verification checklist** for one **step**. **Do not write or change code.**

## Resolve phase id

`$ARGUMENTS` is `PHASE_RAW` optionally followed by `STEP`.

1. Prefer a **slug** from [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md). Soft compat: integer `N` → existing `phase-N.md` or BUILD_PLAN order position → slug.
2. Resolve **title**. Plan file: `phase-<id>.md`. **STEP** stays numeric; if omitted → latest built/unverified step (or ask).
3. Below, **PHASE** = resolved id. Show **PHASE — Title** in chat / Phase health.

## Required

Read [`docs/phase-plans/phase-PHASE.md`](docs/phase-plans/)

If missing → Owner should run `/plan-phase PHASE` first.

**Primary checklist:** that step’s **Step verification** block.

## Intent gate

Read the step’s **Behavior delta**.

- **Missing** → **STOP**: tell Owner to run `/build-phase PHASE STEP` to produce the delta (with scenarios).
- **Present but any ADDED/CHANGED `SHALL` lacks a WHEN/THEN scenario** → **STOP**: complete the delta via `/build-phase` or `/refine-phase` before verify.
- `pending_owner_review` → remind to accept or reject (reject → `/refine-phase`) before treating UAT as final
- If Owner already accepted in chat, proceed; on verify pass set **Intent status: accepted**

Include a short **Intent reminder** (3–6 bullets) from ADDED/CHANGED/REMOVED **and** list each **Scenario** title with its **THEN** outcome.

## UNCHANGED spot-check (required when present)

Read the step’s Behavior delta **UNCHANGED (explicit non-goals for this step)**.

- If UNCHANGED is empty / `none` / omitted → skip this section (note “No UNCHANGED non-goals”).
- Otherwise pick **at least one** material UNCHANGED item (prefer the riskiest for silent regression) and add a checklist item the Owner can run quickly:

```markdown
**UNCHANGED spot-check**
- **Non-goal:** …
- **Steps:** … (concrete action that would reveal if the old/unwanted behavior crept in)
- **Expected:** the non-goal still holds (old behavior absent / unrelated feature unchanged)
- Pass / Fail (Owner)
```

Rules:
- This is **regression guard**, not a new Behavior delta scenario — do not invent ADDED/CHANGED SHALLs here
- Keep it short (usually **1** item; at most **2** if two unrelated non-goals are high risk)
- On Fail → same path as other fails (`/refine-phase`), and call out that an UNCHANGED non-goal regressed
- Include the spot-check in the numbered checklist (e.g. after Trace Verify # rows) so the End message Pass/Fail covers it

## Scenarios → checklist

After reading the Behavior delta:

1. Prefer the step’s **Trace** table (SHALL → Scenario → WHEN → THEN → Verify #) when present. Each Trace row becomes (or updates) checklist item **Verify #** with **Expected** = THEN (and AND lines as separate checks if needed).
2. If Trace is **missing** but scenarios exist → build the checklist from scenarios as today, then **write Trace** into the phase plan under the step (same shape as `/build-phase`) before Owner UAT.
3. For **each** scenario under ADDED/CHANGED (and REMOVED if present), ensure a checklist item whose **Expected** matches the scenario’s **THEN**.
4. Keep the phase plan **Step verification** block as the primary structure; **merge** scenario THEN outcomes — do not duplicate conflicting expectations. If plan, Trace, and delta disagree → **STOP** and ask Owner which is correct before verify.
5. **Steps** column = what the Owner does (from WHEN / Trace WHEN, made concrete: URLs, buttons, roles, test data).
6. At least one checklist item per scenario; happy path + material edge cases from **Risks** when relevant.
7. When reporting results, reference **Verify #** from Trace so Owner can see SHALL ↔ scenario ↔ checklist in one place.
8. **Mid-phase side-work:** the checklist must cover the **current** Behavior delta / Trace / Step verification — including refinements absorbed into this step earlier. Do not verify only the original pre-absorb plan if the delta was updated.

## Evidence by surface (before Playwright)

Decide the step’s surface from Behavior delta / product / stack:

| Surface | Evidence path |
|---------|----------------|
| **Web UI** (browser-rendered) | Playwright sections below (detect → mid-flight → evidence) |
| **Flutter / React Native** | **Native evidence** — never Playwright mid-flight |
| **Backend / CLI / API-only** | **Backend tool evidence** — never Playwright |

## Evidence bar (pass / fail rules)

Each checklist item carries an **Evidence grade**:

| Grade | Meaning |
|-------|---------|
| `agent_tool` | Agent ran a matching-surface tool (Playwright / flutter analyze / buildCommand / HTTP smoke, etc.) and reported pass or fail |
| `owner_uat` | Owner marked Pass or Fail from manual / device / API observation |
| `not_run` | No tool run and Owner has not judged yet |

**Rules:**

1. **Inconclusive ≠ pass** — tool errors, wrong environment, flaky/unclear results → treat as fail or leave `not_run`; never claim Pass from inconclusive output.
2. **Wrong surface ≠ pass** — e.g. Playwright on API-only, or browser path on Flutter/RN → do not count as `agent_tool` evidence for that item.
3. **Step PASS** (End message option 1) only when:
   - every ADDED/CHANGED Trace **Verify #** has Owner Pass (`owner_uat`), **and**
   - no required Verify # is still `not_run` without Owner Pass, **and**
   - Intent is accepted (or set accepted on this Pass).
4. Owner remains the gate — `agent_tool` **strengthens**; it never auto-PASSes the step alone.
5. If evidence is incomplete → **STOP** and ask Owner to complete UAT or re-run tools; do not mark the step verified.

## Verification map (durable prove-paths)

Read [`docs/VERIFICATION_MAP.md`](docs/VERIFICATION_MAP.md) when present (context only — **never** overrides Behavior delta / Trace / Owner Pass).

1. Prefer existing map rows when choosing tool commands / Owner paths for this step’s surface.
2. After a successful verify (End message **1. Pass**), **append** a row when this step established a **new** durable prove path not already listed (Feature/surface · Prove how · Command/tool · Source `verify` · Notes). Set map Status `current`, Last updated today.
3. Do not rewrite Owner-edited rows; do not invent paths you did not run or the Owner did not perform.
4. If the file is missing → create from the Phasestep stub shape (or note Owner should `npx phasestep upgrade`) then seed from this step’s evidence only.

### Native evidence (Flutter / React Native)

1. Check [`.phasestep/stack-catalog.json`](.phasestep/stack-catalog.json) `verification` for `flutter-analyzer-evidence` / `react-native-device-evidence` and `docs/PROGRESS.md` enrichment log.
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

1. Check [`.phasestep/stack-catalog.json`](.phasestep/stack-catalog.json) `verification` + `detectInstalled` and `docs/PROGRESS.md` Stack enrichment log.
2. **Installed / accepted** → use **Playwright evidence** below.
3. **Not configured** → run **Mid-flight offer** below (once per build phase unless Owner already declined).

## Mid-flight Playwright offer (when UI + not configured)

Use when Playwright was skipped at `/setup` Stage 4 or never installed, and this step needs browser verification.

Before writing the checklist, check `docs/PROGRESS.md` for:

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
- **Don't ask again for build phase PHASE** → append to `docs/PROGRESS.md`: `Playwright mid-flight: declined — build phase PHASE` (date). No further mid-flight offers for this build phase (including `/audit-phase`). Proceed Owner-only.

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

### UNCHANGED spot-check
- Non-goal + Steps → Expected → Pass / Fail — or `No UNCHANGED non-goals`

### Checklist (numbered)
Each item: **Steps** → **Expected** → Pass / Fail (Owner fills in) → Evidence grade (`agent_tool` \| `owner_uat` \| `not_run`) → tool note (manual | playwright-cli | mcp | flutter-analyze | rn-tool | buildCommand | none)

Include Trace **Verify #** rows and the **UNCHANGED spot-check** when applicable. Keep short; call out regression risks to earlier verified steps only when relevant. Reminder: inconclusive / wrong surface → not Pass.

### Automated evidence (if Playwright available)
- Commands run
- Results (pass/fail) tied to checklist item numbers

## End message

- Confirm intent accepted before treating verification as final
- **STOP** once Owner has filled the checklist — reply with a number:

```text
Step verification result:
1. Pass — only if Evidence bar met (all ADDED/CHANGED Verify # Owner Pass; no required not_run) → mark verified + delta accepted → /build-phase PHASE <next> (or /pr-step update)
2. Fail — /refine-phase PHASE STEP then re-verify (include Failure brief)
3. Incomplete evidence — finish Owner UAT / re-run matching-surface tools; do not mark verified yet
```

- After the Owner replies, **overwrite Phase health (resume)** in [`docs/PROGRESS.md`](docs/PROGRESS.md):

```text
Phase: PHASE — (title)
Step: STEP — (title)
Status: verified | refining
Verified steps: (include this STEP on Pass)
Open rejects / fails: none | (failed Verify # / UNCHANGED spot-check ids)
Evidence: manual | playwright-cli | mcp | flutter-analyze | rn-tool | buildCommand | mixed | none
Next: /build-phase PHASE <next> | /pr-step … | /refine-phase PHASE STEP | /audit-phase PHASE
Updated: YYYY-MM-DD
```

- When **all** steps verified: optional `/audit-ds` (if present) then `/audit-phase` (set Status `auditing` if starting audit)
- Do not suggest `/complete-phase` until audits are clean
- Optional GitHub after a verified step: `/pr-step update` (Simple→main · GitFlow→develop)
