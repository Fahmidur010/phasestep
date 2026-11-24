# Phasestep — Constitution

**Version:** 1.3.0  
**Status:** Living constitution (portable framework)  
**Last updated:** 2026-11-24  
**Product:** Phasestep  
**Author:** Fahmidur010  

Phasestep is a **framework-agnostic agentic development workflow**. It is not tied to a single product, stack, or IDE. Any team or solo developer can adopt it; project-specific docs and tooling are **instances** of these contracts.

> Install / scaffold: **IDE plugin** (Cursor / Claude Code marketplace → `/setup` scaffolds the project; existing `phasestep.json` = already installed) **or** CLI `npx phasestep init` (or `npm i -g phasestep` then `phasestep init`). Same project shape either way. Adapters implement the command contracts below.

---

## 1. What this is

**Phase-step agentic delivery with living product specs and an intent gate.**

You steer with **written product intent**. An AI agent implements in **small verifiable steps**. After each build you review a short **Behavior delta** (intent) before deep code reading or manual verification. Audits and completion close the phase. Specs and progress stay in the repo so context survives chat sessions.

### One-line definition

> Written product intent → phase plan → one-step build → **behavior contract** → owner verify → refine → phase audit → complete.

### What this is not

- Not classic waterfall (no months of upfront freeze)
- Not unstructured “just ship code” loops (intent and gates are mandatory)
- Not a test-factory that auto-generates suites from specs (WHEN/THEN guide Owner verify; suites are optional)
- Not a replacement for product judgment — the **Owner** accepts intent and verification

### Intent before code

Phasestep puts a short **Behavior delta** in front of deep code review: ADDED / CHANGED / REMOVED `SHALL` statements, each with **WHEN/THEN** scenarios (optional **AND**; GIVEN not required). Specs live as ordinary project documents. Proof is **Owner verification** (the gate) plus compile/build checks and phase audits. For web UI, optional **Playwright** evidence may strengthen verify/audit — it never replaces the Owner gate or auto-accepts intent.

### Engineering constraints (quality armor)

These tighten the loop without replacing Owner gates or product docs:

1. **Prove on the matching surface** — web / native / backend evidence must match the step; **inconclusive is not pass**.
2. **One verifiable unit per step** — smallest change that meets done-when; sequence build → contract → verify before the next step.
3. **Refine fixes root cause** — after Reject / verify fail, name first failure + blast radius before patching; prefer fix at source over new guards unless the guarded state is legitimate.
4. **Progressive playback** — when the Owner described the step in chat, restate Goal · Done-when · Out of scope before coding (Owner Proceed / Edit).

### Design wing (core — not optional)

Every Phasestep install includes a **design wing**: visual direction, detect, critique, polish, and motion. It is part of the package for greenfield and mid-project alike — Owners gate *decisions* (accept a direction, accept a polish/motion pass); they do not opt out of the wing existing.

**Craft floor** — shared bar before UI edits (accepted Visual direction in `DESIGN_SYSTEM.md` overrides defaults except explicit bans):

1. **Quiet chrome, loud moments** — keep frames/toolbars restrained; put richness in one or two memorable content moments.
2. **Never ship (anti-slop)** — decorative kickers/eyebrows; nested card-in-card chrome; emoji-as-icons; default AI beige / purple-glow look when a direction is accepted; gradient text as decoration; hero-metric template stacked without product reason. Scan with `/detect-ui` (stable `AS-*` IDs).
3. **Direction before inventing look** — if Visual direction is missing on a UI surface, run `/design-direction` (or complete Stage 7) before large UI invention.
4. **Detect / critique do not silently rewrite** — `/detect-ui` and `/critique-ui` report findings only; edits go through Owner-gated polish/refine/build.
5. **Motion earns its place** — prefer none; name one purpose; cheapest tool; transform/opacity; honor reduced-motion; sync durable rules into `DESIGN_SYSTEM.md` **Motion**.
6. **Non-UI projects** — Owner records Visual direction / DS as **N/A** at Stage 7; wing commands remain available if UI appears later.

---

## 2. Roles

| Role | Responsibility |
|------|----------------|
| **Owner** | Product authority. Accepts/rejects Behavior deltas. Runs manual verification. Confirms phase complete. Runs `/pr-step` to authorize commit/push/merge. |
| **Agent** | Plans and implements within contracts. Writes Behavior deltas. Runs project build checks. Does not invent product decisions. Does not commit/push/merge unless Owner runs `/pr-step` (or an explicit ask executed through that path). |
| **Reviewer** (optional) | Human or automated review on PRs; does not replace Owner intent/UAT gates. |

---

## 3. Artifact contracts

Every adopting project MUST provide (names may vary; **contracts** must hold). Defaults from `phasestep init`:

| Artifact | Default path | Contract |
|----------|--------------|----------|
| **Constitution** | `docs/PHASESTEP.md` | This document (or linked copy) |
| **Product source of truth** | `docs/product.md` | Behavior of the product. Wins over agent assumptions. |
| **User flow (interaction map)** | `docs/USER_FLOW.md` | End-to-end screens/states/paths. Overview surface during `/setup`; refinements must sync back to the product spec. |
| **Stack enrichment catalog** | `.phasestep/stack-catalog.json` | Curated official starting points (URLs + install recipes). Used after dual lock; Owner-gated; never invent rule bodies. |
| **Design enrichment catalog** | `.phasestep/design-catalog.json` | Component libraries (**pick one**) + guidelines (cite any); agent MCP/skills/llms resources with `why`. |
| **Architecture / conventions** | `docs/architecture.md` | How code is structured. |
| **Open decisions** | `docs/decisions.md` | Unresolved choices; blockers stop build. |
| **Master build plan** | `docs/BUILD_PLAN.md` | Ordered **named** phases (slug + title) and scope boundaries. |
| **Audit plan** | `docs/AUDIT_PLAN.md` | Feature-listed audit phases + dimensions; drafted by `/audit-project`; Owner-gated. |
| **Project map** | `docs/PROJECT_MAP.md` | Agent navigation aid (modules, hubs, seams). Stub installed empty; filled by `/map-project`. Not Owner-gated; not product truth. |
| **Verification map** | `docs/VERIFICATION_MAP.md` | Durable prove-paths (feature/surface → how to prove). Seeded at setup; grown by verify/audit. Context only — never overrides Behavior delta or Owner gates. |
| **Audit reports** | `docs/audit-reports/` | One report per audit phase + `AUDIT_SUMMARY.md`; stable finding IDs; read-only evidence. |
| **Phase execution plan** | `docs/phase-plans/phase-<slug>.md` | Named phase plan; **numeric** steps, done-when, verify checklist, Behavior delta. Legacy `phase-N.md` soft-compat. |
| **Progress + session log** | `docs/PROGRESS.md` | Status + history (Setup checklist + rolling **Phase health** resume block). |
| **Tooling adapters** | `.cursor/commands/`, `.claude/commands/`, `AGENTS.md` | Commands / guidance implementing §5 (Cursor, Claude Code, Codex). |
| **Design / UI system** | `docs/DESIGN_SYSTEM.md` | **Visual direction** + **Motion** + UI rules (tokens, components, craft). Used by design-wing commands and `audit-ds` / `audit-campaign-ds`. Non-UI: Owner marks **N/A** at setup — stub stays. |
| **Config** | `phasestep.json` | Paths + `buildCommand` + `adapters` for this project. |

Paths are overridable in `phasestep.json`.

### Agent adapters (install matrix)

| Agent | Adapter id | Installs | Invoke |
|-------|------------|----------|--------|
| Cursor | `cursor` | `.cursor/commands/*.md` | Slash commands |
| Claude Code | `claude` | `.claude/commands/*.md` | Slash commands (same names) |
| Codex | `codex` | `AGENTS.md` managed block | Follow AGENTS / ask by name |

`init` menu, `--adapters=`, or `--yes` (all). `phasestep check` requires only selected adapters; incomplete command installs → `npx phasestep upgrade`.

---

## 4. Core loop

```text
                 ┌─────────────────────────────────────────┐
                 │              PER PHASE                    │
                 │                                           │
  plan-phase ──► │  for each step:                           │
                 │    build-phase                            │
                 │         │                                 │
                 │         ▼                                 │
                 │    Behavior delta (intent gate)           │
                 │         │                                 │
                 │    reject ──► refine-phase ──┐            │
                 │         │                    │            │
                 │      accept                  │            │
                 │         ▼                    │            │
                 │    verify-phase (Owner) ◄────┘            │
                 │         │                                 │
                 │    fail ──► refine-phase ──► re-verify    │
                 │         │                                 │
                 │      pass → next step                     │
                 │                                           │
                 │  after ALL steps verified:                │
                 │    audit (design if applicable)           │
                 │    audit (code / architecture)            │
                 │    refine if needed → re-audit            │
                 │    complete-phase                         │
                 └─────────────────────────────────────────┘
```

### Stage summary

| Stage | Who | Outcome |
|-------|-----|---------|
| **Plan** | Agent | Phase execution plan with independently verifiable steps |
| **Build** | Agent | One step implemented; project build check; **Behavior delta** written |
| **Intent** | Owner | Accept or reject the delta |
| **Verify** | Owner | Manual verification proves the accepted delta; optional Playwright evidence for web UI |
| **Refine** | Agent | Fixes; refresh delta if behavior changed |
| **Audit** | Agent (read-only) | Phase-wide quality after all steps verified |
| **Complete** | Agent + Owner confirm | Mark phase done; update progress + session log |

---

## 5. Command contracts

| Command | Args | Actor | Must |
|---------|------|-------|------|
| **setup** | optional stage | Agent + Owner | Progressive stub fill. Product (**Spec quality checklist** before accept) → user flow ↔ sync → dual lock → stack enrichment → architecture (impact gate) → decisions → **design wing (direction + pick-one library + DS)** → build plan → `buildCommand`. Docs only (plus Owner-approved agent config). |
| **plan-phase** | `<slug>` | Agent | Named phase; may **add** slug to BUILD_PLAN (Owner gate); **Planning mode** classic \| **progressive**; Clarify + quality for classic; thin plan for progressive. Docs only. |
| **build-phase** | `<slug>` `[S]` | Agent | One **numeric** step; **progressive step capture** wires Owner-described steps into the plan; mid-phase side-work; Behavior delta + **Trace**; intent gate; after UI Accept soft-offer polish/critique. |
| **verify-phase** | `<slug>` `[S]` | Owner (+ Agent checklist) | Checklist from **current** Trace / delta (incl. absorbed mid-phase); **UNCHANGED spot-check**; update **Phase health**. No code changes. |
| **refine-phase** | `<slug>` `[S]` | Agent | Minimal fixes; **mid-phase side-work** absorb into plan/delta (size STOP if too big); **Cross-cutting STOP** if principle/multi-feature; encode lessons may update Visual direction / DS; update **Phase health**. |
| **design-direction** | `[refresh?]` | Agent + Owner | Set or refresh **Visual direction** in `DESIGN_SYSTEM.md` (character, world, moments, signature + page mode). Owner Accept before it sticks. |
| **detect-ui** | `[target]` | Agent | Fixed anti-slop rule table (`AS-*`); **findings only** — no silent rewrite. Prefer before critique for slop hits. |
| **critique-ui** | `[target]` | Agent | Ranked UX/visual review vs direction + craft floor; **findings only** — no silent rewrite. |
| **polish-ui** | `[target]` | Agent | Ordered craft pass (spacing → color/chrome → type → layout → details); keep accepted direction; Owner gate before large edits; soft-offer `/motion-ui` after. |
| **motion-ui** | `[target]` | Agent | Motion decision tree (should it move → purpose → cheapest tool → props/feel → reduced-motion); implement; sync **Motion** in `DESIGN_SYSTEM.md`. Prefer none. |
| **audit-phase** | `<slug>` | Agent | Read-only **build** acceptance audit after steps verified (incl. absorbed mid-phase deltas / Files). Not for campaign. Soft-offer `/detect-ui` / `/critique-ui` before DS audit when UI in scope. |
| **audit-ds** | `<slug>` \| `all` | Agent | Design-system audit for delivery (incl. absorbed UI paths + Visual direction + Motion conformance). Soft-offer `/detect-ui` / `/critique-ui` first when useful. |
| **complete-phase** | `<slug>` | Agent | Owner confirmation; mark complete; session log; **Phase health** → complete; **Phase remainder** (incl. parked side-work seeds → deferred / carry into next). Soft-offer critique/polish on UI if skipped. |
| **session-log** | `label` `<slug>` | Agent | Optional mid-phase or post-complete notes; refresh **Phase health** when useful. |
| **map-project** | `[refresh]` | Agent | Draft/refresh `PROJECT_MAP.md` for navigation. No Owner gate. Context only. |
| **github-connect** | `[repo-url?]` | Agent + Owner | Link `gh` auth + git remote; Owner picks **Simple PR** or **GitFlow** (`github.workflow`); optional GitFlow branch bootstrap. No app commit. |
| **pr-step** | `update` · GitFlow: `release` \| `main` \| `hotfix` \| `bugfix` | Agent + Owner | Invoke **authorizes** commit/push/merge (`merge --no-ff`). Simple→`main`; GitFlow→`develop`. **`release` = live**; **`main` = baseline**. Hotfix from `release` → `release`+`develop`. Bugfix from `develop` → `develop` (live → hotfix). |
| **audit-project** | — | Agent + Owner | Draft `AUDIT_PLAN.md` (feature-listed audit phases) from accepted product/flow/architecture (+DS); prefer project map seams; Owner accept gate; docs only. |
| **audit-campaign** | `N` `[reaudit]` | Agent | Read-only **campaign** audit against audit plan → report in `docs/audit-reports/`. |
| **audit-campaign-ds** | `N` | Agent | Design-system checks for a campaign phase (fold into campaign report). |
| **refine-audit** | `N` | Agent | Fix **only Owner-approved** findings from an audit report; STOP-gated plan; re-audit verifies. |
| **complete-audit** | — | Agent + Owner | All phases reported → `AUDIT_SUMMARY.md`; optionally promote findings into the build plan. |

**Shorthand:** `build-phase <slug>` with no step = next unfinished step only. **Phases are named (slug + title); steps stay numeric.** Soft compat: integer phase args still resolve when `phase-N.md` or BUILD_PLAN order maps them.

**Owner gate format:** Every Owner STOP that presents choices must use a **numbered list** (`1.` `2.` `3.` …). Words are labels; the Owner may reply with the number alone. Never present word-only choice rows such as `Accept | Reject | Edit` without numbers.

**Project map:** Optional agent aid (`/map-project`). Prefer when present for mid-project `/setup` and `/audit-project` slicing. Claims labeled **extracted** vs **heuristic**. Never overrides accepted product, user flow, or architecture. No Owner gate to create or use.

**Audit campaign gates:** `/audit-project` requires accepted product + user flow + architecture (+ design system if UI) — otherwise back to `/setup`. Reports are **read-only**; after each report the Owner picks numbered options: approve all for refinement / select findings / record only / continue to next phase. Fixes happen exclusively in `/refine-audit` on approved findings, then `/audit-campaign N reaudit` verifies. Findings never silently become build work — promotion into `BUILD_PLAN` is an explicit Owner choice at `/complete-audit`.

**Setup gates:** After product accept, agent drafts the user flow (interaction map). Owner tweaks to the flow must update `product.md` in the same turn (**Product sync delta**). After dual lock, agent detects stack(s) and **stops for Owner stack confirmation**, then proposes **official**, **community**, and (for web UI) **verification** catalog items (each with `why`); installs only what Owner accepts. Architecture must not silently rewrite product/flow — use the **Architecture → product/flow impact** gate (1 Accept sync / 2 Reject / 3 Defer to decisions). Decisions: resolve → sync affected docs; unconfirmed stay Open as `tbd`/`deferred`. **Design wing (Stage 7, required):** UI check → non-UI records **N/A** (Owner gate; wing still installed) → UI: **Visual direction** Accept → confirm surface → **pick one** component library (never mix) + optional guidelines → install agent resources → accept `DESIGN_SYSTEM.md` (direction + system). Then build plan → `buildCommand`.

---

## 6. Behavior delta (intent gate)

```markdown
**Behavior delta** (post-build — Owner reviews before `/verify-phase`):
- **Intent status:** pending_owner_review
- **ADDED:**
  - The system SHALL …
    - **Scenario:** [short title]
      - WHEN …
      - THEN …
      - AND … (optional, extra observable outcome)
- **CHANGED:**
  - The system SHALL … (was: …)
    - **Scenario:** …
      - WHEN …
      - THEN …
- **REMOVED:**
  - The system no longer … (or `none`)
    - **Scenario:** … (optional — WHEN/THEN for regression check that old behavior is gone)
- **UNCHANGED (explicit non-goals for this step):**
  - …
- **Risks / edge cases to watch in verification:**
  - …
```

Rules:
- Product behavior language (`SHALL`); 1–4 requirements per step (each with ≥1 scenario).
- **WHEN** = trigger, action, or condition the Owner can observe or perform.
- **THEN** = observable outcome (what verify checklist **Expected** will assert).
- **AND** = optional extra observable outcomes (edge cases, error messages, persistence).
- Context (role, data, starting screen) may live in WHEN or the phase plan — **GIVEN is not required**.
- Align with product spec + step done-when; surface unintended adds; not proof of correct code.
- Persist under the step in the phase plan **and** show in chat.
- After the delta, persist a **Trace** table (SHALL → Scenario → WHEN → THEN → Verify #) for `/verify-phase`; does not change WHEN/THEN rules.

---

## 7. Hard rules

1. Plan before build  
2. One step at a time (unless Owner says otherwise)  
3. Prior step verified before next (unless Owner overrides)  
4. Intent before verify  
5. Verify before next step  
6. Audit only after all steps verified  
7. Owner owns product decisions  
8. No commit / push / merge unless Owner runs `/pr-step` (or an explicit Owner ask that `/pr-step` then executes) — invoking the verb is consent  
9. Minimize scope  
10. Run project build check after implement/refine (`buildCommand` in `phasestep.json`)
11. Cross-cutting / principle changes: **STOP** before code — decision + product/flow sync (or scoped/defer); never silently cascade across features during refine/build  
12. Mid-phase side-work: absorb local Owner refinements into the **current** step/phase (update plan + Behavior delta / Trace / Files) so verify and audit cover them — **no new command**; if too large → Side-work size STOP (absorb / park for new phase / re-plan now)  
13. Progressive phases: `/plan-phase <slug>` may add a new BUILD_PLAN phase; **progressive** mode records each step at `/build-phase <slug> N` from Owner description so audit/complete have a full plan  
14. Never invent installs or rule bodies — catalogs + Owner accept only; mid-flight verification offers are allowed when the surface needs evidence and nothing is configured yet  
15. **Evidence bar:** `/verify-phase` must not PASS a step when ADDED/CHANGED Trace rows lack Owner Pass or matching-surface evidence; wrong-surface or inconclusive tool results are not pass  
16. **Failure brief:** `/refine-phase` after Reject / verify fail records symptom → root cause → blast radius → fix shape before application code (after side-work / Cross-cutting STOPs if any)  
17. **Step playback:** progressive (or vague classic done-when) → Goal · Done-when · Out of scope · Files likely STOP before code  
18. **Encode lessons:** repeated Owner correction class → STOP once (rule / lint-test / doc-only / Visual direction·DS / skip); prefer structure over more chat  
19. **Verified on ship:** `/pr-step` records a Verified line; open Phase health fails block **code** landings unless Owner override; docs-only uses `n/a docs-only`  
20. **Design wing:** UI projects accept Visual direction before inventing look; `/detect-ui` / `/critique-ui` do not silently rewrite; `/polish-ui` keeps accepted direction; `/motion-ui` prefers none and syncs Motion rules; non-UI marks DS **N/A** at Stage 7 — wing commands stay installed  

**Cross-cutting gate:** When an Owner ask changes a core feature principle or affects multiple features/phases, `/refine-phase` (and `/build-phase` / `/refine-audit` when the same signal appears) must present the numbered Cross-cutting STOP before application code. Local bugfixes skip this gate.

**Mid-phase side-work:** Chat refinements during build/refine fold into the current named phase step artifacts. Oversized asks use the Side-work size STOP — never silent mega-scope, never chat-only changes that skip delta/plan.

**Progressive phases:** New or organic features use `/plan-phase <slug>` (add to BUILD_PLAN if needed) → `/build-phase <slug> N` with Owner describing each step → verify → … → soft-offer `/detect-ui` / `/critique-ui` / `/polish-ui` / `/motion-ui` → `/audit-ds` → `/audit-phase` → `/complete-phase`. The phase plan grows with the work.

**GitHub handoff:** `/github-connect` → Simple or GitFlow. Day-to-day: `/pr-step update`. GitFlow: **`release` is the live/deploy line**; **`main` is the stable baseline** (remind `/pr-step main` after release when stable). Live bugs: `/pr-step hotfix <issue>` (from `release` → land `release`+`develop`). Non-live: `/pr-step bugfix`. **Invoke authorizes** git writes (no Gate A/B/C). **Verified** line required on ship; open fails block code unless override. Never force-push. Deploy stays project-local.

**Encode lessons:** When the same correction repeats, `/refine-phase` offers promote to rule, lint/test, or doc-only — so the system learns instead of re-teaching in chat. `/complete-phase` may note unencoded lessons in Phase remainder without blocking complete.

---

## 8. Verification & proof

| Concern | How Phasestep handles it |
|---------|--------------------------|
| Right thing? | Behavior delta (intent gate) |
| Actually works? | Owner manual verification (+ build check); optional surface evidence (Playwright for web UI; analyze/device for Flutter/RN; tools for backend) |
| Evidence grade | Per checklist item: `agent_tool` \| `owner_uat` \| `not_run` — inconclusive / wrong surface ≠ pass |
| How to prove again? | `VERIFICATION_MAP` — durable prove-paths; hints only |
| Codebase healthy? | Phase audits (build + optional campaign); evidence by surface when in scope |

Owner UAT remains the gate. Surface evidence (if accepted at setup or mid-flight for web) adds proof; it does not auto-pass verify or invent installs. Auto-generated test suites from specs remain optional / future — not required for compliance.

**Pass rule:** A step may PASS only when every ADDED/CHANGED Trace **Verify #** has Owner Pass (or equivalent Owner judgment) and no required evidence item is left `not_run` without Owner Pass. Agent tool evidence on the **wrong surface** (e.g. Playwright on API-only) does not count.

**Verification map:** Prefer [`docs/VERIFICATION_MAP.md`](VERIFICATION_MAP.md) (path overridable) when building verify checklists or repeating prove commands. Append new durable paths after verify/audit; never treat the map as a substitute for Trace / Owner Pass.

---

## 9. Version control (recommended)

- Protect shared branches (`main` / `develop` / `release` as used)  
- Day-to-day handoff via `/pr-step` — **invoke authorizes** commit / push / merge (prefer `merge --no-ff`); no Gate A/B/C  
- Short-lived feature / bugfix / hotfix branches; Simple lands on default; GitFlow lands on `develop`, then `release` (live) → `main` (baseline)  
- Never force-push shared branches; deploy/hosting stays project-local  

---

## 10. Adopting Phasestep

```bash
npx phasestep init
# or: npm i -g phasestep && phasestep init

npx phasestep check
npx phasestep upgrade   # later: refresh commands/catalogs without wiping Owner docs
```

Then run **`/setup`** (ensure install → guided product → user flow → stack enrichment → architecture → decisions → design → build plan with **named phases**), or fill stubs manually, then `/plan-phase <first-slug>`. **`/status`** reports whether `phasestep.json` is present (installed).

**IDE plugin:** marketplace install alone is enough to start — `/setup` scaffolds when needed. **CLI:** `init` / `upgrade` / `check` remain available and produce the same project shape.

**Mid-project:** `/setup` detects existing code, documents current behavior, and plans **remaining** work — it does not reinvent the app.

---

## 11. Evolution log

Newest first. Product changelog only.

### Unreleased — IDE plugins (plugin-first install)

- **Cursor** + **Claude Code** plugins ship the same command contracts + a `scaffold/` bundle  
- Marketplace install → `/setup` scaffolds the project when `phasestep.json` is missing — **no** required terminal `npx phasestep init`  
- Existing CLI install (`phasestep.json` present) → `/setup` / `/status` report **installed**  
- npm CLI (`init` / `upgrade` / `check`) unchanged — same project shape either way  
- Regenerate plugins from templates: `npm run generate:plugins`  

### v1.4.0 — design wing detect (`/detect-ui`) — *current*

**Date:** 2026-11-24  

- **`/detect-ui`** — fixed anti-slop rule table (`AS-01`…`AS-08` + `AS-BAN`); findings only  
- Soft-offers from build / critique / polish / audit-ds / complete / motion  
- No live/preview mode; no external design tools  
- Craft floor: detect/critique do not silently rewrite; adapters + smoke  

### v1.3.0 — design wing motion (`/motion-ui` · DS Motion sync)

**Date:** 2026-11-24  

- **`/motion-ui`** — Emil-style decision tree (should it move → purpose → cheapest tool → props/feel → reduced-motion)  
- **`DESIGN_SYSTEM.md` Motion** — durable motion rules synced from motion/polish passes  
- Craft floor item: motion earns its place; soft-offer after `/polish-ui` / UI build  
- Adapters + smoke  

### v1.2.0 — design wing (direction · critique · polish)

**Date:** 2026-11-24  

- **Design wing core** — not optional enrichment; every install gets visual direction + critique + polish  
- **`/design-direction`**, **`/critique-ui`**, **`/polish-ui`** — command contracts; Visual direction lives in `DESIGN_SYSTEM.md`  
- **Craft floor / anti-slop** — §1 shared bar before UI edits  
- **`/setup` Stage 7** — required design wing (non-UI → Owner **N/A**); direction before/with DS accept  
- **Loop hooks** — soft-offer polish/critique after UI `/build-phase` Accept; soft-offer critique before `/audit-ds` / UI complete  
- Encode lessons may update Visual direction / DS; adapters + smoke  

### v1.1.0 — evidence bar · playback · failure brief · verification map · encode · Verified ship

**Date:** 2026-11-22  

- **Engineering constraints** — prove matching surface; one verifiable unit; root-cause refine; progressive playback (§1)  
- **Step playback** — `/build-phase` Goal · Done-when · Out of scope STOP before code (progressive / vague classic)  
- **Evidence bar** — `/verify-phase` grades `agent_tool` \| `owner_uat` \| `not_run`; inconclusive / wrong surface ≠ pass  
- **Failure brief** — `/refine-phase` symptom → root cause → blast radius before code  
- **Verification map** — `docs/VERIFICATION_MAP.md`; seeded at `/setup`; append on verify/audit; context only  
- **Encode lessons** — repeated corrections → STOP (rule / lint-test / doc-only / skip); complete remainder notes open lessons  
- **Verified on `/pr-step`** — Verified line; open Phase health fails block code unless Owner override; docs-only soft  
- Hard rules 15–19; §8 pass rule + map; Codex AGENTS; smoke  

### v1.0.0 — named phases · mid-phase side-work · progressive

**Date:** 2026-11-22  

- **Named build phases** — slug + title; `phase-<slug>.md`; invokes `/plan-phase <slug>`; **steps stay numeric**; soft compat for legacy `phase-N.md`  
- **Mid-phase side-work** — absorb local refinements into current step (plan + delta/Trace/Files); Side-work size STOP if too big; verify/audit/complete cover absorbed work; no new slash command  
- **Progressive phases** — `/plan-phase` classic \| progressive; New phase STOP adds to BUILD_PLAN; `/build-phase` progressive step capture wires Owner-described steps into the plan for audit/complete  
- Constitution §5/§7/glossary; adapters; smoke; site flow hints  

### v0.8.3 — GitFlow docs/stub alignment

**Date:** 2026-11-22  

- Constitution §9 + §5 pr-step Must: invoke = authorize, `--no-ff`, bugfix path; never force-push; deploy project-local  
- PROGRESS + soft-migrate: drop `PR https` examples; note local `merge --no-ff`  
- Codex AGENTS + adapter command READMEs: full `/pr-step` verb list  
- Smoke: soft-reminds, force-push/deploy, Cursor≡Claude bodies, Codex AGENTS, PROGRESS bugfix  

### v0.8.2 — bugfix full-path parity

**Date:** 2026-11-22  

- **`/pr-step bugfix`** — same structure as hotfix: authorize full path, conflict stop, resume, mis-route live → hotfix; soft-remind `/pr-step release` after land  

### v0.8.1 — GitFlow release-as-live + hotfix

**Date:** 2026-11-22  

- GitFlow: **`release` = live/deploy line**; **`main` = stable baseline**; after `/pr-step release` soft-remind `/pr-step main` when stable  
- **`/pr-step hotfix <issue>`** — live: from `release` → fix → land `release` + `develop` (one invoke)  
- **`/pr-step bugfix <issue>`** — non-live: from `develop` → fix → land `develop` (one invoke)  

### v0.8.0 — GitFlow workflow mode

**Date:** 2026-11-22  

- **`/github-connect`** — after connect, numbered **Git workflow** STOP: Simple PR / GitFlow / Decide later; GitFlow bootstrap for `develop` + `release`; Change workflow only  
- **`/pr-step update`** — land **current** work (Phase health); Simple → `main`; GitFlow → `develop`; also `release` / `main` / bugfix / hotfix  
- **Invoke = authorize** commit/push/merge (no Gate A/B/C); prefer `merge --no-ff`; still STOP for connect/tooling/secrets/conflicts  
- Config `github.workflow`; PROGRESS `GitHub workflow:`; deploy/hosting stays project-local  

### v0.7.6 — Strengthening gates

**Date:** 2026-08-01  

- **`/plan-phase`** — numbered **Clarify STOP** before writing `phase-<slug>.md` (historical note; named phases unreleased); **Plan quality checklist** (docs only; not Behavior delta WHEN/THEN)  
- **`/complete-phase`** — **Phase remainder** table + optional next-phase seed bullets; no silent BUILD_PLAN edits; **Phase health** → complete  
- **`/build-phase`** — **Pre-build consistency** (fail-soft; STOP only when **blocking**); **Trace** (SHALL → WHEN/THEN → Verify #) after Behavior delta; overwrite **Phase health**  
- **`/verify-phase`** — prefer Trace Verify #; backfill Trace if missing; **UNCHANGED spot-check** when non-goals listed; overwrite **Phase health**  
- **`/refine-phase`** / **`/session-log`** — refresh **Phase health** when refining or logging mid-phase  
- **`PROGRESS.md`** — rolling **Phase health (resume)** block; `upgrade` soft-migrates if missing  
- **Agent install matrix** — README + constitution adapter table; `init` “Installed for”; `check` groups by adapter and flags incomplete command installs  
- **`/setup` Stage 1** — **Spec quality checklist** on product draft before Accept (Accept with known gaps allowed)  

### v0.7.5 — Site homepage on public surface

**Date:** 2026-07-30  

- README + `package.json` homepage point to https://phasestep.vercel.app/  
- `site/` kept local-only (gitignore); landing hosted separately  

### v0.7.4 — README clarity + evolution log order

**Date:** 2026-07-30  

- README rewritten for first-time users (how it works → quick start → commands)  
- Evolution log ordered newest-first  

### v0.7.3 — Public product surface

**Date:** 2026-07-30  

- README and constitution framed for end users (install → loop → commands)  
- Author credited on the constitution; LICENSE copyright Fahmidur010  

### v0.7.2 — GitHub handoff polish

**Date:** 2026-07-30  

- **`/pr-step`** — numbered STOPs when not connected or tooling missing (Connect / manual checklist / Cancel)  
- Glossary: **github-connect**  
- **`upgrade`** soft-migrates a GitHub section into existing `PROGRESS.md` without `--force-docs`  
- Smoke: verify-phase `/pr-step`, not-connected/tooling STOPs, PROGRESS migrate  

### v0.7.1 — Setup Finish GitHub connect gate

**Date:** 2026-07-30  

- **`/setup` Finish** — numbered STOP: Connect now (`/github-connect`) / Skip (record in PROGRESS)  
- Primary embed for GitHub wiring; init only hints; `/complete-phase` soft-reminds if never connected  
- Capability still installed at `init` (command files); connect itself is not an adapter  

### v0.7.0 — GitHub connect + Owner-gated `/pr-step`

**Date:** 2026-07-29  

- **`/github-connect`** — link `gh` auth + git remote; record in `phasestep.json` / PROGRESS; no commit  
- **`/pr-step`** — numbered Gates A (branch+commit) → B (push+PR) → C (merge if checks green); never silent  
- Fail soft without `git`/`gh`/auth; no force-push; no Issues/Projects automation  
- Standard commit path — build/refine still do not commit alone  

### v0.6.0 — First-party project map + cross-cutting STOP

**Date:** 2026-07-29  

- **`docs/PROJECT_MAP.md`** + **`/map-project`** — thin structural map (modules, hubs, seams; extracted vs heuristic)  
- Agent aid only — **no Owner gate** to create or use; not product truth  
- Mid-project `/setup` and `/audit-project` prefer the map when present / refresh when stale  
- `/complete-phase` marks map stale (or refreshes) when the phase changed major structure  
- **Cross-cutting STOP** on `/refine-phase` (mirrored from `/build-phase` / `/refine-audit`): principle or multi-feature change → decision + product/flow sync / scoped / defer **before** code  

### v0.5.1 — Behavior delta WHEN/THEN scenarios

**Date:** 2026-07-29  

- Each ADDED/CHANGED `SHALL` in a step Behavior delta includes ≥1 **WHEN/THEN** scenario (optional **AND**); REMOVED may include an optional regression scenario; GIVEN not required  
- `/verify-phase` derives checklist **Expected** from scenario **THEN** outcomes  
- No auto-generated test suite from scenarios — Owner gate unchanged  

### v0.5.0 — Split build vs campaign audit commands + numbered Owner gates

**Date:** 2026-07-29  

- **`/audit-phase`** = delivery build acceptance only (no campaign mode)  
- **`/audit-campaign`** (+ `reaudit`) = project audit-plan phases  
- **`/audit-ds`** = delivery design-system audit; **`/audit-campaign-ds`** = campaign DS (folds into campaign report)  
- Removes dual-mode ambiguity when build phase N and audit plan phase N both exist  
- Breaking for consumers who used `/audit-phase` for campaign — run `npx phasestep upgrade` and switch invokes to `/audit-campaign`  
- **Owner gate format:** every STOP choice list is numbered (`1.` `2.` `3.` …); Owner may reply with the number alone  

### v0.4.5–v0.4.11 — Playwright, coexistence, sole workflow, surface evidence

**Date:** 2026-07-27  

- Verification lane + mid-flight Playwright offer for web UI  
- Alongside CLI; `/setup` Sole vs Alongside workflow mode  
- Flutter / React Native / backend evidence by surface (never Playwright for native or pure APIs)  

### v0.4.4 — Audit campaign consistency

**Date:** 2026-07-26  

- **`/audit-ds-phase`** — Build / Campaign / all modes; campaign findings fold into the audit phase report (not a separate file); fix path is `/refine-audit` in campaign mode  
- **`/refine-phase`** — explicitly disclaims project-audit findings; redirects to `/refine-audit`  

### v0.4.3 — Project audit campaign

**Date:** 2026-07-26  

- **`/audit-project`** — audit-only entry: requires accepted product/flow/architecture (+DS if UI); drafts `docs/AUDIT_PLAN.md` (feature-listed audit phases, fixed dimension checklist); Owner accept gate  
- Campaign-mode phase audits (later split into `/audit-campaign` in v0.5.0)  
- **`/refine-audit N`** — fixes only Owner-approved findings; STOP-gated fix plan; requires re-audit  
- **`/complete-audit`** — `AUDIT_SUMMARY.md` + optional promotion of findings into `BUILD_PLAN`  
- `phasestep.json` keys `auditPlan`, `auditReportsDir`; new stubs installed by init/upgrade  
- `upgrade` adds missing Owner stubs without overwriting existing docs  

### v0.4.1 — Docs cleanup

**Date:** 2026-07-26  

- Remove external-project references from README  

### v0.4.0 — Setup, enrichment, multi-adapter, upgrade

**Date:** 2026-07-25  

- **`/setup`** — progressive Owner-gated stub fill (greenfield **or** mid-project: document current + plan remaining)  
- **`docs/USER_FLOW.md`** — interaction map; bidirectional **Product sync delta**; dual-lock before architecture  
- **Stack / design enrichment catalogs** under `.phasestep/` (`stacks`+`community`; libraries pick-one + guidelines)  
- Architecture → product/flow impact gate; Decisions resolve→sync / TBD stays Open  
- Setup order: … → decisions → design → build plan → `buildCommand`  
- **`phasestep upgrade`** — refresh commands/catalogs/constitution; merge config keys; Owner docs safe unless `--force-docs`  
- **Multi-adapter:** Cursor (`.cursor/commands/`), Claude Code (`.claude/commands/`), Codex (`AGENTS.md` managed block); interactive `init` menu (1–4) or `--adapters=` / `--yes`  
- Setup contract smoke (`npm run smoke`) beyond init/check  

### v0.3.0 — Phasestep product

**Date:** 2026-07-25  

- Product brand / npm package: **`phasestep`** (working name was briefly “Phasegate”; unscoped `phasegate` was taken on npm)  
- Generic Cursor command templates (stack-agnostic paths)  
- Minimal CLI: `init`, `check`  
- Default doc layout under `docs/` + `phasestep.json`  
- Single `init` — full command set including design-system audit commands and design-system doc  
- `session-log` retained as optional mid-phase / post-complete logging  

### v0.2.0 — Behavior delta (intent gate)

Required post-build behavior contract; Owner intent gate before verify. Portable constitution seed.

### v0.1.0 — Phase-step agentic delivery (baseline)

Pre–Behavior delta. Plan → build → verify → refine → audit → complete.

### Planned

- ~~Phasestep marketing / docs site (domain)~~ → live at https://phasestep.vercel.app/ (private site repo; package `homepage` v0.7.5)  
- ~~**TBD — Clarify before plan**~~ → `/plan-phase` Clarify STOP (numbered; skip if none / already answered)
- ~~**TBD — Phase remainder at complete**~~ → `/complete-phase` Phase remainder table + optional next-phase seeds
- ~~**TBD — Pre-build consistency**~~ → `/build-phase` fail-soft check; STOP only if blocking
- ~~**TBD — Spec/plan quality checklist**~~ → `/setup` product checklist + `/plan-phase` plan checklist (not Behavior delta)
- ~~**TBD — SHALL → WHEN/THEN → verify trace**~~ → `/build-phase` Trace table; `/verify-phase` uses Verify #
- ~~**TBD — Stronger UNCHANGED spot-check**~~ → `/verify-phase` UNCHANGED spot-check (1–2 items)
- ~~**TBD — Session / phase health snapshot**~~ → `PROGRESS` **Phase health (resume)**; updated by build/verify/refine/complete/session-log; upgrade soft-migrate  
- ~~**TBD — Agent install matrix polish**~~ → README/constitution matrix; `init` install lines; `check` adapter-grouped diagnostics  
- ~~**TBD — GitFlow workflow mode**~~ → v0.8.0 (`/github-connect` Simple vs GitFlow; `/pr-step update` invoke=authorize)  
- **TBD (later) — Opt-in evidence suites from WHEN/THEN** — Owner-gated only; not default  
- **TBD (later) — Stack presets** — thin web / API / Flutter stub+catalog emphasis  
- Better name for `/audit-campaign-ds` if a clearer two-word label appears  
- ~~Optional `/pr-step` + GitHub adapters~~ → v0.7.0  
- ~~WHEN/THEN scenarios on Behavior delta~~ → v0.5.1  
- ~~Optional project-map enrichment~~ → v0.6.0  
- ~~Cross-cutting / principle-change STOP on refine~~ → v0.6.0  
- ~~Multi-adapter (Claude Code, etc.)~~ → v0.4.0  
- ~~`upgrade` command for template refreshes~~ → v0.4.0  
- ~~Tag-triggered CI publish (OIDC Trusted Publishing)~~ → `.github/workflows/`  
- ~~`/setup` + user flow + stack catalog + design catalog~~ → v0.4.0  
- ~~Project audit campaign~~ → v0.4.3  
- ~~Playwright / coexistence / sole / surface evidence~~ → v0.4.5–v0.4.11  
- ~~Split build vs campaign audit commands~~ → v0.5.0  
- ~~Numbered Owner gates~~ → v0.5.0  

---

## 12. Glossary

| Term | Meaning |
|------|---------|
| **Phasestep** | This workflow product / constitution |
| **Phase** | Named milestone in the master build plan (**slug** + **title**); invoke by slug |
| **Step** | Independently verifiable **numeric** unit inside a phase |
| **User flow** | Interaction map (entry → paths → exits); setup overview surface |
| **Stack catalog** | Curated official agentic resource pointers per framework |
| **Design catalog** | Component libraries (pick one) + guidelines; agent MCP/skills/llms |
| **Design wing** | Core visual toolkit: direction, detect, critique, polish, motion — not an opt-in add-on |
| **Visual direction** | Character / world / moments / signature + page mode in `DESIGN_SYSTEM.md`; Owner-gated |
| **Craft floor** | Shared anti-slop / quality bar before UI edits; direction overrides defaults except bans |
| **detect-ui** | Fixed anti-slop rule table (`AS-*`); findings only — no silent rewrite |
| **critique-ui** | Ranked UX/visual review; findings only — no silent rewrite |
| **polish-ui** | Ordered craft pass keeping accepted direction |
| **motion-ui** | Motion decision tree + implement; sync Motion section; prefer none |
| **design-direction** | Set or refresh Visual direction (Owner Accept) |
| **Behavior delta** | ADDED/CHANGED/REMOVED SHALL statements, each with ≥1 WHEN/THEN scenario |
| **Intent gate** | Owner accept/reject of the Behavior delta |
| **Project map** | Agent navigation digest (modules / hubs / seams); context only |
| **Product sync delta** | ADDED/CHANGED/REMOVED when flow refinements update the product spec |
| **Architecture impact gate** | Owner Accept/Reject/Defer when architecture implies product/flow change |
| **Cross-cutting STOP** | Numbered gate before code when a principle change cascades across features |
| **Mid-phase side-work** | Absorb local mid-phase refinements into current step artifacts; size STOP if too big for this phase |
| **Progressive phase** | Thin `/plan-phase <slug>`; steps recorded at each `/build-phase <slug> N` from Owner description; full plan ready for audit/complete |
| **Step playback** | Pre-code restatement of Goal · Done-when · Out of scope (Owner Proceed / Edit) for progressive or vague steps |
| **Evidence grade** | Per verify checklist item: `agent_tool` \| `owner_uat` \| `not_run`; inconclusive / wrong surface ≠ pass |
| **Failure brief** | Refine pre-code note: symptom → root cause → blast radius → fix shape |
| **Verification map** | Durable prove-paths (feature/surface → command/Owner path); context only |
| **Encode lessons** | Promote repeated Owner corrections into rule, lint/test, or doc — not endless chat |
| **Verified line** | `/pr-step` ship citation: phase/step PASS, Owner override, or `n/a docs-only` |
| **pr-step** | GitHub handoff — Simple or GitFlow; release=live; hotfix from release → release+develop; bugfix → develop |
| **github-connect** | Link `gh` auth + remote; choose Simple PR or GitFlow; record in config/PROGRESS; no app commit |
| **Adapter** | IDE-specific command implementation |

---

*End of constitution — Phasestep v1.4.0*
