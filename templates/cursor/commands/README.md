# Phasestep — Cursor adapter

Slash commands for Cursor. The same command bodies are also installed for Claude Code (`.claude/commands/`) when that adapter is enabled. Codex gets a managed block in `AGENTS.md`.

```text
/setup                     → product → user flow ↔ product → stack enrichment → architecture → decisions → design → build plan
/plan-phase <n>            → write phase-N.md
/build-phase <n> [step]    → implement step(s); emit Behavior delta; intent gate
/verify-phase <n> [step]   → Owner UAT + automated checks
/refine-phase <n> [step]   → fix after verify
/audit-phase <n>           → phase acceptance
/complete-phase <n>        → mark done + progress
/session-log …             → optional mid-phase notes
/audit-ds-phase            → design-system audit (UI projects)
```

After `npx phasestep init`, run **`/setup`** before `/plan-phase 1` (or fill stubs manually). Mid-project: document current + plan remaining.

Refresh later with `npx phasestep upgrade` (does not overwrite Owner docs).
