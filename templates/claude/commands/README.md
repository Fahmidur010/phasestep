# Phasestep — Claude Code adapter

Slash commands live in `.claude/commands/` (same bodies as the Cursor adapter). Run them as `/setup`, `/plan-phase`, etc.

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

After `npx phasestep init` (or `upgrade`), run **`/setup`** before `/plan-phase 1` (or fill stubs manually).

Catalogs: `{{STACK_CATALOG}}`, `{{DESIGN_CATALOG}}`  
Constitution: `{{CONSTITUTION}}`
