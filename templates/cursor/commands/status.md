---
description: Show whether this project has Phasestep installed (phasestep.json) and key paths
argument-hint: 
---

Report **Phasestep install status** for this workspace. **Read-only** — no scaffold, no edits, no commits.

## Detect

1. Look for `phasestep.json` at the workspace root. If missing, try legacy `phasegate.json`.
2. If **neither** exists → print:

```text
Phasestep: not installed

Next actions:
1. Setup now — /setup (scaffolds in-repo when using the IDE plugin — no terminal init required)
2. Stop here (CLI alternative: npx phasestep init)
```

On **1**, run `/setup` in this session. Stop after the STOP (or after setup if they pick 1).

3. If a config file exists → project is **installed**. Read it and report:

```text
Phasestep: installed
Config: phasestep.json | phasegate.json
Adapters: …
Constitution: {{CONSTITUTION}}
Product: {{PRODUCT_SPEC}}
Build plan: {{BUILD_PLAN}}
Progress: {{PROGRESS}}
buildCommand: …
```

4. Optionally note whether project-local `.cursor/commands/setup.md` and/or `.claude/commands/setup.md` exist (portable CLI copies). Missing project-local commands is **OK** when the IDE plugin supplies them.
5. If `{{PROGRESS}}` has Setup mode / Workflow mode / Phase health lines, quote them briefly.
6. If Setup is incomplete or Phase health suggests a clear next command, **STOP — Next actions** (numbered; run on pick). Shape from Phase health / Setup checklist, e.g.:

```text
Installed — suggested next:
1. Continue — /setup (or /plan-phase <slug> / /build-phase … as Phase health Next says)
2. Done for now
```

Otherwise stop. Never dump bare “Next: `/…`” without numbers.
