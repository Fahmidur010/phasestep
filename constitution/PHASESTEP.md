# Phasestep — Constitution

**Version:** 0.4.4  
**Status:** Living constitution (portable framework)  
**Last updated:** 2026-07-26  
**Product:** Phasestep  

Phasestep is a **framework-agnostic agentic development workflow**. It is not tied to a single product, stack, or IDE. Any team or solo developer can adopt it; project-specific docs and tooling are **instances** of these contracts.

> Install / scaffold: `npx phasestep init` (or `npm i -g phasestep` then `phasestep init`). Adapters (Cursor commands) implement the command contracts below.

---

## 1. What this is

**Phase-step agentic delivery with living product specs and an intent gate.**

You steer with **written product intent**. An AI agent implements in **small verifiable steps**. After each build you review a short **Behavior delta** (intent) before deep code reading or manual verification. Audits and completion close the phase. Specs and progress stay in the repo so context survives chat sessions.

### One-line definition

> Written product intent → phase plan → one-step build → **behavior contract** → owner verify → refine → phase audit → complete.

### What this is not

- Not classic waterfall (no months of upfront freeze)
- Not pure vibe coding (intent and gates are mandatory)
- Not a full Spec-Driven Development (SDD) test factory (no required GIVEN/WHEN/THEN → auto-generated suite in v0.3)
- Not a replacement for product judgment — the **Owner** accepts intent and verification

### Relationship to SDD / OpenSpec philosophy

Phasestep **inherits the intent-review philosophy** of spec-driven agentic work (review a behavior diff, not a 500-line code diff first) without requiring OpenSpec tooling. Specs live as project documents; deltas are written per step; proof today is primarily **owner verification** plus compile/build checks and phase audits.

---

## 2. Roles

| Role | Responsibility |
|------|----------------|
| **Owner** | Product authority. Accepts/rejects Behavior deltas. Runs manual verification. Confirms phase complete. Asks for commits/PRs. |
| **Agent** | Plans and implements within contracts. Writes Behavior deltas. Runs project build checks. Does not invent product decisions. Does not commit unless Owner asks. |
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
| **Audit reports** | `docs/audit-reports/` | One report per audit phase + `AUDIT_SUMMARY.md`; stable finding IDs; read-only evidence. |
| **Phase execution plan** | `docs/phase-plans/phase-N.md` | Steps, done-when, verify checklist, Behavior delta. |
| **Progress + session log** | `docs/PROGRESS.md` | Status + history (includes Setup checklist). |
| **Tooling adapters** | `.cursor/commands/`, `.claude/commands/`, `AGENTS.md` | Commands / guidance implementing §5 (Cursor, Claude Code, Codex). |
| **Design / UI system** | `docs/DESIGN_SYSTEM.md` | UI rules used by `audit-ds-phase`. Leave unused for non-UI projects. |
| **Config** | `phasestep.json` | Paths + `buildCommand` for this project. |

Paths are overridable in `phasestep.json`.

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
| **Verify** | Owner | Manual verification proves the accepted delta |
| **Refine** | Agent | Fixes; refresh delta if behavior changed |
| **Audit** | Agent (read-only) | Phase-wide quality after all steps verified |
| **Complete** | Agent + Owner confirm | Mark phase done; update progress + session log |

---

## 5. Command contracts

| Command | Args | Actor | Must |
|---------|------|-------|------|
| **setup** | optional stage | Agent + Owner | Progressive stub fill. Product → user flow ↔ sync → dual lock → stack enrichment → architecture (impact gate) → decisions → **design (pick-one library)** → build plan → `buildCommand`. Docs only (plus Owner-approved agent config). |
| **plan-phase** | `N` | Agent | Write phase plan only. No application code. |
| **build-phase** | `N` `[S]` | Agent | One step; build check; Behavior delta; stop for intent gate. |
| **verify-phase** | `N` `[S]` | Owner (+ Agent checklist) | Checklist anchored to delta. No code changes. |
| **refine-phase** | `N` `[S]` | Agent | Minimal fixes; update delta if behavior changed. |
| **audit-phase** | `N` `[reaudit]` | Agent | Read-only audit. Build mode: phase acceptance after steps verified. Campaign mode: audit-plan phase → report in `docs/audit-reports/`. |
| **audit-ds-phase** | `N` \| `all` | Agent | Design-system audit (skip for non-UI projects). |
| **complete-phase** | `N` | Agent | Owner confirmation; mark complete; session log. |
| **session-log** | `label` `N` | Agent | Optional mid-phase or post-complete notes. |
| **audit-project** | — | Agent + Owner | Draft `AUDIT_PLAN.md` (feature-listed audit phases) from accepted product/flow/architecture (+DS); Owner accept gate; docs only. |
| **refine-audit** | `N` | Agent | Fix **only Owner-approved** findings from an audit report; STOP-gated plan; re-audit verifies. |
| **complete-audit** | — | Agent + Owner | All phases reported → `AUDIT_SUMMARY.md`; optionally promote findings into the build plan. |

**Shorthand:** `build-phase N` with no step = next unfinished step only.

**Audit campaign gates:** `/audit-project` requires accepted product + user flow + architecture (+ design system if UI) — otherwise back to `/setup`. Reports are **read-only**; after each report the Owner picks: approve all for refinement / select findings / record only / continue to next phase. Fixes happen exclusively in `/refine-audit` on approved findings, then `/audit-phase N reaudit` verifies. Findings never silently become build work — promotion into `BUILD_PLAN` is an explicit Owner choice at `/complete-audit`.

**Setup gates:** After product accept, agent drafts the user flow (interaction map). Owner tweaks to the flow must update `product.md` in the same turn (**Product sync delta**). After dual lock, agent detects stack(s) and **stops for Owner stack confirmation**, then proposes **official** and **community** catalog items (each with `why`); installs only what Owner accepts. Architecture must not silently rewrite product/flow — use the **Architecture → product/flow impact** gate (Accept sync / Reject / Defer to decisions). Decisions: resolve → sync affected docs; unconfirmed stay Open as `tbd`/`deferred`. Design: UI check → confirm surface → **pick one** component library (never mix) + optional guidelines → install agent resources → accept `DESIGN_SYSTEM.md`. Then build plan → `buildCommand`.

---

## 6. Behavior delta (intent gate)

```markdown
**Behavior delta** (post-build — Owner reviews before verify-phase):
- **Intent status:** pending_owner_review | accepted
- **ADDED:**
  - The system SHALL …
- **CHANGED:**
  - The system SHALL … (was: …)
- **REMOVED:**
  - The system no longer … (or `none`)
- **UNCHANGED (explicit non-goals for this step):**
  - …
- **Risks / edge cases to watch in verification:**
  - …
```

Rules: 3–12 bullets; product behavior language; not proof of correct code; persist in phase plan and chat; accept → verify; reject → refine.

---

## 7. Hard rules

1. Plan before build  
2. One step at a time (unless Owner says otherwise)  
3. Prior step verified before next (unless Owner overrides)  
4. Intent before verify  
5. Verify before next step  
6. Audit only after all steps verified  
7. Owner owns product decisions  
8. No commit unless asked  
9. Minimize scope  
10. Run project build check after implement/refine (`buildCommand` in `phasestep.json`)

---

## 8. Verification & proof (v0.3 stance)

| Concern | How Phasestep handles it |
|---------|--------------------------|
| Right thing? | Behavior delta (intent gate) |
| Actually works? | Owner manual verification (+ build check) |
| Codebase healthy? | Phase audits |

Automated tests from specs remain optional / future — not required for compliance.

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

### v0.1.0 — Phase-step agentic delivery (baseline)

Pre–Behavior delta. Plan → build → verify → refine → audit → complete.

### v0.2.0 — Behavior delta (intent gate)

Required post-build behavior contract; Owner intent gate before verify. Portable constitution seed.

### v0.3.0 — Phasestep product

**Date:** 2026-07-25  

- Product brand / npm package: **`phasestep`** (working name was briefly “Phasegate”; unscoped `phasegate` was taken on npm)
- Generic Cursor command templates (stack-agnostic paths)  
- Minimal CLI: `init`, `check`  
- Default doc layout under `docs/` + `phasestep.json`  
- Single `init` — full command set including `audit-ds-phase` and design-system doc  
- `session-log` retained as optional mid-phase / post-complete logging  

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

### v0.4.1 — Docs cleanup

**Date:** 2026-07-26  

- Remove external-project references from README / MAINTAINING  

### v0.4.3 — Project audit campaign

**Date:** 2026-07-26  

- **`/audit-project`** — audit-only entry: requires accepted product/flow/architecture (+DS if UI); drafts `docs/AUDIT_PLAN.md` (feature-listed audit phases, fixed dimension checklist); Owner accept gate  
- **`/audit-phase N`** campaign mode — read-only per-phase audit against three grounds (spec / universal dimensions / stack rules + tool evidence); preview-first report in `docs/audit-reports/audit-phase-N.md` with stable finding IDs; 4-option Owner gate; `reaudit` verifies fixes  
- **`/refine-audit N`** — fixes only Owner-approved findings; STOP-gated fix plan; statuses Fixed / Partially fixed / Blocked; requires re-audit  
- **`/complete-audit`** — `AUDIT_SUMMARY.md` + optional promotion of findings into `BUILD_PLAN`  
- `phasestep.json` keys `auditPlan`, `auditReportsDir`; new stubs installed by init/upgrade  
- `upgrade` adds missing Owner stubs without overwriting existing docs  

### v0.4.4 — Audit campaign consistency + AGENT_DOC — *current*

**Date:** 2026-07-26  

- **`/audit-ds-phase`** — Build / Campaign / all modes; campaign findings fold into the audit phase report (not a separate file); fix path is `/refine-audit` in campaign mode  
- **`/refine-phase`** — explicitly disclaims project-audit findings; redirects to `/refine-audit`  
- **`AGENT_DOC.md`** — package engineering log (rationale, invariants, work log, known gaps) for contributors  

### Planned

- Optional `/pr-step` + GitHub adapters  
- ~~Multi-adapter (Claude Code, etc.)~~ → v0.4.0  
- ~~`upgrade` command for template refreshes~~ → v0.4.0  
- ~~Tag-triggered CI publish (OIDC Trusted Publishing)~~ → see `MAINTAINING.md` / `.github/workflows/`  
- ~~`/setup` + user flow + stack catalog + design catalog~~ → v0.4.0  
- ~~Project audit campaign~~ → v0.4.3  

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
| **Behavior delta** | ADDED/CHANGED/REMOVED SHALL statements |
| **Intent gate** | Owner accept/reject of the Behavior delta |
| **Product sync delta** | ADDED/CHANGED/REMOVED when flow refinements update the product spec |
| **Architecture impact gate** | Owner Accept/Reject/Defer when architecture implies product/flow change |
| **Adapter** | IDE-specific command implementation |

---

*End of constitution — Phasestep v0.3.0*
