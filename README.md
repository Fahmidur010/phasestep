# Phasestep

**Phase-step agentic delivery with Behavior delta intent gates.**

Framework-agnostic workflow for AI-assisted development. Review **intent** (a short SHALL-based behavior diff) before deep code reading or manual verification — then prove it with Owner UAT and phase audits.

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
plan-phase → build-phase → Behavior delta (intent) → verify-phase
           → refine as needed → audit → complete-phase
```

Also installed: `session-log` (optional mid-phase notes), `audit-ds-phase` (design-system audit — use when the project has UI).

## Project audit (audit-only or health check)

```text
/setup (product → flow → architecture → DS if UI)
  → /audit-project      draft AUDIT_PLAN (feature-listed phases) → Owner accept
  → /audit-phase 1…N    read-only report per phase → Owner decides fixes
  → /refine-audit N     fix only approved findings → /audit-phase N reaudit
  → /complete-audit     AUDIT_SUMMARY; optionally promote findings to build plan
```

Reports live in `docs/audit-reports/` as plain Markdown with stable finding IDs, each citing its ground (spec / universal checklist / stack rules + tool evidence).

## Local development

```bash
node ./bin/phasestep.js init /path/to/project
node ./bin/phasestep.js upgrade /path/to/project
node ./bin/phasestep.js check /path/to/project
npm run smoke
```

## Version

**0.4.3** — see [constitution/PHASESTEP.md](./constitution/PHASESTEP.md) evolution log.

## Maintaining / releasing

See **[MAINTAINING.md](./MAINTAINING.md)** — branch model, semver, tag-triggered npm publish via GitHub Actions (Trusted Publishing / OIDC).

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
