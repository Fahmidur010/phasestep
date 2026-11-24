# Phasestep — Cursor adapter

Slash commands for Cursor. The same command bodies are also installed for Claude Code (`.claude/commands/`) when that adapter is enabled. Codex gets a managed block in `AGENTS.md`.

**Your other slash commands stay on install.** Files that are not Phasestep-owned names are never deleted by `init`. On **`/setup`**, choose **Sole Phasestep (recommended)** to Owner-gate archive competing delivery-workflow files into `.phasestep/archived-workflow/`, or **Alongside** to keep using both (opt-in). Phasestep-owned names: `setup`, `status`, `plan-phase`, `build-phase`, `verify-phase`, `refine-phase`, `design-direction`, `detect-ui`, `critique-ui`, `polish-ui`, `motion-ui`, `audit-phase`, `audit-campaign`, `complete-phase`, `session-log`, `audit-ds`, `audit-campaign-ds`, `audit-project`, `refine-audit`, `complete-audit`, `map-project`, `github-connect`, `pr-step`. If you already had one of those names, `init` without `--force` keeps yours — Sole archive + `upgrade` restores Phasestep bodies.

```text
/setup                     → ensure install → product → user flow ↔ product → stack → architecture → design wing → build plan
/status                    → Phasestep: installed | not installed (read-only)
/plan-phase <slug>         → classic or progressive plan; may add slug to BUILD_PLAN
/build-phase <slug> [step] → build step; progressive capture + Step playback; delta + intent
/verify-phase <slug> [step]→ Owner UAT + Evidence bar (inconclusive / wrong surface ≠ pass)
/refine-phase <slug> [step]→ Failure brief; Encode lessons if repeating; mid-phase absorb / Cross-cutting
/design-direction [refresh]→ set/refresh Visual direction in DESIGN_SYSTEM (Owner Accept)
/detect-ui [target]        → fixed AS-* anti-slop detect — findings only
/critique-ui [target]      → ranked UX/visual review — findings only
/polish-ui [target]        → ordered craft pass (keep accepted direction)
/motion-ui [target]        → motion decision tree + implement (prefer none; sync Motion)
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

Delivery and campaign tracks use **different** audit commands so phase numbers never collide in meaning.

Audit-only projects: run `/setup` at least through product, user flow, architecture (+ design system if UI), then `/audit-project`.

**Start:** marketplace plugin → **`/setup`** (scaffolds if no `phasestep.json`; reports **installed** if CLI already ran) — or after `npx phasestep init`, run **`/setup`**. Then `/plan-phase <first-slug>` (or fill stubs manually). Phases are **named** (slug + title); **steps stay numeric**. Legacy `/plan-phase 1` still resolves when `phase-1.md` or ordered BUILD_PLAN entries exist. Prefer **Sole** workflow mode in `/setup` for full results.

Refresh later with `npx phasestep upgrade` (does not overwrite Owner docs). Stale `audit-ds-phase.md` from older installs may remain — safe to delete; use `/audit-ds` and `/audit-campaign-ds`.
