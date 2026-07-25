# Phasestep

**Phase-step agentic delivery with Behavior delta intent gates.**

Framework-agnostic workflow for AI-assisted development. Review **intent** (a short SHALL-based behavior diff) before deep code reading or manual verification — then prove it with Owner UAT and phase audits.

## Quick start

```bash
# scaffold into the current project
npx phasestep init

# or a specific directory
npx phasestep init ./my-app

# validate required artifacts
npx phasestep check
```

Optional global install:

```bash
npm install -g phasestep
phasestep init
phasestep check
```

Then fill `docs/product.md` + `docs/BUILD_PLAN.md`, open in Cursor, run `/plan-phase 1`.

## What you get

| Path | Purpose |
|------|---------|
| `docs/PHASESTEP.md` | Constitution |
| `phasestep.json` | Paths + build command |
| `.cursor/commands/*` | Cursor adapter (plan/build/verify/…) |
| `docs/*.md` stubs | Product, architecture, decisions, build plan, progress, design system |

## Core loop

```text
plan-phase → build-phase → Behavior delta (intent) → verify-phase
           → refine as needed → audit → complete-phase
```

Also installed: `session-log` (optional mid-phase notes), `audit-ds-phase` (design-system audit — use when the project has UI).

## Local development

```bash
node ./bin/phasestep.js init /path/to/project
node ./bin/phasestep.js check /path/to/project
```

## Version

**0.3.0** — see [constitution/PHASESTEP.md](./constitution/PHASESTEP.md) evolution log.

## Repo

Source: [github.com/Fahmidur010/phasestep](https://github.com/Fahmidur010/phasestep)  
npm package: **`phasestep`**

## Dogfood

First consumer: Headache Center (light consumer via `phasestep.json`; keeps its own `project_guidelines/` paths).

## License

MIT
