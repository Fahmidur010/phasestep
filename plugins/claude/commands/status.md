---
name: status
description: Show whether this project has Phasestep installed (phasestep.json) and key paths
argument-hint: 
---

> **Install check:** If the workspace has no `phasestep.json` (or legacy `phasegate.json`), run **`/setup` first** — it scaffolds the project in-repo (same shape as `npx phasestep init`). If the file exists, the project is **already installed**; continue. Never require a separate terminal init when the Phasestep plugin is active.

Report **Phasestep install status** for this workspace. **Read-only** — no scaffold, no edits, no commits.

## Detect

1. Look for `phasestep.json` at the workspace root. If missing, try legacy `phasegate.json`.
2. If **neither** exists → print:

```text
Phasestep: not installed

Next: run /setup (scaffolds in-repo when using the IDE plugin — no terminal init required)
  or: npx phasestep init
```

Stop.

3. If a config file exists → project is **installed**. Read it and report:

```text
Phasestep: installed
Config: phasestep.json | phasegate.json
Adapters: …
Constitution: docs/PHASESTEP.md
Product: docs/product.md
Build plan: docs/BUILD_PLAN.md
Progress: docs/PROGRESS.md
buildCommand: …
```

4. Optionally note whether project-local `.cursor/commands/setup.md` and/or `.claude/commands/setup.md` exist (portable CLI copies). Missing project-local commands is **OK** when the IDE plugin supplies them.
5. If `docs/PROGRESS.md` has Setup mode / Workflow mode / Phase health lines, quote them briefly.
6. Stop. Do not start `/setup` unless the Owner asks.
