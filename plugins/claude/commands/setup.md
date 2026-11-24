---
name: setup
description: Guided progressive fill of Phasestep stubs (product → user flow → stack → architecture → decisions → design wing → plan)
argument-hint: [stage?]
---

Run **Phasestep setup** — progressively fill project stubs with Owner gates. **Docs only. No application code** (except Owner-approved config like `.cursor/mcp.json` / `AGENTS.md` during stack enrichment).

**Owner gate format:** every STOP that presents choices uses a numbered list (`1.` `2.` `3.` …). Words are labels; the Owner may reply with the number alone.

Resume with `$ARGUMENTS` if provided: `product` | `flow` | `stack` | `architecture` | `decisions` | `design` | `build-plan` | `build-command` (otherwise continue from the first incomplete stage).

**First:** complete **Ensure project install** (below). Then **Setup mode** → **Workflow mode** unless `docs/PROGRESS.md` already records both.

---

## Ensure project install (plugin + CLI — same project)

**Installed marker:** `phasestep.json` at the workspace root (legacy: `phasegate.json`).

| State | Agent action |
|-------|----------------|
| **Present** | Project is **already installed** (CLI `init`/`upgrade` or a prior plugin scaffold). Say once: `Phasestep: installed`. Do **not** re-scaffold. Do **not** ask for `npx phasestep init`. Continue. |
| **Missing** | Scaffold **into this repo now**. Do **not** require a separate terminal `npx phasestep init` — marketplace/plugin users must start working from `/setup` alone. |

### When missing — write the default scaffold

1. If this command came from a **Phasestep IDE plugin**, prefer copying files from that plugin’s `scaffold/` bundle (same layout as CLI init).
2. Otherwise write the defaults below. **Skip any path that already exists** (never clobber Owner docs).
3. Set `adapters` in `phasestep.json` for this IDE: Cursor → include `cursor`; Claude Code → include `claude`; when unsure use `["cursor","claude","codex"]`.
4. After writes, say `Phasestep: installed (scaffolded)` and list the key paths, then continue.

**Default layout** (must match package defaults):

| Path | Role |
|------|------|
| `phasestep.json` | Config (paths, `buildCommand`, `adapters`) |
| `docs/PHASESTEP.md` | Constitution |
| `docs/product.md`, `docs/USER_FLOW.md`, `docs/architecture.md`, `docs/decisions.md` | Owner stubs |
| `docs/BUILD_PLAN.md`, `docs/AUDIT_PLAN.md`, `docs/PROJECT_MAP.md`, `docs/VERIFICATION_MAP.md`, `docs/PROGRESS.md` | Plans / maps / progress |
| `docs/phase-plans/README.md`, `docs/audit-reports/README.md` | Dir stubs |
| `docs/DESIGN_SYSTEM.md` | Design stub |
| `.phasestep/stack-catalog.json`, `.phasestep/design-catalog.json`, `.phasestep/README.md` | Catalogs |

**Commands:** When the **plugin** supplies slash commands, project-local `.cursor/commands` / `.claude/commands` are **optional** (portable copy for repos without the plugin). Do not block setup on missing project-local command files if the plugin is active.

**CLI users:** `npx phasestep init` / `upgrade` / `check` remain fully supported and produce the same project shape. Plugin and npm are two doors into one system.

## Greenfield vs existing (mid-project) project

Detect which mode applies **before Stage 1** (scan repo: app code, commits, existing features):

| Mode | When | Setup intent |
|------|------|----------------|
| **Greenfield** | Fresh scaffold / little product code | Define new product intent, then architecture and forward plan |
| **Existing / mid-project** | Active codebase already shipping features | **Document what exists**, then plan **remaining** work — do not reinvent the app |

**Mid-project rules (apply in every stage):**

1. Prefer **truth from the repo + Owner** over inventing a parallel product.
2. **Project map (agent aid):** if [`docs/PROJECT_MAP.md`](docs/PROJECT_MAP.md) is missing, empty, or stale → run `/map-project` (or `/map-project refresh`) **before** drafting product/architecture when the codebase is non-trivial. No Owner gate. Prefer the map over blind repo grep for modules, hubs, and seams. Map is **context** — accepted product/flow/architecture still win on conflict.
3. Product / user flow: capture **current** intended behavior (as-is + agreed near-term). Do not pretend unbuilt features are done. Use map modules/hubs as orientation hints only.
4. Architecture: **document and follow** existing folders/patterns (use map seams); propose changes only with Owner gate (impact gate still applies).
5. Design: if a component library is already in `package.json` / deps, propose that as the pick-one default.
6. Build plan: phases for **next / remaining** work. Mark already-shipped capability as done or out-of-scope in `docs/PROGRESS.md` / phase “Out of scope”. Map seams may suggest remaining slices — Owner still accepts the build plan.
7. Never rewrite production code during setup. Never use `init --force` / upgrade `--force-*` on Owner docs unless Owner asks.
8. **Workflow mode (below)** decides sole vs alongside. Do not invent a merged meta-workflow. After sole archive, treat Phasestep as the only plan/build/verify/audit loop.

At start, **STOP** once (skip if `docs/PROGRESS.md` already has Setup mode):

```text
Setup mode:
1. Greenfield
2. Existing (mid-project)
3. Unsure (help me decide)
```

Record in `docs/PROGRESS.md`: `Setup mode: greenfield | mid-project`.

---

## Workflow mode — sole Phasestep (recommended) vs alongside

Phasestep can **install safely** next to other agent files. For the **best outcome**, the project should run **one** delivery workflow: Phasestep (plan → build → Behavior delta → verify → audit). A second full agentic loop undercuts the gates.

### Detect candidates (do not move yet)

Scan and list:

1. **Foreign slash commands** — `.cursor/commands/*.md` and `.claude/commands/*.md` whose names are **not** Phasestep-owned (`setup`, `status`, `plan-phase`, `build-phase`, `verify-phase`, `refine-phase`, `design-direction`, `critique-ui`, `polish-ui`, `audit-phase`, `audit-campaign`, `complete-phase`, `session-log`, `audit-ds`, `audit-campaign-ds`, `audit-project`, `refine-audit`, `complete-audit`, `map-project`, `github-connect`, `pr-step`, plus adapter `README.md`)
2. **Name collisions** — Phasestep-owned filenames that exist but are **not** clearly Phasestep bodies (e.g. custom `setup.md` kept at init)
3. **AGENTS.md outside markers** — content outside `<!-- phasestep:codex:start -->` … `<!-- phasestep:codex:end -->`
4. **Owner-pointed extras** — ask once if other rule/command paths are part of their **old delivery loop** (do not auto-grab `.cursor/rules` or random tools)

If **no** candidates (and Owner confirms no other delivery workflow) → record `Workflow mode: sole` in `docs/PROGRESS.md` and continue to Stage 1. No STOP needed.

If `docs/PROGRESS.md` already has `Workflow mode: sole` or `Workflow mode: alongside` → skip this STOP (unless Owner asks to revisit).

### STOP — choose mode (welcoming)

Present findings briefly, then:

```text
Phasestep works best as the project's sole delivery workflow (plan → build → intent → verify → audit).
Other slash commands can stay on disk for niches, but a second full agentic loop weakens the gates.

Workflow mode:
1. Sole Phasestep (recommended) — archive competing workflow files (Owner-gated), then continue /setup
2. Alongside — keep everything; use Phasestep additively (full results not guaranteed if both loops are used)
```

### Option 1 — Sole (after Owner picks 1)

1. Draft an **Archive plan** (paths only — no moves yet):
   - Default include: name collisions + foreign commands the Owner marks as part of the old delivery loop
   - AGENTS: if outside-marker content exists → propose copying full `AGENTS.md` into the archive folder, then leaving repo `AGENTS.md` with the Phasestep managed block only (Owner must Accept)
   - Exclude unless Owner lists them: `.cursor/rules`, IDE settings, unrelated scripts
2. Destination: `.phasestep/archived-workflow/YYYY-MM-DD/` (preserve relative paths under that folder). Write `ARCHIVE_LOG.md` listing each moved path + date.
3. **STOP** — never move silently:

```text
Archive plan ready:
1. Accept archive — move listed files
2. Edit list — revise paths, show again
3. Cancel — stay Alongside (Workflow mode option 2)
```

4. On **1. Accept archive**: move (not delete) listed files; write the log; if project-local Phasestep command files are now missing and the Owner relies on them (no IDE plugin), restore via `npx phasestep upgrade` **or** re-copy from the plugin `scaffold/` / commands — do not leave delivery commands empty. Record in `docs/PROGRESS.md`:

```text
Workflow mode: sole
Archived workflow: .phasestep/archived-workflow/YYYY-MM-DD/
```

5. On **3. Cancel** → treat as Alongside (Workflow mode option 2).
6. Continue setup as the **only** delivery workflow. Do not keep offering the old loop.

### Option 2 — Alongside (explicit opt-in)

1. Record in `docs/PROGRESS.md`: `Workflow mode: alongside` (date + one-line reason if given).
2. Continue setup. Foreign commands and AGENTS outside content stay.
3. Remind once: for full Phasestep results later, re-run `/setup` and choose Sole (or edit PROGRESS and archive).

Never delete archived files. Never archive without Accept.

---

## Artifacts

| Stage | File | Gate |
|-------|------|------|
| 0 Workflow | `docs/PROGRESS.md` + optional `.phasestep/archived-workflow/` | Sole (archive Accept) \| Alongside |
| 1 Product | [`docs/product.md`](docs/product.md) | Owner accept / reject / edit |
| 2 User flow | [`docs/USER_FLOW.md`](docs/USER_FLOW.md) | Owner review; refinements sync product |
| 3 Dual lock | product + user flow | Owner confirms **both** accepted |
| 4 Stack enrichment | [`.phasestep/stack-catalog.json`](.phasestep/stack-catalog.json) | Owner accept / skip proposed resources |
| 5 Architecture | [`docs/architecture.md`](docs/architecture.md) | Owner accept; impact gate if product/flow would change |
| 6 Decisions | [`docs/decisions.md`](docs/decisions.md) | Resolve → sync docs; TBD stays Open |
| 7 Design wing (required) | [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) + [`.phasestep/design-catalog.json`](.phasestep/design-catalog.json) | UI check → Visual direction → pick-one library → guidelines → install → accept doc (non-UI: Owner **N/A**) |
| 8 Build plan | [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) | Agent draft from product/flow/arch/decisions/design → Owner accept |
| 9 Config | [`phasestep.json`](phasestep.json) | Propose `buildCommand` from stack catalog → Owner confirm → Finish |

Also update [`docs/PROGRESS.md`](docs/PROGRESS.md) with a short **Setup** checklist as stages complete.

Read [`docs/PHASESTEP.md`](docs/PHASESTEP.md) if gates or roles are unclear.

## Hard rules

1. **One stage at a time.** Stop after each draft or sync. Do not advance until Owner accepts (or explicitly skips an optional stage).
2. **Owner owns product decisions.** Do not invent features. Mark unknowns as questions.
3. **Docs / config only** — no app implementation, no commits unless Owner asks. Archive moves are Owner-gated config/docs hygiene, not app code.
4. **User flow = interaction map** (screens/states/paths). Not visual design, mockups, or design-system polish.
5. **Bidirectional sync (stage 2):** every Owner change to the user flow **must** update `docs/product.md` in the same turn, then show a **Product sync delta**.
6. If flow and product disagree → **stop** and ask which wins (during setup, prefer the flow, then rewrite product to match).
7. **Stack catalog:** `stacks` = official only; `community` = non-official; `verification` = official cross-cutting verify tools (e.g. Playwright). Present separately. Prefer official. Never invent rule/skill bodies. Never label community as official.
8. **Verify when possible:** if web tools work, confirm catalog URLs resolve. If 404 or unverifiable → say so; fall back to Owner paste/path or skip.
9. **Architecture does not silently rewrite product/flow.** If an architecture edit implies behavior or interaction-map change → **Architecture → product/flow impact** gate (Stage 5). Never edit locked product/flow as a side effect.
10. **Design libraries are pick-one.** Never install or document two component libraries for the same UI. Guidelines may be additive. Commercial / preview-access resources need explicit Owner accept.
11. **Sole vs alongside:** recommend Sole; archive only after Accept; Alongside is explicit opt-in. Never silent moves.

---

## Stage 1 — Product

1. If `docs/product.md` is already substantive and Owner says it is accepted, skip to Stage 2.
2. **Existing / mid-project:** if `docs/PROJECT_MAP.md` is missing/empty/stale and the repo has real app code → run `/map-project` first (no Owner gate). Then scan README, map hubs/modules, and major features; draft product as **current behavior + near-term intent**. Ask Owner what is already shipped vs still planned. Do not mark unbuilt features as live.
3. Ask how they will provide intent (one mode):
   - **paste** — description in chat
   - **path** — point to a file (PRD, README, notes)
   - **interview** — short clarifying questions (who, problem, core journeys, out of scope)
   - **repo** — (mid-project) derive draft from codebase + Owner corrections
4. Draft / rewrite `docs/product.md` in the stub’s shape (Overview, Actors, Core flows, Out of scope). Prefer behavior language (“SHALL” where helpful).
5. Run **Spec quality checklist** on the draft (docs only — **not** a Behavior delta; WHEN/THEN scenarios come later at `/build-phase`). Show it with the summary:

```markdown
**Spec quality checklist** — product draft
| Check | Status | Note |
|-------|--------|------|
| Ambiguous terms (“fast”, “easy”, “etc.”) | pass / gap | … |
| Actors / who is clear | pass / gap | … |
| Core flows are observable (could verify later) | pass / gap | … |
| Error / empty / cancel paths mentioned or explicit N/A | pass / gap | … |
| Out of scope stated | pass / gap | … |
| Mushy SHALLs (untestable as written) | pass / gap | … |
```

6. **STOP.** Show the draft summary + checklist and wait:

```text
Product draft ready:
1. Accept → Stage 2
2. Reject
3. Edit (notes) — preferred when checklist has gaps
4. Accept with known gaps (record gaps in product Open questions / chat)
```

- **1. Accept** or **4. Accept with known gaps** → Stage 2 (on **4**, keep gap notes in `docs/product.md` or `docs/decisions.md`)  
- **2. Reject / 3. Edit** → revise product, re-run checklist, stop again  

Do **not** draft the user flow until product is accepted.

---

## Stage 2 — User flow (interaction map)

**Prerequisite:** `docs/product.md` accepted for this setup pass.

1. Derive `docs/USER_FLOW.md` **only** from the accepted product. Do not add capabilities absent from the product; list gaps under **Open questions**.
2. Write an **interaction map**:
   - Entry points
   - Primary flows (numbered steps; optional mermaid `flowchart`)
   - Branches & alternates (errors, empty, cancel)
   - Success / exit states
   - Non-goals
3. Set flow status to `in_review`. Record `Last synced with product`.
4. **STOP.** Tell Owner the map is the overview surface — easier than reading the full product line-by-line. Wait for:

```text
User flow ready:
1. Accept both (product + flow)
2. Tweak flow
3. Reject
```

### Refinement loop (until dual accept)

When Owner **tweaks** the flow:

1. Apply changes to `docs/USER_FLOW.md`.
2. **Same turn:** update `docs/product.md` so behavior matches the revised map.
3. Show a short **Product sync delta** in chat:

```markdown
**Product sync delta** (flow → product; not a Behavior delta — no WHEN/THEN here):
- **ADDED:** …
- **CHANGED:** … (was: …)
- **REMOVED:** … (or `none`)
- **Questions / unresolved:** …
```

4. Set flow `Last synced with product` to today; keep status `in_review`.
5. **STOP** again for review.

When Owner is satisfied:

1. Set user flow **Status** to `accepted`.
2. Confirm product is in sync (no pending sync delta).
3. **Dual lock** — both artifacts accepted together.
4. Proceed to **Stage 4 — Stack enrichment**.

**Skip:** only if Owner explicitly skips flow (e.g. tiny/non-interactive tool). Record skip in `docs/PROGRESS.md`. Prefer keeping the map for UI and multi-step products. After skip → Stage 4.

---

## Stage 4 — Stack enrichment

**Prerequisite:** product + user flow dual-locked (or flow explicitly skipped).

**Catalog:** [`.phasestep/stack-catalog.json`](.phasestep/stack-catalog.json) — three lanes:
- **`stacks`** = official framework sources only
- **`community`** = non-official curated recipes (`appliesTo` stack ids)
- **`verification`** = official verify/audit evidence by **surface** (web → Playwright; Flutter/RN → analyzer + Owner/device UAT; backend → build/test/lint — see catalog `appliesWhen`)

### 4a — Detect and confirm stack (required gate)

1. Detect stack(s) from the repo using catalog `stacks[].detect` cues. Prefer specific stacks over generic ones (e.g. Next.js over React over Node; Laravel over PHP; React Native over React).
2. **STOP.** State the detected stack(s) clearly and wait for Owner confirmation before any catalog proposals:

```text
Detected stack(s): [e.g. Flutter]
1. Confirm
2. Correct (tell me the stack)
3. Unsure (help me decide)
```

3. Do **not** look up or propose Official/Community items until the Owner confirms or corrects the stack identity.
4. If Owner corrects → use their stack id(s) for the rest of this stage (must exist in the catalog, or treat as unknown and ask for URL/path / skip enrichment).
5. Record confirmed stack id(s) in `docs/PROGRESS.md` Setup checklist / enrichment log.

### 4b — Propose enrichment (only after stack confirmed)

1. Look up matching **official** entries in `stacks` for the confirmed stack(s). Multiple matches are OK when additive (e.g. React + TanStack).
2. Look up matching **community** entries where `appliesTo` intersects confirmed stack ids.
3. Look up matching **verification** entries where `appliesTo` intersects confirmed stack ids **and** `appliesWhen` matches the product surface:
   - **Web UI** (browser-rendered) → Playwright entries (`playwright-cli` / `playwright-mcp`)
   - **Flutter / React Native** (native) → native evidence entries — **never** Playwright
   - **Backend / CLI / API-only** (no browser UI) → backend tool-evidence entry — **never** invent a browser path
   If surface is unclear → ask once (web UI | native mobile | backend-only).
4. If `detectInstalled` already matches (e.g. `@playwright/cli` in package.json, or Playwright in `.cursor/mcp.json` / `.mcp.json`) → say so; still offer skills/MCP wiring if missing; do not re-install blindly. If Claude has MCP only in user-global `~/.claude.json`, ask Owner once rather than assuming missing. For Flutter/RN/backend entries, “accept” usually means record evidence commands in `docs/PROGRESS.md` / `buildCommand` — not a new browser install.
5. Present to Owner in **three clearly labeled sections** (never mix them):

#### A — Official (recommended default)

For each matched stack:
- Stack id / name / **coverage** (`full` | `docs-only` | `partial`)
- Suggested `buildCommand` hints

For **each** official resource and install recipe:
- Label, kind, URL (if any)
- **`why`** — quote/paraphrase the catalog `why` field (what it is and what adding it does for this project)
- What accepting means concretely (e.g. writes `.cursor/mcp.json`, installs a skill, scaffolds `AGENTS.md`)

#### B — Community (optional extras)

For each matched community item:
- Label, URL, publisher
- **`why`** — quote/paraphrase the catalog `why` field (when to use it)
- What accepting means (install command / target)
- Explicit caveat: **not official**; may overlap or conflict with official guidance — prefer official first

#### C — Verification (official, optional — by surface)

Match catalog `verification` entries to the confirmed surface:

**Web UI** — Playwright CLI (primary) / MCP (optional):
- Label, kind, URL, publisher, **`why`**, `appliesWhen`
- Prefer **playwright-cli** for routine `/verify-phase` and audit evidence; offer **playwright-mcp** only if Owner wants exploratory/persistent browser sessions
- What accepting means (devDependency, `install-browser`, `install --skills`, and/or MCP config)
- **Recommended companions:** community items with `recommendedWith` (e.g. `playwright-best-practices`)

**Flutter / React Native** — analyzer/tests + Owner/device UAT:
- Present matching native verification ids from the catalog
- **Never** propose Playwright for native mobile
- What accepting means: record evidence commands (`flutter analyze` / `flutter test`, or RN typecheck/tests + `buildCommand`); Owner still runs device UAT

**Backend / CLI / API-only** — tool evidence + Owner contract UAT:
- Present `backend-tool-evidence` (or matching entry) when there is no browser UI
- Evidence = `buildCommand` / lint / tests; optional HTTP smoke only if Owner asks
- If the stack can also be a web UI (e.g. Laravel) and the product **has** a browser UI → prefer Playwright instead

Do **not** copy skill/rule bodies into the repo from training memory or from the phasestep package — only run the catalog install recipes into **this** project so the agent discovers skills locally.

6. **Verification of URLs:**
   - If web is available → fetch URLs; confirm they resolve. Report failures.
   - If offline / no web / empty → still propose catalog links; ask Owner to paste a URL or path, or **skip**.
7. **Never** write AI rules / skill bodies from training memory. Never present community items as official. Never vendor Playwright (or skill bodies) into the phasestep package — only install into **this** project on Accept.
8. **STOP** and wait:

```text
Stack enrichment — answer each section with a number:
Official:
  1. Accept selected
  2. Skip
Community:
  1. Accept selected (optional)
  2. Skip all community
Verification:
  1. Accept matched surface evidence (web: Playwright | native: analyze/device | backend: tools)
  2. Skip verification
Or overall:
  3. Provide URL/path (Owner's own rules/skills files)
```

9. On Accept (option 1 in a section): apply only Owner-selected recipes (including any accepted verification companions). Record in `docs/PROGRESS.md` Stack enrichment log with provenance (`official` | `community` | `verification`, id, URL, date).
10. On Skip (option 2): record skip/reason; continue. Skip is valid — for **web UI**, `/verify-phase`, `/audit-phase`, and `/audit-campaign` may **STOP once** later with a mid-flight Playwright offer. For **native / backend**, skip means Owner UAT + `buildCommand` only (no Playwright mid-flight).
11. Proceed to Stage 5 — Architecture (cite accepted official sources in conventions; note community / verification extras if any).


---

## Stage 5 — Architecture

**Prerequisite:** stack enrichment completed or explicitly skipped.

1. Lightly scan the repo for stack/layout cues (reuse Stage 4 detection). Prefer [`docs/PROJECT_MAP.md`](docs/PROJECT_MAP.md) when Status is `current` for modules, hubs, and folder seams; refresh via `/map-project` if stale and the codebase is non-trivial.
2. Draft `docs/architecture.md` from product + finalized flow + map/repo scan + **any accepted stack enrichment** (cite official sources in conventions).
3. Align `buildCommand` suggestion with the stack (see Stage 9).
4. For fresh scaffolds: propose a conventional layout justified by the user flow. For existing features/folders: **document and follow** them — do not reinvent.
5. **STOP** for numbered Accept / Reject / Edit.

```text
Architecture draft ready:
1. Accept
2. Reject
3. Edit (notes)
```

### Architecture → product/flow impact gate

Architecture is **how**; product + user flow are **what**. Do **not** silently edit locked `docs/product.md` or `docs/USER_FLOW.md` while refining architecture.

If an Owner edit or the draft **implies** a change to product behavior or the interaction map (e.g. data model cannot support an offline path the flow assumes):

1. **STOP** — do not update product/flow yet.
2. Show an **Architecture → product/flow impact** note in chat:

```markdown
**Architecture → product/flow impact** (Owner gate):
- **Trigger:** …
- **Would change in product:** …
- **Would change in user flow:** … (or `none`)
- **If rejected:** architecture will instead …
```

3. Wait for Owner:

```text
Impact:
1. Accept (sync product/flow)
2. Reject (fit architecture to existing product/flow)
3. Defer (log in decisions)
```

4. **1. Accept** → same turn: update `docs/product.md` and/or `docs/USER_FLOW.md` as needed; keep them aligned (Product sync delta if product behavior changed); re-affirm dual lock; then continue architecture finalize.
5. **2. Reject** → revise `docs/architecture.md` so it fits the existing locked product/flow; do not change product/flow.
6. **3. Defer** → add an Open row in `docs/decisions.md` (`Status: tbd`, `Blocker?` as appropriate); architecture must not assume the deferred outcome; proceed only with an architecture that works without inventing that answer.

When architecture is finalized with **no** open impact:

1. Set architecture accepted in `docs/PROGRESS.md`.
2. Proceed to Stage 6 — Decisions.

---

## Stage 6 — Decisions

**Prerequisite:** architecture accepted (any product/flow sync from Stage 5 impact gate already applied or deferred into Open).

1. Collect open questions from product, flow, stack enrichment, architecture, and any **Deferred** impact items into `docs/decisions.md`.
2. Use the stub shape: **Open** (with `Status`: `tbd` | `deferred`, and `Blocker?`) and **Resolved**.
3. Mark true **blockers** clearly. Do **not** invent answers.
4. **STOP** for Owner review:

```text
Decisions:
1. Resolve some
2. Leave TBD
3. Mark blockers
```

### On resolve

1. Move the row to **Resolved** (decision text + date).
2. **Same turn:** update affected artifacts (`docs/product.md`, `docs/USER_FLOW.md`, `docs/architecture.md`, enrichment log / `phasestep.json` if relevant).
3. Keep product and flow aligned; show a short sync note if product behavior changed.
4. Do not invent scope — only write what the Owner decided.

### On leave TBD / cannot confirm

1. Keep the row in **Open** with `Status: tbd` (or `deferred` if “won’t decide this phase”).
2. Do **not** write fake answers into product / flow / architecture.
3. Non-blocker TBDs may proceed (call them out as risks / out-of-scope in the build plan later).
4. **Blocker TBDs** → stop before `/plan-phase`, or get an explicit Owner override.

When Owner is done with this review pass → Stage 7 — Design system.

---

## Stage 7 — Design wing (required)

**Prerequisite:** decisions reviewed.  
**Catalog:** [`.phasestep/design-catalog.json`](.phasestep/design-catalog.json)

The design wing is **core Phasestep** (Visual direction + DS + later critique/polish commands). Owners gate decisions; they do not opt the wing out of the package.

- **`componentLibraries`** → **pick exactly one** (or none). Never mix libraries.
- **`guidelines`** → cite any (additive).
- Each item and each agent resource has **`why`**. Prefer free / no-access-gate options unless Owner asks for commercial/preview.

### 7a — UI check

1. From product + user flow, decide if this is a **UI product**.
2. If **non-UI** → **STOP** (record N/A — do not pretend the wing was never installed):

```text
Design wing — surface:
1. Non-UI — mark DESIGN_SYSTEM Visual direction + Status as N/A; continue to Stage 8
2. Actually UI — continue design wing
```

On **1**: set `docs/DESIGN_SYSTEM.md` Status and Visual direction Status to `n/a`; note in `docs/PROGRESS.md` (`Design wing: n/a`); go to Stage 8. Commands `/design-direction`, `/critique-ui`, `/polish-ui` remain available if UI appears later.

3. If UI → continue.

```text
Design wing — surface:
1. UI product — continue
2. Non-UI — mark N/A (same as option 1 above)
```

### 7a2 — Visual direction (required for UI)

If Visual direction is missing / stub → run the **`/design-direction`** flow inline (or tell Owner to run `/design-direction`), then continue. Owner **Accept** required before library pick.

If already **accepted** → confirm once; offer refresh:

```text
Visual direction on file:
1. Keep — continue to library / DS
2. Refresh — /design-direction refresh
```

### 7b — Detect and confirm design context (required gate)

1. Infer **surface** from confirmed stack(s): e.g. `react` / `nextjs` / `web` / `tailwind` / `flutter` / `react-native` / `angular`.
2. Note any existing design input (brand guide, Figma, tokens, Owner rules file).
3. **STOP** — do not propose catalog items yet:

```text
Design context: surface=[…] existing=[none | …]
1. Confirm
2. Correct surface
3. I have my own rules (URL/path)
```

4. If Owner provides own rules → verify path/URL; those become primary input for `docs/DESIGN_SYSTEM.md`; catalog becomes optional extras only if Owner asks.

### 7c — Propose from design catalog (only after context confirmed)

Filter catalog by `appliesTo` intersecting confirmed surface/stack.

Present **two separate sections** (never mix):

#### A — Component libraries (**PICK ONE** or none)

For each matching library:
- Name, entry URL, **license** (`free` | `commercial` | `preview-access`)
- **`why`** (what it is and why consider it)
- What picking it means (sole UI component source — no second library)

Do **not** recommend combining libraries. If Owner insists on mixing → warn about conflicts and refuse unless they explicitly override in writing.

#### B — Guidelines (**cite any**)

For each matching guideline:
- Name, URL, **`why`**
- What citing it means (informs `DESIGN_SYSTEM.md`; does not install a second component kit)

### 7d — Owner choice gate

```text
Design choice — answer each section with a number:
Library:
  1. Pick ONE id from the list above
  2. None
Guidelines:
  1. Cite zero or more ids from the list above
  2. None
Or overall:
  3. Provide own files only
```

Record choice in `docs/PROGRESS.md`.

### 7e — Install agent resources for the chosen library (and optional guidelines)

1. For the **single** chosen library, list each `resources[]` entry with **`why`** and what accepting does (MCP / skill / llms cite / CLI init).
2. Flag `commercial` / `preview-access` clearly before install.
3. Verify URLs when web is available.
4. **STOP** per batch (or per resource):

```text
Agent resources for [library]:
1. Accept selected
2. Skip all
3. Provide alternate URL/path
```

5. Apply **only** Owner-accepted recipes. Never invent APIs, license keys, or package names — follow cited docs.
6. For accepted guidelines: cite URLs in `docs/DESIGN_SYSTEM.md` / `AGENTS.md` as needed; install only if Owner accepted a recipe.
7. Log provenance in `docs/PROGRESS.md` design enrichment log (`library` | `guideline` | `resource`, URL, date).

**Example — Owner picked Astryx:** propose Astryx CLI init / agent docs / CLI reference only; draft `DESIGN_SYSTEM.md` with Astryx as sole component source; do not offer MUI/shadcn/daisyUI installs afterward.

### 7f — Draft `docs/DESIGN_SYSTEM.md`

Grounded in product + user flow + architecture + **accepted Visual direction** + **chosen library** + accepted guidelines + Owner files.

Include:
- **Visual direction** (already Accepted in 7a2 — keep in sync; do not blank it)
- **Chosen system** (library id or “Owner custom” / “guidelines only”)
- Principles (align with Character / World)
- Tokens (color, type, spacing, radius) — high level; favor Signature
- Component usage rules (use chosen library; forbidden alternate kits)
- Accessibility baseline
- Do / don’t (include craft floor bans + project Bans)
- Provenance (accepted catalog URLs / Owner paths)

Not mockups or full visual redesign. Critique/polish happen later via `/critique-ui` / `/polish-ui`.

### 7g — Accept gate

```text
DESIGN_SYSTEM.md ready (direction + system):
1. Accept
2. Reject
3. Edit
```

On accept → Stage 8 — Build plan.

---

## Stage 8 — Build plan

**Prerequisite:** decisions reviewed; design wing accepted or marked N/A.

### 8a — Gather inputs

Read before drafting:
1. [`docs/product.md`](docs/product.md) — accepted product behavior
2. [`docs/USER_FLOW.md`](docs/USER_FLOW.md) — finalized interaction map (if not skipped)
3. [`docs/architecture.md`](docs/architecture.md) — accepted structure / conventions
4. [`docs/decisions.md`](docs/decisions.md) — Resolved + Open (`tbd` / `deferred`, blockers)
5. [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — if accepted (chosen library, constraints); ignore if skipped
6. Confirmed stack / `buildCommand` hints (for realistic phase boundaries)

### 8b — Draft `docs/BUILD_PLAN.md`

1. Propose **ordered phases** grounded in the inputs above. Prefer slicing by user-flow segments and architecture seams (not by random file folders).
2. **Existing / mid-project:** do **not** re-plan already-shipped work as future build phases. Put shipped capability in earlier “done” notes or phase Out of scope; plan **remaining** milestones only. Update `docs/PROGRESS.md` so completed areas are marked done where Owner agrees.
3. Each phase needs:
   - **slug** — filesystem-safe kebab-case id (`auth`, `checkout`) used in `/plan-phase <slug>` and `phase-<slug>.md`
   - **title** — human name shown in chat / PROGRESS
   - **in scope** / **out of scope**
4. Write **Phase order** as `N. <slug> — <Title>`, then a `## Phase: <slug> — <Title>` section per phase. **Do not** invent new phases as bare numbers; soft compat for legacy `Phase 1` projects remains in command contracts.
5. Reflect **Resolved** decisions in scope. Call out Open items in phase boundaries / risks:
   - **`tbd` (non-blocker)** → note as risk or “decide during phase”; do not invent the answer in the plan
   - **`deferred`** → keep out of early phases unless Owner overrides
   - **`tbd` + Blocker? = yes** → **do not** schedule work that assumes an answer. Mark the dependency prominently. Prefer stopping before `/plan-phase` until resolved, or get an explicit Owner override recorded in `docs/decisions.md` / chat
6. If design was accepted, phases that ship UI should assume the **chosen library only** (no alternate kit).
7. Do **not** write phase execution plans (`phase-<slug>.md`) here — that is `/plan-phase <slug>` after setup.

### 8c — Owner gate

**STOP.** Present the phase order as **slug — title** (one line each) and wait:

```text
BUILD_PLAN.md ready (named phases — invoke by slug; steps stay numeric):
1. Accept
2. Reject
3. Edit (notes)
```

- **1. Accept** → mark Build plan accepted in `docs/PROGRESS.md`; proceed to Stage 9 — buildCommand  
- **2. Reject / 3. Edit** → revise `docs/BUILD_PLAN.md`, stop again  
- If blocker TBDs remain unresolved and Owner still accepts (1) → record the **Owner override** in `docs/decisions.md` notes and in the build plan risk section

---

## Stage 9 — buildCommand

**Prerequisite:** `docs/BUILD_PLAN.md` accepted.

### 9a — Propose

1. Read [`phasestep.json`](phasestep.json) current `buildCommand`.
2. Read confirmed stack from Stage 4 / `docs/PROGRESS.md` and matching **`buildCommandHints`** in [`.phasestep/stack-catalog.json`](.phasestep/stack-catalog.json).
3. Propose **one** concrete command that fits the stack (e.g. Flutter → `flutter analyze` or `flutter test`; Angular → `ng build`; Next → `npm run build`). Prefer a fast, reliable check the agent can run after every build/refine.
4. If the stack is unclear or no hint fits → **ask Owner**; do not invent a fake command.
5. If current `buildCommand` already matches → say so and offer to keep it.

### 9b — Owner gate

**STOP.** Wait:

```text
buildCommand:
1. Accept proposed ([command])
2. Use different (Owner specifies)
3. Keep current
```

### 9c — Apply

1. On **1. Accept** / **2. Owner-specified**: update `phasestep.json` `buildCommand` only.
2. Sync [`docs/architecture.md`](docs/architecture.md) “Build & quality” to the same command.
3. Mark `buildCommand` confirmed in `docs/PROGRESS.md`.
4. **Seed [`docs/VERIFICATION_MAP.md`](docs/VERIFICATION_MAP.md)** (create from stub if missing):
   - Ensure a row for the project **build/quality check** → command = confirmed `buildCommand`, Source `setup`
   - If Stage 4 accepted a verification lane (Playwright / native / backend) → add one row per accepted surface with Prove how + tool id, Source `setup`
   - Set map **Status:** `seeded`, **Last updated:** today
   - Do **not** invent prove paths the Owner did not accept; leave placeholder `…` rows for later verify/audit
5. Proceed to **Finish**.

---

## Finish

**Prerequisite:** Stage 9 complete (`buildCommand` confirmed).

1. Update [`docs/PROGRESS.md`](docs/PROGRESS.md):
   - All Setup checklist items done (or explicitly skipped where allowed)
   - Build progress still not started / empty for phases
2. Short summary for Owner:
   - Product + user flow dual-locked (or flow skipped)
   - Stack confirmed + enrichment accepted/skipped
   - Architecture accepted (note any impact-gate syncs)
   - Decisions: resolved vs open TBD/blockers
   - Design: library chosen / skipped + resources installed
   - Build plan phase order
   - Final `buildCommand`
   - Verification map seeded (path + surfaces)
3. **STOP — optional GitHub connect** (primary embed). Skip this STOP if `docs/PROGRESS.md` already has a `GitHub: connected` line.

```text
Setup complete — optional GitHub handoff:
1. Connect now — run /github-connect (auth + remote; no commit), then continue Finish
2. Skip — continue without GitHub automation (manual git/PR OK; /pr-step will fail soft until connected)
```

   - On **1. Connect now**: run `/github-connect` (same session or tell Owner to invoke it). Connect will ask **Simple PR** vs **GitFlow** (or later). Then resume Finish step 4.
   - On **2. Skip**: record `GitHub: skipped at setup — YYYY-MM-DD` in `docs/PROGRESS.md` (optional note); do not block delivery.
4. Tell Owner next step — do **not** run it unless asked:

```text
Setup complete → run /plan-phase <first-slug>
```

Later (after verify/complete): `/pr-step update` (Simple→main · GitFlow→develop); GitFlow also `release` / `main`.
Optional: `npx phasestep check` (CLI) to confirm artifacts — not required when the IDE plugin already scaffolds/detects install.
