---
description: Guided progressive fill of Phasestep stubs (product → user flow → stack → architecture → decisions → design → plan)
argument-hint: [stage?]
---

Run **Phasestep setup** — progressively fill project stubs with Owner gates. **Docs only. No application code** (except Owner-approved config like `.cursor/mcp.json` / `AGENTS.md` during stack enrichment).

Resume with `$ARGUMENTS` if provided: `product` | `flow` | `stack` | `architecture` | `decisions` | `design` | `build-plan` | `build-command` (otherwise continue from the first incomplete stage).

## Greenfield vs existing (mid-project) project

Detect which mode applies **before Stage 1** (scan repo: app code, commits, existing features):

| Mode | When | Setup intent |
|------|------|----------------|
| **Greenfield** | Fresh scaffold / little product code | Define new product intent, then architecture and forward plan |
| **Existing / mid-project** | Active codebase already shipping features | **Document what exists**, then plan **remaining** work — do not reinvent the app |

**Mid-project rules (apply in every stage):**

1. Prefer **truth from the repo + Owner** over inventing a parallel product.
2. Product / user flow: capture **current** intended behavior (as-is + agreed near-term). Do not pretend unbuilt features are done.
3. Architecture: **document and follow** existing folders/patterns; propose changes only with Owner gate (impact gate still applies).
4. Design: if a component library is already in `package.json` / deps, propose that as the pick-one default.
5. Build plan: phases for **next / remaining** work. Mark already-shipped capability as done or out-of-scope in `{{PROGRESS}}` / phase “Out of scope”.
6. Never rewrite production code during setup. Never use `init --force` / upgrade `--force-*` on Owner docs unless Owner asks.

At start, **STOP** once:

```text
Setup mode → Greenfield | Existing (mid-project) | Unsure (help me decide)
```

## Artifacts

| Stage | File | Gate |
|-------|------|------|
| 1 Product | [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}}) | Owner accept / reject / edit |
| 2 User flow | [`{{USER_FLOW}}`](../../{{USER_FLOW}}) | Owner review; refinements sync product |
| 3 Dual lock | product + user flow | Owner confirms **both** accepted |
| 4 Stack enrichment | [`{{STACK_CATALOG}}`](../../{{STACK_CATALOG}}) | Owner accept / skip proposed resources |
| 5 Architecture | [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}}) | Owner accept; impact gate if product/flow would change |
| 6 Decisions | [`{{DECISIONS}}`](../../{{DECISIONS}}) | Resolve → sync docs; TBD stays Open |
| 7 Design (optional) | [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) + [`{{DESIGN_CATALOG}}`](../../{{DESIGN_CATALOG}}) | UI check → pick-one library → guidelines → install → accept doc |
| 8 Build plan | [`{{BUILD_PLAN}}`](../../{{BUILD_PLAN}}) | Agent draft from product/flow/arch/decisions/design → Owner accept |
| 9 Config | [`phasestep.json`](../../phasestep.json) | Propose `buildCommand` from stack catalog → Owner confirm → Finish |

Also update [`{{PROGRESS}}`](../../{{PROGRESS}}) with a short **Setup** checklist as stages complete.

Read [`{{CONSTITUTION}}`](../../{{CONSTITUTION}}) if gates or roles are unclear.

## Hard rules

1. **One stage at a time.** Stop after each draft or sync. Do not advance until Owner accepts (or explicitly skips an optional stage).
2. **Owner owns product decisions.** Do not invent features. Mark unknowns as questions.
3. **Docs / config only** — no app implementation, no commits unless Owner asks.
4. **User flow = interaction map** (screens/states/paths). Not visual design, mockups, or design-system polish.
5. **Bidirectional sync (stage 2):** every Owner change to the user flow **must** update `{{PRODUCT_SPEC}}` in the same turn, then show a **Product sync delta**.
6. If flow and product disagree → **stop** and ask which wins (during setup, prefer the flow, then rewrite product to match).
7. **Stack catalog:** `stacks` = official only; `community` = non-official; `verification` = official cross-cutting verify tools (e.g. Playwright). Present separately. Prefer official. Never invent rule/skill bodies. Never label community as official.
8. **Verify when possible:** if web tools work, confirm catalog URLs resolve. If 404 or unverifiable → say so; fall back to Owner paste/path or skip.
9. **Architecture does not silently rewrite product/flow.** If an architecture edit implies behavior or interaction-map change → **Architecture → product/flow impact** gate (Stage 5). Never edit locked product/flow as a side effect.
10. **Design libraries are pick-one.** Never install or document two component libraries for the same UI. Guidelines may be additive. Commercial / preview-access resources need explicit Owner accept.

---

## Stage 1 — Product

1. If `{{PRODUCT_SPEC}}` is already substantive and Owner says it is accepted, skip to Stage 2.
2. **Existing / mid-project:** scan README, app entrypoints, and major features; draft product as **current behavior + near-term intent**. Ask Owner what is already shipped vs still planned. Do not mark unbuilt features as live.
3. Ask how they will provide intent (one mode):
   - **paste** — description in chat
   - **path** — point to a file (PRD, README, notes)
   - **interview** — short clarifying questions (who, problem, core journeys, out of scope)
   - **repo** — (mid-project) derive draft from codebase + Owner corrections
4. Draft / rewrite `{{PRODUCT_SPEC}}` in the stub’s shape (Overview, Actors, Core flows, Out of scope). Prefer behavior language (“SHALL” where helpful).
5. **STOP.** Show the draft summary and wait:

```text
Product draft ready → Accept | Reject | Edit (notes)
```

- **Accept** → Stage 2  
- **Reject / Edit** → revise product, stop again  

Do **not** draft the user flow until product is accepted.

---

## Stage 2 — User flow (interaction map)

**Prerequisite:** `{{PRODUCT_SPEC}}` accepted for this setup pass.

1. Derive `{{USER_FLOW}}` **only** from the accepted product. Do not add capabilities absent from the product; list gaps under **Open questions**.
2. Write an **interaction map**:
   - Entry points
   - Primary flows (numbered steps; optional mermaid `flowchart`)
   - Branches & alternates (errors, empty, cancel)
   - Success / exit states
   - Non-goals
3. Set flow status to `in_review`. Record `Last synced with product`.
4. **STOP.** Tell Owner the map is the overview surface — easier than reading the full product line-by-line. Wait for:

```text
User flow ready → Accept both (product + flow) | Tweak flow | Reject
```

### Refinement loop (until dual accept)

When Owner **tweaks** the flow:

1. Apply changes to `{{USER_FLOW}}`.
2. **Same turn:** update `{{PRODUCT_SPEC}}` so behavior matches the revised map.
3. Show a short **Product sync delta** in chat:

```markdown
**Product sync delta** (flow → product):
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

**Skip:** only if Owner explicitly skips flow (e.g. tiny/non-interactive tool). Record skip in `{{PROGRESS}}`. Prefer keeping the map for UI and multi-step products. After skip → Stage 4.

---

## Stage 4 — Stack enrichment

**Prerequisite:** product + user flow dual-locked (or flow explicitly skipped).

**Catalog:** [`{{STACK_CATALOG}}`](../../{{STACK_CATALOG}}) — three lanes:
- **`stacks`** = official framework sources only
- **`community`** = non-official curated recipes (`appliesTo` stack ids)
- **`verification`** = official cross-cutting verify/audit tools (e.g. Playwright) when the product has a **web UI**

### 4a — Detect and confirm stack (required gate)

1. Detect stack(s) from the repo using catalog `stacks[].detect` cues. Prefer specific stacks over generic ones (e.g. Next.js over React over Node; Laravel over PHP; React Native over React).
2. **STOP.** State the detected stack(s) clearly and wait for Owner confirmation before any catalog proposals:

```text
Detected stack(s): [e.g. Flutter]
Confirm | Correct (tell me the stack) | Unsure (help me decide)
```

3. Do **not** look up or propose Official/Community items until the Owner confirms or corrects the stack identity.
4. If Owner corrects → use their stack id(s) for the rest of this stage (must exist in the catalog, or treat as unknown and ask for URL/path / skip enrichment).
5. Record confirmed stack id(s) in `{{PROGRESS}}` Setup checklist / enrichment log.

### 4b — Propose enrichment (only after stack confirmed)

1. Look up matching **official** entries in `stacks` for the confirmed stack(s). Multiple matches are OK when additive (e.g. React + TanStack).
2. Look up matching **community** entries where `appliesTo` intersects confirmed stack ids.
3. Look up matching **verification** entries where `appliesTo` intersects confirmed stack ids **and** the product has (or will have) a browser-rendered UI. If the product is CLI-only / no UI → skip verification proposals (or ask once).
4. If `detectInstalled` already matches (e.g. `@playwright/cli` in package.json) → say so; still offer skills/MCP wiring if missing; do not re-install blindly.
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

#### C — Verification (web UI — official, optional)

For each matched `verification` entry (typically Playwright CLI primary, MCP alternate):
- Label, kind, URL, publisher
- **`why`** and `appliesWhen`
- Prefer **playwright-cli** for routine `/verify-phase` and audit evidence; offer **playwright-mcp** only if Owner wants exploratory/persistent browser sessions
- What accepting means (devDependency, `install --skills`, and/or `.cursor/mcp.json`)

**Recommended companions:** look up `community` items whose `recommendedWith` intersects the verification ids being accepted (e.g. `playwright-best-practices`). Present them as **recommended with Playwright** (still labeled **community / not official**). Default suggestion: install companions together with playwright-cli unless the Owner declines.

Do **not** copy skill/rule bodies into the repo from training memory or from the phasestep package — only run the catalog install recipes into **this** project so the agent discovers skills locally.

6. **Verification of URLs:**
   - If web is available → fetch URLs; confirm they resolve. Report failures.
   - If offline / no web / empty → still propose catalog links; ask Owner to paste a URL or path, or **skip**.
7. **Never** write AI rules / skill bodies from training memory. Never present community items as official. Never vendor Playwright (or skill bodies) into the phasestep package — only install into **this** project on Accept.
8. **STOP** and wait:

```text
Stack enrichment
  Official → Accept selected | Skip
  Community → Accept selected (optional) | Skip all community
  Verification (web UI) → Accept playwright-cli (+ recommended companions) | Accept MCP too | Skip verification
  Or Provide URL/path (Owner's own rules/skills files)
```

9. On Accept: apply only Owner-selected recipes (including any accepted verification companions). Record in `{{PROGRESS}}` Stack enrichment log with provenance (`official` | `community` | `verification`, id, URL, date).
10. On Skip: record skip/reason; continue.
11. Proceed to Stage 5 — Architecture (cite accepted official sources in conventions; note community / verification extras if any).


---

## Stage 5 — Architecture

**Prerequisite:** stack enrichment completed or explicitly skipped.

1. Lightly scan the repo for stack/layout cues (reuse Stage 4 detection).
2. Draft `{{ARCHITECTURE}}` from product + finalized flow + repo scan + **any accepted stack enrichment** (cite official sources in conventions).
3. Align `buildCommand` suggestion with the stack (see Stage 9).
4. For fresh scaffolds: propose a conventional layout justified by the user flow. For existing features/folders: **document and follow** them — do not reinvent.
5. **STOP** for Accept | Reject | Edit.

```text
Architecture draft ready → Accept | Reject | Edit (notes)
```

### Architecture → product/flow impact gate

Architecture is **how**; product + user flow are **what**. Do **not** silently edit locked `{{PRODUCT_SPEC}}` or `{{USER_FLOW}}` while refining architecture.

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
Impact → Accept (sync product/flow) | Reject (fit architecture to existing product/flow) | Defer (log in decisions)
```

4. **Accept** → same turn: update `{{PRODUCT_SPEC}}` and/or `{{USER_FLOW}}` as needed; keep them aligned (Product sync delta if product behavior changed); re-affirm dual lock; then continue architecture finalize.
5. **Reject** → revise `{{ARCHITECTURE}}` so it fits the existing locked product/flow; do not change product/flow.
6. **Defer** → add an Open row in `{{DECISIONS}}` (`Status: tbd`, `Blocker?` as appropriate); architecture must not assume the deferred outcome; proceed only with an architecture that works without inventing that answer.

When architecture is finalized with **no** open impact:

1. Set architecture accepted in `{{PROGRESS}}`.
2. Proceed to Stage 6 — Decisions.

---

## Stage 6 — Decisions

**Prerequisite:** architecture accepted (any product/flow sync from Stage 5 impact gate already applied or deferred into Open).

1. Collect open questions from product, flow, stack enrichment, architecture, and any **Deferred** impact items into `{{DECISIONS}}`.
2. Use the stub shape: **Open** (with `Status`: `tbd` | `deferred`, and `Blocker?`) and **Resolved**.
3. Mark true **blockers** clearly. Do **not** invent answers.
4. **STOP** for Owner review:

```text
Decisions → Resolve some | Leave TBD | Mark blockers
```

### On resolve

1. Move the row to **Resolved** (decision text + date).
2. **Same turn:** update affected artifacts (`{{PRODUCT_SPEC}}`, `{{USER_FLOW}}`, `{{ARCHITECTURE}}`, enrichment log / `phasestep.json` if relevant).
3. Keep product and flow aligned; show a short sync note if product behavior changed.
4. Do not invent scope — only write what the Owner decided.

### On leave TBD / cannot confirm

1. Keep the row in **Open** with `Status: tbd` (or `deferred` if “won’t decide this phase”).
2. Do **not** write fake answers into product / flow / architecture.
3. Non-blocker TBDs may proceed (call them out as risks / out-of-scope in the build plan later).
4. **Blocker TBDs** → stop before `/plan-phase`, or get an explicit Owner override.

When Owner is done with this review pass → Stage 7 — Design system.

---

## Stage 7 — Design system (optional)

**Prerequisite:** decisions reviewed.  
**Catalog:** [`{{DESIGN_CATALOG}}`](../../{{DESIGN_CATALOG}})

- **`componentLibraries`** → **pick exactly one** (or none). Never mix libraries.
- **`guidelines`** → cite any (additive).
- Each item and each agent resource has **`why`**. Prefer free / no-access-gate options unless Owner asks for commercial/preview.

### 7a — UI check

1. From product + user flow, decide if this is a **UI product**.
2. If non-UI → **STOP** for skip confirm. On skip: leave `{{DESIGN_SYSTEM}}` stub; note skip in `{{PROGRESS}}`; go to Stage 8.
3. If UI → continue.

```text
Design → UI product | Skip (non-UI / later)
```

### 7b — Detect and confirm design context (required gate)

1. Infer **surface** from confirmed stack(s): e.g. `react` / `nextjs` / `web` / `tailwind` / `flutter` / `react-native` / `angular`.
2. Note any existing design input (brand guide, Figma, tokens, Owner rules file).
3. **STOP** — do not propose catalog items yet:

```text
Design context: surface=[…] existing=[none | …]
Confirm | Correct surface | I have my own rules (URL/path)
```

4. If Owner provides own rules → verify path/URL; those become primary input for `{{DESIGN_SYSTEM}}`; catalog becomes optional extras only if Owner asks.

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
Design choice
  Library → pick ONE id | None
  Guidelines → zero or more ids
  Or Provide own files only
```

Record choice in `{{PROGRESS}}`.

### 7e — Install agent resources for the chosen library (and optional guidelines)

1. For the **single** chosen library, list each `resources[]` entry with **`why`** and what accepting does (MCP / skill / llms cite / CLI init).
2. Flag `commercial` / `preview-access` clearly before install.
3. Verify URLs when web is available.
4. **STOP** per batch (or per resource):

```text
Agent resources for [library]
  Accept selected | Skip all | Provide alternate URL/path
```

5. Apply **only** Owner-accepted recipes. Never invent APIs, license keys, or package names — follow cited docs.
6. For accepted guidelines: cite URLs in `{{DESIGN_SYSTEM}}` / `AGENTS.md` as needed; install only if Owner accepted a recipe.
7. Log provenance in `{{PROGRESS}}` design enrichment log (`library` | `guideline` | `resource`, URL, date).

**Example — Owner picked Astryx:** propose Astryx CLI init / agent docs / CLI reference only; draft `DESIGN_SYSTEM.md` with Astryx as sole component source; do not offer MUI/shadcn/daisyUI installs afterward.

### 7f — Draft `{{DESIGN_SYSTEM}}`

Grounded in product + user flow + architecture + **chosen library** + accepted guidelines + Owner files.

Include:
- **Chosen system** (library id or “Owner custom” / “guidelines only”)
- Principles
- Tokens (color, type, spacing, radius) — high level
- Component usage rules (use chosen library; forbidden alternate kits)
- Accessibility baseline
- Do / don’t
- Provenance (accepted catalog URLs / Owner paths)

Not mockups or full visual redesign.

### 7g — Accept gate

```text
DESIGN_SYSTEM.md ready → Accept | Reject | Edit
```

On accept → Stage 8 — Build plan.

---

## Stage 8 — Build plan

**Prerequisite:** decisions reviewed; design accepted or skipped.

### 8a — Gather inputs

Read before drafting:
1. [`{{PRODUCT_SPEC}}`](../../{{PRODUCT_SPEC}}) — accepted product behavior
2. [`{{USER_FLOW}}`](../../{{USER_FLOW}}) — finalized interaction map (if not skipped)
3. [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}}) — accepted structure / conventions
4. [`{{DECISIONS}}`](../../{{DECISIONS}}) — Resolved + Open (`tbd` / `deferred`, blockers)
5. [`{{DESIGN_SYSTEM}}`](../../{{DESIGN_SYSTEM}}) — if accepted (chosen library, constraints); ignore if skipped
6. Confirmed stack / `buildCommand` hints (for realistic phase boundaries)

### 8b — Draft `{{BUILD_PLAN}}`

1. Propose **ordered phases** grounded in the inputs above. Prefer slicing by user-flow segments and architecture seams (not by random file folders).
2. **Existing / mid-project:** do **not** re-plan already-shipped work as future build phases. Put shipped capability in earlier “done” notes or phase Out of scope; plan **remaining** milestones only. Update `{{PROGRESS}}` so completed areas are marked done where Owner agrees.
3. Each phase: **title**, **in scope**, **out of scope**.
4. Reflect **Resolved** decisions in scope. Call out Open items in phase boundaries / risks:
   - **`tbd` (non-blocker)** → note as risk or “decide during phase”; do not invent the answer in the plan
   - **`deferred`** → keep out of early phases unless Owner overrides
   - **`tbd` + Blocker? = yes** → **do not** schedule work that assumes an answer. Mark the dependency prominently. Prefer stopping before `/plan-phase` until resolved, or get an explicit Owner override recorded in `{{DECISIONS}}` / chat
5. If design was accepted, phases that ship UI should assume the **chosen library only** (no alternate kit).
6. Do **not** write phase execution plans (`phase-N.md`) here — that is `/plan-phase N` after setup.

### 8c — Owner gate

**STOP.** Present the phase order (short summary per phase) and wait:

```text
BUILD_PLAN.md ready → Accept | Reject | Edit (notes)
```

- **Accept** → mark Build plan accepted in `{{PROGRESS}}`; proceed to Stage 9 — buildCommand  
- **Reject / Edit** → revise `{{BUILD_PLAN}}`, stop again  
- If blocker TBDs remain unresolved and Owner still accepts → record the **Owner override** in `{{DECISIONS}}` notes and in the build plan risk section

---

## Stage 9 — buildCommand

**Prerequisite:** `{{BUILD_PLAN}}` accepted.

### 9a — Propose

1. Read [`phasestep.json`](../../phasestep.json) current `buildCommand`.
2. Read confirmed stack from Stage 4 / `{{PROGRESS}}` and matching **`buildCommandHints`** in [`{{STACK_CATALOG}}`](../../{{STACK_CATALOG}}).
3. Propose **one** concrete command that fits the stack (e.g. Flutter → `flutter analyze` or `flutter test`; Angular → `ng build`; Next → `npm run build`). Prefer a fast, reliable check the agent can run after every build/refine.
4. If the stack is unclear or no hint fits → **ask Owner**; do not invent a fake command.
5. If current `buildCommand` already matches → say so and offer to keep it.

### 9b — Owner gate

**STOP.** Wait:

```text
buildCommand → Accept proposed ([command]) | Use different (Owner specifies) | Keep current
```

### 9c — Apply

1. On Accept / Owner-specified: update `phasestep.json` `buildCommand` only.
2. Sync [`{{ARCHITECTURE}}`](../../{{ARCHITECTURE}}) “Build & quality” to the same command.
3. Mark `buildCommand` confirmed in `{{PROGRESS}}`.
4. Proceed to **Finish**.

---

## Finish

**Prerequisite:** Stage 9 complete (`buildCommand` confirmed).

1. Update [`{{PROGRESS}}`](../../{{PROGRESS}}):
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
3. Tell Owner next step — do **not** run it unless asked:

```text
Setup complete → run /plan-phase 1
```

Optional: `npx phasestep check` to confirm artifacts exist.
