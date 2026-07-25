# Phasegate — Constitution

**Version:** 0.3.0  
**Status:** Living constitution (portable framework)  
**Last updated:** 2026-07-25  
**Product:** Phasegate  

Phasegate is a **framework-agnostic agentic development workflow**. It is not tied to a single product, stack, or IDE. Any team or solo developer can adopt it; project-specific docs and tooling are **instances** of these contracts.

> Install / scaffold: `npx phasegate init` (or `node path/to/phasegate/bin/phasegate.js init`). Adapters (Cursor commands) implement the command contracts below.

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

Phasegate **inherits the intent-review philosophy** of spec-driven agentic work (review a behavior diff, not a 500-line code diff first) without requiring OpenSpec tooling. Specs live as project documents; deltas are written per step; proof today is primarily **owner verification** plus compile/build checks and phase audits.

---

## 2. Roles

| Role | Responsibility |
|------|----------------|
| **Owner** | Product authority. Accepts/rejects Behavior deltas. Runs manual verification. Confirms phase complete. Asks for commits/PRs. |
| **Agent** | Plans and implements within contracts. Writes Behavior deltas. Runs project build checks. Does not invent product decisions. Does not commit unless Owner asks. |
| **Reviewer** (optional) | Human or automated review on PRs; does not replace Owner intent/UAT gates. |

---

## 3. Artifact contracts

Every adopting project MUST provide (names may vary; **contracts** must hold). Defaults from `phasegate init`:

| Artifact | Default path | Contract |
|----------|--------------|----------|
| **Constitution** | `docs/PHASEGATE.md` | This document (or linked copy) |
| **Product source of truth** | `docs/product.md` | Behavior of the product. Wins over agent assumptions. |
| **Architecture / conventions** | `docs/architecture.md` | How code is structured. |
| **Open decisions** | `docs/decisions.md` | Unresolved choices; blockers stop build. |
| **Master build plan** | `docs/BUILD_PLAN.md` | Ordered phases and scope boundaries. |
| **Phase execution plan** | `docs/phase-plans/phase-N.md` | Steps, done-when, verify checklist, Behavior delta. |
| **Progress + session log** | `docs/PROGRESS.md` | Status + history. |
| **Tooling adapter** | `.cursor/commands/` | Commands implementing §5. |
| **Design / UI system** | `docs/DESIGN_SYSTEM.md` | UI rules used by `audit-ds-phase`. Leave unused for non-UI projects. |
| **Config** | `phasegate.json` | Paths + `buildCommand` for this project. |

Paths are overridable in `phasegate.json`.

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
| **plan-phase** | `N` | Agent | Write phase plan only. No application code. |
| **build-phase** | `N` `[S]` | Agent | One step; build check; Behavior delta; stop for intent gate. |
| **verify-phase** | `N` `[S]` | Owner (+ Agent checklist) | Checklist anchored to delta. No code changes. |
| **refine-phase** | `N` `[S]` | Agent | Minimal fixes; update delta if behavior changed. |
| **audit-phase** | `N` | Agent | Read-only code/architecture audit after all steps verified. |
| **audit-ds-phase** | `N` \| `all` | Agent | Design-system audit (skip for non-UI projects). |
| **complete-phase** | `N` | Agent | Owner confirmation; mark complete; session log. |
| **session-log** | `label` `N` | Agent | Optional mid-phase or post-complete notes. |

**Shorthand:** `build-phase N` with no step = next unfinished step only.

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
10. Run project build check after implement/refine (`buildCommand` in `phasegate.json`)

---

## 8. Verification & proof (v0.3 stance)

| Concern | How Phasegate handles it |
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

## 10. Adopting Phasegate

```bash
# from this repo (local dogfood) or after publish:
node /path/to/phasegate/bin/phasegate.js init
# or: npx phasegate init

phasegate check
```

Then fill product/architecture/build plan stubs and run `/plan-phase 1`.

---

## 11. Evolution log

### v0.1.0 — Phase-step agentic delivery (baseline)

Pre–Behavior delta. Plan → build → verify → refine → audit → complete.

### v0.2.0 — Behavior delta (intent gate)

Required post-build behavior contract; Owner intent gate before verify. Portable constitution seed.

### v0.3.0 — Phasegate product — *current*

**Date:** 2026-07-25  

- Named product: **Phasegate**  
- Generic Cursor command templates (stack-agnostic paths)  
- Minimal CLI: `init`, `check`  
- Default doc layout under `docs/` + `phasegate.json`  
- Single `init` — full command set including `audit-ds-phase` and design-system doc  
- `session-log` retained as optional mid-phase / post-complete logging  

### Planned

- `upgrade` command for template refreshes  
- Multi-adapter (Claude Code, etc.)  
- Optional `/pr-step` + GitHub adapters  
- npm publish when cold `init` needs no walkthrough  

---

## 12. Glossary

| Term | Meaning |
|------|---------|
| **Phasegate** | This workflow product / constitution |
| **Phase** | Milestone slice of the master build plan |
| **Step** | Independently verifiable unit inside a phase |
| **Behavior delta** | ADDED/CHANGED/REMOVED SHALL statements |
| **Intent gate** | Owner accept/reject of the Behavior delta |
| **Adapter** | IDE-specific command implementation |

---

*End of constitution — Phasegate v0.3.0*
