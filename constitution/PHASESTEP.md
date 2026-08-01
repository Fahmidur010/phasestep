# Phasestep — Constitution

**Version:** 0.7.6  
**Status:** Living constitution (portable framework)  
**Last updated:** 2026-08-01  
**Product:** Phasestep  
**Author:** Fahmidur010  

Phasestep is a **framework-agnostic agentic development workflow**. It is not tied to a single product, stack, or IDE. Any team or solo developer can adopt it; project-specific docs and tooling are **instances** of these contracts.

> Install / scaffold: `npx phasestep init` (or `npm i -g phasestep` then `phasestep init`). Adapters (Cursor, Claude Code, Codex) implement the command contracts below.

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

---

## 2. Roles

| Role | Responsibility |
|------|----------------|
| **Owner** | Product authority. Accepts/rejects Behavior deltas. Runs manual verification. Confirms phase complete. Accepts `/pr-step` gates for commit/PR/merge. |
| **Agent** | Plans and implements within contracts. Writes Behavior deltas. Runs project build checks. Does not invent product decisions. Does not commit/push/merge unless Owner Accepts via `/pr-step` (or an explicit ask executed through that path). |
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
| **Master build plan** | `docs/BUILD_PLAN.md` | Ordered phases and scope boundaries. |
| **Audit plan** | `docs/AUDIT_PLAN.md` | Feature-listed audit phases + dimensions; drafted by `/audit-project`; Owner-gated. |
| **Project map** | `docs/PROJECT_MAP.md` | Agent navigation aid (modules, hubs, seams). Stub installed empty; filled by `/map-project`. Not Owner-gated; not product truth. |
| **Audit reports** | `docs/audit-reports/` | One report per audit phase + `AUDIT_SUMMARY.md`; stable finding IDs; read-only evidence. |
| **Phase execution plan** | `docs/phase-plans/phase-N.md` | Steps, done-when, verify checklist, Behavior delta. |
| **Progress + session log** | `docs/PROGRESS.md` | Status + history (Setup checklist + rolling **Phase health** resume block). |
| **Tooling adapters** | `.cursor/commands/`, `.claude/commands/`, `AGENTS.md` | Commands / guidance implementing §5 (Cursor, Claude Code, Codex). |
| **Design / UI system** | `docs/DESIGN_SYSTEM.md` | UI rules used by `audit-ds` / `audit-campaign-ds`. Leave unused for non-UI projects. |
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
| **setup** | optional stage | Agent + Owner | Progressive stub fill. Product (**Spec quality checklist** before accept) → user flow ↔ sync → dual lock → stack enrichment → architecture (impact gate) → decisions → **design (pick-one library)** → build plan → `buildCommand`. Docs only (plus Owner-approved agent config). |
| **plan-phase** | `N` | Agent | **Clarify STOP** (ambiguities) before write unless none / already answered; **Plan quality checklist**; then write phase plan only. No application code. |
| **build-phase** | `N` `[S]` | Agent | **Pre-build consistency** (fail-soft; STOP only if blocking); one step; build check; Behavior delta (WHEN/THEN per SHALL); **Trace** table; update **Phase health**; stop for intent gate. |
| **verify-phase** | `N` `[S]` | Owner (+ Agent checklist) | Checklist from Trace / Behavior delta THEN outcomes (Verify #); **UNCHANGED spot-check** when non-goals listed; update **Phase health**. No code changes. |
| **refine-phase** | `N` `[S]` | Agent | Minimal fixes; **Cross-cutting STOP** if principle/multi-feature change; update delta if behavior changed; update **Phase health**. |
| **audit-phase** | `N` | Agent | Read-only **build** acceptance audit after steps verified. Not for campaign. |
| **audit-ds** | `N` \| `all` | Agent | Design-system audit for delivery (skip for non-UI). |
| **complete-phase** | `N` | Agent | Owner confirmation; mark complete; session log; **Phase health** → complete; **Phase remainder** (still open / deferred / out of scope / carry into next + optional next-phase seeds). |
| **session-log** | `label` `N` | Agent | Optional mid-phase or post-complete notes; refresh **Phase health** when useful. |
| **map-project** | `[refresh]` | Agent | Draft/refresh `PROJECT_MAP.md` for navigation. No Owner gate. Context only. |
| **github-connect** | `[repo-url?]` | Agent + Owner | Link `gh` auth + git remote; record in config/PROGRESS. No commit. |
| **pr-step** | `N` `[S]` | Agent + Owner | Owner-gated branch → commit → push → PR → optional merge via `git`/`gh`. |
| **audit-project** | — | Agent + Owner | Draft `AUDIT_PLAN.md` (feature-listed audit phases) from accepted product/flow/architecture (+DS); prefer project map seams; Owner accept gate; docs only. |
| **audit-campaign** | `N` `[reaudit]` | Agent | Read-only **campaign** audit against audit plan → report in `docs/audit-reports/`. |
| **audit-campaign-ds** | `N` | Agent | Design-system checks for a campaign phase (fold into campaign report). |
| **refine-audit** | `N` | Agent | Fix **only Owner-approved** findings from an audit report; STOP-gated plan; re-audit verifies. |
| **complete-audit** | — | Agent + Owner | All phases reported → `AUDIT_SUMMARY.md`; optionally promote findings into the build plan. |

**Shorthand:** `build-phase N` with no step = next unfinished step only.

**Owner gate format:** Every Owner STOP that presents choices must use a **numbered list** (`1.` `2.` `3.` …). Words are labels; the Owner may reply with the number alone. Never present word-only choice rows such as `Accept | Reject | Edit` without numbers.

**Project map:** Optional agent aid (`/map-project`). Prefer when present for mid-project `/setup` and `/audit-project` slicing. Claims labeled **extracted** vs **heuristic**. Never overrides accepted product, user flow, or architecture. No Owner gate to create or use.

**Audit campaign gates:** `/audit-project` requires accepted product + user flow + architecture (+ design system if UI) — otherwise back to `/setup`. Reports are **read-only**; after each report the Owner picks numbered options: approve all for refinement / select findings / record only / continue to next phase. Fixes happen exclusively in `/refine-audit` on approved findings, then `/audit-campaign N reaudit` verifies. Findings never silently become build work — promotion into `BUILD_PLAN` is an explicit Owner choice at `/complete-audit`.

**Setup gates:** After product accept, agent drafts the user flow (interaction map). Owner tweaks to the flow must update `product.md` in the same turn (**Product sync delta**). After dual lock, agent detects stack(s) and **stops for Owner stack confirmation**, then proposes **official**, **community**, and (for web UI) **verification** catalog items (each with `why`); installs only what Owner accepts. Architecture must not silently rewrite product/flow — use the **Architecture → product/flow impact** gate (1 Accept sync / 2 Reject / 3 Defer to decisions). Decisions: resolve → sync affected docs; unconfirmed stay Open as `tbd`/`deferred`. Design: UI check → confirm surface → **pick one** component library (never mix) + optional guidelines → install agent resources → accept `DESIGN_SYSTEM.md`. Then build plan → `buildCommand`.

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
8. No commit / push / merge unless Owner Accepts via `/pr-step` (or an explicit Owner ask that `/pr-step` then executes)  
9. Minimize scope  
10. Run project build check after implement/refine (`buildCommand` in `phasestep.json`)
11. Cross-cutting / principle changes: **STOP** before code — decision + product/flow sync (or scoped/defer); never silently cascade across features during refine/build

**Cross-cutting gate:** When an Owner ask changes a core feature principle or affects multiple features/phases, `/refine-phase` (and `/build-phase` / `/refine-audit` when the same signal appears) must present the numbered Cross-cutting STOP before application code. Local bugfixes skip this gate.

**GitHub handoff:** `/github-connect` links the remote; `/pr-step` runs Gates A (branch+commit), B (push+PR), C (merge if checks green)—each numbered. Missing `gh`/auth → fail soft with a checklist. Never force-push; never auto-merge without Gate C Accept.

---

## 8. Verification & proof

| Concern | How Phasestep handles it |
|---------|--------------------------|
| Right thing? | Behavior delta (intent gate) |
| Actually works? | Owner manual verification (+ build check); optional surface evidence (Playwright for web UI; analyze/device for Flutter/RN; tools for backend) |
| Codebase healthy? | Phase audits (build + optional campaign); evidence by surface when in scope |

Owner UAT remains the gate. Surface evidence (if accepted at setup or mid-flight for web) adds proof; it does not auto-pass verify or invent installs. Auto-generated test suites from specs remain optional / future — not required for compliance.

---

## 9. Version control (recommended)

- Protect default branch; use PRs  
- Short-lived branches per step or chunk; optional phase integration branch  
- Commit when Owner asks  
- No force-push to protected branches  

---

## 10. Adopting Phasestep

```bash
npx phasestep init
# or: npm i -g phasestep && phasestep init

npx phasestep check
npx phasestep upgrade   # later: refresh commands/catalogs without wiping Owner docs
```

Then run **`/setup`** (guided product → user flow → stack enrichment → architecture → decisions → design → build plan), or fill stubs manually, then `/plan-phase 1`.

**Mid-project:** `/setup` detects existing code, documents current behavior, and plans **remaining** work — it does not reinvent the app.

---

## 11. Evolution log

Newest first. Product changelog only.

### v0.7.6 — Strengthening gates — *current*

**Date:** 2026-08-01  

- **`/plan-phase`** — numbered **Clarify STOP** before writing `phase-N.md`; **Plan quality checklist** (docs only; not Behavior delta WHEN/THEN)  
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
| **Phase** | Milestone slice of the master build plan |
| **Step** | Independently verifiable unit inside a phase |
| **User flow** | Interaction map (entry → paths → exits); setup overview surface |
| **Stack catalog** | Curated official agentic resource pointers per framework |
| **Design catalog** | Component libraries (pick one) + guidelines; agent MCP/skills/llms |
| **Behavior delta** | ADDED/CHANGED/REMOVED SHALL statements, each with ≥1 WHEN/THEN scenario |
| **Intent gate** | Owner accept/reject of the Behavior delta |
| **Project map** | Agent navigation digest (modules / hubs / seams); context only |
| **Product sync delta** | ADDED/CHANGED/REMOVED when flow refinements update the product spec |
| **Architecture impact gate** | Owner Accept/Reject/Defer when architecture implies product/flow change |
| **Cross-cutting STOP** | Numbered gate before code when a principle change cascades across features |
| **pr-step** | Owner-gated GitHub handoff (branch, commit, PR, optional merge via `gh`) |
| **github-connect** | Link `gh` auth + git remote; record in config/PROGRESS; no commit |
| **Adapter** | IDE-specific command implementation |

---

*End of constitution — Phasestep v0.7.6*
