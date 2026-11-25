---
name: refine-phase
description: Fix issues from audit or verification (named phase or step)
argument-hint: [phase-slug] [step?]
---

> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.

Fix issues for a **named build phase** from **intent rejection**, **verification**, **audit**, and/or **design-system audit**.

**Not for project-audit findings.** If the issues come from an `/audit-project` campaign report (`docs/audit-reports/audit-phase-N.md`), stop and use `/refine-audit N` instead — it enforces the Owner-approval gate. If it is unclear which the Owner means, ask once.

## Resolve phase id

`$ARGUMENTS` is `PHASE_RAW` optionally followed by `STEP`.

1. Prefer a **slug** from [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md). Soft compat: integer `N` → existing `phase-N.md` or BUILD_PLAN order → slug.
2. Resolve **title**. Plan file: `phase-<id>.md`. With **STEP** (numeric): scope to that step; without: Owner’s full-phase issue list.
3. Below, **PHASE** = resolved id. Show **PHASE — Title** in chat / Phase health.

## Before coding

1. Read Owner’s issue list (delta rejection / verify failures / audit reports / chat notes)
2. Read [`docs/phase-plans/phase-PHASE.md`](docs/phase-plans/) — stay in scope; read Behavior delta if present
3. Read [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) **Phase: PHASE** — do not start next phase
4. Read [`docs/PROGRESS.md`](docs/PROGRESS.md) **Phase health (resume)** if present — align with open rejects / fails
5. Product decision gaps → [`docs/decisions.md`](docs/decisions.md) and ask Owner
6. **Mid-phase side-work?** (Owner chat polish / extra ask while on this phase) → follow **Mid-phase side-work** below **before** coding oversized asks. Local absorbs update plan + delta (no new command).
7. **Cross-cutting / principle change?** → run **Cross-cutting STOP** below **before any code**. Do not “just implement” a new core rule across the tree. (If both side-work-size and principle apply → Cross-cutting first, then size gate if still needed.)
8. **Reject / verify fail?** → write **Failure brief** below **before application code** (after side-work / Cross-cutting STOPs if those fired).

At start of refine work (after side-work / Cross-cutting / Failure brief as needed), **overwrite Phase health**: `Phase: PHASE — Title`, `Status: refining`, keep open rejects/fails, `Next: /verify-phase PHASE STEP` (or re-audit command if audit-scoped).

## Failure brief (Reject / verify fail — before coding)

When refining from **intent Reject** or **verify Fail**, show this once before application code (skip for pure absorb of local polish with no fail, or when Owner already accepted a brief this chat):

```markdown
**Failure brief** — Phase PHASE Step STEP
- **Symptom:** what failed / what Owner rejected (Verify # / delta note)
- **Root cause:** first place the system went wrong (not only the last symptom)
- **Blast radius:** other steps / surfaces / files that may be affected
- **Fix shape:** smallest change at the root (prefer fix source over new guards unless the guarded state is legitimate)
```

Then proceed under **Rules**. If root cause is unclear → say so and propose the smallest probe; do not spray unrelated patches.

## Encode lessons STOP (repeated corrections)

**When:** the same Owner correction class is repeating — e.g. Owner says “again” / “same issue”, or this is the **second+** refine for the same Verify # / Reject theme / Failure brief root cause in this phase (or the agent keeps reintroducing the same mistake).

**Skip when:** first occurrence of this class, or Owner already chose an encode option for it this chat / it is already encoded in lint/test/constitution.

Show a one-line pattern, then **STOP** once:

```text
Repeated correction — encode the lesson:
1. Promote to project rule — add/update constitution or architecture convention (docs)
2. Encode in structure — add/adjust lint, type, or test that fails if this recurs
3. Doc-only note — short note in decisions / VERIFICATION_MAP / phase plan Risks; no new lint/test
4. Update Visual direction / DESIGN_SYSTEM — bans, Moments, Signature, or do/don’t (UI craft lessons)
5. Skip encode — fix this instance only
```

- **1** → update the chosen doc, then continue the fix under **Rules**.  
- **2** → add the smallest structural check with the fix (or immediately after); do not invent heavy frameworks.  
- **3** → write the note, then fix.  
- **4** → update [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) (or run `/design-direction refresh` if the whole direction shifted); then fix.  
- **5** → proceed under **Rules** without promotion.

Prefer **2** when a cheap local assertion exists; prefer **1** for product/principle mistakes; prefer **4** for repeating visual/craft misses; never silently expand scope beyond the lesson.

## Mid-phase side-work (absorb into current workflow)

**No new slash command.** While mid-phase / mid-step (build, refine, or chat on the current step), Owner refinements are part of the **same** delivery loop.

### Absorb (default)

Treat as **current step / current phase** when the ask is local polish on the same surface/feature (layout, component swap, copy, small bugfix, same done-when neighborhood) and does **not** invent a new BUILD_PLAN milestone or belong clearly in another phase.

**Required after absorb** (so later build / verify / audit see it):

1. Implement the change on the current step (do not open the next unbuilt step for this).
2. Update [`phase-PHASE.md`](docs/phase-plans/) for that step: Task / Done when / Files as needed.
3. If behavior changed → update **Behavior delta** (WHEN/THEN) + **Trace** + **Step verification**; set Intent `pending_owner_review` and run the intent gate below.
4. If new/changed paths → update **Files checklist** (and **Audit checkpoints** when material).
5. Say briefly what was absorbed so Owner knows verify/audit will cover it.

Purely structural/style with no behavior change → plan Files/checklist update if paths changed; say **Behavior unchanged**.

### Too large → Side-work size STOP

**Do not silently absorb** when the ask is too big for this step/phase, e.g.:

- New feature or milestone not in this phase’s in-scope  
- Clearly belongs in another BUILD_PLAN phase (earlier or later)  
- Needs its own multi-step slice / new phase plan  
- Would rewrite product/flow across surfaces (also trigger **Cross-cutting STOP**)

Show a one-line why, then **STOP**:

```text
Mid-phase side-work — too large for this step/phase:
1. Absorb anyway into current step — update plan + delta; then continue
2. Park for a new / other phase — note seed (remainder / decisions / BUILD_PLAN); do not implement now; continue current step work
3. Re-plan now — /plan-phase PHASE (pause this step; run on pick)
```

- **1** → absorb path above (Owner accepts the blast radius).  
- **2** → record a short seed (Phase remainder row, Open decision, or BUILD_PLAN out-of-scope note); **resume** the current step without coding the parked ask.  
- **3** → run `/plan-phase PHASE` in this session (or BUILD_PLAN edit with Owner); pause this step until guided.

If unsure size → prefer this STOP once over silent mega-scope.

## Cross-cutting STOP (principle or multi-feature change)

Use when the Owner’s ask (or the fix) would:

- Change a **core principle** of how a feature works (not a local bug/typo/style fix), **or**
- Affect **other features / phases / steps** beyond the current refine scope, **or**
- Contradict accepted [`docs/product.md`](docs/product.md) / [`docs/USER_FLOW.md`](docs/USER_FLOW.md) without an explicit doc update

If unsure whether it qualifies → treat as cross-cutting once (ask via the gate).

**Do not write application code yet.** Show a short impact note:

```markdown
**Cross-cutting change** (Owner gate):
- **Principle / rule changing:** …
- **Was:** …
- **Would become:** …
- **Also affects:** (features / phases / steps — or `none beyond this step`)
- **Docs to sync:** product | user flow | architecture | decisions | build plan | phase plans
```

Then **STOP**:

```text
Cross-cutting change:
1. Record decision + sync product/flow (and architecture impact gate if needed) → then re-scope phases/steps → then refine
2. Scoped only to this step/phase — Owner accepts limited blast radius; other surfaces stay old behavior until planned
3. Defer — log in decisions as tbd/deferred; do not code the new principle yet
4. Not cross-cutting — continue as a normal local refine
```

- **1** → update [`docs/decisions.md`](docs/decisions.md) (Resolved); sync `docs/product.md` / `docs/USER_FLOW.md` same turn if behavior changed; use architecture impact gate if structure must change; reopen or adjust phase plans / `docs/BUILD_PLAN.md` as needed; mark [`docs/PROJECT_MAP.md`](docs/PROJECT_MAP.md) stale if modules/hubs shift; **then** refine **one step at a time** with fresh WHEN/THEN deltas.
- **2** → document the limited scope in the Behavior delta **UNCHANGED** / risks; do not silently “fix” sibling features.
- **3** → Open row in decisions; stop coding the new principle.
- **4** → proceed under **Rules** below (local refine only).

Never silently rewrite product truth while refining. Never cascade fixes across features without **1** or an explicit **2**.

## Rules

- Minimal fixes only (unless Owner chose Cross-cutting option **1**, or Side-work size option **1**, and scoped the work) — **smallest change** that clears the fail / reject
- Prefer **root-cause** fix from the Failure brief; avoid symptom-only guards unless Owner accepts them
- Absorbed side-work **must** land in plan + delta/Trace (when behavior changes) — never chat-only
- Do not implement the next unbuilt step
- Run `npm run build` after fixes
- Do not commit unless asked — use `/pr-step update` (invoke authorizes commit/push/merge)
- After a principle change: each touched step needs an updated Behavior delta (WHEN/THEN) + intent gate before verify

## Behavior delta update

If behavior changed (including after intent rejection, absorbed side-work, or Cross-cutting option **1**/**2**): update the step’s Behavior delta (including **WHEN/THEN** scenarios under each changed `SHALL`); set **Intent status:** `pending_owner_review`; show revised delta in chat.

If purely structural/style with no behavior change: say **Behavior unchanged**.

## After fixes

1. List issue → fix (only after Cross-cutting STOP if it applied)
2. If delta updated: **STOP** — same numbered intent gate as `/build-phase`:

```text
Behavior delta ready:
1. Accept → /verify-phase PHASE STEP
2. Reject → continue refine, then re-review delta
```

3. After intent **1. Accept** (or when refine finished and ready to prove again), **STOP — Next actions** (numbered; Owner replies with a number; **run the chosen workflow in this session**):

```text
Refine ready.
1. Re-verify — /verify-phase PHASE STEP
2. Re-audit design — /audit-ds PHASE (only if refine was audit-ds scoped; else omit)
3. Re-audit phase — /audit-phase PHASE (only if refine was audit scoped; else omit)
4. Land work — /pr-step update (Simple→main · GitFlow→develop)
5. Stop here
```

   Omit inapplicable options and renumber. Prefer **1. Re-verify** as the default path after a build-scoped refine.
4. After a later verify **Pass**, follow `/verify-phase` **After Pass — Next actions STOP** (continue build / land / audits) — do not dump bare “Next: `/…`” lines.
5. All steps verified + audits clean → offer `/complete-phase PHASE` as a numbered next action (same session on Owner pick).

Do **not** add a separate session log for routine refine — `/complete-phase` handles the phase-complete entry (Owner may `/session-log` for mid-phase notes).
