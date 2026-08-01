# Phasestep — Claude Code adapter

Slash commands live in `.claude/commands/` (same bodies as the Cursor adapter). Run them as `/setup`, `/plan-phase`, etc.

```text
/setup                     → product → user flow ↔ product → stack enrichment → architecture → decisions → design → build plan
/plan-phase <n>            → clarify STOP if needed → write phase-N.md
/build-phase <n> [step]    → pre-build consistency → implement; Behavior delta; intent gate
/verify-phase <n> [step]   → Owner UAT from THEN outcomes + automated checks
/refine-phase <n> [step]   → fix after verify (Cross-cutting STOP if principle cascades)
/audit-phase <n>           → build-phase acceptance audit (delivery)
/audit-ds <n|all>          → design-system audit (delivery)
/complete-phase <n>        → mark done + progress + phase remainder
/session-log …             → optional mid-phase notes
/map-project [refresh]     → agent project map (navigation aid; no Owner gate)
/github-connect [repo]     → link GitHub remote + gh auth (no commit)
/pr-step <n> [step?]       → Owner-gated branch → commit → push → PR → optional merge

/audit-project             → draft AUDIT_PLAN → Owner accept
/audit-campaign <n> [reaudit] → campaign audit report per audit-plan phase
/audit-campaign-ds <n>     → design-system checks folded into campaign report
/refine-audit <n>          → fix only Owner-approved campaign findings
/complete-audit            → AUDIT_SUMMARY; optionally promote findings to build plan
```

After `npx phasestep init` (or `upgrade`), run **`/setup`** before `/plan-phase 1` (or fill stubs manually).

Catalogs: `{{STACK_CATALOG}}`, `{{DESIGN_CATALOG}}`  
Constitution: `{{CONSTITUTION}}`
