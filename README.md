# Phasestep

**Phase-step agentic delivery with Behavior delta intent gates.**

Framework-agnostic workflow for AI-assisted development. Review **intent** (a short SHALL-based behavior diff with **WHEN/THEN** scenarios) before deep code reading or manual verification — then prove it with Owner UAT and phase audits.

## Quick start

```bash
# scaffold into the current project — prompts for Cursor / Claude Code / Codex / All
npx phasestep init

# or a specific directory / non-interactive choice
npx phasestep init ./my-app
npx phasestep init --adapters=cursor
npx phasestep init --yes   # all adapters, no prompt

# refresh package templates later (keeps Owner docs)
npx phasestep upgrade

# validate required artifacts
npx phasestep check
```

Optional global install:

```bash
npm install -g phasestep
phasestep init
phasestep check
phasestep upgrade
```

Then run `/setup` (or fill `docs/product.md` + `docs/BUILD_PLAN.md`), open in your agent, run `/plan-phase 1`. Mid-project: `/setup` documents what exists and plans remaining work.

## Adopting alongside an existing workflow

Phasestep **installs additively** (foreign slash commands are not deleted). For the **best outcome**, make Phasestep the **sole delivery workflow**.

| Path | What happens |
|------|----------------|
| **`/setup` → Sole (recommended)** | Agent lists competing workflow candidates → Owner Accepts an **archive** plan → files move to `.phasestep/archived-workflow/YYYY-MM-DD/` (not deleted) → continue setup as the only plan/build/verify/audit loop |
| **`/setup` → Alongside (opt-in)** | Keep your commands; use Phasestep additively. Full results are not guaranteed if both loops stay in use |
| Custom file with a **Phasestep name** at `init` | `init` **skips** it (keeps yours) unless `--force`. Sole archive + `upgrade` restores Phasestep bodies |
| Existing `AGENTS.md` | Phasestep **appends** a marker-delimited block; Sole may archive outside content with Owner Accept |
| `upgrade` | Refreshes Phasestep commands/catalogs/constitution; foreign commands untouched; Owner docs sacred unless `--force-docs` |

`init` prints an **Alongside** summary and points you to `/setup` for Sole vs Alongside. Never silent archives.

**Practice:** land with `init` → run `/setup` → choose Sole when ready → archive competing delivery-loop files → proceed. Niche one-off commands can remain if they are not a second full agentic workflow.

## What you get

| Path | Purpose |
|------|---------|
| `docs/PHASESTEP.md` | Constitution |
| `phasestep.json` | Paths + build command + adapters |
| `.cursor/commands/*` | Cursor adapter |
| `.claude/commands/*` | Claude Code adapter |
| `AGENTS.md` | Codex / AGENTS adapter (managed Phasestep block) |
| `docs/*.md` stubs | Product, user flow, architecture, decisions, build plan, audit plan, progress, design system |
| `.phasestep/stack-catalog.json` | Official stack enrichment starting points |
| `.phasestep/design-catalog.json` | Design libraries (pick one) + guidelines |

## Core loop

```text
/setup (once) → product → user flow ↔ product → stack enrichment → architecture → decisions → design → build plan
plan-phase → build-phase → Behavior delta (WHEN/THEN) → intent gate → verify-phase
           → refine as needed → audit-phase (+ optional audit-ds) → complete-phase
```

Also installed: `session-log` (optional mid-phase notes), `audit-ds` (design-system audit for delivery — use when the project has UI).

## Project audit (audit-only or health check)

```text
/setup (product → flow → architecture → DS if UI)
  → /audit-project         draft AUDIT_PLAN (feature-listed phases) → Owner accept
  → /audit-campaign 1…N    read-only report per phase → Owner decides fixes
  → /refine-audit N        fix only approved findings → /audit-campaign N reaudit
  → /complete-audit        AUDIT_SUMMARY; optionally promote findings to build plan
```

Delivery (`/audit-phase`) and campaign (`/audit-campaign`) are **separate commands** so build phase N and audit plan phase N never share one slash command.

Reports live in `docs/audit-reports/` as plain Markdown with stable finding IDs, each citing its ground (spec / universal checklist / stack rules + tool evidence).

Optional **verification by surface:** web UI → Playwright (CLI preferred); Flutter/RN → analyzer/tests + Owner device UAT; backend/CLI → `buildCommand` / lint / tests. Never Playwright for native or pure APIs. Mid-flight Playwright offer only applies to web UI if Stage 4 was skipped.

## Local development

```bash
node ./bin/phasestep.js init /path/to/project
node ./bin/phasestep.js upgrade /path/to/project
node ./bin/phasestep.js check /path/to/project
npm run smoke
```

## Version

**0.5.0** — see [constitution/PHASESTEP.md](./constitution/PHASESTEP.md) evolution log.

## Maintaining / releasing

See **[MAINTAINING.md](./MAINTAINING.md)** — branch model, semver, tag-triggered npm publish via GitHub Actions (Trusted Publishing / OIDC).

Contributing to the package itself? Start with **[AGENT_DOC.md](./AGENT_DOC.md)** — module map, design rationale, invariants, and the running engineering log.

Quick release (after merging to `main`):

```bash
npm run release:patch   # or release:minor / release:major
git push origin main --follow-tags
```

## Repo

Source: [github.com/Fahmidur010/phasestep](https://github.com/Fahmidur010/phasestep)  
npm package: **`phasestep`**

## License

MIT
