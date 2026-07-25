# Phasegate

**Phase-step agentic delivery with Behavior delta intent gates.**

Framework-agnostic workflow for AI-assisted development. Review **intent** (a short SHALL-based behavior diff) before deep code reading or manual verification — then prove it with Owner UAT and phase audits.

## Quick start

```bash
# from this repo (local)
node ./bin/phasegate.js init /path/to/your-project

# later, after npm publish:
# npx phasegate init
```

Then fill `docs/product.md` + `docs/BUILD_PLAN.md`, open in Cursor, run `/plan-phase 1`.

```bash
node ./bin/phasegate.js check /path/to/your-project
```

## What you get

| Path | Purpose |
|------|---------|
| `docs/PHASEGATE.md` | Constitution |
| `phasegate.json` | Paths + build command |
| `.cursor/commands/*` | Cursor adapter (plan/build/verify/…) |
| `docs/*.md` stubs | Product, architecture, decisions, build plan, progress, design system |

## Core loop

```text
plan-phase → build-phase → Behavior delta (intent) → verify-phase
           → refine as needed → audit → complete-phase
```

Also installed: `session-log` (optional mid-phase notes), `audit-ds-phase` (design-system audit — use it when the project has UI).

## Version

**0.3.0** — see [constitution/PHASEGATE.md](./constitution/PHASEGATE.md) evolution log.

## Dogfood

First consumer target: [headache-center](../headache-center) (keeps its own paths today; migration = step 4).

## License

MIT
