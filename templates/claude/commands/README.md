# Phasestep — Claude Code adapter

Slash commands live in `.claude/commands/` (same bodies as the Cursor adapter). Run them as `/setup`, `/plan-phase`, etc.

```text
/setup                     → product → user flow ↔ product → stack enrichment → architecture → decisions → design → build plan
/plan-phase <slug>         → classic or progressive plan; may add slug to BUILD_PLAN
/build-phase <slug> [step] → build step; progressive capture + Step playback; delta + intent
/verify-phase <slug> [step]→ Owner UAT + Evidence bar (inconclusive / wrong surface ≠ pass)
/refine-phase <slug> [step]→ Failure brief; Encode lessons if repeating; mid-phase absorb / Cross-cutting
/audit-phase <slug>        → build-phase acceptance audit (delivery)
/audit-ds <slug|all>       → design-system audit (delivery)
/complete-phase <slug>     → mark done + progress + phase remainder
/session-log … <slug>      → optional mid-phase notes
/map-project [refresh]     → agent project map (navigation aid; no Owner gate)
/github-connect [repo]     → link GitHub + choose Simple PR or GitFlow (no app commit)
/pr-step [update|release|main|bugfix|hotfix …]
                           → git handoff + Verified line; open fails block code unless override;
                             Simple→main · GitFlow→develop; release=live · hotfix from release

/audit-project             → draft AUDIT_PLAN → Owner accept
/audit-campaign <n> [reaudit] → campaign audit report per audit-plan phase
/audit-campaign-ds <n>     → design-system checks folded into campaign report
/refine-audit <n>          → fix only Owner-approved campaign findings
/complete-audit            → AUDIT_SUMMARY; optionally promote findings to build plan
```

After `npx phasestep init` (or `upgrade`), run **`/setup`** before `/plan-phase <first-slug>` (or fill stubs manually). Phases are **named** (slug + title); **steps stay numeric**. Legacy numeric phase ids still resolve when present.

Catalogs: `{{STACK_CATALOG}}`, `{{DESIGN_CATALOG}}`  
Constitution: `{{CONSTITUTION}}`
