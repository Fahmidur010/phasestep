# Phasestep — Cursor adapter

Slash commands for Cursor. The same command bodies are also installed for Claude Code (`.claude/commands/`) when that adapter is enabled. Codex gets a managed block in `AGENTS.md`.

**Your other slash commands stay on install.** Files that are not Phasestep-owned names are never deleted by `init`. On **`/setup`**, choose **Sole Phasestep (recommended)** to Owner-gate archive competing delivery-workflow files into `.phasestep/archived-workflow/`, or **Alongside** to keep using both (opt-in). Phasestep-owned names: `setup`, `plan-phase`, `build-phase`, `verify-phase`, `refine-phase`, `audit-phase`, `complete-phase`, `session-log`, `audit-ds-phase`, `audit-project`, `refine-audit`, `complete-audit`. If you already had one of those names, `init` without `--force` keeps yours — Sole archive + `upgrade` restores Phasestep bodies.

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

/audit-project             → draft AUDIT_PLAN (feature-listed audit phases) → Owner accept
/audit-phase <n> [reaudit] → campaign mode: read-only report per audit phase
/refine-audit <n>          → fix only Owner-approved findings
/complete-audit            → AUDIT_SUMMARY; optionally promote findings to build plan
```

Audit-only projects: run `/setup` at least through product, user flow, architecture (+ design system if UI), then `/audit-project`.

After `npx phasestep init`, run **`/setup`** before `/plan-phase 1` (or fill stubs manually). Mid-project: document current + plan remaining. Prefer **Sole** workflow mode in `/setup` for full results.

Refresh later with `npx phasestep upgrade` (does not overwrite Owner docs).
