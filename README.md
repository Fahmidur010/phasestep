# Phasestep

**Build software in small steps. Review what should change before you dig through the code.**

Phasestep is a workflow for AI-assisted development. You (the **Owner**) keep product intent in the repo. Your coding agent plans and builds one step at a time. After each build you accept or reject a short **Behavior delta** — then verify, refine, and audit. Specs stay in Markdown, so context survives chat sessions.

Works with **Cursor**, **Claude Code**, and **Codex**. Stack-agnostic (web, mobile, backend).

**Site:** [phasestep.vercel.app](https://phasestep.vercel.app/) · **Author:** [Fahmidur010](https://github.com/Fahmidur010) · **npm:** [`phasestep`](https://www.npmjs.com/package/phasestep) · **v0.8.1**

---

## Supported agents

| Agent | Adapter id | What `init` installs | How you invoke |
|-------|------------|----------------------|----------------|
| **Cursor** | `cursor` | `.cursor/commands/*.md` | Slash commands (`/setup`, …) |
| **Claude Code** | `claude` | `.claude/commands/*.md` | Slash commands (same names) |
| **Codex** | `codex` | `AGENTS.md` managed block | Follow AGENTS / ask by command name |

Pick at `init`: interactive menu, `--adapters=cursor,claude`, or `--yes` (all three). Only selected adapters are required by `phasestep check`. Re-run `npx phasestep upgrade` if command files are missing after a partial install.

---

## How it works

```text
1. /setup          → product, flow, stack, architecture, design, build plan
2. /plan-phase N   → break phase N into verifiable steps
3. /build-phase N S → implement one step + Behavior delta (SHALL + WHEN/THEN)
4. You Accept      → intent gate (or reject → /refine-phase)
5. /verify-phase   → you prove it (manual UAT; optional browser/native evidence)
6. Repeat 3–5      → until the phase is done
7. /audit-phase    → phase quality check → /complete-phase
8. Optional        → /pr-step update (git handoff; Simple or GitFlow)
```

**Behavior delta** = ADDED / CHANGED / REMOVED `SHALL` lines, each with at least one **WHEN → THEN** scenario. You review that contract before deep code review.

Owner choices are always **numbered** (`1.` `2.` `3.` …). Reply with the number.

---

## Quick start

```bash
npx phasestep init
```

Pick adapters when prompted (Cursor / Claude Code / Codex / all), then:

1. Open the project in your agent  
2. Run **`/setup`** (greenfield or mid-project — it asks)  
3. Run **`/plan-phase 1`**

Later:

```bash
npx phasestep upgrade   # refresh commands & catalogs; keeps your product docs
npx phasestep check     # validate docs + selected-adapter command files
```

---

## Commands (day to day)

| Command | Role |
|---------|------|
| `/setup` | One-time (or resume) project wiring |
| `/plan-phase N` | Clarify ambiguities (Owner gate) → plan phase N |
| `/build-phase N [S]` | Pre-build consistency → build step S (or next) |
| `/verify-phase N [S]` | Owner verification |
| `/refine-phase …` | Fix after reject / failed verify |
| `/audit-phase N` | Delivery audit after the phase |
| `/complete-phase N` | Mark phase done + phase remainder / next seeds |
| `/map-project` | Optional repo map for the agent |
| `/github-connect` | Optional: link `gh` + remote; choose Simple or GitFlow |
| `/pr-step update` | Optional: land current work (Simple→main · GitFlow→develop); invoke authorizes commit/push/merge |
Also: `/audit-project` + `/audit-campaign` for a full-project health audit, `/audit-ds` / `/refine-audit` / `/complete-audit` as needed. Details live in the installed command files and [constitution](./constitution/PHASESTEP.md).

---

## What gets installed

| Path | Purpose |
|------|---------|
| `docs/PHASESTEP.md` | Constitution (the rules) |
| `phasestep.json` | Paths, `buildCommand`, adapters |
| `.cursor/commands/*` | Cursor slash commands (if `cursor` adapter) |
| `.claude/commands/*` | Claude Code slash commands (if `claude` adapter) |
| `AGENTS.md` | Codex guidance managed block (if `codex` adapter) |
| `docs/*.md` | Product, flow, architecture, plans, progress, … |
| `.phasestep/*-catalog.json` | Stack & design enrichment catalogs |

---

## Already have another agent workflow?

`init` does **not** delete your existing slash commands.

- **Sole (recommended)** in `/setup` — archive competing delivery-loop files (Owner Accept); Phasestep becomes the only plan → build → verify loop  
- **Alongside** — keep both; results may be weaker if two full loops stay active  

`upgrade` refreshes Phasestep files only. Your product docs stay unless you pass `--force-docs`.

---

## Optional extras

**GitHub** — after setup, connect once and choose a workflow, then hand off verified work:

| Workflow | When | Day-to-day |
|----------|------|------------|
| **Simple PR** | Solo / small / trunk-style | `/pr-step update` → commit + merge into **main** |
| **GitFlow** | Production apps (release = live) | `update` → **develop** → **`release` (live)** → **`main` (baseline)**; `hotfix` from release |

```text
/github-connect [repo]     → auth + remote, then Simple vs GitFlow
/pr-step update            → land current work (Simple→main · GitFlow→develop)
/pr-step release           → GitFlow: develop → release (live line); remind /pr-step main when stable
/pr-step main              → GitFlow: release → main (baseline snapshot)
/pr-step hotfix <issue>    → GitFlow: from release → fix → release + develop
/pr-step bugfix <issue>   → GitFlow: from develop → fix → develop
```

Needs local `git` + [GitHub CLI](https://cli.github.com/). Running `/pr-step` authorizes commit/push/merge for that verb (no Gate A/B/C). Deploy/hosting stays in your project — Phasestep owns branch topology only.

**Evidence by surface** — web UI can use Playwright; Flutter/RN use analyzer + device UAT; backend uses `buildCommand` / tests. Never Playwright for native-only or pure APIs.

---

## License

MIT · [github.com/Fahmidur010/phasestep](https://github.com/Fahmidur010/phasestep)
