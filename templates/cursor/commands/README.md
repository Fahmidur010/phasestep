# Phasestep — Cursor adapter

Slash commands for Cursor. The same command bodies are also installed for Claude Code (`.claude/commands/`) when that adapter is enabled. Codex gets a managed block in `AGENTS.md`.

**Your other slash commands stay on install.** Files that are not Phasestep-owned names are never deleted by `init`. On **`/setup`**, choose **Sole Phasestep (recommended)** to Owner-gate archive competing delivery-workflow files into `.phasestep/archived-workflow/`, or **Alongside** to keep using both (opt-in). Phasestep-owned names: `setup`, `plan-phase`, `build-phase`, `verify-phase`, `refine-phase`, `audit-phase`, `audit-campaign`, `complete-phase`, `session-log`, `audit-ds`, `audit-campaign-ds`, `audit-project`, `refine-audit`, `complete-audit`, `map-project`, `github-connect`, `pr-step`. If you already had one of those names, `init` without `--force` keeps yours — Sole archive + `upgrade` restores Phasestep bodies.

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

Delivery and campaign tracks use **different** audit commands so phase numbers never collide in meaning.

Audit-only projects: run `/setup` at least through product, user flow, architecture (+ design system if UI), then `/audit-project`.

After `npx phasestep init`, run **`/setup`** before `/plan-phase 1` (or fill stubs manually). Mid-project: document current + plan remaining. Prefer **Sole** workflow mode in `/setup` for full results.

Refresh later with `npx phasestep upgrade` (does not overwrite Owner docs). Stale `audit-ds-phase.md` from older installs may remain — safe to delete; use `/audit-ds` and `/audit-campaign-ds`.
