# Phasestep

**Build software in small steps. Review what should change before you dig through the code.**

Phasestep is a workflow for AI-assisted development. You (the **Owner**) keep product intent in the repo. Your coding agent plans and builds one step at a time. After each build you accept or reject a short **Behavior delta** — then verify, refine, and audit. Specs stay in Markdown, so context survives chat sessions.

Works with **Cursor**, **Claude Code**, and **Codex**. Stack-agnostic (web, mobile, backend).

**Site:** [phasestep.vercel.app](https://phasestep.vercel.app/) · **Author:** [Fahmidur010](https://github.com/Fahmidur010) · **npm:** [`phasestep`](https://www.npmjs.com/package/phasestep) · **v1.1.0**

---

## Two ways in — one system

| Path | What you do | Project install |
|------|-------------|-----------------|
| **IDE plugin** (Cursor / Claude Code) | Install from the marketplace → open a repo → run **`/setup`** | If `phasestep.json` is missing, `/setup` scaffolds it in-repo. If it already exists (you used npm before), it shows **installed** and continues. **No** separate `npx phasestep init`. |
| **npm CLI** | `npx phasestep init` | Same files and contracts. Use `upgrade` / `check` anytime (also fine with the plugin). |

Plugin and npm are two doors into the same Phasestep loop. The workflow does not change.

Plugin sources in this repo: [`plugins/cursor`](./plugins/cursor), [`plugins/claude`](./plugins/claude). Regenerate after template edits: `npm run generate:plugins`.

---

## Supported agents

| Agent | Adapter id | What lands in the project | How you invoke |
|-------|------------|---------------------------|----------------|
| **Cursor** | `cursor` | Docs + config (+ optional `.cursor/commands` via CLI) | Slash commands (`/setup`, …) — from **plugin** and/or project |
| **Claude Code** | `claude` | Docs + config (+ optional `.claude/commands` via CLI) | Slash commands (same names) |
| **Codex** | `codex` | `AGENTS.md` managed block (CLI) | Follow AGENTS / ask by command name |

CLI `init`: interactive menu, `--adapters=cursor,claude`, or `--yes` (all three). Only selected adapters are required by `phasestep check`. Re-run `npx phasestep upgrade` if project-local command files are missing after a partial CLI install.

---

## How it works

```text
1. /setup               → product, flow, stack, architecture, design, build plan (named phases)
2. /plan-phase <slug>   → break that phase into numbered steps
3. /build-phase <slug> S → (progressive: playback) implement + Behavior delta (SHALL + WHEN/THEN)
4. You Accept           → intent gate (or reject → /refine-phase)
5. /verify-phase <slug> → evidence bar + Owner UAT (inconclusive ≠ pass)
6. Repeat 3–5           → until the phase is done
7. /audit-phase <slug>  → phase quality check → /complete-phase <slug>
8. Optional             → /pr-step update (git handoff; Simple or GitFlow)
```

**Behavior delta** = ADDED / CHANGED / REMOVED `SHALL` lines, each with at least one **WHEN → THEN** scenario. You review that contract before deep code review.

**Mid-phase refinements** (layout, components, small fixes while on a step) fold into the current phase plan + delta — no extra command — so verify and audit cover them. If an ask is too large for this phase, the agent stops and offers absorb / park for a new phase / re-plan.

**New features mid-project:** `/plan-phase <slug>` (adds to the build plan if needed) → choose **progressive** → `/build-phase <slug> 1` (describe the step; agent restates Goal / Done-when for Proceed/Edit) → verify → step 2… → `/audit-ds` → `/audit-phase` → `/complete-phase`. The phase plan grows as you build.

**Quality armor:** verify uses an evidence bar (tool / Owner UAT / not run — wrong surface or inconclusive does not pass). After Reject or failed verify, refine starts with a short failure brief (root cause + blast radius) before coding. Repeated corrections get an **encode lessons** stop (rule / lint / test / doc). A **verification map** stores durable prove-paths. `/pr-step` records a **Verified** line and won’t land application code over open verify fails unless you override.

Owner choices are always **numbered** (`1.` `2.` `3.` …). Reply with the number.

---

## Quick start

### A. IDE plugin (no terminal init)

1. Install **Phasestep** from the Cursor or Claude Code marketplace  
2. Open your project → run **`/setup`** (scaffolds if needed, or reports **installed**)  
3. Run **`/plan-phase <first-slug>`** when the build plan is ready  

### B. npm CLI

```bash
npx phasestep init
```

Pick adapters when prompted (Cursor / Claude Code / Codex / all), then open the project and run **`/setup`**, then **`/plan-phase <first-slug>`**.

Later (either path):

```bash
npx phasestep upgrade   # refresh commands & catalogs; keeps your product docs
npx phasestep check     # validate docs + selected-adapter command files
```

---

## Commands (day to day)

| Command | Role |
|---------|------|
| `/setup` | Ensure install + one-time (or resume) project wiring |
| `/status` | Read-only: **installed** or not (`phasestep.json`) |
| `/plan-phase <slug>` | Named phase; classic full plan or **progressive**; may add slug to BUILD_PLAN |
| `/build-phase <slug> [S]` | Build step S (or next); progressive capture + step playback; Behavior delta |
| `/verify-phase <slug> [S]` | Owner verification + evidence bar (inconclusive ≠ pass) |
| `/refine-phase <slug> [S]` | Fix after reject / fail; failure brief; encode lessons if repeating |
| `/audit-phase <slug>` | Delivery audit after the phase |
| `/complete-phase <slug>` | Mark phase done + phase remainder / next seeds |
| `/map-project` | Optional repo map for the agent |
| `/github-connect` | Optional: link `gh` + remote; choose Simple or GitFlow |
| `/pr-step update` | Land current work; Verified line; open fails block code unless override |
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
/pr-step hotfix <issue>    → GitFlow live: from release → fix → release + develop (one invoke)
/pr-step bugfix <issue>   → GitFlow non-live: from develop → fix → develop (one invoke)
```

Needs local `git` + [GitHub CLI](https://cli.github.com/). Running `/pr-step` authorizes commit/push/merge for that verb (no Gate A/B/C). Deploy/hosting stays in your project — Phasestep owns branch topology only.

**Evidence by surface** — web UI can use Playwright; Flutter/RN use analyzer + device UAT; backend uses `buildCommand` / tests. Never Playwright for native-only or pure APIs.

---

## License

MIT · [github.com/Fahmidur010/phasestep](https://github.com/Fahmidur010/phasestep)
